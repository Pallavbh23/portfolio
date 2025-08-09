export default function LeetCode() {
  const username = process.env.NEXT_PUBLIC_LEETCODE_USERNAME || "Pallavbh23";
  const badgeUrl = `https://leetcode-stats.vercel.app/api?username=${username}&theme=light`;

  return (
    <div className="rounded-xl border border-cloud/70 shadow-card p-5 bg-white">
      <img
        src={badgeUrl}
        alt="LeetCode stats"
        className="max-w-full"
        style={{ borderRadius: "8px" }}
      />
      <p className="text-xs text-slate-500 mt-3">
        Stats powered by{" "}
        <a
          href="https://github.com/JacobLinCool/LeetCode-Stats-Card"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          JacobLinCool/LeetCode-Stats-Card
        </a>
        .
      </p>
    </div>
  );
}
