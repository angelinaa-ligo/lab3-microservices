import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import CommunityPost from "../models/CommunityPost.js";
import AIInteraction from "../models/AIInteraction.js";

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash"
});



export async function communityAIAgent(userInput) {
  
  try {
    if (!userInput || userInput.trim().length < 3) {
  return {
  text: JSON.stringify({
    answer: "Can you clarify your question?",
    suggestedQuestions: []
  }),
  suggestedQuestions: [],
  retrievedPosts: []
};
}
    
    const keywords = userInput
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2);

    
    const posts = await CommunityPost.find({
      $or: keywords.flatMap(word => [
        { title: { $regex: word, $options: "i" } },
        { content: { $regex: word, $options: "i" } }
      ])
    })
    .limit(5);

    
    const context = posts
      .map(p => `Title: ${p.title}\nContent: ${p.content}`)
      .join("\n\n");
const pastInteractions = await AIInteraction.find()
  .sort({ createdAt: -1 })
  .limit(2);

const previousText = pastInteractions.length > 0
  ? pastInteractions.map(i => i.aiResponse).join("\n")
  : "";
    const promptTemplate = new PromptTemplate({
  template: `
You are a helpful assistant that answers user questions using ONLY the posts provided below.
Do not make up new posts or events. Quote or summarize them directly.
If no posts match, clearly say "No related posts found."
Previous interactions:
{previousText}
Community posts:
{context}

User question: {question}

Instructions:
1. Answer clearly and concisely using the forum posts.
2. Suggest 3 follow-up questions that are relevant to the user's original question, based on the context of the posts.
3. Format your output as JSON:
{{
  "answer": "...",
  "suggestedQuestions": ["...","...","..."]
}}
`,
  inputVariables: ["context", "question", "previousText"]
});const formattedPrompt = await promptTemplate.format({
  context,
  question: userInput,
  previousText
});

const response = await model.invoke(formattedPrompt);

    

    let parsed;
    try {
      parsed = JSON.parse(response.content);
    } catch {
      
      parsed = {
        answer: response.content,
        suggestedQuestions: []
      };
    }

  
    await AIInteraction.create({
      userInput,
      aiResponse: parsed.answer,
      retrievedPostIds: posts.map(p => p._id)
    });

    
    return {
  text: parsed.answer,
  suggestedQuestions: parsed.suggestedQuestions || [], 
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
    console.error("FULL ERROR:", error);
    console.error("RESPONSE:", error?.response);
    console.error("ETAILS:", error?.message);
    throw error; 
  }
}