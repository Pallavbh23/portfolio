import Link from "next/link";

export default function WorkLinkedList() {
  const items = [
    {
      company: "Fynd",
      role: "SDE I · Payments (POS)",
      period: "Feb 2023 — Present",
      linkedIn: "https://www.linkedin.com/company/fynd/",
      bullets: [
        "Own the POS side of the payments stack—offline refunds, credit notes, split & advance payments; adopted by 100+ offline businesses.",
        "Added rails like PayU, zero-value checkout, and payment links powering Ajio, JioMart, Tira.",
        "Python · Kafka · Redis · MySQL; ~99.9% API success in production.",
      ],
    },
    {
      company: "Bharti Airtel",
      role: "Young Technical Leader (SDE-I)",
      period: "May 2022 — Feb 2023",
      linkedIn: "https://www.linkedin.com/company/bharti-airtel/",
      bullets: [
        "Reconciled data across 3+ lines of business (~15M users/mo) with Python.",
        "Automations lifted resolution rates ~65% → ~95%; tuned Spring Boot services for ~25% faster response times impacting 350M+ users.",
      ],
    },
    {
      company: "Profitize",
      role: "Backend Engineer (remote)",
      period: "Jan 2021 — Apr 2022",
      linkedIn: "https://www.linkedin.com/company/profitize/",
      bullets: [
        "Co-built the digital bookkeeping product with the founder; mentored a team of 5; shipped 30+ features.",
        "Dashboards/pipelines saved 20+ hrs/week; CI/CD + AWS (lambdas, microservices).",
      ],
    },
  ];

  return (
    <div className="relative">
      <div
        className="absolute left-4 top-0 bottom-0 w-px bg-cloud"
        aria-hidden
      />
      <ul className="space-y-8">
        {items.map((it, i) => (
          <li key={i} className="pl-12">
            <div className="relative">
              <div className="absolute -left-8 top-1.5 h-4 w-4 rounded-full bg-indigo-600 shadow" />
              <div className="text-sm text-slate-500">next →</div>
              <h3 className="text-xl font-medium">
                <Link
                  href={it.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-indigo-600/40 underline-offset-4 hover:decoration-indigo-600"
                >
                  {it.company}
                </Link>{" "}
                <span className="text-slate-500">— {it.role}</span>
              </h3>
              <div className="text-sm text-slate-500">{it.period}</div>
              <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-600">
                {it.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
