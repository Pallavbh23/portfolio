import { fetchRepos } from "@/lib/github";
import ProjectsHeapStack from "@/components/ProjectsHeapStack";

export default async function ProjectsGrid() {
  const username = process.env.GITHUB_USERNAME || "Pallavbh23";
  let repos: any[] = [];
  try {
    repos = await fetchRepos(username);
  } catch (e) {
    return <div className="text-red-600">Failed to load projects.</div>;
  }

  if (!repos.length) return <div>No projects found.</div>;

  // Already sorted by star + other priorities in fetchRepos; we only need star order for heap semantics.
  // Ensure pure star descending for display consistency before heap build.
  const sorted = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count);

  return <ProjectsHeapStack repos={sorted} />;
}
