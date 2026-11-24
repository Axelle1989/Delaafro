/**
 * LLM Provider Abstraction for DELAAFRO Chatbot "Dela"
 * Supports Gemini (default), Claude (Anthropic), with offline knowledge base fallback.
 */

function getLocalKnowledgeFallback(lastUserMessage = '') {
  const text = (lastUserMessage || '').toLowerCase();

  if (text.includes('comment') && (text.includes('vas') || text.includes('va'))) {
    return "Bonjour ! Je vais très bien, merci 🌿 Je suis Dela, la conseillère DELAAFRO. Comment se portent vos cheveux afro ou vos locks aujourd'hui ?";
  }

  if (text.includes('whatsapp') || text.includes('numéro') || text.includes('numero') || text.includes('contacter') || text.includes('humain') || text.includes('téléphone')) {
    return "Vous pouvez joindre directement notre équipe DELAAFRO sur WhatsApp au **+229 45 48 34 73** (lien direct : https://wa.me/22945483473) ✨ Nous sommes disponibles pour vous guider pas à pas.";
  }

  if (text.includes('routine') || text.includes('gamme') || text.includes('soin') || text.includes('cheveux') || text.includes('sec') || text.includes('casse')) {
    return "Pour sublimer vos cheveux afro ou crépus, l'essentiel repose sur l'équilibre entre hydrater (eau, aloe vera) et sceller avec un beurre ou une huile végétale. Avez-vous une porosité forte ou faible ?\n\nPour un rituel complet prêt à l'emploi, découvrez notre **Gamme Hydratation Intense** 🌿\n\n[PRODUIT: gamme-hydratation]";
  }

  if (text.includes('bonjour') || text.includes('salut') || text.includes('hello')) {
    return "Bonjour, je suis Dela, la conseillère DELAAFRO. Comment puis-je vous aider ? 🌿";
  }

  return "Je suis à votre entière disposition pour vous guider sur nos rituels capillaires 100% naturels formulés au Bénin 🌿 Que recherchez-vous pour vos cheveux ou locks ? Vous pouvez également contacter notre équipe sur WhatsApp : https://wa.me/22945483473 ✨";
}

export async function generateChatResponse({
  messages,
  systemPrompt,
  stream = false,
  onChunk,
}) {
  const provider = (process.env.LLM_PROVIDER || 'gemini').toLowerCase();
  const apiKey = process.env.LLM_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_API_KEY_HERE') {
    const demoReply =
      "Bonjour, je suis Dela, la conseillère DELAAFRO ! 🌿 Je suis prête à vous orienter sur nos rituels capillaires naturels formulés au Bénin. Pour activer mes réponses IA en direct, renseignez votre clé `LLM_API_KEY` dans votre fichier `.env`. Notre équipe vous répond avec grand plaisir sur WhatsApp : https://wa.me/22945483473 ✨";
    if (stream && onChunk) {
      for (const word of demoReply.split(' ')) {
        onChunk(word + ' ');
        await new Promise((r) => setTimeout(r, 20));
      }
    }
    return demoReply;
  }

  const lastUserMsg = messages[messages.length - 1]?.content || '';

  try {
    if (provider === 'claude') {
      return await generateClaudeResponse({ messages, systemPrompt, apiKey, stream, onChunk });
    }

    // Default: Gemini
    return await generateGeminiResponse({ messages, systemPrompt, apiKey, stream, onChunk });
  } catch (err) {
    console.warn('API externe inaccessible, bascule sur la base de connaissances locale Dela:', err.message);
    const fallbackReply = getLocalKnowledgeFallback(lastUserMsg);

    if (stream && onChunk) {
      const parts = fallbackReply.split(' ');
      for (let i = 0; i < parts.length; i++) {
        onChunk(parts[i] + (i < parts.length - 1 ? ' ' : ''));
        await new Promise((r) => setTimeout(r, 20));
      }
    }
    return fallbackReply;
  }
}

/**
 * Gemini API Provider (Default)
 */
async function generateGeminiResponse({ messages, systemPrompt, apiKey, stream, onChunk }) {
  const model = process.env.LLM_MODEL || 'gemini-1.5-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:${
    stream ? 'streamGenerateContent?alt=sse&' : 'generateContent?'
  }key=${apiKey}`;

  // Convert messages to Gemini format: role 'user' or 'model'
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const body = {
    contents,
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 600,
    },
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Gemini API Error:', response.status, errText.slice(0, 300));
    throw new Error(`Gemini API error (${response.status})`);
  }

  if (!stream) {
    const data = await response.json();
    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Je vous remercie pour votre message. Comment puis-je vous accompagner pour vos soins capillaires ?";
    return replyText;
  }

  // Handle SSE streaming
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let accumulated = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data: ')) continue;
      const jsonStr = trimmed.replace(/^data: /, '').trim();
      if (!jsonStr || jsonStr === '[DONE]') continue;

      try {
        const parsed = JSON.parse(jsonStr);
        const chunkText = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (chunkText) {
          accumulated += chunkText;
          if (onChunk) onChunk(chunkText);
        }
      } catch (e) {
        // partial json chunk, ignore
      }
    }
  }

  return accumulated;
}

/**
 * Claude (Anthropic) API Provider
 */
async function generateClaudeResponse({ messages, systemPrompt, apiKey, stream, onChunk }) {
  const model = process.env.LLM_MODEL || 'claude-3-haiku-20240307';
  const endpoint = 'https://api.anthropic.com/v1/messages';

  const formattedMessages = messages.map((m) => ({
    role: m.role === 'assistant' || m.role === 'model' ? 'assistant' : 'user',
    content: m.content,
  }));

  const body = {
    model,
    system: systemPrompt,
    messages: formattedMessages,
    max_tokens: 600,
    temperature: 0.6,
    stream: Boolean(stream),
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Claude API Error:', response.status, errText.slice(0, 300));
    throw new Error(`Claude API error (${response.status})`);
  }

  if (!stream) {
    const data = await response.json();
    return (
      data.content?.[0]?.text ||
      "Je vous remercie pour votre message. Comment puis-je vous accompagner pour vos soins capillaires ?"
    );
  }

  // Handle Claude SSE streaming
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let accumulated = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data: ')) continue;
      const jsonStr = trimmed.replace(/^data: /, '').trim();
      if (!jsonStr || jsonStr === '[DONE]') continue;

      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
          const chunkText = parsed.delta.text;
          accumulated += chunkText;
          if (onChunk) onChunk(chunkText);
        }
      } catch (e) {
        // partial json chunk, ignore
      }
    }
  }

  return accumulated;
}
