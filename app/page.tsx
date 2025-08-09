import Image from "next/image";
import GraphHero from "@/components/GraphHero";
import ProjectsGrid from "@/components/ProjectsGrid";
import WorkLinkedList from "@/components/WorkLinkedList";
import DSAPlayground from "@/components/DSAPlayground";
import LeetCode from "@/components/LeetCode";

export default async function Page() {
  return (
    <>
      <GraphHero />

      <section id="about" className="container py-16">
        <div className="flex items-center gap-6">
          <Image
            src="https://github.com/Pallavbh23.png"
            alt="Pallav Bhardwaj"
            width={96}
            height={96}
            className="rounded-full border border-cloud"
          />
          <div>
            <h2 className="text-2xl font-semibold">Hi, I’m Pallav.</h2>
            <p className="mt-2 text-slate-600">
              I build payments, reliability, and data systems you can trust.
              Currently crafting POS payment flows and integrations—plus the odd
              dashboard and pipeline when it helps unblock teams.
            </p>
          </div>
        </div>
      </section>

      <section id="work" className="container py-16">
        <h2 className="text-2xl font-semibold">Work</h2>
        <p className="text-slate-600 mt-2">
          A timeline as a linked list. Inspect a node → expand details.
        </p>
        <div className="mt-8">
          <WorkLinkedList />
        </div>
      </section>

      <section id="projects" className="container py-16">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <p className="text-slate-600 mt-2">
          Auto-fetched from my GitHub. Starred repos are highlighted; AI
          projects float to the top.
        </p>
        <div className="mt-8">
          <ProjectsGrid />
        </div>
      </section>

      <section id="leetcode" className="container py-16">
        <h2 className="text-2xl font-semibold">LeetCode</h2>
        <p className="text-slate-600 mt-2">
          DSA practice, contests, and recent streaks.
        </p>
        <div className="mt-8">
          <LeetCode />
        </div>
      </section>

      <section id="writing" className="container py-16">
        <h2 className="text-2xl font-semibold">Writing</h2>
        <div className="mt-6 grid gap-6">
          <a
            className="rounded-xl border border-cloud/70 bg-white hover:bg-indigo-100/30 transition-colors shadow-card p-5"
            href="https://pallavbh23.medium.com/setting-up-docker-and-docker-compose-for-nest-js-and-mongodb-1cd972d97ef7"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="text-sm text-slate-500">Medium</div>
            <h3 className="text-xl font-medium mt-1">
              Setting up Docker & docker-compose for Nest.js and MongoDB
            </h3>
            <p className="text-slate-600 mt-2">
              A concise setup so the API and DB run happily together in
              containers.
            </p>
          </a>
        </div>
      </section>

      <section id="playground" className="container py-16">
        <h2 className="text-2xl font-semibold">Playground</h2>
        <p className="text-slate-600 mt-2">
          BFS vs DFS on a random store graph. Adjust nodes, density, and speed.
        </p>
        <div className="mt-8">
          <DSAPlayground />
        </div>
      </section>

      <section id="contact" className="container py-16">
        <h2 className="text-2xl font-semibold">Contact</h2>
        <p className="text-slate-600 mt-2">
          Reach me at{" "}
          <a className="underline" href="mailto:pallavbh23@gmail.com">
            pallavbh23@gmail.com
          </a>{" "}
          or on{" "}
          <a
            className="underline"
            href="https://www.linkedin.com/in/pbh23"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          .
        </p>
      </section>

      <footer className="border-t border-cloud py-10 text-center text-slate-500">
        <div className="container">
          © {new Date().getFullYear()} Pallav Bhardwaj • built with Next.js +
          Tailwind + Framer Motion
        </div>
      </footer>
    </>
  );
}
