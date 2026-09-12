import { DetectedField, FieldCategory } from './types';

// Normalized Taxonomy and Synonym Rules
interface TaxonomyRule {
  key: string;
  synonyms: string[];
  exactKeywords?: string[];
  excludePatterns?: string[];
}

const TAXONOMY_RULES: TaxonomyRule[] = [
  // First Name
  {
    key: 'firstName',
    synonyms: ['first name', 'given name', 'forename', 'fname', 'legal first name', 'candidate first name', 'applicant first name', 'primer nombre'],
    excludePatterns: ['last name', 'surname', 'middle name']
  },
  // Last Name
  {
    key: 'lastName',
    synonyms: ['last name', 'family name', 'surname', 'lname', 'legal last name', 'candidate last name', 'applicant last name', 'apellido'],
    excludePatterns: ['first name', 'given name', 'middle name']
  },
  // Full Name
  {
    key: 'fullName',
    synonyms: ['full name', 'your name', 'candidate name', 'applicant name', 'legal name', 'complete name', 'name', 'nombre completo'],
    excludePatterns: ['company name', 'university name', 'school name', 'first name', 'last name', 'file name']
  },
  // Email
  {
    key: 'email',
    synonyms: ['email', 'email address', 'e-mail', 'e_mail', 'electronic mail', 'contact email', 'correo'],
    excludePatterns: ['alternate email', 'secondary email']
  },
  // Phone
  {
    key: 'phone',
    synonyms: ['phone', 'phone number', 'telephone', 'mobile', 'cell', 'mobile number', 'cellphone', 'contact number', 'whatsapp', 'telefono'],
    excludePatterns: ['alternate phone', 'fax', 'emergency']
  },
  // Alternate Phone
  {
    key: 'alternatePhone',
    synonyms: ['alternate phone', 'secondary phone', 'other phone', 'home phone']
  },
  // Address
  {
    key: 'addressLine1',
    synonyms: ['address', 'street address', 'address line 1', 'address 1', 'street line 1', 'home address', 'residential address', 'mailing address', 'direccion'],
    excludePatterns: ['email address', 'ip address', 'mac address', 'line 2']
  },
  {
    key: 'addressLine2',
    synonyms: ['address line 2', 'address 2', 'street line 2', 'apt', 'suite', 'unit', 'building', 'floor']
  },
  // City
  {
    key: 'city',
    synonyms: ['city', 'town', 'municipality', 'suburb', 'ciudad'],
    excludePatterns: ['electricity']
  },
  // State
  {
    key: 'state',
    synonyms: ['state', 'province', 'region', 'state/province', 'state / province', 'canton', 'estado'],
    excludePatterns: ['statement', 'united states']
  },
  // Country
  {
    key: 'country',
    synonyms: ['country', 'nation', 'country of residence', 'current country', 'citizenship country', 'pais']
  },
  // Postal Code
  {
    key: 'postalCode',
    synonyms: ['postal code', 'zip code', 'zip', 'pincode', 'pin code', 'postcode', 'codigo postal']
  },
  // Nationality & Citizenship
  {
    key: 'nationality',
    synonyms: ['nationality', 'national origin']
  },
  {
    key: 'citizenship',
    synonyms: ['citizenship', 'country of citizenship', 'citizen of']
  },
  {
    key: 'passportNumber',
    synonyms: ['passport', 'passport number', 'passport no', 'national id', 'government id']
  },
  // Gender & Pronouns
  {
    key: 'gender',
    synonyms: ['gender', 'gender identity', 'sex', 'genero'],
    excludePatterns: ['transgender']
  },
  {
    key: 'pronouns',
    synonyms: ['pronouns', 'preferred pronouns']
  },

  // Education: Institution
  {
    key: 'institution',
    synonyms: [
      'university', 'college', 'school', 'institution', 'educational institution', 
      'name of institution', 'college / university', 'school / university', 
      'institute name', 'academic institution', 'alma mater', 'universidad'
    ],
    excludePatterns: ['high school']
  },
  // Education: Degree
  {
    key: 'degree',
    synonyms: ['degree', 'qualification', 'highest qualification', 'degree title', 'level of education', 'academic degree', 'titulo']
  },
  // Education: Major
  {
    key: 'major',
    synonyms: ['major', 'field of study', 'department', 'stream', 'branch', 'specialization', 'area of study', 'discipline', 'course of study', 'especialidad']
  },
  // Education: GPA
  {
    key: 'gpa',
    synonyms: ['gpa', 'cgpa', 'grade point', 'percentage', 'grade', 'marks', 'academic score']
  },
  // Education: Graduation Year
  {
    key: 'graduationYear',
    synonyms: ['graduation year', 'completion year', 'year of completion', 'year of passing', 'grad year', 'end year', 'expected graduation', 'passout year', 'year graduated']
  },
  {
    key: 'startYear',
    synonyms: ['start year', 'commencement year', 'admission year', 'year started', 'entry year']
  },

  // Compensation & Notice
  {
    key: 'currentSalary',
    synonyms: ['current salary', 'current ctc', 'current compensation', 'present salary', 'current pay', 'salario actual']
  },
  {
    key: 'expectedSalary',
    synonyms: ['expected salary', 'expected ctc', 'desired compensation', 'salary expectation', 'target compensation', 'compensation requirement', 'desired salary', 'remuneration expectation', 'salario esperado']
  },
  {
    key: 'noticePeriod',
    synonyms: ['notice period', 'availability', 'how soon can you start', 'earliest start date', 'start date', 'availability to join', 'joining time', 'periodo de preaviso']
  },

  // Work Authorization
  {
    key: 'authorizedInCountry',
    synonyms: [
      'authorized to work', 'legally authorized', 'authorization to work', 
      'right to work', 'eligible to work', 'work authorization', 
      'legally eligible to work', 'authorized to work in'
    ]
  },
  {
    key: 'requiresSponsorship',
    synonyms: [
      'require sponsorship', 'visa sponsorship', 'need sponsorship', 
      'immigration sponsorship', 'future sponsorship', 'h-1b', 'work permit sponsorship'
    ]
  },
  {
    key: 'willingToRelocate',
    synonyms: ['willing to relocate', 'relocation', 'open to relocate', 'willingness to relocate', 'open to relocation']
  },

  // Links
  {
    key: 'linkedin',
    synonyms: ['linkedin', 'linkedin profile', 'linkedin url', 'linkedin link', 'perfil de linkedin']
  },
  {
    key: 'github',
    synonyms: ['github', 'github profile', 'github url', 'github link', 'git repo', 'perfil de github']
  },
  {
    key: 'portfolio',
    synonyms: ['portfolio', 'portfolio url', 'portfolio link', 'personal website', 'website', 'personal site', 'web site', 'online portfolio', 'sitio web', 'sitio personal'],
    excludePatterns: ['company website']
  },
  {
    key: 'twitter',
    synonyms: ['twitter', 'x profile', 'twitter url', 'x url']
  },
  {
    key: 'leetcode',
    synonyms: ['leetcode', 'coding profile', 'competitive coding', 'hackerrank']
  }
];

