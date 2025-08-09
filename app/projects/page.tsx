import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

export default function ProjectsIndex() {
  const dir = path.join(process.cwd(), "content/projects");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  return (
    <section className="container py-16">
      <h1 className="text-2xl font-semibold">Project Case Studies</h1>
      <ul className="mt-6 space-y-3">
        {files.map((f) => {
          const slug = f.replace(/\.mdx$/, "");
          return (
            <li key={slug}>
              <Link className="underline" href={`/projects/${slug}`}>
                {slug}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
