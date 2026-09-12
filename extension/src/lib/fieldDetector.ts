import { matchFieldToProfile } from './semanticMatcher';
import { DetectedField, ScanResult, SelectOption } from './types';

/**
 * Builds a reliable, unique CSS selector for a DOM element
 */
export const getUniqueSelector = (el: HTMLElement): string => {
  if (el.id) {
    return `#${CSS.escape(el.id)}`;
  }

  const name = el.getAttribute('name');
  if (name) {
    const selector = `${el.tagName.toLowerCase()}[name="${CSS.escape(name)}"]`;
    if (document.querySelectorAll(selector).length === 1) {
      return selector;
    }
  }

  // Path-based unique selector
  const path: string[] = [];
  let current: HTMLElement | null = el;

  while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.body) {
    let selector = current.tagName.toLowerCase();
    if (current.id) {
      selector += `#${CSS.escape(current.id)}`;
      path.unshift(selector);
      break;
    } else {
      let sibling = current;
      let nth = 1;
      while (sibling.previousElementSibling) {
        sibling = sibling.previousElementSibling as HTMLElement;
        if (sibling.tagName === current.tagName) nth++;
      }
      if (nth > 1) selector += `:nth-of-type(${nth})`;
    }
    path.unshift(selector);
    current = current.parentElement;
  }

  return path.join(' > ');
};

/**
 * Extracts visible, user-facing label for a form field
 */
export const extractFieldLabel = (el: HTMLElement): string => {
  // 1. Explicit <label for="...">
  if (el.id) {
    const labelEl = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
    if (labelEl && labelEl.textContent?.trim()) {
      return labelEl.textContent.trim();
    }
  }

  // 2. Ancestor <label>
  const parentLabel = el.closest('label');
  if (parentLabel) {
    // Clone and remove inputs from label text to avoid duplicate value
    const clone = parentLabel.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('input, select, textarea, button').forEach(n => n.remove());
    if (clone.textContent?.trim()) {
      return clone.textContent.trim();
    }
  }

  // 3. aria-labelledby
  const labelledBy = el.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelEl = document.getElementById(labelledBy);
    if (labelEl && labelEl.textContent?.trim()) {
      return labelEl.textContent.trim();
    }
  }

  // 4. aria-label
  const ariaLabel = el.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim()) {
    return ariaLabel.trim();
  }

  // 5. Preceding text / sibling
  let sibling = el.previousElementSibling;
  while (sibling) {
    if (sibling.tagName === 'LABEL' || sibling.tagName === 'SPAN' || sibling.tagName === 'P' || sibling.tagName === 'DIV') {
      const text = sibling.textContent?.trim();
      if (text && text.length < 80) return text;
    }
    sibling = sibling.previousElementSibling;
  }

  // 6. Parent container heading or first child text
  const container = el.parentElement;
  if (container) {
    const firstLabel = container.querySelector('label, .label, [class*="label"], [class*="title"]');
    if (firstLabel && firstLabel !== el && firstLabel.textContent?.trim()) {
      return firstLabel.textContent.trim();
    }
  }

  // 7. Placeholder
  const placeholder = el.getAttribute('placeholder');
  if (placeholder && placeholder.trim()) {
    return placeholder.trim();
  }

  // 8. Name or ID attribute fallback
  const fallback = el.getAttribute('name') || el.id || '';
  return fallback.replace(/[-_]/g, ' ').replace(/([A-Z])/g, ' $1').trim();
};

/**
 * Checks if element is visually visible and interactive
 */
const isElementVisible = (el: HTMLElement): boolean => {
  if (el.getAttribute('type') === 'hidden') return false;
  if (el.getAttribute('aria-hidden') === 'true') return false;

  const style = window.getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
    return false;
  }

  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
};

/**
 * Scans page DOM and returns classified detected fields
 */
export const scanPageForFields = (dictionary: Record<string, string>): ScanResult => {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(
      'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="image"]):not([type="reset"]), select, textarea'
    )
  );

  const detectedFields: DetectedField[] = [];
  let index = 0;

  for (const el of elements) {
    if (!isElementVisible(el)) continue;

    // Ignore search bars, newsletter popups, or captcha
    const nameOrId = (el.getAttribute('name') || el.id || '').toLowerCase();
    if (nameOrId.includes('captcha') || nameOrId.includes('csrf') || nameOrId.includes('search')) {
      continue;
    }

    const tagName = el.tagName.toUpperCase();
    const inputType = tagName === 'INPUT' ? ((el as HTMLInputElement).type || 'text').toLowerCase() : tagName.toLowerCase();
    const label = extractFieldLabel(el);
    const placeholder = el.getAttribute('placeholder') || '';
    const name = el.getAttribute('name') || '';
    const fieldId = el.id || '';
    const ariaLabel = el.getAttribute('aria-label') || '';
    const selector = getUniqueSelector(el);

    // Extract options if select
    let options: SelectOption[] | undefined;
    if (tagName === 'SELECT') {
      const select = el as HTMLSelectElement;
      options = Array.from(select.options).map(opt => ({
        label: opt.text.trim(),
        value: opt.value.trim()
      }));
    }

    // Match against profile dictionary
    const match = matchFieldToProfile({
      label,
      placeholder,
      name,
      fieldId,
      ariaLabel,
      tagName,
      inputType,
      options
    }, dictionary);

    // Default approved if high confidence or subjective
    const approved = match.confidence >= 0.85 && Boolean(match.matchedValue);

    detectedFields.push({
      id: `field_${index++}`,
      selector,
      tagName,
      inputType,
      label: label || placeholder || name || `Field ${index}`,
      placeholder,
      name,
      fieldId,
      ariaLabel,
      category: match.category,
      matchedKey: match.matchedKey,
      matchedValue: match.matchedValue,
      confidence: match.confidence,
      approved,
      isSubjective: match.isSubjective,
      aiDraft: match.isSubjective ? match.matchedValue : undefined,
      aiPrompt: match.aiPrompt,
      options,
      isMissing: match.isMissing,
      saveToProfile: false
    });
  }

  const factualCount = detectedFields.filter(f => f.category === 'factual').length;
  const confirmationCount = detectedFields.filter(f => f.category === 'confirmation').length;
  const subjectiveCount = detectedFields.filter(f => f.category === 'subjective').length;
  const missingCount = detectedFields.filter(f => f.category === 'missing').length;

  return {
    url: window.location.href,
    title: document.title,
    totalCount: detectedFields.length,
    factualCount,
    confirmationCount,
    subjectiveCount,
    missingCount,
    fields: detectedFields
  };
};
