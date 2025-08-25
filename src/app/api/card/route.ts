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
    ? new Date(commits[0].updated_at).toLocaleDateString()
    : "N/A";

  // const accountCreated = new Date(user.created_at);
  // const accountAge = Math.floor(
  //   (today.getTime() - accountCreated.getTime()) / (1000 * 60 * 60 * 24 * 365)
  // );

  const svg = `
<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
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
  <rect width="100%" height="100%" rx="12" class="terminal-bg terminal-border"/>


  
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
  <image x="25" y="190" width="110" height="110" href="/me.jpg" clip-path="circle(55px at 55px 55px)"/>

  <!-- Stats Section -->
  <text x="180" y="195" class="info">OS</text>
  <text x="280" y="195" class="text">Arch Linux</text>

  <text x="180" y="215" class="info">Host</text>
  <text x="280" y="215" class="text">${user.location || "Delhi, India"}</text>

  <text x="180" y="235" class="info">Uptime</text>
  <text x="280" y="235" class="text">${age}</text>

  <text x="180" y="255" class="info">Repos</text>
  <text x="280" y="255" class="text">${user.public_repos} repos</text>

  <text x="180" y="275" class="info">Shell</text>
  <text x="280" y="275" class="text">${topLanguages
    .slice(0, 2)
    .join(", ")}</text>

  <text x="180" y="295" class="info">Stars</text>
  <text x="280" y="295" class="text">${stars} stars</text>
  
  <text x="180" y="315" class="info">Followers</text>
  <text x="280" y="315" class="text">${user.followers} followers</text>
  
  <text x="180" y="335" class="info">Last Commit:</text>
  <text x="280" y="335" class="text">${lastCommitDate}</text>

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
  <text x="20" y="430" class="prompt">┌──(</text>
  <text x="60" y="430" class="success">dev</text>
  <text x="85" y="430" class="prompt">㉿</text>
  <text x="105" y="430" class="info">github</text>
  <text x="160" y="430" class="prompt"> )-[</text>
  <text x="190" y="430" class="accent">~</text>
  <text x="200" y="430" class="prompt">]</text>
  <text x="20" y="450" class="prompt">└─</text>
  <text x="45" y="450" class="command">$ git log --stack --oneline</text>
  
  <!-- Stack Section -->
  <text x="20" y="470" class="text">Stack (used so far): Typescript, Javascript, C++, Go, Reactjs ,Nextjs, Docker, Git, PostgresSQL, MongoDB</text>
  
  <!-- profiles -->
  <text x="20" y="500" class="prompt">┌──(</text>
  <text x="60" y="500" class="success">dev</text>
  <text x="85" y="500" class="prompt">㉿</text>
  <text x="105" y="500" class="info">github</text>
  <text x="160" y="500" class="prompt"> )-[</text>
  <text x="190" y="500" class="accent">~</text>
  <text x="200" y="500" class="prompt">]</text>
  <text x="20" y="520" class="prompt">└─</text>
  <text x="45" y="520" class="command">$ git log --profiles</text>
  
  <!-- Profile Section -->
  <text x="20" y="540" class="text">Codeforces</text>
  <a href="https://codeforces.com/profile/Realmchan" target="_blank" rel="noopener noreferrer">
  <text x="120" y="540" class="link">Realmchan</text>
  </a>
  <text x="20" y="560" class="text" >CodeChef</text>
  <a href="https://www.codechef.com/users/realm" target="_blank" rel="noopener noreferrer">
  <text x="120" y="560" class="link">Realm</text>
  </a>
  <text x="20" y="580" class="text">Leetcode</text>
  <a href="https://leetcode.com/realmchan" target="_blank" rel="noopener noreferrer">
  <text x="120" y="580" class="link">Realmchan</text>
  </a>
  
  <!-- connect -->
  <text x="20" y="610" class="prompt">┌──(</text>
  <text x="60" y="610" class="success">dev</text>
  <text x="85" y="610" class="prompt">㉿</text>
  <text x="105" y="610" class="info">github</text>
  <text x="160" y="610" class="prompt"> )-[</text>
  <text x="190" y="610" class="accent">~</text>
  <text x="200" y="610" class="prompt">]</text>
  <text x="20" y="630" class="prompt">└─</text>
  <text x="45" y="630" class="command">$ git ping -c1 chandansahoo.dev</text>

  <!-- Connect Section -->
  <text x="20" y="650" class="text">Email</text>
  <a href="mailto:chandansahoo02468@gmail.com" target="_blank" rel="noopener noreferrer">
  <text x="120" y="650" class="link">chandansahoo02468@gmail.com</text>
  </a>
  <text x="20" y="670" class="text" >LinkedIn</text>
  <a href="https://linkedin.com/in/chandansahoo-cs" target="_blank" rel="noopener noreferrer">
  <text x="120" y="670" class="link">chandansahoo-cs</text>
  </a>
  <text x="20" y="690" class="text">Github</text>
  <a href="https://github.com/chandanSahoo-cs" target="_blank" rel="noopener noreferrer">
  <text x="120" y="690" class="link">chandanSahoo-cs</text>
  </a>
  <text x="20" y="710" class="text">Discord</text>
  <a href="https://discord.com/users/chandansahoo" target="_blank" rel="noopener noreferrer">
  <text x="120" y="710" class="link">chandansahoo</text>
  </a>
  
  </svg>
  `;
  
  return new Response(svg, {
      headers: { "Content-Type": "image/svg+xml" },
  });
}
/* eslint-enable @typescript-eslint/no-explicit-any */