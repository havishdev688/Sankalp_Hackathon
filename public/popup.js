// Debug button: log detected patterns to console
document.addEventListener('DOMContentLoaded', function() {
  const debugButton = document.getElementById('debugButton');
  if (debugButton) {
    debugButton.addEventListener('click', () => {
      chrome.storage.local.get({ detectedPatterns: [] }, (result) => {
        console.log('Detected Patterns:', result.detectedPatterns);
        alert('Patterns logged to console!');
      });
    });
  }
});
// Dark Pattern Shield - Popup Script

document.addEventListener('DOMContentLoaded', function() {
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  const toggleSwitch = document.getElementById('toggleSwitch');
  const patternsDetected = document.getElementById('patternsDetected');
  const sitesBlocked = document.getElementById('sitesBlocked');
  const detectionResults = document.getElementById('detectionResults');
  const detectionList = document.getElementById('detectionList');
  const scanButton = document.getElementById('scanButton');
  const viewHistory = document.getElementById('viewHistory');
  const settingsButton = document.getElementById('settingsButton');

  // Initialize popup
  init();

  // Toggle protection
  toggleSwitch.addEventListener('click', function() {
    const isActive = toggleSwitch.classList.contains('active');
    const newState = !isActive;
    
    toggleSwitch.classList.toggle('active', newState);
    updateStatus(newState);
    
    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'toggleProtection',
          enabled: newState
        });
      }
    });
    
    // Update storage
    chrome.storage.sync.set({ protectionEnabled: newState });
  });

  // Scan current page
  scanButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'scan' }, function(response) {
          if (response && response.patterns) {
            displayDetectionResults(response.patterns);
          }
        });
      }
    });
  });

  // View history
  viewHistory.addEventListener('click', function() {
    chrome.tabs.create({ url: chrome.runtime.getURL('history.html') });
  });

  // Settings
  settingsButton.addEventListener('click', function() {
    chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
  });

  // Initialize popup state
  function init() {
    // Load settings
    chrome.storage.sync.get(['protectionEnabled', 'detectionHistory', 'blockedSites'], function(result) {
      const protectionEnabled = result.protectionEnabled !== false;
      updateStatus(protectionEnabled);
      
      // Update stats
      updateStats(result.detectionHistory || [], result.blockedSites || []);
      
      // Load recent detections
      loadRecentDetections(result.detectionHistory || []);
    });
  }

  // Update protection status
  function updateStatus(isActive) {
    if (isActive) {
      statusDot.className = 'status-dot status-active';
      statusText.textContent = 'Protection Active';
    } else {
      statusDot.className = 'status-dot status-inactive';
      statusText.textContent = 'Protection Disabled';
    }
    toggleSwitch.classList.toggle('active', isActive);
  }

  // Update statistics
  function updateStats(detectionHistory, blockedSites) {
    // Count patterns detected today
    const today = new Date().toDateString();
    const todayDetections = detectionHistory.filter(item => 
      new Date(item.timestamp).toDateString() === today
    );
    const totalPatterns = todayDetections.reduce((sum, item) => sum + item.patterns.length, 0);
    
    patternsDetected.textContent = totalPatterns;
    sitesBlocked.textContent = blockedSites.length;
  }

  // Load recent detections
  function loadRecentDetections(detectionHistory) {
    if (detectionHistory.length === 0) {
      detectionResults.style.display = 'none';
      return;
    }

    // Get last 5 detections
    const recentDetections = detectionHistory.slice(-5).reverse();
    
    detectionList.innerHTML = '';
    recentDetections.forEach(item => {
      const domain = new URL(item.url).hostname;
      const detectionItem = document.createElement('div');
      detectionItem.className = 'detection-item';
      
      const patternNames = item.patterns.map(p => p.name).join(', ');
      const timeAgo = getTimeAgo(item.timestamp);
      
      detectionItem.innerHTML = `
        <div class="detection-name">${patternNames}</div>
        <div class="detection-message">${domain} • ${timeAgo}</div>
      `;
      
      detectionList.appendChild(detectionItem);
    });
    
    detectionResults.style.display = 'block';
  }

  // Display detection results
  function displayDetectionResults(patterns) {
    if (patterns.length === 0) {
      detectionList.innerHTML = '<div class="detection-item"><div class="detection-name">No patterns detected</div><div class="detection-message">This page appears to be safe</div></div>';
    } else {
      detectionList.innerHTML = '';
      patterns.forEach(pattern => {
        const detectionItem = document.createElement('div');
        detectionItem.className = 'detection-item';
        detectionItem.innerHTML = `
          <div class="detection-name">${pattern.name}</div>
          <div class="detection-message">${pattern.message}</div>
        `;
        detectionList.appendChild(detectionItem);
      });
    }
    
    detectionResults.style.display = 'block';
  }

  // Get time ago string
  function getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }
});
  // Fetch detected patterns from Chrome storage and display summary
  document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get({ detectedPatterns: [] }, (result) => {
      const patterns = result.detectedPatterns;
      const summaryDiv = document.getElementById('analytics-summary');
      if (!summaryDiv) return;

      if (patterns.length === 0) {
        summaryDiv.innerHTML = '<p>No dark patterns detected yet.</p>';
        return;
      }

      // Count by type
      const typeCounts = {};
      patterns.forEach(p => {
        typeCounts[p.pattern.type] = (typeCounts[p.pattern.type] || 0) + 1;
      });

      // Last detected pattern
      const lastPattern = patterns[patterns.length - 1];
      const lastTip = lastPattern.pattern.tip || 'No tip available.';

      // Build summary HTML
      let html = `<h3>Dark Pattern Analytics</h3>`;
      html += `<p>Total detected: <b>${patterns.length}</b></p>`;
      html += `<ul>`;
      Object.entries(typeCounts).forEach(([type, count]) => {
        html += `<li>${type}: ${count}</li>`;
      });
      html += `</ul>`;
      html += `<p>Last detected: <b>${lastPattern.pattern.type}</b> on <b>${lastPattern.url}</b></p>`;
      html += `<p>Tip: <i>${lastTip}</i></p>`;

      summaryDiv.innerHTML = html;
    });
  });
