declare var process: {
  env: {
    EXPO_PUBLIC_GEMINI_API_KEY: string;
  };
};

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

// Using the 2.5 Flash model from your eligible list
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export const getSpecialistRecommendation = async (userSymptoms: string) => {
  try {
    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a medical triage assistant. User symptoms: "${userSymptoms}". Suggest the best medical specialty from: Cardiologist, Dermatologist, Orthopedic, Pediatrician, Neurologist, General Physician. Give a short explanation and end with the specialty in [Brackets].`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      throw new Error(`API Error ${response.status}: ${errorData.error?.message}`);
    }

    const data = await response.json();

    if (!data?.candidates || !data.candidates[0]?.content?.parts) {
      throw new Error("No response from AI. Possibly rate limit exceeded.");
    }

    const aiText = data.candidates[0].content.parts[0].text;
    const match = aiText.match(/\[(.*?)\]/);
    const specialty = match ? match[1] : null;

    return {
      message: aiText.replace(/[\[\]]/g, ""),
      specialty,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};