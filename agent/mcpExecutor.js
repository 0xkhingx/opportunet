const { MongoClient, ObjectId } = require('mongodb');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

let client = null;
let db = null;

// Connect once and reuse
async function getDB() {
  if (db) return db;
  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db('opportunet');
  console.log('✅ MCP MongoDB connected');
  return db;
}

// Execute any MCP tool call
async function executeTool(toolName, args) {
  const db = await getDB();

  switch (toolName) {

    case 'find_opportunities': {
      const filter = {
        is_active: true,
        deadline: { $gte: new Date() }
      };
      if (args.category) filter.category = args.category;
      if (args.tags?.length) filter.tags = { $in: args.tags };

      const results = await db.collection('opportunities')
        .find(filter)
        .sort({ deadline: 1 })
        .limit(args.limit || 20)
        .toArray();

      return {
        success: true,
        count: results.length,
        opportunities: results.map(o => ({
          id: o._id.toString(),
          title: o.title,
          category: o.category,
          tags: o.tags,
          prize_or_value: o.prize_or_value,
          deadline: o.deadline,
          url: o.url,
          difficulty: o.difficulty,
          description: o.description.slice(0, 200) + '...'
        }))
      };
    }

    case 'get_user_profile': {
      const user = await db.collection('users')
        .findOne({ _id: new ObjectId(args.user_id) });

      if (!user) return { success: false, error: 'User not found' };

      return {
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          profile: user.profile,
          preferences: user.preferences
        }
      };
    }

    case 'save_opportunity_score': {
      // Upsert — create or update the application record
      const result = await db.collection('applications').updateOne(
        {
          user_id: new ObjectId(args.user_id),
          opportunity_id: new ObjectId(args.opportunity_id)
        },
        {
          $set: {
            agent_score: args.score,
            agent_reason: args.reason,
            agent_scored_at: new Date(),
            status: 'saved'
          },
          $setOnInsert: {
            user_id: new ObjectId(args.user_id),
            opportunity_id: new ObjectId(args.opportunity_id),
            createdAt: new Date()
          }
        },
        { upsert: true }
      );

      return {
        success: true,
        message: `Score ${args.score} saved for opportunity ${args.opportunity_id}`
      };
    }

    case 'get_top_opportunities': {
      const minScore = args.min_score || 60;
      const limit = args.limit || 10;

      const applications = await db.collection('applications')
        .find({
          user_id: new ObjectId(args.user_id),
          agent_score: { $gte: minScore },
          status: { $ne: 'ignored' }
        })
        .sort({ agent_score: -1 })
        .limit(limit)
        .toArray();

      // Populate opportunity details
      const oppIds = applications.map(a => a.opportunity_id);
      const opportunities = await db.collection('opportunities')
        .find({ _id: { $in: oppIds }, deadline: { $gte: new Date() } })
        .toArray();

      const oppMap = {};
      opportunities.forEach(o => { oppMap[o._id.toString()] = o; });

      const results = applications
        .filter(a => oppMap[a.opportunity_id.toString()])
        .map(a => ({
          application_id: a._id.toString(),
          score: a.agent_score,
          reason: a.agent_reason,
          status: a.status,
          opportunity: oppMap[a.opportunity_id.toString()]
        }));

      return { success: true, count: results.length, data: results };
    }

    case 'update_application_status': {
      const update = { status: args.status, updatedAt: new Date() };
      if (args.status === 'applied') update.applied_at = new Date();

      await db.collection('applications').updateOne(
        {
          user_id: new ObjectId(args.user_id),
          opportunity_id: new ObjectId(args.opportunity_id)
        },
        { $set: update },
        { upsert: true }
      );

      return {
        success: true,
        message: `Status updated to ${args.status}`
      };
    }

    default:
      return { success: false, error: `Unknown tool: ${toolName}` };
  }
}

module.exports = { executeTool, getDB };
