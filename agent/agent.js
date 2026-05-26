require('dotenv').config({ path: '../backend/.env' });
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const Anthropic = require('@anthropic-ai/sdk');
const mcpTools = require('./mcpTools');
const { executeTool } = require('./mcpExecutor');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Convert our MCP tools to Anthropic's tool format
const anthropicTools = mcpTools.map(tool => ({
  name: tool.name,
  description: tool.description,
  input_schema: tool.parameters
}));

async function runAgent(userId, task) {
  console.log(`\n🤖 Agent starting task: "${task}"`);
  console.log('─'.repeat(50));

  const systemPrompt = `You are OpportuNet, an AI agent that helps developers and students find the best opportunities for them.

You have access to a MongoDB database of opportunities (hackathons, grants, freelance gigs, web3 projects).

Your job is to:
1. Get the user's profile to understand their skills and interests
2. Find relevant opportunities from the database
3. Score each opportunity from 0-100 based on fit with the user's profile
4. Save each score with a clear plain-English reason
5. Return a ranked list of the top opportunities

Scoring criteria:
- Skill match (40 points): How well do the required skills match the user's skills?
- Interest alignment (30 points): Does this match the user's stated interests?
- Deadline urgency (15 points): Is there enough time to apply? (>14 days = full points)
- Difficulty fit (15 points): Does the difficulty match the user's experience level?

Always be specific in your reasons. Bad: "Good match". Good: "Strong match — requires React and Node.js which are core skills, aligns with AI interest, deadline is 16 days away."

User ID: ${userId}`;

  const messages = [{ role: 'user', content: task }];

  let iterationCount = 0;
  const maxIterations = 15;

  while (iterationCount < maxIterations) {
    iterationCount++;

    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 4096,
      system: systemPrompt,
      tools: anthropicTools,
      messages
    });

    // Add assistant response to history
    messages.push({ role: 'assistant', content: response.content });

    // Check if we're done
    if (response.stop_reason === 'end_turn') {
      const finalText = response.content
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('\n');

      console.log('\n✅ Agent complete');
      console.log('─'.repeat(50));
      return { success: true, response: finalText, iterations: iterationCount };
    }

    // Process tool calls
    if (response.stop_reason === 'tool_use') {
      const toolUseBlocks = response.content.filter(b => b.type === 'tool_use');
      const toolResults = [];

      for (const toolUse of toolUseBlocks) {
        console.log(`\n🔧 Tool call: ${toolUse.name}`);
        console.log('   Args:', JSON.stringify(toolUse.input, null, 2));

        const result = await executeTool(toolUse.name, toolUse.input);
        console.log(`   Result: ${result.success ? '✅' : '❌'} ${result.message || (result.count !== undefined ? result.count + ' items' : '')}`);

        toolResults.push({
          type: 'tool_result',
          tool_use_id: toolUse.id,
          content: JSON.stringify(result)
        });
      }

      // Send tool results back
      messages.push({ role: 'user', content: toolResults });
    }
  }

  return { success: false, error: 'Max iterations reached', iterations: iterationCount };
}

module.exports = { runAgent };