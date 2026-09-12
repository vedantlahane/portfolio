import { defineBackground } from 'wxt/utils/define-background';
import { fetchPortfolioData, quickAddProfileField, requestAiAnswer } from '../src/lib/api';
import { getCachedProfile } from '../src/lib/storage';

export default defineBackground(() => {
  console.log('Portfolio Form Filler background script initialized.');

  // Initial fetch on extension launch
  fetchPortfolioData().catch(err => {
    console.log('Initial portfolio sync waiting for configuration:', err.message);
  });

  // Cross-browser message router
  browser.runtime.onMessage.addListener((message: any, sender, sendResponse) => {
    if (message.type === 'SYNC_PROFILE') {
      fetchPortfolioData(message.apiUrl, message.apiKey)
        .then(result => sendResponse(result))
        .catch(err => sendResponse({ success: false, message: err.message }));
      return true; // Keep message channel open for async response
    }

    if (message.type === 'GENERATE_AI_ANSWER') {
      requestAiAnswer(message.question, message.context)
        .then(result => sendResponse(result))
        .catch(err => sendResponse({ success: false, message: err.message }));
      return true;
    }

    if (message.type === 'QUICK_ADD_FIELD') {
      quickAddProfileField(message.key, message.label, message.value, message.category)
        .then(result => sendResponse({ success: result }))
        .catch(() => sendResponse({ success: false }));
      return true;
    }

    if (message.type === 'GET_CACHED_PROFILE') {
      getCachedProfile()
        .then(profile => sendResponse({ profile }))
        .catch(() => sendResponse({ profile: null }));
      return true;
    }
  });
});
