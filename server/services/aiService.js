/**
 * Dual LLM Service (Groq + Gemini)
 * Unified interface for recruitment question drafting, semantic field resolution,
 * and knowledge base retrieval.
 */

const getEnv = (key, fallback = '') => process.env[key] || fallback;

const CONFIG = {
  get groqKey() { return getEnv('GROQ_API_KEY'); },
  get geminiKey() { return getEnv('GEMINI_API_KEY'); },
  get defaultProvider() { return getEnv('DEFAULT_AI_PROVIDER', 'groq'); },
  get defaultGroqModel() { return getEnv('DEFAULT_GROQ_MODEL', 'qwen/qwen3.8-27b'); },
  get defaultGeminiModel() { return getEnv('DEFAULT_GEMINI_MODEL', 'gemini-3.6-flash'); }
};

/**
 * Executes a chat completion via Groq
 */
async function callGroq(messages, model = CONFIG.defaultGroqModel, maxTokens = 600) {
  const apiKey = CONFIG.groqKey;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured on the server.');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model || CONFIG.defaultGroqModel,
      messages,
      max_tokens: maxTokens,
      temperature: 0.6
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Groq API Error (${response.status}): ${data.error?.message || JSON.stringify(data)}`);
  }

  const text = data.choices?.[0]?.message?.content?.trim() || '';
  return { text, provider: 'groq', model };
}

/**
 * Executes a generation request via Google Gemini
 */
async function callGemini(systemPrompt, userPrompt, model = CONFIG.defaultGeminiModel, maxTokens = 600) {
  const apiKey = CONFIG.geminiKey;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt ? systemPrompt + '\n\n' : ''}${userPrompt}` }]
        }
      ],
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: 0.6
      }
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Gemini API Error (${response.status}): ${data.error?.message || JSON.stringify(data)}`);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  return { text, provider: 'gemini', model };
}

/**
 * Dispatches prompt to the specified or default AI provider with automatic fallback
 */
async function dispatchAi({ provider, model, systemPrompt, userPrompt, maxTokens = 600 }) {
  const activeProvider = provider || CONFIG.defaultProvider;

  try {
    if (activeProvider === 'gemini') {
      const targetModel = model || CONFIG.defaultGeminiModel;
      return await callGemini(systemPrompt, userPrompt, targetModel, maxTokens);
    } else {
      const targetModel = model || CONFIG.defaultGroqModel;
      const messages = [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: userPrompt }
      ];
      return await callGroq(messages, targetModel, maxTokens);
    }
  } catch (primaryError) {
    const fallbackProvider = activeProvider === 'groq' ? 'gemini' : 'groq';
    const fallbackKey = fallbackProvider === 'groq' ? CONFIG.groqKey : CONFIG.geminiKey;

    if (fallbackKey) {
      try {
        console.warn(`[AI Service] ${activeProvider} failed (${primaryError.message}). Attempting fallback to ${fallbackProvider}...`);
        if (fallbackProvider === 'gemini') {
          return await callGemini(systemPrompt, userPrompt, CONFIG.defaultGeminiModel, maxTokens);
        } else {
          const messages = [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            { role: 'user', content: userPrompt }
          ];
          return await callGroq(messages, CONFIG.defaultGroqModel, maxTokens);
        }
      } catch (fallbackError) {
        throw new Error(`Primary (${activeProvider}: ${primaryError.message}) and Fallback (${fallbackProvider}: ${fallbackError.message}) both failed.`);
      }
    }
    throw primaryError;
  }
}

/**
 * Health check test for a specific provider and model
 */
async function testConnection(provider = 'groq', model = '') {
  const startTime = Date.now();
  const targetModel = model || (provider === 'groq' ? CONFIG.defaultGroqModel : CONFIG.defaultGeminiModel);
  const userPrompt = 'Respond with exactly: CONNECTION_SUCCESSFUL';

  try {
    const result = await dispatchAi({
      provider,
      model: targetModel,
      systemPrompt: 'You are a diagnostic health checker. Reply concisely.',
      userPrompt,
      maxTokens: 15
    });

    return {
      success: true,
      provider,
      model: targetModel,
      latencyMs: Date.now() - startTime,
      response: result.text
    };
  } catch (error) {
    return {
      success: false,
      provider,
      model: targetModel,
      latencyMs: Date.now() - startTime,
      error: error.message
    };
  }
}

/**
 * Performs relevance scoring to retrieve the most pertinent knowledge vault items
 */
function retrieveRelevantKnowledge(query, knowledgeVault = [], topK = 4) {
  if (!Array.isArray(knowledgeVault) || knowledgeVault.length === 0) return [];

  const queryTerms = (query || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);

  const scored = knowledgeVault.map(item => {
    let score = 0;
    if (item.pinned) score += 2.0;

    const titleLower = (item.title || '').toLowerCase();
    const contentLower = (item.content || '').toLowerCase();
    const tagsLower = Array.isArray(item.tags) ? item.tags.join(' ').toLowerCase() : '';

    queryTerms.forEach(term => {
      if (titleLower.includes(term)) score += 3.0;
      if (tagsLower.includes(term)) score += 2.5;
      if (contentLower.includes(term)) score += 1.0;
    });

    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map(s => s.item);
}

/**
 * Generates grounded application essay responses based on personal knowledge & projects
 */
async function generateAnswer({
  question,
  context = '',
  knowledgeVault = [],
  projects = [],
  skills = [],
  profileFacts = {},
  provider,
  model,
  customInstructions = ''
}) {
  if (!question || !question.trim()) {
    throw new Error('A question prompt is required to generate an answer.');
  }

  const relevantKnowledge = retrieveRelevantKnowledge(question, knowledgeVault, 4);

  const projectSummaries = (projects || []).slice(0, 3).map(p => 
    `• ${p.title}: ${p.description} (Tech: ${Array.isArray(p.tech) ? p.tech.join(', ') : p.tech})`
  ).join('\n');

  const knowledgeSummaries = relevantKnowledge.map(k => 
    `[${k.category.toUpperCase()}] ${k.title}:\n${k.content}`
  ).join('\n\n');

  const systemPrompt = `You are representing Vedant Lahane, a software developer and computer science student.
