import { ImageResponse } from "next/og";
export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#F7F8FB",
          color: "#0B1220",
          padding: "72px",
          fontSize: 56,
          fontWeight: 700,
        }}
      >
        <div>Pallav Bhardwaj</div>
        <div style={{ marginTop: 12, fontSize: 28, fontWeight: 500 }}>
          Payments • Reliability • Data — and playful DSA
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
