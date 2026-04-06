import ENV from "./config.js";

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${ENV.GEMINI_API_KEY}`;

fetch(url)
    .then(res => res.json())
    .then(data => {
        if (data.models) {
            console.log("Available generation models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(m.name);
                }
            });
        } else {
            console.log(data);
        }
    })
    .catch(err => console.error(err));