Your task is to draft an authentic, articulate, high-impact response to a job application question.

RULES:
1. Ground the response STRICTLY in Vedant's real background, projects, achievements, and knowledge base provided below. Do NOT hallucinate technologies, employers, or metrics that do not exist in the context.
2. Tone: Confident, professional, clear, and direct. Avoid generic buzzwords and clichés. Let real technical decisions speak for themselves.
3. Keep the answer concise: typically 2-4 focused paragraphs (or 100-250 words) unless specifically asked for a bulleted list or single sentence.
4. Voice: First person ("I built", "In my experience").

${customInstructions ? `USER INSTRUCTIONS:\n${customInstructions}\n` : ''}

VEDANT'S BACKGROUND CONTEXT:
• Name: ${profileFacts.fullName || 'Vedant Lahane'}
• Education: ${profileFacts.educationInstitution || 'Government College of Engineering, Amravati'} (${profileFacts.degree || 'B.Tech in Computer Science'})
• Key Skills: ${skills.flatMap(s => s.skills || []).slice(0, 15).join(', ')}

FEATURED PROJECTS:
${projectSummaries || '• SafarSathi (Offline-first PWA), Axon (RAG Document Intelligence), ShoeMarkNet (Deep learning classification)'}

PERSONAL KNOWLEDGE BASE & STORIES:
${knowledgeSummaries || '• Proven experience solving 350+ DSA algorithmic problems on LeetCode; strong expertise in React, TypeScript, Node.js, and Java.'}`;

  const userPrompt = `Application Question:\n"${question}"\n\n${context ? `Additional Form Context:\n${context}\n\n` : ''}Please draft a compelling response for Vedant.`;

  const result = await dispatchAi({
    provider,
    model,
    systemPrompt,
    userPrompt,
    maxTokens: 550
  });

  return {
    answer: result.text,
    provider: result.provider,
    model: result.model,
    usedKnowledge: relevantKnowledge.map(k => k.title)
  };
}

/**
 * Resolves tricky or ambiguous form fields using LLM understanding
 */
async function matchFieldSemantically({
  fieldLabel,
  placeholder = '',
  inputType = 'text',
  options = [],
  dictionary = {},
  knowledgeVault = [],
  provider,
  model
}) {
  const relevantKnowledge = retrieveRelevantKnowledge(fieldLabel, knowledgeVault, 2);

  const factsSnippet = Object.entries(dictionary)
    .filter(([_, v]) => v && typeof v === 'string' && v.length < 150)
    .slice(0, 40)
    .map(([k, v]) => `${k}: "${v}"`)
    .join('\n');

  const optionsList = Array.isArray(options) && options.length > 0 
    ? `Available Dropdown Options:\n${options.map(o => `• value="${o.value}", label="${o.label}"`).join('\n')}` 
    : '';

  const systemPrompt = `You are an intelligent form-filling resolver for job recruitment portals.
Given a form field's label, type, and available options, select or formulate the exact value from the user's profile facts that should be entered into the field.

Return ONLY a JSON object in this exact format:
{
  "value": "the chosen value or matching option value",
  "confidence": 0.0 to 1.0,
  "reasoning": "brief 1-sentence reason"
}`;

  const userPrompt = `Field Label: "${fieldLabel}"
Placeholder: "${placeholder}"
Input Type: "${inputType}"
${optionsList}

User Facts:
${factsSnippet}

Knowledge Context:
${relevantKnowledge.map(k => `${k.title}: ${k.content}`).join('\n')}

What is the best value to fill?`;

  try {
    const result = await dispatchAi({
      provider,
      model,
      systemPrompt,
      userPrompt,
      maxTokens: 200
    });

    const jsonMatch = result.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (err) {
    console.error('Semantic match error:', err.message);
  }

  return { value: '', confidence: 0, reasoning: 'Could not semantically resolve' };
}

/**
 * Suggests category and tags for a newly provided piece of knowledge
 */
async function suggestKnowledgeClassification({ title, content, provider, model }) {
  const systemPrompt = `You are a categorization assistant for a personal professional knowledge base.
Categories allowed:
1. Experience & Stories
2. Technical Depth
3. Career Goals
4. Work Style & Values
5. Project Context
6. DSA & Problem Solving
7. Custom Attributes
8. General

Return ONLY a JSON object:
{
  "category": "one of the allowed categories",
  "tags": ["tag1", "tag2", "tag3"]
}`;

  const userPrompt = `Title: ${title}\nContent: ${content}`;

  try {
    const result = await dispatchAi({
      provider,
      model,
      systemPrompt,
      userPrompt,
      maxTokens: 100
    });

    const jsonMatch = result.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (err) {
    console.warn('Categorization suggestion failed:', err.message);
  }

  return { category: 'Experience & Stories', tags: ['General'] };
}

module.exports = {
  CONFIG,
  testConnection,
  generateAnswer,
  matchFieldSemantically,
  suggestKnowledgeClassification,
  retrieveRelevantKnowledge
};
