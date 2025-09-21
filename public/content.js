// Dark Pattern Shield - Content Script
// Runs on every webpage to detect dark patterns

(function() {
  'use strict';

  // Dark pattern detection rules
  const DARK_PATTERN_RULES = [
    {
      id: 'hidden-auto-renewal',
      name: 'Hidden Auto-Renewal',
      severity: 4,
      selectors: [
        'input[type="checkbox"][checked]',
        '.auto-renewal',
        '.recurring-billing',
        '[data-auto-renew="true"]'
      ],
      textPatterns: [
        /automatically.*renew/i,
        /recurring.*billing/i,
        /auto.*renewal/i,
        /subscription.*continues/i
      ],
      message: 'Auto-renewal detected! This subscription will charge you automatically.'
    },
    {
      id: 'confusing-cancellation',
      name: 'Confusing Cancellation',
      severity: 5,
      selectors: [
        '.cancellation-hidden',
        '.cancel-difficult',
        '[data-cancel-hidden="true"]'
      ],
      textPatterns: [
        /contact.*support.*to.*cancel/i,
        /call.*to.*cancel/i,
        /email.*to.*cancel/i
      ],
      message: 'Difficult cancellation process detected!'
    },
    {
      id: 'hidden-costs',
      name: 'Hidden Costs',
      severity: 4,
      selectors: [
        '.hidden-fee',
        '.additional-cost',
        '.service-fee'
      ],
      textPatterns: [
        /additional.*fees.*may.*apply/i,
        /service.*fee.*not.*included/i,
        /taxes.*and.*fees.*extra/i
      ],
      message: 'Hidden costs detected! Check for additional fees.'
    },
    {
      id: 'pre-checked-addons',
      name: 'Pre-checked Add-ons',
      severity: 3,
      selectors: [
        'input[type="checkbox"][checked]',
        '.addon-checked',
        '.premium-included'
      ],
      textPatterns: [
        /premium.*features.*included/i,
        /add.*protection.*plan/i,
        /extended.*warranty/i
      ],
      message: 'Pre-checked add-ons detected! Uncheck unwanted services.'
    }
  ];

  let isScanning = false;
  let detectedPatterns = [];

  // Initialize extension
  function init() {
    // Check if protection is enabled
    chrome.storage.sync.get(['protectionEnabled'], (result) => {
      if (result.protectionEnabled !== false) {
        startScanning();
      }
    });

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'scan') {
        scanPage();
        sendResponse({ patterns: detectedPatterns });
      } else if (request.action === 'toggleProtection') {
        toggleProtection(request.enabled);
        sendResponse({ success: true });
      }
    });
  }

  // Start scanning for dark patterns
  function startScanning() {
    if (isScanning) return;
    
    isScanning = true;
    scanPage();
    
    // Scan periodically for dynamic content
    setInterval(scanPage, 5000);
  }

  // Stop scanning
  function stopScanning() {
    isScanning = false;
    removeOverlay();
  }

  // Toggle protection on/off
  function toggleProtection(enabled) {
    if (enabled) {
      startScanning();
    } else {
      stopScanning();
    }
    chrome.storage.sync.set({ protectionEnabled: enabled });
  }

  // Scan current page for dark patterns
  function scanPage() {
    const patterns = [];
    
    DARK_PATTERN_RULES.forEach(rule => {
      const detected = detectPattern(rule);
      if (detected) {
        patterns.push({
          ...rule,
          elements: detected.elements,
          timestamp: Date.now()
        });
      }
    });

    if (patterns.length > 0) {
      detectedPatterns = patterns;
      showProtectionOverlay(patterns);
      reportToBackground(patterns);
    } else {
      detectedPatterns = [];
      removeOverlay();
    }
  }

  // Detect a specific pattern
  function detectPattern(rule) {
    const elements = [];
    
    // Check DOM selectors
    rule.selectors.forEach(selector => {
      const found = document.querySelectorAll(selector);
      found.forEach(element => {
        elements.push({
          selector: selector,
          element: element,
          text: element.textContent?.substring(0, 100)
        });
      });
    });

    // Check text patterns
    const pageText = document.body.innerText;
    rule.textPatterns.forEach(pattern => {
      if (pattern.test(pageText)) {
        const matches = pageText.match(pattern);
        if (matches) {
          elements.push({
            type: 'text',
            match: matches[0],
            pattern: pattern.toString()
          });
        }
      }
    });

    return elements.length > 0 ? { elements } : null;
  }

  // Show protection overlay
  function showProtectionOverlay(patterns) {
    // Remove existing overlay
    removeOverlay();

    const overlay = document.createElement('div');
    overlay.id = 'dark-pattern-shield-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 2147483647;
      background: #fee2e2;
      border: 2px solid #dc2626;
      border-radius: 8px;
      padding: 16px;
      max-width: 320px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.4;
    `;

    // Header
    const header = document.createElement('div');
    header.style.cssText = 'display: flex; align-items: center; margin-bottom: 12px;';
    header.innerHTML = `
      <div style="font-weight: bold; color: #dc2626; font-size: 16px;">
        🛡️ Dark Pattern Detected!
      </div>
      <button id="close-overlay" style="
        margin-left: auto;
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #6b7280;
        padding: 0;
        width: 20px;
        height: 20px;
      ">×</button>
    `;

    // Content
    const content = document.createElement('div');
    patterns.forEach((pattern, index) => {
      const item = document.createElement('div');
      item.style.cssText = `
        margin-bottom: ${index < patterns.length - 1 ? '12px' : '0'};
        padding: 12px;
        background: white;
        border-radius: 6px;
        border-left: 4px solid #dc2626;
      `;
      
      item.innerHTML = `
        <div style="font-weight: 600; color: #dc2626; margin-bottom: 4px;">
          ${pattern.name}
        </div>
        <div style="color: #374151; font-size: 13px;">
          ${pattern.message}
        </div>
        <div style="margin-top: 8px;">
          <button onclick="window.open('${chrome.runtime.getURL('popup.html')}', '_blank')" style="
            background: #dc2626;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            margin-right: 8px;
          ">Get Help</button>
          <button onclick="blockSite()" style="
            background: #6b7280;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
          ">Block Site</button>
        </div>
      `;
      content.appendChild(item);
    });

    overlay.appendChild(header);
    overlay.appendChild(content);
    document.body.appendChild(overlay);

    // Close button handler
    document.getElementById('close-overlay').onclick = removeOverlay;

    // Auto-remove after 15 seconds
    setTimeout(removeOverlay, 15000);
  }

  // Remove overlay
  function removeOverlay() {
    const overlay = document.getElementById('dark-pattern-shield-overlay');
    if (overlay) {
      overlay.remove();
    }
  }

  // Block current site
  function blockSite() {
    chrome.storage.sync.get(['blockedSites'], (result) => {
      const blockedSites = result.blockedSites || [];
      const currentDomain = window.location.hostname;
      
      if (!blockedSites.includes(currentDomain)) {
        blockedSites.push(currentDomain);
        chrome.storage.sync.set({ blockedSites });
        
        // Show confirmation
        alert(`Site ${currentDomain} has been blocked. You can unblock it in the extension settings.`);
        
        // Redirect to safe page
        window.location.href = 'https://darkpatternshield.com/blocked';
      }
    });
  }

  // Report to background script
  function reportToBackground(patterns) {
    chrome.runtime.sendMessage({
      type: 'DETECTION_RESULTS',
      url: window.location.href,
      patterns: patterns,
      timestamp: Date.now()
    });
  }

  // Check if site is blocked
  function checkIfBlocked() {
    chrome.storage.sync.get(['blockedSites'], (result) => {
      const blockedSites = result.blockedSites || [];
      const currentDomain = window.location.hostname;
      
      if (blockedSites.includes(currentDomain)) {
        // Show blocking page
        document.body.innerHTML = `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #fee2e2;
            color: #dc2626;
            text-align: center;
            padding: 20px;
          ">
            <div style="font-size: 48px; margin-bottom: 20px;">🛡️</div>
            <h1 style="font-size: 24px; margin-bottom: 16px;">Site Blocked</h1>
            <p style="font-size: 16px; margin-bottom: 24px; max-width: 500px;">
              This site has been blocked by Dark Pattern Shield due to detected deceptive practices.
            </p>
            <div style="display: flex; gap: 12px;">
              <button onclick="window.location.href='https://darkpatternshield.com'" style="
                background: #dc2626;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                font-size: 14px;
                cursor: pointer;
              ">Visit Shield</button>
              <button onclick="unblockSite()" style="
                background: #6b7280;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                font-size: 14px;
                cursor: pointer;
              ">Unblock Site</button>
            </div>
          </div>
        `;
      }
    });
  }

  // Unblock site
  function unblockSite() {
    chrome.storage.sync.get(['blockedSites'], (result) => {
      const blockedSites = result.blockedSites || [];
      const currentDomain = window.location.hostname;
      
      const updatedSites = blockedSites.filter(site => site !== currentDomain);
      chrome.storage.sync.set({ blockedSites: updatedSites });
      
      // Reload page
      window.location.reload();
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Check if site should be blocked
  checkIfBlocked();

})();
