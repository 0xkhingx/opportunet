require('dotenv').config({ path: '../backend/.env' });
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const opportunities = [
  {
    title: "Google Cloud Rapid Agent Hackathon",
    description: "Build AI agents for real-world challenges using Gemini and Google Cloud Agent Builder. Partner tracks include MongoDB, GitLab, Elastic, Fivetran, Arize, and Dynatrace.",
    category: "hackathon",
    tags: ["AI", "Google Cloud", "MongoDB", "agent", "Gemini"],
    prize_or_value: "$60,000 total prizes",
    deadline: new Date("2026-06-11"),
    url: "https://devpost.com/hackathons",
    source: "devpost",
    difficulty: "intermediate"
  },
  {
    title: "Gitcoin Grants Round 20 — Open Source",
    description: "Funding round for open source projects building on Ethereum. Community-voted quadratic funding.",
    category: "web3",
    tags: ["Ethereum", "open source", "Solidity", "Web3"],
    prize_or_value: "Variable (quadratic funding)",
    deadline: new Date("2026-06-20"),
    url: "https://gitcoin.co/grants",
    source: "gitcoin",
    difficulty: "intermediate"
  },
  {
    title: "MLH Fellowship — Spring Batch",
    description: "A 12-week internship alternative for software engineers. Work on open source projects with mentorship from industry engineers.",
    category: "scholarship",
    tags: ["open source", "Python", "JavaScript", "mentorship"],
    prize_or_value: "$5,000 stipend",
    deadline: new Date("2026-06-15"),
    url: "https://fellowship.mlh.io",
    source: "mlh",
    difficulty: "intermediate"
  },
  {
    title: "Freelance: React Dashboard for Fintech Startup",
    description: "Looking for a React developer to build an analytics dashboard. Must have experience with charts (Recharts or D3), REST APIs, and clean UI.",
    category: "freelance",
    tags: ["React", "JavaScript", "dashboard", "fintech"],
    prize_or_value: "$800–$1,200",
    deadline: new Date("2026-06-05"),
    url: "https://upwork.com",
    source: "upwork",
    difficulty: "intermediate"
  },
  {
    title: "ETHGlobal Brussels Hackathon",
    description: "48-hour Ethereum hackathon with $500k+ in prizes. Build anything on Ethereum — DeFi, NFTs, infrastructure, tooling.",
    category: "hackathon",
    tags: ["Ethereum", "Solidity", "DeFi", "Web3", "NFT"],
    prize_or_value: "$500,000+ in prizes",
    deadline: new Date("2026-07-01"),
    url: "https://ethglobal.com",
    source: "ethglobal",
    difficulty: "advanced"
  },
  {
    title: "Africa Tech Founders Grant",
    description: "Non-dilutive grant for African founders building tech solutions to local problems. Applications open to individuals and teams.",
    category: "grant",
    tags: ["Africa", "startup", "grant", "founders"],
    prize_or_value: "$10,000",
    deadline: new Date("2026-06-30"),
    url: "https://africatechgrant.org",
    source: "manual",
    location: "Africa",
    difficulty: "any"
  },
  {
    title: "Freelance: Full-Stack Node.js API Developer",
    description: "Need an experienced Node.js developer to build a REST API for a logistics platform. MongoDB experience required.",
    category: "freelance",
    tags: ["Node.js", "MongoDB", "REST API", "backend"],
    prize_or_value: "$1,500–$2,500",
    deadline: new Date("2026-06-08"),
    url: "https://upwork.com",
    source: "upwork",
    difficulty: "advanced"
  },
  {
    title: "Buildspace N&W Season 6",
    description: "6-week program to build your idea with support from a global community. Work on your project nights and weekends.",
    category: "hackathon",
    tags: ["startup", "Web3", "AI", "community", "build"],
    prize_or_value: "Community + exposure",
    deadline: new Date("2026-06-18"),
    url: "https://buildspace.so",
    source: "buildspace",
    difficulty: "any"
  },
  {
    title: "NEAR Horizon — AI x Web3 Grant",
    description: "Grants for teams building at the intersection of AI and Web3 on the NEAR Protocol. Up to $50k for strong applications.",
    category: "web3",
    tags: ["NEAR", "AI", "Web3", "grant", "blockchain"],
    prize_or_value: "Up to $50,000",
    deadline: new Date("2026-07-15"),
    url: "https://near.org/horizon",
    source: "near",
    difficulty: "advanced"
  },
  {
    title: "Freelance: UI/UX Designer for Mobile App",
    description: "Looking for a designer to create Figma mockups for a health tracking app. Need strong mobile design skills and a clean portfolio.",
    category: "freelance",
    tags: ["Figma", "UI/UX", "design", "mobile"],
    prize_or_value: "$600–$900",
    deadline: new Date("2026-06-07"),
    url: "https://toptal.com",
    source: "toptal",
    difficulty: "intermediate"
  },
  {
    title: "GitHub Education — Student Developer Pack Grant",
    description: "GitHub offers grants and resources to student developers. Apply for tools, cloud credits, and more.",
    category: "grant",
    tags: ["GitHub", "student", "developer tools", "cloud"],
    prize_or_value: "$200 in credits + tools",
    deadline: new Date("2026-12-31"),
    url: "https://education.github.com",
    source: "github",
    difficulty: "beginner"
  },
  {
    title: "Solana Grizzlython Hackathon",
    description: "Global hackathon on Solana with prizes across DeFi, gaming, payments, and infrastructure tracks.",
    category: "hackathon",
    tags: ["Solana", "Web3", "Rust", "DeFi", "gaming"],
    prize_or_value: "$400,000 in prizes",
    deadline: new Date("2026-06-25"),
    url: "https://solana.com/grizzlython",
    source: "solana",
    difficulty: "advanced"
  },
  {
    title: "Freelance: Python Data Pipeline Engineer",
    description: "Short-term contract to build ETL pipelines for a data analytics startup. Pandas, SQLAlchemy, and Airflow experience preferred.",
    category: "freelance",
    tags: ["Python", "data engineering", "ETL", "Airflow", "SQL"],
    prize_or_value: "$2,000–$3,500",
    deadline: new Date("2026-06-12"),
    url: "https://upwork.com",
    source: "upwork",
    difficulty: "advanced"
  },
  {
    title: "Mozilla Tech Fund — AI Safety Track",
    description: "Grants for researchers and developers working on responsible AI development. Focus on transparency, accountability, and fairness.",
    category: "grant",
    tags: ["AI", "safety", "research", "Mozilla", "ethics"],
    prize_or_value: "$50,000–$100,000",
    deadline: new Date("2026-07-20"),
    url: "https://foundation.mozilla.org/techfund",
    source: "mozilla",
    difficulty: "advanced"
  },
  {
    title: "HNG Internship Season 12",
    description: "Remote internship program for developers, designers, and marketers. 3-month program with mentorship and real project experience.",
    category: "job",
    tags: ["internship", "remote", "Africa", "frontend", "backend"],
    prize_or_value: "Certificate + $500 top performers",
    deadline: new Date("2026-06-14"),
    url: "https://hng.tech",
    source: "hng",
    location: "Remote (Africa-focused)",
    difficulty: "beginner"
  },
  {
    title: "Chainlink Spring 2026 Hackathon",
    description: "Build smart contracts and hybrid blockchain applications using Chainlink oracles. Open to all skill levels.",
    category: "hackathon",
    tags: ["Chainlink", "Solidity", "oracles", "DeFi", "smart contracts"],
    prize_or_value: "$650,000 in prizes",
    deadline: new Date("2026-06-22"),
    url: "https://chain.link/hackathon",
    source: "chainlink",
    difficulty: "intermediate"
  },
  {
    title: "Freelance: Smart Contract Auditor",
    description: "Audit a Solidity smart contract for a DeFi protocol. Must have prior audit experience or a strong security background.",
    category: "freelance",
    tags: ["Solidity", "security", "audit", "DeFi", "Web3"],
    prize_or_value: "$3,000–$5,000",
    deadline: new Date("2026-06-09"),
    url: "https://code4rena.com",
    source: "code4rena",
    difficulty: "advanced"
  },
  {
    title: "Figma x Adobe — Student Design Challenge",
    description: "Design challenge for students to reimagine an everyday product experience. Open to individuals and teams up to 3.",
    category: "hackathon",
    tags: ["design", "Figma", "UI/UX", "student", "Adobe"],
    prize_or_value: "$5,000 + Adobe subscription",
    deadline: new Date("2026-06-28"),
    url: "https://figma.com/design-challenge",
    source: "figma",
    difficulty: "beginner"
  },
  {
    title: "World Bank Youth Innovation Fund",
    description: "Funding for youth-led projects addressing global development challenges — education, health, climate, and financial inclusion.",
    category: "grant",
    tags: ["grant", "social impact", "youth", "global", "innovation"],
    prize_or_value: "$25,000",
    deadline: new Date("2026-07-10"),
    url: "https://worldbank.org/youthfund",
    source: "worldbank",
    difficulty: "any"
  },
  {
    title: "Freelance: React Native Developer — E-Commerce App",
    description: "Build a cross-platform e-commerce mobile app. Must know React Native, Expo, and have shipped at least one app to stores.",
    category: "freelance",
    tags: ["React Native", "mobile", "Expo", "JavaScript", "e-commerce"],
    prize_or_value: "$2,000–$4,000",
    deadline: new Date("2026-06-10"),
    url: "https://upwork.com",
    source: "upwork",
    difficulty: "advanced"
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing opportunities
    await mongoose.connection.collection('opportunities').deleteMany({});
    console.log('🗑️  Cleared existing opportunities');

    // Insert seed data
    await mongoose.connection.collection('opportunities').insertMany(opportunities);
    console.log(`🌱 Seeded ${opportunities.length} opportunities`);

    // Create a test user (you)
    await mongoose.connection.collection('users').deleteMany({ email: 'khingx@test.com' });
    await mongoose.connection.collection('users').insertOne({
      name: 'Khingx',
      email: 'khingx@test.com',
      profile: {
        skills: ['React', 'Node.js', 'Python', 'Solidity', 'Figma', 'MongoDB'],
        interests: ['AI', 'Web3', 'Design', 'Music', 'Open Source'],
        categories: ['hackathon', 'grant', 'freelance', 'web3'],
        location: 'Nigeria',
        experience_level: 'advanced',
        bio: 'Full-stack developer and designer passionate about AI and Web3. Student builder who competes in hackathons and takes on freelance projects.'
      },
      preferences: {
        min_score: 60,
        deadline_buffer_days: 3,
        ignored_sources: []
      },
      last_seen: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('👤 Created test user: Khingx');

    console.log('\n✅ Seed complete! Check your Atlas Data Explorer.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
