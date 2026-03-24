import { GoogleGenerativeAI } from "@google/generative-ai";
import CommunityPost from "../models/CommunityPost.js";
import AIInteraction from "../models/AIInteraction.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-pro",  //erro aqui
});

export async function communityAIAgent(userInput) {

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

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  await AIInteraction.create({
    userInput,
    aiResponse: text,
    retrievedPostIds: posts.map(p => p._id)
  });

  return {
    text,
    suggestedQuestions: [
      "Can you explain more?",
      "Are there any safety concerns?",
      "Is this a recent discussion?"
    ],
    retrievedPosts: posts
  };
}