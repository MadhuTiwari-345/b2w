import { GoogleGenAI, Type } from "@google/genai";
import { SERVICES } from "../constants";
import { RecommendationResponse } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getRecommendations = async (userQuery: string): Promise<RecommendationResponse> => {
  // Construct a context string describing available services
  const servicesContext = SERVICES.map(s => `- ID: ${s.id}, Name: ${s.title}, Desc: ${s.description}`).join('\n');

  const systemInstruction = `
    You are an expert video production consultant for a company called b2w.tv.
    Your goal is to analyze the user's request and recommend the top 1 to 3 most relevant video services from the provided list.
    
    Available Services:
    ${servicesContext}

    Rules:
    1. Analyze the user's intent semantically.
    2. Select the best matching services (minimum 1, maximum 3).
    3. Provide a brief, persuasive reason starting with "Why this matches:" for each recommendation.
    4. Extract specific keywords from the user's input that triggered this recommendation.
    5. Return JSON only.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  serviceId: { type: Type.STRING, description: "The ID of the service from the available list" },
                  reason: { type: Type.STRING, description: "A short explanation of why this fits the user request" },
                  matchedKeywords: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "Keywords from the user text that matched this service"
                  }
                },
                required: ["serviceId", "reason", "matchedKeywords"]
              }
            }
          }
        }
      }
    });

    let text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    // Defensive parsing: Clean potential markdown formatting if the model adds it
    text = text.trim();
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    return JSON.parse(text) as RecommendationResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback logic for when API Key is missing or quota exceeded (simulated for prototype robustness)
    return fallbackLogic(userQuery);
  }
};

// Fallback keyword matching logic (client-side only as requested by fallback requirement)
const fallbackLogic = (query: string): RecommendationResponse => {
  const lowerQuery = query.toLowerCase();
  const results = [];

  if (lowerQuery.includes('product') || lowerQuery.includes('demo') || lowerQuery.includes('explain')) {
    results.push({
      serviceId: 'product-demo',
      reason: 'You mentioned explaining a product, which is ideal for a demo.',
      matchedKeywords: ['product', 'explain']
    });
  }
  
  if (lowerQuery.includes('brand') || lowerQuery.includes('story') || lowerQuery.includes('mission')) {
    results.push({
      serviceId: 'brand-film',
      reason: 'Storytelling is key for brand identity.',
      matchedKeywords: ['story', 'brand']
    });
  }

  if (lowerQuery.includes('event') || lowerQuery.includes('conference')) {
    results.push({
      serviceId: 'event-coverage',
      reason: 'Perfect for capturing your live event.',
      matchedKeywords: ['event']
    });
  }

  if (lowerQuery.includes('ad') || lowerQuery.includes('commercial') || lowerQuery.includes('promo')) {
    results.push({
      serviceId: 'ad-film',
      reason: 'Best choice for advertising and commercial campaigns.',
      matchedKeywords: ['ad', 'commercial']
    });
  }

  // Default fallback if nothing matches
  if (results.length === 0) {
    results.push({
      serviceId: 'social-promo',
      reason: 'A great starting point for general visibility.',
      matchedKeywords: []
    });
    results.push({
      serviceId: 'brand-film',
      reason: 'Establish your identity with a high-quality film.',
      matchedKeywords: []
    });
  }

  // Ensure unique serviceIds
  const uniqueResults = results.filter((v, i, a) => a.findIndex(t => t.serviceId === v.serviceId) === i);

  return { recommendations: uniqueResults.slice(0, 3) };
};