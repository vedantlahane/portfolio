const fs = require('fs');
const path = './server/controllers/formProfileController.js';
let content = fs.readFileSync(path, 'utf8');

// Replace buildLookupDictionary with a cleaner version
const newLookup = `// Builds a flat lookup dictionary for fast matching in extension
const buildLookupDictionary = (publicProfile, formProfile, projects, skills) => {
  const p = publicProfile || {};
  const fp = formProfile || {};
  const personal = fp.personal || {};
  const edu = (fp.education && fp.education[0]) || {};

  const nameParts = (personal.preferredName || p.name || 'Vedant Lahane').trim().split(' ');
  const firstName = personal.legalFirstName || nameParts[0] || 'Vedant';
  const lastName = personal.legalLastName || nameParts.slice(1).join(' ') || 'Lahane';
  const fullName = personal.preferredName || p.name || \`\${firstName} \${lastName}\`;

  // Flat dictionary with high-value keys
  const dict = {
    // Identity & Contact
    fullName,
    firstName,
    lastName,
    preferredName: personal.preferredName || firstName,
    email: p.email || 'vedantanillahane@gmail.com',
    phone: p.phone || '+91 7447335096',
    alternatePhone: personal.alternatePhone || '',
    gender: personal.gender || '',
    pronouns: personal.pronouns || 'he/him',

    // Address
    addressLine1: personal.addressLine1 || '',
    addressLine2: personal.addressLine2 || '',
    city: personal.city || 'Amravati',
    state: personal.state || 'Maharashtra',
    country: personal.country || 'India',
    postalCode: personal.postalCode || '',
    nationality: personal.nationality || 'Indian',
    citizenship: personal.citizenship || 'India',
    passportNumber: personal.passportNumber || '',

    // Social Links
    linkedin: personal.linkedinUrl || 'https://linkedin.com/in/vedant-lahane',
    linkedinUrl: personal.linkedinUrl || 'https://linkedin.com/in/vedant-lahane',
    linkedinProfile: personal.linkedinUrl || 'https://linkedin.com/in/vedant-lahane',
    github: personal.githubUrl || 'https://github.com/vedantlahane',
    githubUrl: personal.githubUrl || 'https://github.com/vedantlahane',
    githubProfile: personal.githubUrl || 'https://github.com/vedantlahane',
    twitter: personal.twitterUrl || 'https://twitter.com/vedantlahane',
    twitterUrl: personal.twitterUrl || 'https://twitter.com/vedantlahane',
    leetcode: 'https://leetcode.com/u/vedantlahane',
    leetcodeUrl: 'https://leetcode.com/u/vedantlahane',
    portfolio: personal.portfolioUrl || 'https://vedantlahane.vercel.app',
    portfolioUrl: personal.portfolioUrl || 'https://vedantlahane.vercel.app',
    website: personal.portfolioUrl || 'https://vedantlahane.vercel.app',
    websiteUrl: personal.portfolioUrl || 'https://vedantlahane.vercel.app',
    cvLink: p.cvLink || '',

    // Education
    institution: edu.institution || 'Government College of Engineering, Amravati',
    university: edu.institution || 'Government College of Engineering, Amravati',
    college: edu.institution || 'Government College of Engineering, Amravati',
    degree: edu.degree || 'Bachelor of Technology',
    major: edu.major || 'Computer Science & Engineering',
    fieldOfStudy: edu.major || 'Computer Science & Engineering',
    gpa: edu.gpa || '',
    graduationYear: edu.graduationYear || '2026',
    startYear: edu.startYear || '2022',
    educationLocation: edu.location || 'Amravati, Maharashtra, India',

    // Skills & Highlights
    skillsSummary: (skills || []).flatMap(s => s.skills).join(', '),
    featuredSkills: (p.featuredSkills || []).map(s => s.name).join(', '),
    roles: (p.roles || []).join(', '),
    
    // Default Professional Summary (from Profile)
    professionalSummary: p.heroDescription || ''
  };

  // Merge custom fields
  if (Array.isArray(fp.customFields)) {
    fp.customFields.forEach(cf => {
      if (cf.key && cf.value) {
        dict[cf.key] = cf.value;
      }
    });
  }

  // Index Knowledge Vault entries
`;

const regex = /\/\/ Builds a flat lookup dictionary for fast matching in extension[\s\S]*?\/\/ Index Knowledge Vault entries\n/m;
content = content.replace(regex, newLookup);

fs.writeFileSync(path, content, 'utf8');
console.log('patched');
