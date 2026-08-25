import { useState } from "react";
import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import {
  revealContainerStyles,
  revealTitleStyles,
  titleLineStyles,
  sceneLayerStyles,
  overlayLayerStyles,
  fallingLineStyles,
  ratStyles,
  holeStyles,
  bulletStreakStyles,
  bulletHoleStyles,
  monsterStyles,
  vignetteStyles,
  glitchTitleStyles,
  cardFallStyles,
  drunkStyles,
  tapeWrapStyles,
  tapeStyles,
  chalkStyles,
} from "./HomeReveal.styles";

const VARIANT_COUNT = 8;

const TITLE_LINES: { text: string; color: string }[] = [
  { text: "HORRIBLE", color: "primary.main" },
  { text: "CARD", color: "secondary.main" },
  { text: "GAME", color: "primary.main" },
];

const Rat = () => (
  <svg viewBox="0 0 120 80" width="120" height="80" aria-hidden>
    <path
      d="M0 44 Q -22 26 -18 6"
      stroke="#8a8a8a"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <ellipse cx="60" cy="46" rx="34" ry="20" fill="#7d7d7d" />
    <circle cx="94" cy="32" r="14" fill="#8f8f8f" />
    <circle cx="87" cy="20" r="7" fill="#9a9a9a" />
    <circle cx="101" cy="20" r="7" fill="#9a9a9a" />
    <circle cx="85" cy="19" r="3.5" fill="#e0b6b6" />
    <circle cx="99" cy="19" r="3.5" fill="#e0b6b6" />
    <circle cx="101" cy="30" r="2.6" fill="#111" />
    <circle cx="109" cy="35" r="2" fill="#5a2b2b" />
    <line x1="105" y1="37" x2="121" y2="35" stroke="#ccc" strokeWidth="1" />
    <line x1="105" y1="39" x2="121" y2="41" stroke="#ccc" strokeWidth="1" />
  </svg>
);

const Hole = () => (
  <svg viewBox="0 0 120 40" width="110" height="36" aria-hidden>
    <ellipse cx="60" cy="26" rx="52" ry="13" fill="#040403" />
    <ellipse cx="60" cy="23" rx="42" ry="10" fill="#000" />
    <circle cx="30" cy="18" r="2" fill="#1c1a15" />
    <circle cx="88" cy="16" r="2.4" fill="#1c1a15" />
    <circle cx="52" cy="12" r="1.6" fill="#1c1a15" />
  </svg>
);

const Monster = () => (
  <svg viewBox="0 0 200 160" width="100%" height="100%" aria-hidden>
    <path d="M46 30 L28 0 L60 18 Z" fill="#7b3f6e" />
    <path d="M154 30 L172 0 L140 18 Z" fill="#7b3f6e" />
    <path
      d="M100 22 C 42 12 10 62 16 112 C 20 152 72 152 100 152 C 128 152 180 152 184 112 C 190 62 158 12 100 22 Z"
      fill="#7b3f6e"
    />
    <circle cx="70" cy="70" r="14" fill="#fff" />
    <circle cx="130" cy="70" r="14" fill="#fff" />
    <circle cx="73" cy="72" r="6" fill="#111" />
    <circle cx="133" cy="72" r="6" fill="#111" />
    <path
      d="M60 116 Q100 138 140 116 L140 128 Q100 150 60 128 Z"
      fill="#3a1d36"
    />
    <path
      d="M72 116 l4 8 l4 -8 l4 8 l4 -8 l4 8 l4 -8 l4 8 l4 -8 l4 8 l4 -8 l4 8 l4 -8"
      fill="#fff"
    />
  </svg>
);

const DrunkBody = () => (
  <svg viewBox="0 0 120 44" width="100%" height="100%" aria-hidden>
    <ellipse cx="44" cy="28" rx="34" ry="11" fill="#22261f" />
    <path d="M30 38 L30 26" stroke="#22261f" strokeWidth="7" strokeLinecap="round" />
    <circle cx="84" cy="22" r="9" fill="#22261f" />
    <circle cx="81" cy="20" r="2.4" fill="#0e1511" />
    <rect
      x="56"
      y="12"
      width="5"
      height="15"
      rx="2.5"
      fill="#7c9a54"
      transform="rotate(-18 58 20)"
    />
  </svg>
);

