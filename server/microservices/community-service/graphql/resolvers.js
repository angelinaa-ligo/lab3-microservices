import jwt from "jsonwebtoken";
import CommunityPost from "../models/CommunityPost.js";
import HelpRequest from "../models/HelpRequest.js";
import { config } from "../config/config.js";


const getUserFromRequest = (req) => {
  const token =
    req.cookies?.token ||
    req.headers.authorization?.split(" ")[1];

  if (!token) return null;

  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch {
    return null;
  }
};

const resolvers = {
  
  Query: {
    posts: async (_, { category }) => {
      if (category) {
        return CommunityPost.find({ category });
      }
      return CommunityPost.find();
    },

    helpRequests: async () => {
      return HelpRequest.find();
    },
    
    
  },
 
  Mutation: {
    createPost: async (_, { title, content, category }, { req }) => {
      const user = getUserFromRequest(req);
      if (!user) {
        throw new Error("Not authenticated");
      }

      return CommunityPost.create({
  author: user.id,
  authorName: user.username,
  authorRole: user.role,
  title,
  content,
  category,
});
    },

    createHelpRequest: async (
      _,
      { description, location },
      { req }
    ) => {
      const user = getUserFromRequest(req);
      if (!user) {
        throw new Error("Not authenticated");
      }

      return HelpRequest.create({
        author: user.id,
        description,
        location,
      });
    },

    resolveHelpRequest: async (_, { id }, { req }) => {
  const user = getUserFromRequest(req);

  if (!user) {
    throw new Error("Not authenticated");
  }

  
  if (
    user.role !== "business_owner" &&
    user.role !== "community_organizer"
  ) {
    throw new Error("Not authorized");
  }

  return HelpRequest.findByIdAndUpdate(
    id,
    {
      isResolved: true,
      updatedAt: new Date(),
    },
    { new: true }
  );
},
  },
};

export default resolvers;