import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, Attachment } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are ThinkMate AI, a friendly, supportive, and student-focused learning assistant created by Akshay.
Your goal is to help students understand concepts, not just give answers.
- Explain concepts step-by-step using simple language.
- Use examples from daily life.
- Encourage critical thinking.
- If a student asks for an essay or direct answer to homework, guide them on how to write it instead of doing it for them.
- Be encouraging and non-judgmental.
- Keep formatting clean using Markdown (bold, lists, headers).
- If a file (PDF, image, etc.) is provided, analyze it deeply for educational value.
`;

export const generateResponse = async (
  currentMessage: string,
  history: Message[],
  attachment?: Attachment
): Promise<string> => {
  try {
    const parts: any[] = [];

    // Add attachment if present
    if (attachment) {
      parts.push({
        inlineData: {
          mimeType: attachment.mimeType,
          data: attachment.data,
        },
      });
    }

    // Add text prompt
    parts.push({ text: currentMessage });

    // History Context - Efficiently slice to save tokens
    const contextPrompt = history.slice(-6).map(m => {
        const attachInfo = m.attachment ? `[Attached: ${m.attachment.name}]` : '';
        // Limit text length for efficiency
        const textPreview = m.text.length > 500 ? m.text.substring(0, 500) + "..." : m.text;
        return `${m.role === 'user' ? 'Student' : 'ThinkMate'}: ${textPreview} ${attachInfo}`
    }).join('\n');
    
    const fullPrompt = contextPrompt ? `Previous Conversation:\n${contextPrompt}\n\nCurrent Request:\n` : "";

    // Add context to text part
    if (fullPrompt) {
        parts[parts.length - 1].text = fullPrompt + parts[parts.length - 1].text;
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        role: "user",
        parts: parts
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        tools: [{ googleMaps: {} }], // Added Google Maps grounding
      }
    });

    let text = response.text || "I couldn't generate a response at the moment. Please try again.";

    // Handle Grounding Metadata for Google Maps/Search
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        const chunks = response.candidates[0].groundingMetadata.groundingChunks;
        let sources: string[] = [];
        
        chunks.forEach((chunk: any) => {
            if (chunk.web?.uri && chunk.web?.title) {
                sources.push(`- [${chunk.web.title}](${chunk.web.uri})`);
            } else if (chunk.maps?.uri && chunk.maps?.title) {
                sources.push(`- [📍 ${chunk.maps.title}](${chunk.maps.uri})`);
            }
        });

        if (sources.length > 0) {
            // Deduplicate sources
            const uniqueSources = [...new Set(sources)];
            text += `\n\n**Sources & Locations:**\n${uniqueSources.join('\n')}`;
        }
    }

    return text;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Something went wrong while connecting to ThinkMate. Please check your connection or try a shorter message.";
  }
};

export const transcribeAudio = async (audioBase64: string): Promise<string> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: "audio/wav",
                            data: audioBase64
                        }
                    },
                    {
                        text: "Transcribe exactly what is said in this audio."
                    }
                ]
            }
        });
        return response.text || "";
    } catch (e) {
        console.error("Transcription error", e);
        return "";
    }
}

export const generateSpeech = async (text: string): Promise<string | null> => {
  try {
     const cleanText = text.replace(/\*/g, '');
     const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: { parts: [{ text: cleanText }] },
      config: {
        responseModalities: ["AUDIO"], 
        speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
        }
      }
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (e) {
      console.error("TTS Error", e);
      return null;
  }
}

// --- NEW TOOLS FUNCTIONS ---

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string; // The correct option text
  explanation: string;
}

export const generateQuizJSON = async (topic: string, difficulty: string = 'Medium', count: number = 5): Promise<QuizQuestion[]> => {
  try {
    const prompt = `Generate a ${difficulty} level quiz about "${topic}". 
    Return a strict JSON array of ${count} objects. 
    Each object must have these keys: "question" (string), "options" (array of 4 strings), "answer" (string, must match one of the options exactly), "explanation" (string). 
    The "explanation" should explain why the answer is correct in 1-2 sentences.
    Do not use markdown formatting. Just the JSON string.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "[]";
    const cleanJson = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("Quiz Gen Error", e);
    return [];
  }
};

export const generateStudyPlan = async (topic: string, days: number, intensity: string): Promise<string> => {
    try {
        const prompt = `Create a structured ${days}-day study plan for learning "${topic}" with a ${intensity} intensity level.
        
        Format the output as a Markdown Table with columns: Day, Focus Topic, Action Items, and Practice Task.
        Make it visually organized and easy to read.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [{ text: prompt }] }
        });
        return response.text || "Could not generate plan.";
    } catch (e) {
        return "Error generating plan.";
    }
};

export const generateSummary = async (text: string, type: 'bullet' | 'paragraph' | 'eli5'): Promise<string> => {
    try {
        let prompt = "";
        if (type === 'bullet') prompt = "Summarize the following text into concise, easy-to-read bullet points:";
        if (type === 'paragraph') prompt = "Summarize the following text into a cohesive, well-written paragraph:";
        if (type === 'eli5') prompt = "Explain the following text as if I am 5 years old (ELI5):";

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [{ text: `${prompt}\n\n${text}` }] }
        });
        return response.text || "Could not generate summary.";
    } catch (e) {
        return "Error generating summary.";
    }
}

export const editImageWithGemini = async (base64Image: string, prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/jpeg', 
            },
          },
          {
            text: `${prompt}. Maintain the original aspect ratio and high quality.`
          },
        ],
      },
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData && part.inlineData.data) {
            return part.inlineData.data;
        }
    }
    return null;
  } catch (e) {
    console.error("Image Edit Error", e);
    return null;
  }
};

export const analyzeVideo = async (videoData: string, mimeType: string, prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: videoData,
                            mimeType: mimeType
                        }
                    },
                    {
                        text: prompt || "Analyze this video and describe what is happening in detail."
                    }
                ]
            }
        });
        return response.text || "Unable to analyze video.";
    } catch (e) {
        console.error("Video Analysis Error", e);
        return "Error analyzing video. Please make sure the video is less than 20MB and try again.";
    }
}

// --- CREATIVE GENERATION ---

export const generateImageFromPrompt = async (prompt: string, size: '1K' | '2K' | '4K'): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData && part.inlineData.data) {
            return part.inlineData.data;
        }
    }
    return null;
  } catch (e) {
    console.error("Image Gen Error", e);
    return null;
  }
};

export const generateVideoFromPrompt = async (prompt: string, aspectRatio: '16:9' | '9:16'): Promise<string | { error: string } | null> => {
   try {
    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: aspectRatio
        }
    });

    // Poll for completion
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (uri) {
        return `${uri}&key=${process.env.API_KEY}`;
    }
    return null;

   } catch (e: any) {
       console.error("Video Gen Error", e);
       // Handle Quota Exceeded specific error (Code 429)
       if (e.message?.includes('429') || e.status === 'RESOURCE_EXHAUSTED' || e.code === 429) {
           return { error: "Video generation limit reached (Quota Exceeded). Please try again later or use the text features." };
       }
       return null;
   }
}