// Dark Pattern Shield - Background Script
// Handles extension lifecycle and communication

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings
    chrome.storage.sync.set({
      protectionEnabled: true,
      blockedSites: [],
      detectionHistory: [],
      settings: {
        realTimeProtection: true,
        emailAlerts: true,
        autoReport: false,
        severityThreshold: 3
      }
    });

    // Open welcome page
    chrome.tabs.create({
      url: chrome.runtime.getURL('popup.html')
    });
  }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'DETECTION_RESULTS') {
    handleDetectionResults(request, sender);
  } else if (request.type === 'BLOCK_SITE') {
    blockSite(request.domain);
  } else if (request.type === 'UNBLOCK_SITE') {
    unblockSite(request.domain);
  }
});

// Handle detection results
function handleDetectionResults(request, sender) {
  const { url, patterns, timestamp } = request;
  
  // Store detection history
  chrome.storage.sync.get(['detectionHistory'], (result) => {
    const history = result.detectionHistory || [];
    history.push({
      url,
      patterns,
      timestamp,
      tabId: sender.tab.id
    });
    
    // Keep only last 100 detections
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
    
    chrome.storage.sync.set({ detectionHistory: history });
  });

  // Check severity threshold
  const maxSeverity = Math.max(...patterns.map(p => p.severity));
  chrome.storage.sync.get(['settings'], (result) => {
    const settings = result.settings || {};
    const threshold = settings.severityThreshold || 3;
    
    if (maxSeverity >= threshold) {
      // Show notification for high severity patterns
      showNotification(patterns, url);
      
      // Update badge
      chrome.action.setBadgeText({
        text: patterns.length.toString(),
        tabId: sender.tab.id
      });
      chrome.action.setBadgeBackgroundColor({
        color: '#dc2626',
        tabId: sender.tab.id
      });
    }
  });
}

// Show notification for detected patterns
function showNotification(patterns, url) {
  const domain = new URL(url).hostname;
  const patternNames = patterns.map(p => p.name).join(', ');
  
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/shield-48.png',
    title: 'Dark Pattern Detected',
    message: `${patternNames} detected on ${domain}`,
    buttons: [
      { title: 'View Details' },
      { title: 'Block Site' }
    ]
  });
}

// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  chrome.notifications.clear(notificationId);
  
  // Open popup
  chrome.action.openPopup();
});

// Handle notification button clicks
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  chrome.notifications.clear(notificationId);
  
  if (buttonIndex === 0) {
    // View Details - open popup
    chrome.action.openPopup();
  } else if (buttonIndex === 1) {
    // Block Site
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        const domain = new URL(tabs[0].url).hostname;
        blockSite(domain);
      }
    });
  }
});

// Block a site
function blockSite(domain) {
  chrome.storage.sync.get(['blockedSites'], (result) => {
    const blockedSites = result.blockedSites || [];
    if (!blockedSites.includes(domain)) {
      blockedSites.push(domain);
      chrome.storage.sync.set({ blockedSites });
      
      // Reload current tab if it's the blocked site
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && new URL(tabs[0].url).hostname === domain) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
    }
  });
}

// Unblock a site
function unblockSite(domain) {
  chrome.storage.sync.get(['blockedSites'], (result) => {
    const blockedSites = result.blockedSites || [];
    const updatedSites = blockedSites.filter(site => site !== domain);
    chrome.storage.sync.set({ blockedSites: updatedSites });
  });
}

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if site is blocked
    chrome.storage.sync.get(['blockedSites'], (result) => {
      const blockedSites = result.blockedSites || [];
      const domain = new URL(tab.url).hostname;
      
      if (blockedSites.includes(domain)) {
        // Redirect to blocked page
        chrome.tabs.update(tabId, {
          url: chrome.runtime.getURL('blocked.html')
        });
      }
    });
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  chrome.action.openPopup();
});

// Periodic cleanup
chrome.alarms.create('cleanup', { periodInMinutes: 60 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cleanup') {
    // Clean up old detection history
    chrome.storage.sync.get(['detectionHistory'], (result) => {
      const history = result.detectionHistory || [];
      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      const recentHistory = history.filter(item => item.timestamp > oneWeekAgo);
      
      if (recentHistory.length !== history.length) {
        chrome.storage.sync.set({ detectionHistory: recentHistory });
      }
    });
  }
});
