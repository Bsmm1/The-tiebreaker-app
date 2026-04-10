import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface DecisionAnalysis {
  decision: string;
  summary: string;
  pros: { point: string; weight: "low" | "medium" | "high" }[];
  cons: { point: string; weight: "low" | "medium" | "high" }[];
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  comparison?: {
    headers: string[];
    rows: { label: string; values: string[] }[];
  };
  recommendation: string;
}

export async function analyzeDecision(decision: string): Promise<DecisionAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following decision: "${decision}". Provide a comprehensive breakdown including pros, cons, SWOT analysis, and a comparison if there are multiple options involved. If it's a yes/no decision, compare the "Yes" vs "No" scenarios.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          decision: { type: Type.STRING },
          summary: { type: Type.STRING },
          pros: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                point: { type: Type.STRING },
                weight: { type: Type.STRING, enum: ["low", "medium", "high"] }
              },
              required: ["point", "weight"]
            }
          },
          cons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                point: { type: Type.STRING },
                weight: { type: Type.STRING, enum: ["low", "medium", "high"] }
              },
              required: ["point", "weight"]
            }
          },
          swot: {
            type: Type.OBJECT,
            properties: {
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
              threats: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["strengths", "weaknesses", "opportunities", "threats"]
          },
          comparison: {
            type: Type.OBJECT,
            properties: {
              headers: { type: Type.ARRAY, items: { type: Type.STRING } },
              rows: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    values: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["label", "values"]
                }
              }
            },
            required: ["headers", "rows"]
          },
          recommendation: { type: Type.STRING }
        },
        required: ["decision", "summary", "pros", "cons", "swot", "recommendation"]
      }
    }
  });

  return JSON.parse(response.text);
}
