import "server-only";
const GH = "https://api.github.com";

async function gh(path: string, revalidateSec = 3600) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN)
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`${GH}${path}`, {
    headers,
    next: { revalidate: revalidateSec },
  });
  if (!res.ok) throw new Error(`${path} failed`);
  return res.json();
}

export async function fetchRepos(username: string) {
  // user repos + starred repos (to promote)
  const [repos, starred] = await Promise.all([
    gh(`/users/${username}/repos?per_page=100&sort=updated`),
    gh(`/users/${username}/starred?per_page=100`, 3 * 3600),
  ]);

  const starredSet = new Set(
    starred.map(
      (r: any) => `${r.owner.login.toLowerCase()}/${r.name.toLowerCase()}`
    )
  );

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN)
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const aiKeywords = /(ai|ml|gpt|llm|langchain|transformer|cv|nlp)/i;

  const enriched = await Promise.all(
    repos.map(async (r: any) => {
      let readme = "";
      try {
        const readmeRes = await fetch(
          `${GH}/repos/${r.owner.login}/${r.name}/readme`,
          { headers, cache: "force-cache" }
        );
        if (readmeRes.ok) {
          const data = await readmeRes.json();
          readme = Buffer.from(data.content || "", "base64")
            .toString()
            .slice(0, 600);
        }
      } catch {
        // ignore README errors
      }
      const key = `${r.owner.login.toLowerCase()}/${r.name.toLowerCase()}`;
      return {
        name: r.name,
        full_name: r.full_name,
        html_url: r.html_url,
        description: r.description,
        stargazers_count: r.stargazers_count,
        topics: r.topics || [],
        isAIish: aiKeywords.test(
          [r.name, r.description, (r.topics || []).join(" ")].join(" ")
        ),
        isStarred: starredSet.has(key),
        readme,
      };
    })
  );

  // sort: starred first → AI-ish → stars desc
  return enriched.sort(
    (a, b) =>
      Number(b.isStarred) - Number(a.isStarred) ||
      Number(b.isAIish) - Number(a.isAIish) ||
      b.stargazers_count - a.stargazers_count
  );
}
