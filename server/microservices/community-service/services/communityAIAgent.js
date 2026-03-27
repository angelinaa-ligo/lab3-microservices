import { GoogleGenAI } from "@google/genai";
import CommunityPost from "../models/CommunityPost.js";
import AIInteraction from "../models/AIInteraction.js";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  apiVersion: "v1"
});

// Testa os modelos disponíveis
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
    // 🔑 Divide o input em palavras-chave e remove palavras pequenas
    const keywords = userInput
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2);

    // 🔎 Busca posts relacionados por título ou conteúdo usando regex
    const posts = await CommunityPost.find({
      $or: keywords.flatMap(word => [
        { title: { $regex: word, $options: "i" } },
        { content: { $regex: word, $options: "i" } }
      ])
    })
    .limit(5);

    // Cria contexto com título + conteúdo para a AI
    const context = posts
      .map(p => `Title: ${p.title}\nContent: ${p.content}`)
      .join("\n\n");

    const prompt = `
You are a helpful assistant that answers user questions using ONLY the posts provided below.
Do not make up new posts or events. Quote or summarize them directly.
If no posts match, clearly say "No related posts found."

Community posts:
${context}

User question: ${userInput}

Instructions:
1. Answer clearly and concisely using the forum posts.
2. Suggest 3 follow-up questions that are relevant to the user's original question, based on the context of the posts.
3. Format your output as JSON:
{
  "answer": "...",
  "suggestedQuestions": ["...","...","..."]
}
`;

    const result = await genAI.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: prompt,
    });

    // Tenta parsear JSON da resposta da AI
    let parsed;
    try {
      parsed = JSON.parse(result.text);
    } catch {
      // fallback genérico se AI não retornar JSON válido
      parsed = {
        answer: result.text,
        suggestedQuestions: []
      };
    }

    // Salva a interação no banco
    await AIInteraction.create({
      userInput,
      aiResponse: parsed.answer,
      retrievedPostIds: posts.map(p => p._id)
    });

    // Retorna resposta + posts + sugestões de perguntas
    return {
  text: parsed.answer,
  suggestedQuestions: parsed.suggestedQuestions || [], // garante que seja sempre array
  retrievedPosts: posts.map(post => ({
    id: post._id.toString(),
    title: post.title,
    content: post.content,
    category: post.category,
    authorName: post.authorName,
    authorRole: post.authorRole
  }))
};

  } catch (error) {
    console.error("🔥 FULL ERROR:", error);
    console.error("🔥 RESPONSE:", error?.response);
    console.error("🔥 DETAILS:", error?.message);
    throw error; // Mantém pra GraphQL
  }
}