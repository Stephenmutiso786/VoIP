import { GoogleGenAI } from "@google/genai";
import { Call } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateAIInsights = async (calls: Call[], userQuery: string) => {
  if (!apiKey) {
    return "API Key is missing. Please configure the environment.";
  }

  // Create a summary context of the calls
  const summary = {
    totalCalls: calls.length,
    active: calls.filter(c => c.status === 'In Progress').length,
    ringing: calls.filter(c => c.status === 'Ringing').length,
    missed: calls.filter(c => c.status === 'Missed').length,
    inboundCount: calls.filter(c => c.direction === 'Inbound').length,
    outboundCount: calls.filter(c => c.direction === 'Outbound').length,
    recentCalls: calls.slice(0, 10).map(c => ({
      status: c.status,
      caller: c.caller,
      direction: c.direction,
      duration: c.duration,
      agent: c.agent || 'Unassigned'
    }))
  };

  const systemInstruction = `You are VetraCom's AI Data Analyst. 
  You have access to the following real-time VoIP call data summary: ${JSON.stringify(summary)}. 
  Answer the user's questions about the call logs, trends, or specific incidents. 
  Be professional, concise, and helpful. If you identify a high number of missed calls, suggest checking agent availability.
  Note that 'Inbound' means customer calling us, 'Outbound' means agent calling customer.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error analyzing the data. Please try again later.";
  }
};