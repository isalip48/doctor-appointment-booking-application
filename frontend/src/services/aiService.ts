declare var process: {
  env: {
    EXPO_PUBLIC_GEMINI_API_KEY: string;
  };
};

// Define the message structure for Gemini
export interface ChatMessage {
  role: "user" | "model";
  parts: (
    | { text: string }
    | { inline_data: { mime_type: string; data: string } }
  )[];
}

const BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export const getSpecialistRecommendation = async (history: ChatMessage[]) => {
  try {
    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: history,
        system_instruction: {
          parts: [
            {
              text: `You are a medical triage assistant. 
            Your goal is to suggest the most appropriate medical specialty based on the user's symptoms.
            
            RULES:
            1. If the user's symptoms are vague, ask ONE clear follow-up question about location, duration, or severity.
            2. Do not ask more than 2 questions total. 
            3. Once you have enough info, provide a 2-line explanation and the specialty in [Brackets].
            4. Never give a medical diagnosis, only a specialty recommendation.
            5. Always be empathetic and professional.`,
            },
          ],
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `API Error: ${errorData.error?.message || response.status}`,
      );
    }

    const data = await response.json();
    const aiText = data.candidates[0].content.parts[0].text;

    // Extract specialty if it exists in [Brackets]
    const match = aiText.match(/\[(.*?)\]/);
    const specialty = match ? match[1] : null;

    return {
      message: aiText.replace(/[\[\]]/g, ""), // Clean text for UI
      specialty: specialty,
      rawText: aiText, // Need this to keep history accurate
    };
  } catch (error) {
    console.error("Service Error:", error);
    throw error;
  }
};

export const analyzeMedicalReport = async (
  base64Data: string,
  mimeType: string,
) => {
  try {
    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Analyze this medical report carefully. Provide:
                        1. A brief summary of the findings (2-3 sentences)
                        2. Any abnormal or concerning values
                        3. Recommended medical specialty to consult

                        Put the specialty name in [Brackets] like [Cardiology].

                        IMPORTANT: 
                        - Be professional and empathetic
                        - Do NOT provide a diagnosis
                        - Only suggest which specialist to see
                        - If the report is unclear, mention that
                        - Give the answers point-wise for clarity`,
              },
              { inline_data: { mime_type: mimeType, data: base64Data } },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error("Failed to analyze medical report");
    }

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No analysis results returned");
    }

    const aiText = data.candidates[0].content.parts[0].text;
    const match = aiText.match(/\[(.*?)\]/);

    return {
      message: aiText.replace(/[\[\]]/g, ""),
      specialty: match ? match[1] : null,
    };
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};
