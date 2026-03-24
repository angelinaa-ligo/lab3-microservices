import mongoose from "mongoose";

const AIInteractionSchema = new mongoose.Schema({
  userInput: { type: String, required: true },
  aiResponse: { type: String, required: true },
  retrievedPostIds: [
    { type: mongoose.Schema.Types.ObjectId, ref: "CommunityPost" }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("AIInteraction", AIInteractionSchema);