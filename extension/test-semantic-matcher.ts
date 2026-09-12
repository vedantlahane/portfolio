import { matchFieldToProfile, isSubjectiveQuestion, normalizeText } from './src/lib/semanticMatcher';

const mockProfileDictionary: Record<string, string> = {
  fullName: 'Vedant Lahane',
  firstName: 'Vedant',
  lastName: 'Lahane',
  email: 'vedant@example.com',
  phone: '+91 9876543210',
  currentRole: 'Full Stack Engineer',
  currentCompany: 'Tech Corp',
  totalExperience: '2+ years',
  noticePeriod: 'Immediate / 15 days',
  currentSalary: '8 LPA',
  expectedSalary: '14 LPA',
  workAuthorization: 'Authorized to work in India',
  requiresSponsorship: 'No',
  github: 'https://github.com/vedantlahane',
  linkedin: 'https://linkedin.com/in/vedantlahane',
  portfolio: 'https://vedantlahane.vercel.app',
  educationInstitution: 'Pune University',
  degree: 'Bachelor of Engineering in Computer Science',
  addressLine1: 'Flat 402, Green Valley Apartments',
  city: 'Pune',
  state: 'Maharashtra',
  country: 'India',
  postalCode: '411001',
  whyOurCompany: 'I admire the company mission and want to contribute my full-stack engineering expertise.'
};

interface TestCase {
  name: string;
  field: {
    name?: string;
    id?: string;
    type?: string;
    placeholder?: string;
    ariaLabel?: string;
    labelText?: string;
    tagName: string;
    options?: { value: string; label: string }[];
  };
  expectedCategories: string[];
  expectedKey?: string;
  expectedValueSubstr?: string;
  isSubjective?: boolean;
}

const testCases: TestCase[] = [
  {
    name: 'Candidate Legal First Name',
    field: {
      name: 'candidate_first_name',
      id: 'input_fname',
      labelText: 'Legal First Name *',
      placeholder: 'Enter first name',
      tagName: 'INPUT'
    },
    expectedCategories: ['factual'],
    expectedKey: 'firstName',
    expectedValueSubstr: 'Vedant'
  },
  {
    name: 'Surname / Family Name',
    field: {
      name: 'applicant_surname',
      labelText: 'Family Name / Surname',
      placeholder: 'e.g. Smith',
      tagName: 'INPUT'
    },
    expectedCategories: ['factual'],
    expectedKey: 'lastName',
    expectedValueSubstr: 'Lahane'
  },
  {
    name: 'Contact Email Address',
    field: {
      name: 'email',
      type: 'email',
      labelText: 'Email Address *',
      placeholder: 'name@domain.com',
      tagName: 'INPUT'
    },
    expectedCategories: ['factual'],
    expectedKey: 'email',
    expectedValueSubstr: 'vedant@example.com'
  },
  {
    name: 'Primary Telephone / Mobile',
    field: {
      name: 'phone_number',
      labelText: 'Mobile / Telephone',
      placeholder: '+1 ...',
      tagName: 'INPUT'
    },
    expectedCategories: ['factual'],
    expectedKey: 'phone',
    expectedValueSubstr: '9876543210'
  },
  {
    name: 'LinkedIn Profile URL',
    field: {
      name: 'job_application[answers][linkedin]',
      labelText: 'LinkedIn Profile URL',
      placeholder: 'https://linkedin.com/in/...',
      tagName: 'INPUT'
    },
    expectedCategories: ['factual'],
    expectedKey: 'linkedin',
    expectedValueSubstr: 'linkedin.com'
  },
  {
    name: 'GitHub Profile URL',
    field: {
      name: 'github_profile',
      labelText: 'GitHub / Code Repository Link',
      placeholder: 'github.com/username',
      tagName: 'INPUT'
    },
    expectedCategories: ['factual'],
    expectedKey: 'github',
    expectedValueSubstr: 'github.com'
  },
  {
    name: 'Personal Website / Portfolio',
    field: {
      name: 'website_url',
      labelText: 'Personal Website or Portfolio',
      placeholder: 'https://',
      tagName: 'INPUT'
    },
    expectedCategories: ['factual'],
    expectedKey: 'portfolio',
    expectedValueSubstr: 'vedantlahane'
  },
  {
    name: 'Notice Period Field',
    field: {
      name: 'notice_period_days',
      labelText: 'What is your official notice period?',
      placeholder: 'Days or months',
      tagName: 'INPUT'
    },
    expectedCategories: ['factual'],
    expectedKey: 'noticePeriod',
    expectedValueSubstr: 'Immediate'
  },
  {
    name: 'Expected Salary Field',
    field: {
      name: 'desired_compensation',
      labelText: 'Expected Compensation / Desired Salary (Annual)',
      placeholder: 'e.g. 15 LPA',
      tagName: 'INPUT'
    },
    expectedCategories: ['factual'],
    expectedKey: 'expectedSalary',
    expectedValueSubstr: '14 LPA'
  },
  {
    name: 'Visa Sponsorship Dropdown (High Confidence)',
    field: {
      name: 'requires_visa_sponsorship',
      labelText: 'Will you now or in the future require visa sponsorship?',
      tagName: 'SELECT',
      options: [
        { value: '', label: 'Select...' },
        { value: 'yes', label: 'Yes, I require sponsorship' },
        { value: 'no', label: 'No, I am authorized without sponsorship' }
      ]
    },
    expectedCategories: ['factual', 'confirmation'],
    expectedKey: 'requiresSponsorship',
    expectedValueSubstr: 'no'
  },
  {
    name: 'Confirmation Needed Dropdown (Medium Confidence / Non-standard)',
    field: {
      name: 'employment_type_preference',
      labelText: 'Role type / employment arrangement preference',
      tagName: 'SELECT',
      options: [
        { value: 'full_time', label: 'Regular Full-Time Direct Hire' },
        { value: 'contract', label: 'Contract / W2' }
      ]
    },
    expectedCategories: ['confirmation', 'missing']
  },
  {
    name: 'Subjective: Why work here textarea',
    field: {
      name: 'why_company_question',
      labelText: 'Why do you want to work at our company?',
      placeholder: 'Tell us in 2-3 sentences...',
      tagName: 'TEXTAREA'
    },
    expectedCategories: ['subjective'],
    isSubjective: true
  },
  {
    name: 'Subjective: Technical Achievement',
    field: {
      name: 'proudest_achievement',
      labelText: 'Tell us about a technical problem you tackled and what you learned from it.',
      tagName: 'TEXTAREA'
    },
    expectedCategories: ['subjective'],
    isSubjective: true
  },
  {
    name: 'Driver License (Not in Profile)',
    field: {
      name: 'driver_license_id',
      labelText: 'Driver License / Driving Permit Number',
      placeholder: 'DL-XXXX',
      tagName: 'INPUT'
    },
    expectedCategories: ['missing']
  }
];

