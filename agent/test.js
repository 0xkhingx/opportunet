require('dotenv').config({ path: '../backend/.env' });
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const { runAgent } = require('./agent');
const { getDB } = require('./mcpExecutor');

async function test() {
  try {
    // Get the test user we seeded
    const db = await getDB();
    const user = await db.collection('users').findOne({ email: 'khingx@test.com' });

    if (!user) {
      console.error('❌ Test user not found. Run the seed script first.');
      process.exit(1);
    }

    console.log(`\n👤 Running agent for: ${user.name}`);
    console.log(`   Skills: ${user.profile.skills.join(', ')}`);
    console.log(`   Interests: ${user.profile.interests.join(', ')}`);
    console.log(`   Categories: ${user.profile.categories.join(', ')}`);

    const result = await runAgent(
      user._id.toString(),
      `Find and score all available opportunities for this user. 
       Get their profile first, then find opportunities across all their preferred categories (hackathon, grant, freelance, web3).
       Score each one and save the scores. 
       Finally, tell me the top 5 opportunities with scores and reasons.`
    );

    if (result.success) {
      console.log('\n🎯 Agent Response:');
      console.log('─'.repeat(50));
      console.log(result.response);
      console.log(`\n📊 Completed in ${result.iterations} iterations`);
    } else {
      console.error('❌ Agent failed:', result.error);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

test();
