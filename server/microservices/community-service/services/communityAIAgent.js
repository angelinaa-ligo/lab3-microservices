import { GoogleGenAI } from "@google/genai";
import CommunityPost from "../models/CommunityPost.js";
import AIInteraction from "../models/AIInteraction.js";

// 🔥 cliente configurado corretamente (API v1)
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  apiVersion: "v1"
});
// 🔥 TESTE AQUI (RODA UMA VEZ AO INICIAR)
(async () => {
  try {
    const models = await genAI.models.list();
    console.log("🔥 AVAILABLE MODELS:", models);
  } catch (err) {
    console.error("❌ LIST MODELS ERROR:", err);
  }
})();
export async function communityAIAgent(userInput) {
  try {
    // 🔎 busca posts relacionados
    const posts = await CommunityPost.find({
      $or: [
        { title: { $regex: userInput, $options: "i" } },
        { content: { $regex: userInput, $options: "i" } }
      ]
    }).limit(5);

    const context = posts.map(p => p.content).join("\n");

    const prompt = `
Community discussions:
${context}

User question: ${userInput}

If the question is unclear, ask a clarifying question.
Otherwise, answer clearly and concisely.
`;

    // 🤖 chamada correta pro Gemini (API nova)
    const result = await genAI.models.generateContent({
      model: "models/gemini-2.5-flash", // ✅ agora funciona com v1
      contents: prompt,
    });

    const text = result.text;

    // 💾 salva interação
    await AIInteraction.create({
      userInput,
      aiResponse: text,
      retrievedPostIds: posts.map(p => p._id)
    });

    return {
      text,
      suggestedQuestions: [
        "Can you explain more?",
        "Is this recent?",
        "Do you want similar posts?"
      ],
      retrievedPosts: posts
    };

  } catch (error) {
    
  console.error("🔥 FULL ERROR:", error);
  console.error("🔥 RESPONSE:", error?.response);
  console.error("🔥 DETAILS:", error?.message);

  throw error; // 👈 IMPORTANTE (pra ver no GraphQL também)
}
}