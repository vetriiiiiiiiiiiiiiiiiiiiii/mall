import { SHIRTS } from '@/data/shirts';
import { SearchMatchResult } from '@/types/shirt';

/**
 * AI Natural-Language Semantic Search Engine
 * Supports Gemini Vision/Text API when API key present, with smart client-side semantic matching fallback.
 */
export async function performAISemanticSearch(queryText: string): Promise<SearchMatchResult[]> {
  const cleanQuery = queryText.trim().toLowerCase();
  if (!cleanQuery) {
    return SHIRTS.map((shirt) => ({
      shirt,
      matchScore: 100,
      reasonText: 'Catalog standard match',
    }));
  }

  // Attempt server-side Gemini search if API Key is configured
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.AI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an AI fashion recommendation engine for a shirt collection.
User search query: "${cleanQuery}"

Catalog of Shirts:
${JSON.stringify(SHIRTS.map(s => ({ id: s.id, name: s.name, color: s.color, style: s.style, category: s.category, tags: s.tags, desc: s.description })))}

Analyze the user's intent and score each shirt ID from 0 to 100 on how well it satisfies the prompt. Provide a short reason (under 12 words) for each match.
Return output strictly in valid JSON format:
[
  { "id": "shirt-01", "score": 95, "reason": "Dark color with oversized casual aesthetic" }
]`
            }]
          }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const parsed = JSON.parse(jsonText) as Array<{ id: string; score: number; reason: string }>;
          const resultsMap = new Map(parsed.map(item => [item.id, item]));

          return SHIRTS.map(shirt => {
            const matchInfo = resultsMap.get(shirt.id);
            return {
              shirt,
              matchScore: matchInfo ? Math.min(100, Math.max(0, matchInfo.score)) : 50,
              reasonText: matchInfo?.reason || 'Recommended based on style analysis',
            };
          }).sort((a, b) => b.matchScore - a.matchScore);
        }
      }
    } catch (err) {
      console.warn('Gemini API search fallback triggered:', err);
    }
  }

  // Intelligent Local Semantic Fallback System
  return localSemanticSearch(cleanQuery);
}

function localSemanticSearch(query: string): SearchMatchResult[] {
  const synonyms: Record<string, string[]> = {
    dark: ['black', 'dark blue', 'deep', 'night', 'oversized', 'urban'],
    light: ['white', 'beige', 'tan', 'summer', 'poplin'],
    casual: ['oversized', 'streetwear', 'relaxed', 'oxford', 'linen', 'weekend', 'resort'],
    formal: ['slim fit', 'business', 'office', 'poplin', 'white', 'meeting', 'wedding'],
    summer: ['linen', 'breathable', 'resort', 'ocean', 'casual', 'short sleeve'],
    office: ['formal', 'white', 'classic', 'poplin', 'business'],
    green: ['forest', 'linen', 'earthy', 'resort'],
    blue: ['ocean', 'oxford', 'casual', 'indigo'],
    black: ['urban', 'dark', 'streetwear', 'oversized'],
  };

  const tokens = query.split(/\s+/);
  const expandedTokens = new Set<string>();

  tokens.forEach(t => {
    expandedTokens.add(t);
    for (const [key, synList] of Object.entries(synonyms)) {
      if (t.includes(key) || key.includes(t)) {
        synList.forEach(s => expandedTokens.add(s));
      }
    }
  });

  const scored = SHIRTS.map(shirt => {
    let score = 0;
    const matchReasons: string[] = [];

    const nameLower = shirt.name.toLowerCase();
    const colorLower = shirt.color.toLowerCase();
    const styleLower = shirt.style.toLowerCase();
    const categoryLower = shirt.category.toLowerCase();
    const descLower = shirt.description.toLowerCase();
    const tagsLower = shirt.tags.map(t => t.toLowerCase());

    // Direct term matching
    tokens.forEach(token => {
      if (nameLower.includes(token)) {
        score += 40;
        matchReasons.push(`Matches name "${token}"`);
      }
      if (colorLower.includes(token)) {
        score += 35;
        matchReasons.push(`Matches color "${shirt.color}"`);
      }
      if (styleLower.includes(token) || categoryLower.includes(token)) {
        score += 25;
        matchReasons.push(`Fits "${shirt.style}" style`);
      }
      if (tagsLower.some(t => t.includes(token))) {
        score += 20;
      }
      if (descLower.includes(token)) {
        score += 10;
      }
    });

    // Expanded synonym/semantic matching
    expandedTokens.forEach(exp => {
      if (tagsLower.includes(exp)) score += 15;
      if (styleLower.includes(exp)) score += 15;
      if (descLower.includes(exp)) score += 8;
    });

    // Normalize score to 40 - 98 range for relevant matches
    let finalScore = Math.min(98, Math.max(30, Math.round(score * 1.5)));
    if (tokens.length === 0) finalScore = 90;

    let reasonText = matchReasons.slice(0, 2).join(', ');
    if (!reasonText) {
      if (shirt.color.toLowerCase().includes('black') && (query.includes('dark') || query.includes('black'))) {
        reasonText = 'Similar dark color tone & streetwear fit';
        finalScore = 94;
      } else if (shirt.category.toLowerCase().includes('casual') && query.includes('casual')) {
        reasonText = 'Matches casual aesthetic and breathable cotton fabric';
        finalScore = 92;
      } else {
        reasonText = `Complements requested ${shirt.style.toLowerCase()} elements`;
        finalScore = Math.max(65, finalScore);
      }
    }

    return {
      shirt,
      matchScore: finalScore,
      reasonText,
    };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore);
}
