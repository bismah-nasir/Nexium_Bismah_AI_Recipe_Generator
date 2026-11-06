import type { CSSProperties, ReactNode } from "react";
import {
    AbsoluteFill,
    Audio,
    Easing,
    Img,
    Sequence,
    interpolate,
    spring,
    staticFile,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";
import landing from "../public/capture/landing/manifest.json";
import generate from "../public/capture/generate/manifest.json";
import reject from "../public/capture/reject/manifest.json";
import { MagicReveal, MagicWand, WAND_FRAMES, WAND_LEAD_IN } from "./MagicWand";

// Set this to the working production URL. The end screen hides the line while it is empty.
const LIVE_URL = "ai-recipegen.vercel.app";
const REPO_URL = "github.com/bismah-nasir/Nexium_Bismah_AI_Recipe_Generator";

export const FPS = 30;
const s = (seconds: number) => Math.round(seconds * FPS);
const FONT = '"Segoe UI", system-ui, sans-serif';
const ORANGE = "#ff6900";
const DEEP = "#c73a00";
const INK = "#1e293b";
const CREAM = "#fff7f2";

const CLIPS = { landing, generate, reject };

// Shows the recorded frame for the current moment. speed maps video time to recording time.
const Clip = ({
    name,
    from,
    to,
    speed,
}: {
    name: keyof typeof CLIPS;
    from: number;
    to: number;
    speed: number;
}) => {
    const frame = useCurrentFrame();
    const { frames } = CLIPS[name];
    const t = Math.min(to, from + (frame / FPS) * speed);
    let lo = 0;
    let hi = frames.length - 1;
    while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        if (frames[mid].t <= t) lo = mid;
        else hi = mid - 1;
    }
    return (
        <Img
            src={staticFile(`capture/${name}/${frames[lo].file}`)}
            style={{ width: 1920, height: 1080 }}
        />
    );
};

// Slow camera move across a still screenshot
const Still = ({ file, duration, zoom = 1.07 }: { file: string; duration: number; zoom?: number }) => {
    const frame = useCurrentFrame();
    const scale = interpolate(frame, [0, s(duration)], [1, zoom], {
        extrapolateRight: "clamp",
    });
    return (
        <Img
            src={staticFile(file)}
            style={{ width: 1920, height: 1080, transform: `scale(${scale})` }}
        />
    );
};

// Crossfades a scene in and out
const Fade = ({
    duration,
    fadeIn = true,
    fadeOut = true,
    children,
}: {
    duration: number;
    fadeIn?: boolean;
    fadeOut?: boolean;
    children: ReactNode;
}) => {
    const frame = useCurrentFrame();
    const end = s(duration);
    const opacity = Math.min(
        fadeIn ? interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }) : 1,
        fadeOut ? interpolate(frame, [end - 10, end], [1, 0], { extrapolateLeft: "clamp" }) : 1
    );
    return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

