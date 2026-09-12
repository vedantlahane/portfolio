import { defineContentScript } from 'wxt/utils/define-content-script';
import { scanPageForFields } from '../src/lib/fieldDetector';
import { fillAllApprovedFields, injectFieldValue } from '../src/lib/domFiller';
import { DetectedField } from '../src/lib/types';

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    console.log('Portfolio Form Filler content script active.');

    // Listen for commands from the extension popup
    browser.runtime.onMessage.addListener((message: any, sender, sendResponse) => {
      // 1. Scan page for form fields
      if (message.type === 'SCAN_PAGE') {
        try {
          const dictionary = message.dictionary || {};
          const scanResult = scanPageForFields(dictionary);
          sendResponse({ success: true, result: scanResult });
        } catch (err: any) {
          console.error('Page scan failed:', err);
          sendResponse({ success: false, error: err.message });
        }
        return true;
      }

      // 2. Fill all approved fields
      if (message.type === 'FILL_ALL_FIELDS') {
        try {
          const fields: DetectedField[] = message.fields || [];
          const result = fillAllApprovedFields(fields);
          sendResponse({ success: true, ...result });
        } catch (err: any) {
          console.error('Fill form failed:', err);
          sendResponse({ success: false, error: err.message });
        }
        return true;
      }

      // 3. Fill a single specific field
      if (message.type === 'FILL_SINGLE_FIELD') {
        try {
          const { selector, value } = message;
          const el = document.querySelector(selector) as HTMLElement;
          if (el) {
            const success = injectFieldValue(el, value);
            sendResponse({ success });
          } else {
            sendResponse({ success: false, message: 'Element not found on page' });
          }
        } catch (err: any) {
          sendResponse({ success: false, error: err.message });
        }
        return true;
      }
    });
  }
});
