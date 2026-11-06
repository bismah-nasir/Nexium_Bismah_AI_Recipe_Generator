import type { CSSProperties } from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const LIVE_URL = "ai-recipegen.vercel.app";
const CHIPS = ["Diet-aware recipes", "Nutrition per serving", "Safety cautions"];

const FONT = '"Segoe UI", system-ui, sans-serif';
const ORANGE = "#ff6900";
const DEEP = "#c73a00";
const INK = "#1e293b";
const CREAM = "#fff7f2";

// The screenshots are 1920 wide. scale sizes them, and cursor hides the recorded pointer.
const Browser = ({
    file,
    scale,
    height,
    cursor,
    style,
}: {
    file: string;
    scale: number;
    height: number;
    cursor: { x: number; y: number };
    style: CSSProperties;
}) => (
    <div
        style={{
            position: "absolute",
            width: 1920 * scale,
            borderRadius: 18,
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 40px 90px rgba(120,50,0,.28)",
            ...style,
        }}
    >
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                height: 54,
                padding: "0 22px",
                background: "#f8ede5",
            }}
        >
            {["#ff5f57", "#febc2e", "#28c840"].map((color) => (
                <div key={color} style={{ width: 14, height: 14, borderRadius: 7, background: color }} />
            ))}
            <div
                style={{
                    marginLeft: 16,
                    padding: "6px 22px",
                    width: "45%",
                    borderRadius: 10,
                    background: "#fff",
                    color: "#64748b",
                    fontSize: 19,
                }}
            >
                {LIVE_URL}
            </div>
        </div>
        <div style={{ position: "relative", height, overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    width: 1920,
                    height: 1080,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                }}
            >
                <Img src={staticFile(file)} style={{ width: 1920, height: 1080 }} />
                <div
                    style={{
                        position: "absolute",
                        left: cursor.x,
                        top: cursor.y,
                        width: 34,
                        height: 34,
                        background: "#fff",
                    }}
                />
            </div>
        </div>
    </div>
);

export const Poster = () => (
    <AbsoluteFill
        style={{
            background: `radial-gradient(circle at 80% 18%, #ffd2ab 0%, ${CREAM} 48%, #fff 100%)`,
            fontFamily: FONT,
        }}
    >
        <Browser
            file="poster/form.jpg"
            scale={0.62}
            height={600}
            cursor={{ x: 1080, y: 500 }}
            style={{
                left: 930,
                top: 96,
                transform: "perspective(2400px) rotateY(-9deg) rotateX(2deg)",
                transformOrigin: "left center",
            }}
        />
        <Browser
            file="poster/recipe.jpg"
            scale={0.5}
            height={491}
            cursor={{ x: 680, y: 522 }}
            style={{
                left: 880,
                top: 505,
                boxShadow: "0 40px 100px rgba(120,50,0,.4)",
            }}
        />

        <div style={{ position: "absolute", left: 120, top: 262, width: 740 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 110,
                        height: 110,
                        borderRadius: 26,
                        background: ORANGE,
                    }}
                >
                    {/* ChefHat from lucide, the icon in the app's navbar */}
                    <svg
                        width={72}
                        height={72}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#fff"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z" />
                        <path d="M6 17h12" />
                    </svg>
                </div>
                <div style={{ fontSize: 112, fontWeight: 800, color: ORANGE, letterSpacing: -2 }}>RecipeGen</div>
            </div>
            <div style={{ marginTop: 44, fontSize: 58, fontWeight: 700, color: INK, lineHeight: 1.16 }}>
                Turn your ingredients into <span style={{ color: DEEP }}>recipes</span> with AI
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 40 }}>
                {CHIPS.map((chip) => (
                    <div
                        key={chip}
                        style={{
                            padding: "12px 26px",
                            borderRadius: 999,
                            background: "#ffe6d3",
                            color: DEEP,
                            fontSize: 30,
                            fontWeight: 600,
                        }}
                    >
                        {chip}
                    </div>
                ))}
            </div>
            <div style={{ marginTop: 36, fontSize: 32, color: "#64748b" }}>{LIVE_URL}</div>
        </div>
    </AbsoluteFill>
);