// Popup comment that springs in, optionally with an arrow to the thing it describes
const Callout = ({
    at,
    until,
    x,
    y,
    width = 460,
    title,
    text,
    target,
    from,
}: {
    at: number;
    until: number;
    x: number;
    y: number;
    width?: number;
    title: string;
    text?: string;
    target?: { x: number; y: number };
    from?: { x: number; y: number };
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const start = s(at);
    const end = s(until);
    if (frame < start || frame > end) return null;
    const pop = spring({ frame: frame - start, fps, config: { damping: 14, stiffness: 170 } });
    const out = interpolate(frame, [end - 8, end], [1, 0], { extrapolateLeft: "clamp" });
    const anchor = from ?? { x: x + width / 2, y };
    const draw = interpolate(frame - start, [4, 16], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
    });
    return (
        <AbsoluteFill style={{ opacity: out }}>
            {target && (
                <svg width={1920} height={1080} style={{ position: "absolute" }}>
                    <line
                        x1={anchor.x}
                        y1={anchor.y}
                        x2={anchor.x + (target.x - anchor.x) * draw}
                        y2={anchor.y + (target.y - anchor.y) * draw}
                        stroke={ORANGE}
                        strokeWidth={5}
                        strokeLinecap="round"
                    />
                    {draw === 1 && (
                        <>
                            <circle cx={target.x} cy={target.y} r={19} fill={ORANGE} opacity={0.25} />
                            <circle cx={target.x} cy={target.y} r={10} fill={ORANGE} />
                        </>
                    )}
                </svg>
            )}
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width,
                    padding: "20px 26px",
                    background: "#fff",
                    borderRadius: 18,
                    borderLeft: `9px solid ${ORANGE}`,
                    boxShadow: "0 22px 55px rgba(70,30,0,.28)",
                    fontFamily: FONT,
                    transform: `scale(${pop})`,
                    transformOrigin: "center",
                }}
            >
                <div style={{ fontSize: 31, fontWeight: 700, color: DEEP, lineHeight: 1.2 }}>{title}</div>
                {text && (
                    <div style={{ fontSize: 24, color: INK, marginTop: 8, lineHeight: 1.32 }}>{text}</div>
                )}
            </div>
        </AbsoluteFill>
    );
};

const brandBackground: CSSProperties = {
    background: `radial-gradient(circle at 78% 22%, #ffd9b8 0%, ${CREAM} 45%, #fff 100%)`,
    fontFamily: FONT,
};

const useRise = (delay: number) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const p = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 120 } });
    return { opacity: p, transform: `translateY(${(1 - p) * 40}px)` };
};

const Title = () => {
    const logo = useRise(4);
    const tag = useRise(22);
    const sub = useRise(38);
    const frame = useCurrentFrame();
    const chef = interpolate(frame, [0, s(4.5)], [1, 1.05]);
    return (
        <AbsoluteFill style={brandBackground}>
            <div style={{ position: "absolute", left: 140, top: 310, width: 980 }}>
                <div style={{ ...logo, fontSize: 124, fontWeight: 800, color: ORANGE, letterSpacing: -2 }}>
                    RecipeGen
                </div>
                <div style={{ ...tag, fontSize: 62, fontWeight: 700, color: INK, marginTop: 14, lineHeight: 1.15 }}>
                    Turn your ingredients into recipes with AI
                </div>
                <div style={{ ...sub, fontSize: 34, color: "#475569", marginTop: 30 }}>
                    Personalized meals, nutrition, and safety tips in seconds
                </div>
            </div>
            <Img
                src={staticFile("chef.png")}
                style={{
                    position: "absolute",
                    right: 150,
                    top: 100,
                    height: 880,
                    transform: `scale(${chef})`,
                }}
            />
        </AbsoluteFill>
    );
};

const STACK = ["Next.js 15", "TypeScript", "Tailwind CSS", "Supabase Auth", "MongoDB Atlas", "Gemini API", "Vercel"];

