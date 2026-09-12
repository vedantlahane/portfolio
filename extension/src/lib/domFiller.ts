import { DetectedField } from './types';

/**
 * Safely injects values into DOM elements ensuring React/Vue/Angular/Formik state synchronizes properly
 */
export const injectFieldValue = (element: HTMLElement, value: string): boolean => {
  if (!element || value === undefined || value === null) return false;

  try {
    const tagName = element.tagName.toUpperCase();

    // 1. Textarea Element
    if (tagName === 'TEXTAREA') {
      const textarea = element as HTMLTextAreaElement;
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      )?.set;

      if (nativeSetter) {
        nativeSetter.call(textarea, value);
      } else {
        textarea.value = value;
      }

      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
      textarea.dispatchEvent(new Event('blur', { bubbles: true }));
      applyFillHighlight(textarea);
      return true;
    }

    // 2. Select Element
    if (tagName === 'SELECT') {
      const select = element as HTMLSelectElement;
      const targetValNorm = value.trim().toLowerCase();
      let foundIndex = -1;

      // Try exact value or label match first
      for (let i = 0; i < select.options.length; i++) {
        const opt = select.options[i];
        const valNorm = opt.value.trim().toLowerCase();
        const textNorm = opt.text.trim().toLowerCase();

        if (valNorm === targetValNorm || textNorm === targetValNorm) {
          foundIndex = i;
          break;
        }
      }

      // Try substring match if no exact match
      if (foundIndex === -1) {
        for (let i = 0; i < select.options.length; i++) {
          const opt = select.options[i];
          const textNorm = opt.text.trim().toLowerCase();
          if (textNorm.includes(targetValNorm) || targetValNorm.includes(textNorm)) {
            foundIndex = i;
            break;
          }
        }
      }

      if (foundIndex !== -1) {
        select.selectedIndex = foundIndex;
        select.dispatchEvent(new Event('input', { bubbles: true }));
        select.dispatchEvent(new Event('change', { bubbles: true }));
        select.dispatchEvent(new Event('blur', { bubbles: true }));
        applyFillHighlight(select);
        return true;
      }
      return false;
    }

    // 3. Input Element (Text, Email, Tel, Radio, Checkbox, etc.)
    if (tagName === 'INPUT') {
      const input = element as HTMLInputElement;
      const inputType = (input.type || 'text').toLowerCase();

      // Checkbox
      if (inputType === 'checkbox') {
        const isTrue = value === 'true' || value === 'Yes' || value === '1';
        input.checked = isTrue;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new Event('click', { bubbles: true }));
        applyFillHighlight(input);
        return true;
      }

      // Radio Button
      if (inputType === 'radio') {
        const inputValNorm = input.value.trim().toLowerCase();
        const targetValNorm = value.trim().toLowerCase();
        if (inputValNorm === targetValNorm || (targetValNorm === 'yes' && inputValNorm === 'true')) {
          input.checked = true;
          input.dispatchEvent(new Event('change', { bubbles: true }));
          input.dispatchEvent(new Event('click', { bubbles: true }));
          applyFillHighlight(input);
          return true;
        }
        return false;
      }

      // Standard text-based input
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;

      if (nativeSetter) {
        nativeSetter.call(input, value);
      } else {
        input.value = value;
      }

      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.dispatchEvent(new Event('blur', { bubbles: true }));
      applyFillHighlight(input);
      return true;
    }

    // 4. ContentEditable / Custom ARIA inputs
    if (element.isContentEditable) {
      element.innerText = value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      element.dispatchEvent(new Event('blur', { bubbles: true }));
      applyFillHighlight(element);
      return true;
    }

    return false;
  } catch (err) {
    console.error('Failed to inject field value:', err);
    return false;
  }
};

/**
 * Applies a visual accent glow to filled fields for transparent user feedback
 */
const applyFillHighlight = (el: HTMLElement) => {
  const originalTransition = el.style.transition;
  const originalOutline = el.style.outline;

  el.style.transition = 'outline 0.3s ease, background-color 0.3s ease';
  el.style.outline = '2px solid #85a7ad';
  el.style.backgroundColor = 'rgba(133, 167, 173, 0.08)';

  setTimeout(() => {
    el.style.outline = originalOutline;
    el.style.backgroundColor = '';
    el.style.transition = originalTransition;
  }, 2000);
};

/**
 * Fills all approved fields on the page
 */
export const fillAllApprovedFields = (fields: DetectedField[]): { filledCount: number; failedCount: number } => {
  let filledCount = 0;
  let failedCount = 0;

  for (const field of fields) {
    if (!field.approved || !field.matchedValue) continue;

    const el = document.querySelector(field.selector) as HTMLElement;
    if (el) {
      const success = injectFieldValue(el, field.matchedValue);
      if (success) {
        filledCount++;
      } else {
        failedCount++;
      }
    } else {
      failedCount++;
    }
  }

  return { filledCount, failedCount };
};
