"use client";
import useSWR from "swr";

export default function ProjectsGrid() {
  const { data, error } = useSWR("/api/github", (url) =>
    fetch(url).then((r) => r.json())
  );

  if (error)
    return <div className="text-red-600">Failed to load projects.</div>;
  if (!data) return <div>Loading projects…</div>;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {data.map((repo: any) => (
        <a
          key={repo.html_url}
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-cloud/70 background hover:background transition-colors shadow-card p-5 flex flex-col"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{repo.name}</h3>
            {repo.stargazers_count > 0 && (
              <span className="text-xs background text-indigo-600 rounded-full px-2 py-0.5">
                ★ {repo.stargazers_count}
              </span>
            )}
          </div>
          <p className="text-slate-600 mt-2 flex-1">{repo.description}</p>
          {repo.readme && (
            <p className="text-slate-500 text-xs mt-3 line-clamp-3 whitespace-pre-line">
              {repo.readme}
            </p>
          )}
        </a>
      ))}
    </div>
  );
}