let passed = 0;
let failed = 0;

console.log('--- RUNNING SEMANTIC MATCHER TESTS ---');

for (const tc of testCases) {
  const result = matchFieldToProfile(
    {
      label: tc.field.labelText || '',
      placeholder: tc.field.placeholder || '',
      name: tc.field.name || '',
      fieldId: tc.field.id || '',
      ariaLabel: tc.field.ariaLabel || '',
      tagName: tc.field.tagName,
      inputType: tc.field.type || 'text',
      options: tc.field.options || []
    },
    mockProfileDictionary
  );

  let ok = true;
  let reasons: string[] = [];

  if (tc.isSubjective && !result.isSubjective) {
    ok = false;
    reasons.push('Expected subjective=true, got isSubjective=' + result.isSubjective);
  }

  if (!tc.expectedCategories.includes(result.category)) {
    ok = false;
    reasons.push('Expected category in [' + tc.expectedCategories.join(', ') + '], got "' + result.category + '"');
  }

  if (tc.expectedKey && result.matchedKey !== tc.expectedKey) {
    ok = false;
    reasons.push('Expected matchedKey="' + tc.expectedKey + '", got "' + result.matchedKey + '"');
  }

  if (tc.expectedValueSubstr && !result.matchedValue.toLowerCase().includes(tc.expectedValueSubstr.toLowerCase())) {
    ok = false;
    reasons.push('Expected matchedValue to contain "' + tc.expectedValueSubstr + '", got "' + result.matchedValue + '"');
  }

  if (ok) {
    console.log('[PASS] ' + tc.name + ' -> ' + result.category + ' (key: ' + (result.matchedKey || 'N/A') + ', conf: ' + result.confidence.toFixed(2) + ')');
    passed++;
  } else {
    console.error('[FAIL] ' + tc.name);
    for (const r of reasons) console.error('   ' + r);
    console.error('   Result:', result);
    failed++;
  }
}

console.log('\nResults: ' + passed + ' passed, ' + failed + ' failed.');
if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL SEMANTIC MATCHER TESTS PASSED!\n');
}
