import { ImageResponse } from "next/og";
import { getCaseStudyBySlug } from "@/lib/db";

export const runtime = "nodejs";
export const alt = "Northfold Case Study Preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);

  const title = cs?.title || "Case Study Architecture";
  const outcome = cs?.outcome || "Systems engineering and performance analysis.";
  const topic = cs?.topic_name || "Engineering";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          backgroundColor: "#FBFBFA",
          color: "#111111",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          border: "16px solid #111111",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              fontSize: 20,
              fontFamily: "monospace",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#666662",
            }}
          >
            FAHAD.SYSTEMS // CASE STUDY
          </div>
          <div
            style={{
              padding: "6px 18px",
              backgroundColor: "#111111",
              color: "#FBFBFA",
              borderRadius: "9999px",
              fontSize: 16,
              fontFamily: "monospace",
              textTransform: "uppercase",
            }}
          >
            {topic}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: "#111111",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#555555",
              lineHeight: 1.4,
              fontFamily: "serif",
            }}
          >
            {outcome}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "2px solid #E2E2DC",
            paddingTop: "24px",
            fontSize: 16,
            fontFamily: "monospace",
            color: "#8C8C86",
          }}
        >
          <div>LATENCY ZERO • DETERMINISTIC SCALE</div>
          <div>NORTHFOLD PORTFOLIO</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
