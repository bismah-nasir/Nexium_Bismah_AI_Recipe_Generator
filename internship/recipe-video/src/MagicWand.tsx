import type { ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";

const GOLD = "#ffc247";
const ORANGE = "#ff6900";
const CENTER = { x: 960, y: 540 };
const MAX_RADIUS = 1120;

// Frames within this overlay's Sequence
const FLICK = 22;
const END = 58;

const STAR =
    "M0 -10 C1.2 -3 3 -1.2 10 0 C3 1.2 1.2 3 0 10 C-1.2 3 -3 1.2 -10 0 C-3 -1.2 -1.2 -3 0 -10 Z";

// Where the wand's tip is: a quick swoop from the lower left to the middle of the screen
const tipAt = (f: number) => {
    const k = interpolate(f, [0, FLICK], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.3, 0, 0.25, 1),
    });
    const a = { x: -180, y: 900 };
    const b = { x: 360, y: 90 };
    return {
        x: (1 - k) ** 2 * a.x + 2 * k * (1 - k) * b.x + k * k * CENTER.x,
        y: (1 - k) ** 2 * a.y + 2 * k * (1 - k) * b.y + k * k * CENTER.y,
    };
};

const Sparkle = ({ x, y, size, color, opacity, spin }: { x: number; y: number; size: number; color: string; opacity: number; spin: number }) => (
    <path
        d={STAR}
        fill={color}
        opacity={opacity}
        transform={`translate(${x} ${y}) rotate(${spin}) scale(${size})`}
    />
);

// Sparkle trail and wand. Render this above both scenes.
export const MagicWand = () => {
    const frame = useCurrentFrame();
    const sparkles = [];

    // Trail left behind the tip
    for (let birth = 0; birth <= Math.min(frame, FLICK); birth++) {
        for (let i = 0; i < 4; i++) {
            const age = frame - birth;
            const life = 16 + random(`life-${birth}-${i}`) * 16;
            if (age > life) continue;
            const tip = tipAt(birth);
            const k = age / life;
            sparkles.push(
                <Sparkle
                    key={`t-${birth}-${i}`}
                    x={tip.x + (random(`x-${birth}-${i}`) - 0.5) * 70}
                    y={tip.y + (random(`y-${birth}-${i}`) - 0.5) * 70 + age * age * 0.12}
                    size={(0.5 + random(`s-${birth}-${i}`) * 1.4) * (1 - k * 0.6)}
                    color={i % 2 ? GOLD : ORANGE}
                    opacity={1 - k}
                    spin={age * 9}
                />
            );
        }
    }

    // Burst when the wand flicks
    if (frame >= FLICK) {
        const age = frame - FLICK;
        for (let i = 0; i < 90; i++) {
            const life = 18 + random(`bl-${i}`) * 20;
            if (age > life) continue;
            const angle = random(`ba-${i}`) * Math.PI * 2;
            const speed = 16 + random(`bs-${i}`) * 34;
            const travel = speed * age * (1 - (age / life) * 0.45);
            sparkles.push(
                <Sparkle
                    key={`b-${i}`}
                    x={CENTER.x + Math.cos(angle) * travel}
                    y={CENTER.y + Math.sin(angle) * travel + age * age * 0.1}
                    size={(0.7 + random(`bz-${i}`) * 2.2) * (1 - (age / life) * 0.5)}
                    color={i % 3 === 0 ? "#fff" : i % 3 === 1 ? GOLD : ORANGE}
                    opacity={1 - age / life}
                    spin={age * 7 + i * 20}
                />
            );
        }
    }

    const radius = revealRadius(frame - FLICK);
    const ringOpacity = interpolate(frame, [FLICK, FLICK + 4, FLICK + 16, FLICK + 24], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const flash = interpolate(frame, [FLICK - 1, FLICK + 1, FLICK + 9], [0, 0.85, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // The wand swings back after the flick, then leaves
    const tip = tipAt(frame);
    const swing = interpolate(frame, [0, FLICK - 3, FLICK, FLICK + 7, END - 12], [62, 26, 12, 46, 70], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const leave = interpolate(frame, [FLICK + 6, END - 12], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.in(Easing.cubic),
    });
    const wandOpacity = interpolate(frame, [0, 4, END - 18, END - 10], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
            <svg width={1920} height={1080}>
                <defs>
                    <radialGradient id="glow">
                        <stop offset="0%" stopColor="#fff" stopOpacity="1" />
                        <stop offset="35%" stopColor={GOLD} stopOpacity="0.75" />
                        <stop offset="100%" stopColor={ORANGE} stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="rod" x1="0" x2="1">
                        <stop offset="0%" stopColor="#3b1a07" />
                        <stop offset="55%" stopColor="#6b3410" />
                        <stop offset="100%" stopColor="#2a1204" />
                    </linearGradient>
                </defs>

                {frame >= FLICK && radius > 0 && (
                    <>
                        <circle cx={CENTER.x} cy={CENTER.y} r={radius} fill="none" stroke={ORANGE} strokeWidth={34} opacity={ringOpacity * 0.28} />
                        <circle cx={CENTER.x} cy={CENTER.y} r={radius} fill="none" stroke={GOLD} strokeWidth={9} opacity={ringOpacity} />
                    </>
                )}

                {flash > 0 && <circle cx={CENTER.x} cy={CENTER.y} r={430} fill="url(#glow)" opacity={flash} />}

                {sparkles}

                <g
                    opacity={wandOpacity}
                    transform={`translate(${tip.x - leave * 260} ${tip.y + leave * 760}) rotate(${-swing})`}
                >
                    <circle r={78} fill="url(#glow)" opacity={0.75} />
                    <g transform="rotate(205)">
                        <rect x={-8} y={26} width={16} height={430} rx={8} fill="url(#rod)" />
                        <rect x={-10} y={330} width={20} height={126} rx={9} fill="#26120a" />
                        <rect x={-10.5} y={322} width={21} height={13} rx={4} fill={GOLD} />
                        <rect x={-10.5} y={26} width={21} height={11} rx={4} fill={GOLD} />
                    </g>
                    <path d={STAR} fill="#fff" stroke={GOLD} strokeWidth={0.8} transform="scale(4.4)" />
                </g>
            </svg>
        </AbsoluteFill>
    );
};

// Radius of the circle that reveals the next scene, f frames after the flick
export const revealRadius = (f: number) =>
    interpolate(f, [0, 22], [0, MAX_RADIUS], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.45, 0, 0.2, 1),
    });

// Reveals its children through a growing circle from the wand's tip
export const MagicReveal = ({ children }: { children: ReactNode }) => {
    const frame = useCurrentFrame();
    const radius = revealRadius(frame);
    return (
        <AbsoluteFill style={{ clipPath: `circle(${radius}px at ${CENTER.x}px ${CENTER.y}px)` }}>
            {children}
        </AbsoluteFill>
    );
};

export const WAND_LEAD_IN = FLICK;
export const WAND_FRAMES = END;
