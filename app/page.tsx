// app/page.tsx
import Image from "next/image";
import GraphHero from "@/components/GraphHero";
import ProjectsGrid from "@/components/ProjectsGrid";
import WorkLinkedList from "@/components/WorkLinkedList";
import DSAPlayground from "@/components/DSAPlayground";
import LeetCode from "@/components/LeetCode";

import Section from "@/components/Section";
import { Card, CardBody, CardTitle, CardMeta } from "@/components/Card"; // fixed path

export default async function Page() {
  const year = new Date().getFullYear();
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug('[Page] render year', year);
  }

  return (
    <main className="bg-background text-foreground">
      {/* ABOUT */}
      <Section id="about">
        <div className="flex items-center gap-6">
          <Image
            src="https://github.com/Pallavbh23.png"
            alt="Pallav Bhardwaj"
            width={96}
            height={96}
            className="rounded-full border border-border"
          />
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold">Hi, I’m Pallav.</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              I build payments, reliability, and data systems you can trust. Currently crafting payment flows and
              integrations—plus the odd dashboard and pipeline when it helps unblock teams.
            </p>
          </div>
        </div>
      </Section>

      {/* GRAPH HERO (moved here) */}
      <GraphHero />

      {/* WORK */}
      <Section id="work">
        <h2 className="mb-3 text-3xl md:text-4xl font-semibold">Work</h2>
        <p className="text-muted-foreground">A timeline as a linked list. Inspect a node → expand details.</p>
        <div className="mt-8">
          <WorkLinkedList />
        </div>
      </Section>

      {/* PROJECTS */}
      <Section id="projects">
        <h2 className="mb-3 text-3xl md:text-4xl font-semibold">Projects</h2>
        <p className="text-muted-foreground">
          Auto-fetched from my GitHub. Starred repos are highlighted; AI projects float to the top.
        </p>
        <div className="mt-8">
          <ProjectsGrid />
        </div>
      </Section>

      {/* LEETCODE */}
      <Section id="leetcode">
        <h2 className="mb-3 text-3xl md:text-4xl font-semibold">LeetCode</h2>
        <p className="text-muted-foreground">DSA practice, contests, and recent streaks.</p>
        <div className="mt-8">
          <LeetCode />
        </div>
      </Section>

      {/* WRITING (example converted to Cards for more “volume”) */}
      <Section id="writing">
        <h2 className="mb-6 text-3xl md:text-4xl font-semibold">Writing</h2>
        <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="https://pallavbh23.medium.com/setting-up-docker-and-docker-compose-for-nest-js-and-mongodb-1cd972d97ef7"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card>
              <CardBody>
                <div className="text-sm text-muted-foreground">Medium</div>
                <CardTitle className="mt-1">
                  Setting up Docker & docker-compose for Nest.js and MongoDB
                </CardTitle>
                <p className="mt-2 text-muted-foreground">
                  A concise setup so the API and DB run happily together in containers.
                </p>
              </CardBody>
            </Card>
          </a>
          {/* Add more posts here as needed */}
        </div>
      </Section>

      {/* PLAYGROUND */}
      <Section id="playground">
        <h2 className="mb-3 text-3xl md:text-4xl font-semibold">Playground</h2>
        <p className="text-muted-foreground">
          BFS vs DFS on a random store graph. Adjust nodes, density, and speed.
        </p>
        <div className="mt-8">
          <DSAPlayground />
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact" padded={false}>
        <div className="py-12 md:py-16 border-t border-border">
          <h2 className="text-3xl md:text-4xl font-semibold">Contact</h2>
          <p className="mt-3 text-muted-foreground">
            Reach me at{" "}
            <a className="underline underline-offset-4" href="mailto:pallavbh23@gmail.com">
              pallavbh23@gmail.com
            </a>{" "}
            or on{" "}
            <a
              className="underline underline-offset-4"
              href="https://www.linkedin.com/in/pbh23"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            .
          </p>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10 text-center text-muted-foreground">
        <div className="container-app">
          © {year} Pallav Bhardwaj • built with Next.js + Tailwind + Framer Motion
        </div>
      </footer>
    </main>
  );
}
