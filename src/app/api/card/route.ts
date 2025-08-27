/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/card/route.ts
import "dotenv/config";

const GH_TOKEN = process.env.GH_TOKEN; // set in Vercel project settings
const headers = {
  Authorization: `Bearer ${GH_TOKEN}`,
  "User-Agent": "chandanSahoo-cs-card", // required by GitHub API
};

export async function GET() {
  // GitHub username
  const username = "chandanSahoo-cs";

  // fetch basic user info
  const userRes = await fetch(`https://api.github.com/users/${username}`, {
    headers,
  });
  const user = await userRes.json();
  //   console.log("User details: ", user);

  // fetch repos to count stars
  const repoRes = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100`,
    {
      headers,
    }
  );
  const repos = await repoRes.json();
  //   console.log("Repo details:", repos);
  const stars = repos.reduce(
    (sum: number, r: any) => sum + (r.stargazers_count || 0),
    0
  );

  // const forks = repos.reduce(
  //   (sum: number, r: any) => sum + (r.forks_count || 0),
  //   0
  // );

  const languages = repos
    .filter((r: any) => r.language)
    .reduce((acc: any, r: any) => {
      acc[r.language] = (acc[r.language] || 0) + 1;
      return acc;
    }, {});

  const topLanguages = Object.entries(languages)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 3)
    .map(([lang]) => lang);

  // calculate age
  const birthDate = new Date("2005-11-03");
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();
  if (days < 0) {
    months--;
    days += 30;
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  const age = `${years}y ${months}m ${days}d`;

  // last commit date (just for one repo, say your profile repo)
  const commitRes = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    {
      headers,
    }
  );
  const commits = await commitRes.json();
  console.log(commits);
  const lastCommitDate = commits[0]?.updated_at
    ? new Date(commits[0].updated_at).toLocaleString()
    : "N/A";

  const stack = [
    "Typescript",
    "Javascript",
    "C++",
    "Go",
    "Reactjs",
    "Nextjs",
    "Docker",
    "Git",
    "PostgresSQL",
    "MongoDB",
  ];

  // Rank and Rating
  const codeforces = await fetch(
    "https://competeapi.vercel.app/user/codeforces/realmchan/"
  );
  const codeforcesDetails = await codeforces.json();
  const codeforcesRating = await codeforcesDetails[0].rating;
  const codeforcesRank = await codeforcesDetails[0].rank.toUpperCase();

  const codechef = await fetch(
    "https://competeapi.vercel.app/user/codechef/realm/"
  );
  const codechefDetails = await codechef.json();
  const codechefRating = await codechefDetails.rating_number;
  const codechefRank =
    (await codechefDetails.rating.toUpperCase()[0]) + " STAR";

  const leetcode = await fetch(
    "https://competeapi.vercel.app/user/leetcode/realmchan/"
  );
  const leetcodeDetails = await leetcode.json();
  const leetcodeRating = Math.floor(
    leetcodeDetails.data.userContestRanking.rating
  );

  const svg = `
<svg width="1000" height="800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .terminal-bg { fill: #0d1117; }
      .terminal-border { fill: none; stroke: #30363d; stroke-width: 2; }
      .header-bg { fill: #21262d; }
      .dot-red { fill: #ff5f56; }
      .dot-yellow { fill: #ffbd2e; }
      .dot-green { fill: #27c93f; }
      .prompt { fill: #7c3aed; font-family: 'Fira Code', monospace; font-size: 14px; }
      .command { fill: #22d3ee; font-family: 'Fira Code', monospace; font-size: 14px; }
      .text { fill: #e6edf3; font-family: 'Fira Code', monospace; font-size: 14px; }
      .link {fill: #3a7be5; font-family: 'Fira Code', monospace; font-size: 14px; }
      .accent { fill: #f97316; font-family: 'Fira Code', monospace; font-size: 14px; }
      .success { fill: #22c55e; font-family: 'Fira Code', monospace; font-size: 14px; }
      .info { fill: #3b82f6; font-family: 'Fira Code', monospace; font-size: 14px; }
    </style>
  </defs>
  <!-- Header bar -->
  <rect width="100%" height="100%" class="terminal-bg"/>
  <rect width="100%" height="35" class="header-bg"/>
  <circle cx="20" cy="17.5" r="6" class="dot-red"/>
  <circle cx="40" cy="17.5" r="6" class="dot-yellow"/>
  <circle cx="60" cy="17.5" r="6" class="dot-green"/>
  <text x="400" y="25" class="text" text-anchor="middle">chandanSahoo-cs@github:~$</text>
  
    <!-- Entry -->
    <text x="20" y="60" class="prompt">$ git connect ${
      user.blog || user.html_url
    }</text>
    <text x="20" y="80" class="success">✓ Connection established</text>
    <!-- Terminal Background -->


  
  <!-- neofetch -->
  <text x="20" y="110" class="prompt">┌──(</text>
  <text x="60" y="110" class="success">dev</text>
  <text x="85" y="110" class="prompt">㉿</text>
  <text x="105" y="110" class="info">github</text>
  <text x="160" y="110" class="prompt"> )-[</text>
  <text x="190" y="110" class="accent">~</text>
  <text x="200" y="110" class="prompt">]</text>
  <text x="20" y="130" class="prompt">└─</text>
  <text x="45" y="130" class="command">$ git log --whoami</text>
  
  <!-- Neofetch Header -->
  <text x="180" y="150" class="success" font-size="18" font-weight="bold">${
    user.name || username
  }</text>
  <text x="180" y="165" class="accent">@${username}</text>
  
  <!-- Profile Picture (ASCII Art Style) -->
  <rect x="20" y="185" width="120" height="120" rx="60" fill="#30363d" stroke="#58a6ff" stroke-width="2"/>
  <image x="25" y="190" width="110" height="110" href="data:image/jpeg;base64,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" clip-path="circle(55px at 55px 55px)"/>

  <!-- Stats Section -->
  <text x="180" y="195" class="info">OS</text>
  <text x="300" y="195" class="text">Arch Linux</text>

  <text x="180" y="215" class="info">Host</text>
  <text x="300" y="215" class="text">${user.location || "Delhi, India"}</text>

  <text x="180" y="235" class="info">Uptime</text>
  <text x="300" y="235" class="text">${age}</text>

  <text x="180" y="255" class="info">Repos</text>
  <text x="300" y="255" class="text">${user.public_repos} repos</text>

  <text x="180" y="275" class="info">Top Languages</text>
  <text x="300" y="275" class="text">${topLanguages.join(" • ")}</text>

  <text x="180" y="295" class="info">Stars</text>
  <text x="300" y="295" class="text">${stars} stars</text>
  
  <text x="180" y="315" class="info">Followers</text>
  <text x="300" y="315" class="text">${user.followers} followers</text>
  
  <text x="180" y="335" class="info">Last Commit</text>
  <text x="300" y="335" class="text">${lastCommitDate}</text>

  <!-- Color Palette -->
  <text x="30" y="370" class="text">Colors:</text>
  <rect x="30" y="380" width="20" height="20" fill="#ff5f56"/>
  <rect x="55" y="380" width="20" height="20" fill="#ffbd2e"/>
  <rect x="80" y="380" width="20" height="20" fill="#27c93f"/>
  <rect x="105" y="380" width="20" height="20" fill="#3b82f6"/>
  <rect x="130" y="380" width="20" height="20" fill="#7c3aed"/>
  <rect x="155" y="380" width="20" height="20" fill="#f97316"/>
  <rect x="180" y="380" width="20" height="20" fill="#22c55e"/>
  <rect x="205" y="380" width="20" height="20" fill="#22d3ee"/>
  
  <!-- stack -->
  <text x="20" y="450" class="prompt">┌──(</text>
  <text x="60" y="450" class="success">dev</text>
  <text x="85" y="450" class="prompt">㉿</text>
  <text x="105" y="450" class="info">github</text>
  <text x="160" y="450" class="prompt"> )-[</text>
  <text x="190" y="450" class="accent">~</text>
  <text x="200" y="450" class="prompt">]</text>
  <text x="20" y="470" class="prompt">└─</text>
  <text x="45" y="470" class="command">$ git log --stack --oneline</text>
  
  <!-- Stack Section -->
  <text x="20" y="490" class="text">Stack (used so far): ${stack.join(
    " • "
  )}</text>  
  <!-- profiles -->
  <text x="20" y="540" class="prompt">┌──(</text>
  <text x="60" y="540" class="success">dev</text>
  <text x="85" y="540" class="prompt">㉿</text>
  <text x="105" y="540" class="info">github</text>
  <text x="160" y="540" class="prompt"> )-[</text>
  <text x="190" y="540" class="accent">~</text>
  <text x="200" y="540" class="prompt">]</text>
  <text x="20" y="560" class="prompt">└─</text>
  <text x="45" y="560" class="command">$ git log --profiles</text>
  
  <!-- Profile Section -->
  <text x="20" y="580" class="text">Codeforces</text>
  <a href="https://codeforces.com/profile/Realmchan" target="_blank" rel="noopener noreferrer">
  <text x="120" y="580" class="text">Realmchan | ${codeforcesRating} | ${codeforcesRank} </text>
  </a>
  <text x="20" y="600" class="text" >CodeChef</text>
  <a href="https://www.codechef.com/users/realm" target="_blank" rel="noopener noreferrer">
  <text x="120" y="600" class="text">Realm | ${codechefRating} | ${codechefRank} </text>
  </a>
  <text x="20" y="620" class="text">Leetcode</text>
  <a href="https://leetcode.com/realmchan" target="_blank" rel="noopener noreferrer">
  <text x="120" y="620" class="text">Realmchan | ${leetcodeRating} </text>
  </a>
  
  <!-- connect -->
  <text x="20" y="670" class="prompt">┌──(</text>
  <text x="60" y="670" class="success">dev</text>
  <text x="85" y="670" class="prompt">㉿</text>
  <text x="105" y="670" class="info">github</text>
  <text x="160" y="670" class="prompt"> )-[</text>
  <text x="190" y="670" class="accent">~</text>
  <text x="200" y="670" class="prompt">]</text>
  <text x="20" y="690" class="prompt">└─</text>
  <text x="45" y="690" class="command">$ git ping -c1 chandansahoo.dev</text>

  <!-- Connect Section -->
  <text x="20" y="710" class="text">Email</text>
  <a href="mailto:chandansahoo02468@gmail.com" target="_blank" rel="noopener noreferrer">
  <text x="120" y="710" class="text">chandansahoo02468@gmail.com</text>
  </a>
  <text x="20" y="730" class="text" >LinkedIn</text>
  <a href="https://linkedin.com/in/chandansahoo-cs" target="_blank" rel="noopener noreferrer">
  <text x="120" y="730" class="text">chandansahoo-cs</text>
  </a>
  <text x="20" y="750" class="text">Github</text>
  <a href="https://github.com/chandanSahoo-cs" target="_blank" rel="noopener noreferrer">
  <text x="120" y="750" class="text">chandanSahoo-cs</text>
  </a>
  <text x="20" y="770" class="text">Discord</text>
  <a href="https://discord.com/users/chandansahoo" target="_blank" rel="noopener noreferrer">
  <text x="120" y="770" class="text">chandansahoo</text>
  </a>
  </svg>
  `;

  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml" },
  });
}
/* eslint-enable @typescript-eslint/no-explicit-any */
