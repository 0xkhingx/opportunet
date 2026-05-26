// MCP Tools — these are the "superpowers" exposed to Gemini
// Each tool maps to a real MongoDB operation

const mcpTools = [
  {
    name: "find_opportunities",
    description: "Find opportunities from MongoDB with optional filters. Use this to retrieve hackathons, grants, freelance gigs, or web3 projects.",
    parameters: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: ["hackathon", "grant", "freelance", "web3", "scholarship", "job"],
          description: "Filter by opportunity category"
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Filter by skill tags e.g. ['React', 'AI']"
        },
        limit: {
          type: "number",
          description: "Max number of results to return (default 20)"
        }
      }
    }
  },
  {
    name: "get_user_profile",
    description: "Get a user's profile including their skills, interests, and preferences. Use this before scoring opportunities.",
    parameters: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
          description: "The MongoDB ObjectId of the user"
        }
      },
      required: ["user_id"]
    }
  },
  {
    name: "save_opportunity_score",
    description: "Save the agent's fit score and reasoning for an opportunity to MongoDB. Always call this after scoring.",
    parameters: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
          description: "The user's MongoDB ObjectId"
        },
        opportunity_id: {
          type: "string",
          description: "The opportunity's MongoDB ObjectId"
        },
        score: {
          type: "number",
          description: "Fit score from 0 to 100"
        },
        reason: {
          type: "string",
          description: "Plain-English explanation of why this score was given"
        }
      },
      required: ["user_id", "opportunity_id", "score", "reason"]
    }
  },
  {
    name: "get_top_opportunities",
    description: "Get the top scored opportunities for a user, sorted by fit score descending.",
    parameters: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
          description: "The user's MongoDB ObjectId"
        },
        limit: {
          type: "number",
          description: "How many top opportunities to return (default 10)"
        },
        min_score: {
          type: "number",
          description: "Minimum fit score to include (default 60)"
        }
      },
      required: ["user_id"]
    }
  },
  {
    name: "update_application_status",
    description: "Update the status of an opportunity a user has interacted with.",
    parameters: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
          description: "The user's MongoDB ObjectId"
        },
        opportunity_id: {
          type: "string",
          description: "The opportunity's MongoDB ObjectId"
        },
        status: {
          type: "string",
          enum: ["saved", "applied", "ignored", "won", "lost"],
          description: "New status for the application"
        }
      },
      required: ["user_id", "opportunity_id", "status"]
    }
  }
];

module.exports = mcpTools;