// Subjective Question Patterns
const SUBJECTIVE_PATTERNS = [
  'tell us about yourself',
  'tell me about yourself',
  'tell us about a',
  'tell us about',
  'describe yourself',
  'brief bio',
  'professional summary',
  'cover letter',
  'letter of motivation',
  'why do you want to join',
  'why our company',
  'why are you interested in',
  'why this role',
  'why do you want to work',
  'why should we hire you',
  'describe a project',
  'proudest project',
  'technical challenge',
  'challenging project',
  'technical problem',
  'greatest technical achievement',
  'greatest achievement',
  'describe your experience with',
  'what makes you a good fit',
  'strengths and weaknesses',
  'additional information',
  'pitch yourself'
];

/**
 * Normalizes an arbitrary text string for clean comparison
 */
export const normalizeText = (text: string): string => {
  return (text || '')
    .toLowerCase()
    .replace(/[_\-./\\:,|()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Checks if a string matches any subjective essay question triggers
 */
export const isSubjectiveQuestion = (combinedText: string, tagName: string, inputType: string): boolean => {
  const norm = normalizeText(combinedText);

  // Textareas or contenteditable are prime candidates
  const isLargeInput = tagName === 'TEXTAREA' || inputType === 'textarea';

  // Direct phrase match
  for (const pattern of SUBJECTIVE_PATTERNS) {
    if (norm.includes(pattern)) return true;
  }

  // Question words in textarea
  if (isLargeInput) {
    const hasQuestionWords = norm.includes('why') || norm.includes('describe') || norm.includes('explain') ||
      norm.includes('how have you') || norm.includes('tell us') || norm.includes('tell me') || norm.includes('what are');
    const hasContextWords = norm.includes('experience') || norm.includes('project') || norm.includes('interest') ||
      norm.includes('challenge') || norm.includes('company') || norm.includes('role') || norm.includes('problem') ||
      norm.includes('technical') || norm.includes('learned') || norm.includes('accomplishment') || norm.includes('situation') ||
      norm.includes('tackled') || norm.includes('solved') || norm.includes('strength') || norm.includes('weakness') ||
      norm.includes('work') || norm.includes('background') || norm.includes('career');
    if (hasQuestionWords && hasContextWords) return true;
  }

  return false;
};

/**
 * Evaluates match confidence and profile value for a detected field
 */
export const matchFieldToProfile = (
  fieldMeta: {
    label: string;
    placeholder: string;
    name: string;
    fieldId: string;
    ariaLabel: string;
    tagName: string;
    inputType: string;
    options?: { label: string; value: string }[];
  },
  dictionary: Record<string, string>
): {
  category: FieldCategory;
  matchedKey: string;
  matchedValue: string;
  confidence: number;
  isSubjective: boolean;
  isMissing: boolean;
  aiPrompt?: string;
} => {
  const { label, placeholder, name, fieldId, ariaLabel, tagName, inputType, options } = fieldMeta;

  // Composite search string prioritizing explicit user-facing label
  const compositeLabel = [label, ariaLabel, placeholder, name, fieldId]
    .filter(Boolean)
    .join(' ');
  const normalizedLabel = normalizeText(compositeLabel);

  // 1. Check for Subjective Questions
  if (isSubjectiveQuestion(compositeLabel, tagName, inputType)) {
    let matchedValue = '';
    const norm = normalizedLabel;

    if (norm.includes('tell us about') || norm.includes('summary') || norm.includes('bio')) {
      matchedValue = dictionary.professionalSummary || '';
    } else if (norm.includes('why') && (norm.includes('company') || norm.includes('join') || norm.includes('us') || norm.includes('interested'))) {
      matchedValue = dictionary.whyOurCompany || '';
    } else if (norm.includes('project') || norm.includes('proud') || norm.includes('achievement')) {
      matchedValue = dictionary.proudestProject || dictionary.technicalAchievement || '';
    }

    return {
      category: 'subjective',
      matchedKey: 'aiQuestion',
      matchedValue,
      confidence: 0.85,
      isSubjective: true,
      isMissing: false,
      aiPrompt: label || placeholder || 'Tell us about your background and qualifications.'
    };
  }

  // 2. Score against Taxonomy Rules
  let bestMatch: { rule: TaxonomyRule; score: number } | null = null;

  for (const rule of TAXONOMY_RULES) {
    // Check exclusions
    if (rule.excludePatterns) {
      const isExcluded = rule.excludePatterns.some(ex => normalizedLabel.includes(ex));
      if (isExcluded) continue;
    }

    // Check exact synonyms
    for (const syn of rule.synonyms) {
      if (normalizedLabel === syn) {
        bestMatch = { rule, score: 0.98 };
        break;
      }
      // Word boundary containment
      const regex = new RegExp(`\\b${syn}\\b`, 'i');
      if (regex.test(normalizedLabel)) {
        const score = 0.90 + (syn.length / Math.max(normalizedLabel.length, 1)) * 0.08;
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { rule, score: Math.min(score, 0.96) };
        }
      }
    }
  }

  // 3. Fallback: Search in custom fields of dictionary
  if (!bestMatch) {
    for (const [key, val] of Object.entries(dictionary)) {
      const normKey = normalizeText(key);
      if (normKey && (normalizedLabel.includes(normKey) || normKey.includes(normalizedLabel))) {
        bestMatch = {
          rule: { key, synonyms: [key] },
          score: 0.82
        };
        break;
      }
    }
  }

  if (bestMatch && bestMatch.score >= 0.70) {
    const matchedKey = bestMatch.rule.key;
    const lookupCandidates = [
      matchedKey,
      matchedKey + 'Url',
      matchedKey.replace(/Url$/, ''),
      matchedKey.toLowerCase(),
      matchedKey.replace(/([A-Z])/g, '_$1').toLowerCase()
    ];
    let matchedValue = '';
    for (const cand of lookupCandidates) {
      if (dictionary[cand]) {
        matchedValue = dictionary[cand];
        break;
      }
    }

    // Handle Select Dropdowns (Option Matching)
    if (tagName === 'SELECT' && Array.isArray(options) && options.length > 0) {
      let matchedOption = options.find(opt => {
        const optNorm = normalizeText(opt.label);
        const valNorm = normalizeText(matchedValue);
        return optNorm === valNorm || optNorm.includes(valNorm) || valNorm.includes(optNorm);
      });

      // Boolean / Yes-No handling
      if (!matchedOption && (matchedValue === 'Yes' || matchedValue === 'No')) {
        matchedOption = options.find(opt => {
          const optNorm = normalizeText(opt.label);
          if (matchedValue === 'Yes') return optNorm === 'yes' || optNorm.includes('true') || optNorm.includes('authorized');
          return optNorm === 'no' || optNorm.includes('false') || optNorm.includes('not');
        });
      }

      if (matchedOption) {
        return {
          category: bestMatch.score > 0.90 ? 'factual' : 'confirmation',
          matchedKey,
          matchedValue: matchedOption.value || matchedOption.label,
          confidence: Math.max(bestMatch.score, 0.88),
          isSubjective: false,
          isMissing: false
        };
      } else {
        return {
          category: 'confirmation',
          matchedKey,
          matchedValue,
          confidence: 0.75,
          isSubjective: false,
          isMissing: false
        };
      }
    }

    if (matchedValue) {
      const category: FieldCategory = bestMatch.score >= 0.88 ? 'factual' : 'confirmation';
      return {
        category,
        matchedKey,
        matchedValue,
        confidence: bestMatch.score,
        isSubjective: false,
        isMissing: false
      };
    } else {
      return {
        category: 'missing',
        matchedKey,
        matchedValue: '',
        confidence: bestMatch.score,
        isSubjective: false,
        isMissing: true
      };
    }
  }

  // Unrecognized field
  return {
    category: 'missing',
    matchedKey: '',
    matchedValue: '',
    confidence: 0.2,
    isSubjective: false,
    isMissing: true
  };
};
