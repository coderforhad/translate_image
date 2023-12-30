import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Validate environment variables
    const key = process.env.API_KEY;
    const url = process.env.URL;

    if (!url || !key) {
      res.status(500).json({ error: "API configuration missing" });
      return;
    }

    // Validate request payload
    const { text, target_lang } = req.body;

    if (!text || !target_lang) {
      res.status(400).json({ error: "Invalid request payload" });
      return;
    }

    try {
      // Make the Axios request with a timeout
      const response = await axios.post(`${url}`, [{ text }], {
        timeout: 5000, // Set the timeout to 5 seconds (adjust as needed)
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": `${key}`,
          "Ocp-Apim-Subscription-Region": "eastasia",
        },
        params: {
          "api-version": "3.0",
          to: target_lang,
        },
      });

      // Extract the translated text from the response
      const translatedText = response.data[0].translations[0].text;

      // Send the translated text back to the client
      res.status(200).json({ translatedText });
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ error: "Translation failed" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
