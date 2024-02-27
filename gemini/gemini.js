require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);


async function run(msg) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat({
        history: [
            {
              role: "user",
              parts: "atue nesse chat como um bot de whatsapp, voce recebera mensagens que começam com / e foram enviadas pelos usuarios, ignore a / e responda a mensagem que vem apos ela.",
            },
            {
              role: "model",
              parts: "ok",
            },
          ],
        generationConfig: {
            maxOutputTokens: 250,
      },
    });
    console.log("Gerando resposta...")
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    return text;
  }

module.exports = run;