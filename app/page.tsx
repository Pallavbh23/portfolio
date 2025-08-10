// app/page.tsx
import Image from "next/image";
import GraphHero from "@/components/GraphHero";
import ProjectsGrid from "@/components/ProjectsGrid";
import WorkLinkedList from "@/components/WorkLinkedList";
import DSAPlayground from "@/components/DSAPlayground";
import LeetCode from "@/components/LeetCode";
import Section from "@/components/Section";
import { Card, CardBody, CardTitle } from "@/components/Card"; // removed unused CardMeta
import WhatsAppCard from "@/components/WhatsAppCard";

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
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Image
            src="https://github.com/Pallavbh23.png"
            alt="Pallav Bhardwaj"
            width={112}
            height={112}
            className="rounded-full border border-border shadow-sm"
          />
          <div className="space-y-4 max-w-3xl">
            <div>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
                <span className="text-indigo-700 dark:text-indigo-300">Hi, I’m Pallav.</span>
              </h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                I build resilient <span className="font-medium text-foreground">payments</span> & reliability systems—offline flows, idempotent pipelines, and data surfaces that keep teams shipping. 
                I obsess over lean, well‑instrumented Python (clean error budgets, tight p99s) and pragmatic system design—idempotency keys, outbox/event sourcing, backpressure, caching layers & graceful degradation—to ship fast without firefights.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="https://www.linkedin.com/in/pbh23"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-medium bg-card hover:bg-accent transition-colors card-hover"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="text-sky-600"><path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V23h-4V8zM8.5 8h3.8v2.1h.05c.53-1 1.82-2.1 3.75-2.1 4.01 0 4.75 2.64 4.75 6.08V23h-4v-7.08c0-1.69-.03-3.87-2.36-3.87-2.36 0-2.72 1.84-2.72 3.74V23h-4V8z"/></svg>
                LinkedIn
              </a>
              <a
                href="https://github.com/Pallavbh23"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-medium bg-card hover:bg-accent transition-colors card-hover"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.53-1.36-1.28-1.72-1.28-1.72-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.04 1.78 2.72 1.27 3.38.97.1-.76.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.3 1.19-3.11-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.19a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.5 3.17-1.19 3.17-1.19.63 1.59.23 2.76.11 3.05.74.81 1.18 1.85 1.18 3.1 0 4.43-2.69 5.41-5.25 5.7.42.36.79 1.07.79 2.17 0 1.56-.01 2.82-.01 3.2 0 .31.21.67.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" clipRule="evenodd"/></svg>
                GitHub
              </a>
            </div>
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
        <p className="mt-2 text-sm"><a href="https://github.com/Pallavbh23" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted">https://github.com/Pallavbh23</a></p>
        <div className="mt-8">
          <ProjectsGrid />
        </div>
      </Section>

      {/* CODING STATS */}
      <Section id="coding-stats">
        <h2 className="mb-3 text-3xl md:text-4xl font-semibold">Coding Stats</h2>
        <p className="text-muted-foreground">Practice & profiles across platforms.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3 card-hover">
            <div className="flex items-center gap-3">
              <img src="https://leetcode.com/favicon.ico" alt="LeetCode" className="h-6 w-6 rounded-sm" />
              <h3 className="text-lg font-semibold">LeetCode</h3>
            </div>
            <LeetCode />
          </div>
          <a
            href="https://takeuforward.org/plus/profile/pallavbh23"
            target="_blank" rel="noopener noreferrer"
            className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3 card-hover hover:bg-accent transition"
          >
            <div className="flex items-center gap-3">
              <img src="https://takeuforward.org/static/media/TufDarkCircleLogo.876d63ea7e9c6b8336e9.png" alt="takeUforward" className="h-6 w-6 rounded-sm" />
              <h3 className="text-lg font-semibold">takeUforward</h3>
            </div>
            <p className="text-sm text-muted-foreground">Problem lists & progress tracking.</p>
            <span className="text-sm text-primary font-medium">View profile →</span>
          </a>
          <a
            href="https://www.crio.do/learn/portfolio/pallavbh23/"
            target="_blank" rel="noopener noreferrer"
            className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3 card-hover hover:bg-accent transition"
          >
            <div className="flex items-center gap-3">
              <img src="https://www.crio.do/favicon.ico" alt="Crio" className="h-6 w-6 rounded-sm" />
              <h3 className="text-lg font-semibold">Crio</h3>
            </div>
            <p className="text-sm text-muted-foreground">Hands-on learning & micro-experiences.</p>
            <span className="text-sm text-primary font-medium">View portfolio →</span>
          </a>
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
          <a
            href="https://medium.com/@nakshatransit/introduction-to-crypto-currency-d8f658dc1e61"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card>
              <CardBody>
                <div className="text-sm text-muted-foreground">Medium</div>
                <CardTitle className="mt-1">Introduction to Crypto Currency</CardTitle>
                <p className="mt-2 text-muted-foreground">An accessible primer on the fundamentals behind digital assets & cryptographic value transfer.</p>
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
        <div className="py-14 md:py-20 border-t border-border">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">Contact</h2>
          <div className="grid gap-6 md:grid-cols-3 auto-rows-fr w-full">
            <a
              href="mailto:pallavbh23@gmail.com"
              className="group relative rounded-xl border border-border bg-card p-6 flex flex-col gap-3 card-hover overflow-hidden h-full"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-primary/5 via-primary/0 to-primary/10" />
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-medium">@</div>
                <div>
                  <div className="text-sm uppercase tracking-wide text-muted-foreground">Email</div>
                  <div className="text-lg font-semibold">pallavbh23@gmail.com</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">Fastest way to reach me for opportunities, collaborations or a quick technical chat.</p>
            </a>
            <div className="h-full"><WhatsAppCard /></div>
            <a
              href="https://www.linkedin.com/in/pbh23"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-xl border border-border bg-card p-6 flex flex-col gap-3 card-hover overflow-hidden h-full"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-sky-500/5 via-sky-500/0 to-sky-500/10" />
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center font-medium">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V23h-4V8zM8.5 8h3.8v2.1h.05c.53-1 1.82-2.1 3.75-2.1 4.01 0 4.75 2.64 4.75 6.08V23h-4v-7.08c0-1.69-.03-3.87-2.36-3.87-2.36 0-2.72 1.84-2.72 3.74V23h-4V8z"/></svg>
                </div>
                <div>
                  <div className="text-sm uppercase tracking-wide text-muted-foreground">LinkedIn</div>
                  <div className="text-lg font-semibold">/in/pbh23</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">Professional updates, network and quick DMs. Always open to thoughtful connection requests.</p>
            </a>
          </div>
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