const TechStack = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const head = useRise(2);
    return (
        <AbsoluteFill style={{ ...brandBackground, alignItems: "center", justifyContent: "center" }}>
            <div style={{ ...head, fontSize: 74, fontWeight: 800, color: INK, marginBottom: 60 }}>
                Built with
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 28, justifyContent: "center", width: 1400 }}>
                {STACK.map((name, i) => {
                    const p = spring({ frame: frame - 10 - i * 5, fps, config: { damping: 12, stiffness: 170 } });
                    return (
                        <div
                            key={name}
                            style={{
                                transform: `scale(${p})`,
                                padding: "24px 44px",
                                borderRadius: 999,
                                background: "#fff",
                                border: `3px solid ${ORANGE}`,
                                color: DEEP,
                                fontSize: 42,
                                fontWeight: 700,
                                boxShadow: "0 12px 30px rgba(70,30,0,.14)",
                            }}
                        >
                            {name}
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};

const LinkRow = ({ label, value, style }: { label: string; value: string; style: CSSProperties }) => (
    <div style={{ ...style, marginTop: 30, textAlign: "center" }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#ffe1c9", letterSpacing: 2, textTransform: "uppercase" }}>
            {label}
        </div>
        <div style={{ fontSize: 46, fontWeight: 700, color: "#fff", marginTop: 6 }}>{value}</div>
    </div>
);

const EndScreen = () => {
    const logo = useRise(2);
    const live = useRise(14);
    const repo = useRise(LIVE_URL ? 26 : 14);
    return (
        <AbsoluteFill
            style={{
                background: `linear-gradient(135deg, ${ORANGE}, ${DEEP})`,
                fontFamily: FONT,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div style={{ ...logo, fontSize: 118, fontWeight: 800, color: "#fff", marginBottom: 16 }}>RecipeGen</div>
            {LIVE_URL && <LinkRow label="Try it live" value={LIVE_URL} style={live} />}
            <LinkRow label="Source code" value={REPO_URL} style={repo} />
        </AbsoluteFill>
    );
};

const Music = () => {
    const frame = useCurrentFrame();
    const volume = interpolate(frame, [0, 12, TOTAL_FRAMES - 45, TOTAL_FRAMES], [0, 0.75, 0.75, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    return <Audio src={staticFile("music.wav")} volume={volume} />;
};

// The wand flicks on the beat where the drums come in
const REVEAL = 124 / FPS;

// [start, length] of each scene, in seconds
const T = {
    title: [0, 5],
    landing: [REVEAL, 7.56],
    signin: [11.5, 3.6],
    form: [15, 12],
    generating: [27, 2.5],
    recipeTop: [29.5, 4.5],
    recipeScroll: [34, 8],
    reject: [42, 7.5],
    saved: [49.3, 3.9],
    stack: [53, 3],
    end: [55.8, 4.1],
} as const;

export const TOTAL_FRAMES = s(59.9);

const Scene = ({ time, children }: { time: readonly [number, number]; children: ReactNode }) => (
    <Sequence from={s(time[0])} durationInFrames={s(time[1])}>
        {children}
    </Sequence>
);

export const Demo = () => (
    <AbsoluteFill style={{ background: CREAM }}>
        <Music />

        <Scene time={T.title}>
            <Title />
        </Scene>

        <Scene time={T.landing}>
            <Fade duration={T.landing[1]} fadeIn={false}>
                <MagicReveal>
                <Clip name="landing" from={0} to={8.3} speed={1.17} />
                <Callout at={0.9} until={2.6} x={1330} y={560} title="A clean landing page" text="Explains the app at a glance" />
                <Callout at={3} until={4.9} x={1330} y={905} title="How it works" text="Ingredients in, recipe out" />
                <Callout at={5.2} until={7.2} x={1330} y={905} title="Key features" text="AI recipes, diet choices, and nutrition" />
                </MagicReveal>
            </Fade>
        </Scene>

        <Sequence from={124 - WAND_LEAD_IN} durationInFrames={WAND_FRAMES}>
            <MagicWand />
        </Sequence>

        <Scene time={T.signin}>
            <Fade duration={T.signin[1]}>
                <Still file="capture/signin.jpg" duration={T.signin[1]} />
                <Callout
                    at={0.5}
                    until={3.2}
                    x={1320}
                    y={420}
                    title="Secure accounts"
                    text="Email sign-in powered by Supabase Auth"
                    target={{ x: 1185, y: 480 }}
                    from={{ x: 1320, y: 480 }}
                />
            </Fade>
        </Scene>

        <Scene time={T.form}>
            <Fade duration={T.form[1]} fadeOut={false}>
                <Clip name="generate" from={0.6} to={13.84} speed={1.1} />
                <Callout
                    at={0.5}
                    until={5.2}
                    x={1262}
                    y={215}
                    width={470}
                    title="Add what you have"
                    text="Type an ingredient and press Enter"
                    target={{ x: 1190, y: 288 }}
                    from={{ x: 1262, y: 288 }}
                />
                <Callout
                    at={5.7}
                    until={11.6}
                    x={1262}
                    y={215}
                    width={470}
                    title="Set your preferences"
                    text="Meal type, diet, and difficulty"
                    target={{ x: 1190, y: 443 }}
                    from={{ x: 1262, y: 320 }}
                />
                <Callout
                    at={7.8}
                    until={11.6}
                    x={170}
                    y={640}
                    width={620}
                    title="Chicken in a vegan recipe?"
                    text="Let's see how the AI handles that"
                />
            </Fade>
        </Scene>

        <Scene time={T.generating}>
            <Clip name="generate" from={13.84} to={19.65} speed={2.32} />
            <Callout at={0.1} until={2.4} x={170} y={660} width={560} title="Gemini builds the recipe" text="Returned as validated, structured data" target={{ x: 660, y: 550 }} />
        </Scene>

        <Scene time={T.recipeTop}>
            <Clip name="generate" from={19.65} to={21.45} speed={0.4} />
            <Callout
                at={0.2}
                until={4.4}
                x={1262}
                y={540}
                width={470}
                title="Nutrition per serving"
                text="Calories, protein, carbs, and fat"
                target={{ x: 1486, y: 478 }}
            />
            <Callout
                at={1.5}
                until={4.4}
                x={1262}
                y={740}
                width={470}
                title="The diet is respected"
                text="Chicken was swapped for tofu, and the app says why"
                target={{ x: 1158, y: 633 }}
                from={{ x: 1262, y: 800 }}
            />
        </Scene>

        <Scene time={T.recipeScroll}>
            <Clip name="generate" from={21.45} to={28.88} speed={1.24} />
            <Callout at={0.7} until={3.6} x={1262} y={400} width={470} title="Clear instructions" text="Every step includes its quantities" />
            <Callout
                at={4.4}
                until={7.9}
                x={1262}
                y={540}
                width={470}
                title="Safety first"
                text="Allergen and food-safety cautions"
                target={{ x: 1158, y: 650 }}
                from={{ x: 1262, y: 610 }}
            />
            <Callout
                at={5.6}
                until={7.9}
                x={1262}
                y={770}
                width={470}
                title="Chef's tips"
                text="Ideas to take it further"
                target={{ x: 1158, y: 850 }}
                from={{ x: 1262, y: 830 }}
            />
        </Scene>

        <Scene time={T.reject}>
            <Fade duration={T.reject[1]}>
                <Clip name="reject" from={0.44} to={7.68} speed={1.37} />
                <Callout
                    at={0.4}
                    until={5.2}
                    x={1262}
                    y={215}
                    width={470}
                    title="What about nonsense?"
                    text="Random text, or things you can't eat"
                    target={{ x: 1190, y: 288 }}
                    from={{ x: 1262, y: 288 }}
                />
                <Callout
                    at={5.5}
                    until={7.4}
                    x={1262}
                    y={455}
                    width={470}
                    title="Politely rejected"
                    text="No fake recipe, and nothing is saved"
                    target={{ x: 1216, y: 540 }}
                    from={{ x: 1262, y: 530 }}
                />
            </Fade>
        </Scene>

        <Scene time={T.saved}>
            <Fade duration={T.saved[1]}>
                <Still file="capture/recipes.jpg" duration={T.saved[1]} zoom={1.05} />
                <Callout at={0.5} until={3.6} x={760} y={670} width={640} title="Every recipe is saved" text="Stored in MongoDB, private to your account" target={{ x: 645, y: 745 }} from={{ x: 760, y: 745 }} />
            </Fade>
        </Scene>

        <Scene time={T.stack}>
            <Fade duration={T.stack[1]}>
                <TechStack />
            </Fade>
        </Scene>

        <Scene time={T.end}>
            <Fade duration={T.end[1]} fadeOut={false}>
                <EndScreen />
            </Fade>
        </Scene>
    </AbsoluteFill>
);
