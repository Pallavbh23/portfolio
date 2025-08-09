import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { remark } from "remark";
import html from "remark-html";

// Force full static generation (needed for output: 'export')
export const dynamic = "force-static";
export const runtime = "nodejs"; // ensure node fs available at build time only
export const revalidate = false;

const PROJECTS_DIR = path.join(process.cwd(), "content/projects");

// Pre-generate static params for export mode
export function generateStaticParams() {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => ({ slug: f.replace(/\.(md|mdx)$/i, "") }));
}

async function loadProjectMarkdown(slug: string) {
  const fileBase = path.join(PROJECTS_DIR, slug);
  const mdPath = `${fileBase}.md`;
  const mdxPath = `${fileBase}.mdx`; // legacy extension – treated as plain markdown now
  const file =
    fs.existsSync(mdPath) || fs.existsSync(mdxPath)
      ? fs.existsSync(mdPath)
        ? mdPath
        : mdxPath
      : null;
  if (!file) return null;
  const raw = fs.readFileSync(file, "utf8");

  // Strip any exported metadata block at top (simple heuristic)
  const cleaned = raw.replace(/^export const metadata[\s\S]*?};?\n+/i, "").trimStart();

  const processed = await remark().use(html).process(cleaned);
  return String(processed);
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const htmlContent = await loadProjectMarkdown(params.slug);
  if (!htmlContent) notFound();
  return (
    <section className="container py-16 prose dark:prose-invert max-w-none">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </section>
  );
}
