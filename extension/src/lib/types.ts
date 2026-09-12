export interface ConnectionConfig {
  apiUrl: string;
  apiKey: string;
  lastSyncedAt?: number;
  status: 'connected' | 'disconnected' | 'error';
}

export type FieldCategory = 'factual' | 'confirmation' | 'subjective' | 'missing';

export interface SelectOption {
  label: string;
  value: string;
}

export interface DetectedField {
  id: string;                    // Unique field id on page (e.g. field_0)
  selector: string;              // Unique CSS selector to find the element
  tagName: string;               // INPUT, SELECT, TEXTAREA, or COMBOBOX
  inputType: string;             // text, email, tel, select, textarea, etc.
  label: string;                 // Extracted user-facing label
  placeholder: string;           // Placeholder text if present
  name: string;                  // HTML name attribute
  fieldId: string;               // HTML id attribute
  ariaLabel: string;             // ARIA label attribute

  // Matching attributes
  category: FieldCategory;
  matchedKey: string;            // Normalized key (e.g. 'firstName', 'university')
  matchedValue: string;          // Best candidate profile value
  confidence: number;            // 0.0 to 1.0 confidence score
  approved: boolean;             // Whether user wants to autofill this field

  // Subjective / AI Questions
  isSubjective: boolean;
  aiDraft?: string;              // Grounded AI-generated answer draft
  aiPrompt?: string;             // The question fed to the AI model

  // Select / Dropdown options
  options?: SelectOption[];

  // Missing profile attributes
  isMissing: boolean;
  saveToProfile?: boolean;       // If user provides a value, save to private profile
}

export interface ScanResult {
  url: string;
  title: string;
  totalCount: number;
  factualCount: number;
  confirmationCount: number;
  subjectiveCount: number;
  missingCount: number;
  fields: DetectedField[];
}

export interface FormProfilePayload {
  dictionary: Record<string, string>;
  publicProfile?: any;
  formProfile?: any;
  projects?: any[];
  skills?: any[];
  extensionApiKey?: string;
}
