import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "HTTP-Referer": "http://localhost:8080",
            "X-Title": "ByteChat"
        },
        body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: message
                }
            ]
        })
    };

    try {
        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            options
        );

        const data = await response.json();

        console.log("OpenRouter Response:", data);

        if (!response.ok) {
            throw new Error(data.error?.message || "Request Failed");
        }

        return data.choices[0].message.content;
    } catch (err) {
        console.error("OpenRouter Error:", err.message);
        return "Sorry, I couldn't generate a response.";
    }
};

export default getOpenAIAPIResponse;