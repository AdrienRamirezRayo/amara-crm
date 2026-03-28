import OpenAI from "openai";

function mapLanguageCodeToName(code) {
  const map = {
    "en-US": "English",
    "es-ES": "Spanish",
    "fr-FR": "French",
    "de-DE": "German",
    "it-IT": "Italian",
    "pt-BR": "Portuguese",
    "ru-RU": "Russian",
    "zh-CN": "Chinese (Simplified)",
    "ja-JP": "Japanese",
    "ko-KR": "Korean",
    "ar-SA": "Arabic",
    "hi-IN": "Hindi",
  };

  return map[code] || code;
}

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function translateText(req, res) {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;

    if (!text || !String(text).trim()) {
      return res.status(400).json({
        error: "Text is required.",
      });
    }

    if (!targetLanguage || targetLanguage === "original") {
      return res.json({
        translatedText: text,
      });
    }

    const client = getOpenAIClient();

    if (!client) {
      return res.json({
        translatedText:
          "Translation service is not configured yet. Add OPENAI_API_KEY in the root .env file.",
      });
    }

    const sourceName = mapLanguageCodeToName(sourceLanguage);
    const targetName = mapLanguageCodeToName(targetLanguage);

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You are a translation engine. Translate accurately and return only the translated text.",
        },
        {
          role: "user",
          content: `Translate this from ${sourceName} to ${targetName}:\n\n${text}`,
        },
      ],
    });

    const translatedText =
      response.output_text?.trim() || "Translation failed.";

    return res.json({ translatedText });
  } catch (error) {
    console.error("translateText error:", error);

    return res.status(500).json({
      error: "Translation failed.",
    });
  }
}