const ChalkBody = () => (
  <svg viewBox="0 0 120 160" width="90" height="120" aria-hidden>
    <g
      fill="none"
      stroke="#e6e0c8"
      strokeWidth="3"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <circle cx="60" cy="18" r="13" />
      <path d="M60 31 L60 78" />
      <path d="M60 44 L36 62" />
      <path d="M60 44 L84 62" />
      <path d="M60 78 L42 120" />
      <path d="M60 78 L78 120" />
    </g>
  </svg>
);

const RatScene = () => (
  <Box sx={sceneLayerStyles}>
    <Box sx={ratStyles}>
      <Rat />
    </Box>
    <Box sx={holeStyles}>
      <Hole />
    </Box>
  </Box>
);

const BulletScene = () => (
  <Box sx={overlayLayerStyles}>
    {[
      { top: "16%", left: "18%" },
      { top: "52%", left: "56%" },
      { top: "82%", left: "32%" },
    ].map((h, i) => (
      <Box key={`streak-${i}`} sx={bulletStreakStyles(h.top, i * 0.18 + 0.05)} />
    ))}
    {[
      { top: "18%", left: "22%" },
      { top: "54%", left: "60%" },
      { top: "84%", left: "36%" },
    ].map((h, i) => (
      <Box key={`hole-${i}`} sx={bulletHoleStyles(h.top, h.left, i * 0.18 + 0.3)} />
    ))}
  </Box>
);

const MonsterScene = () => (
  <Box sx={sceneLayerStyles}>
    <Box sx={monsterStyles}>
      <Monster />
    </Box>
  </Box>
);

const FlickerScene = () => <Box sx={vignetteStyles} />;

const CardsScene = () => (
  <Box sx={sceneLayerStyles}>
    {[
      { left: "6%", rotate: -14, delay: 0 },
      { left: "28%", rotate: 10, delay: 0.12 },
      { left: "48%", rotate: -6, delay: 0.24 },
      { left: "68%", rotate: 14, delay: 0.36 },
      { left: "86%", rotate: -10, delay: 0.48 },
    ].map((c, i) => (
      <Box key={i} sx={cardFallStyles(c.left, c.rotate, c.delay)} />
    ))}
  </Box>
);

const DrunksScene = () => (
  <Box sx={sceneLayerStyles}>
    {[
      { bottom: "-12px", left: "2%", scale: 1, delay: 0 },
      { bottom: "-6px", left: "34%", scale: 0.8, delay: 0.4 },
      { bottom: "-14px", left: "66%", scale: 1.1, delay: 0.8 },
    ].map((d, i) => (
      <Box key={i} sx={drunkStyles(d.bottom, d.left, d.scale, d.delay)}>
        <DrunkBody />
      </Box>
    ))}
  </Box>
);

const CrimeScene = () => (
  <>
    <Box sx={sceneLayerStyles}>
      <Box sx={chalkStyles}>
        <ChalkBody />
      </Box>
    </Box>
    <Box sx={tapeWrapStyles}>
      <Box sx={tapeStyles}>CRIME SCENE — DO NOT CROSS</Box>
    </Box>
  </>
);

export const HomeReveal = () => {
  const [variant] = useState(() => Math.floor(Math.random() * VARIANT_COUNT));

  const scene = (() => {
    switch (variant) {
      case 0:
        return <RatScene />;
      case 1:
        return <BulletScene />;
      case 2:
        return <MonsterScene />;
      case 3:
        return <FlickerScene />;
      case 4:
        return <CardsScene />;
      case 6:
        return <DrunksScene />;
      case 7:
        return <CrimeScene />;
      default:
        return null;
    }
  })();

  const isGlitch = variant === 3;
  const isFalling = variant === 5;

  const titleSx = (
    isGlitch ? [revealTitleStyles, glitchTitleStyles] : revealTitleStyles
  ) as SxProps<Theme>;

  return (
    <Box sx={revealContainerStyles}>
      {scene}

      <Typography variant="h1" sx={titleSx}>
        {TITLE_LINES.map((line, i) =>
          isFalling ? (
            <Box
              key={line.text}
              component="span"
              sx={fallingLineStyles(0.1 + i * 0.16)}
              style={{ color: line.color }}
            >
              {line.text}
            </Box>
          ) : (
            <Box
              key={line.text}
              component="span"
              sx={titleLineStyles}
              style={{ color: line.color }}
            >
              {line.text}
            </Box>
          ),
        )}
      </Typography>
    </Box>
  );
};
