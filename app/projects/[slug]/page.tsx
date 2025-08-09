import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const file = path.join(
    process.cwd(),
    "content/projects",
    `${params.slug}.mdx`
  );
  if (!fs.existsSync(file)) notFound();
  // Import the MDX file from the content folder
  const mdx = (await import(`../../../content/projects/${params.slug}.mdx`))
    .default;
  const Mdx = mdx as unknown as React.FC;
  return (
    <section className="container py-16">
      <Mdx />
    </section>
  );
}
