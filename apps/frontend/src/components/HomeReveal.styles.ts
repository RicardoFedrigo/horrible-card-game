import type { SxProps, Theme } from "@mui/material";

export const revealContainerStyles: SxProps<Theme> = {
  position: "relative",
  display: "inline-block",
  zIndex: 1,
  mb: 2,
  overflow: "visible",
};

export const revealTitleStyles: SxProps<Theme> = {
  fontSize: { xs: "3rem", md: "4.5rem" },
  letterSpacing: "-0.02em",
  lineHeight: 1.1,
  position: "relative",
  zIndex: 1,
  animation: "hcg-title-fade 0.7s ease-out both",
};

export const titleLineStyles: SxProps<Theme> = {
  display: "block",
};

export const sceneLayerStyles: SxProps<Theme> = {
  position: "absolute",
  inset: 0,
  zIndex: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none",
  overflow: "visible",
};

export const overlayLayerStyles: SxProps<Theme> = {
  position: "absolute",
  inset: 0,
  zIndex: 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none",
  overflow: "visible",
};

export const fallingLineStyles = (delay: number): SxProps<Theme> => ({
  display: "block",
  animation: "hcg-letter-drop 0.6s cubic-bezier(0.2, 0.8, 0.3, 1.2) both",
  animationDelay: `${delay}s`,
});

export const ratStyles: SxProps<Theme> = {
  position: "absolute",
  bottom: 4,
  left: "50%",
  marginLeft: "-140px",
  animation: "hcg-rat-run 1.7s ease-in-out forwards",
};

export const holeStyles: SxProps<Theme> = {
  position: "absolute",
  bottom: -6,
  right: -20,
};

export const bulletStreakStyles = (top: string, delay: number): SxProps<Theme> => ({
  position: "absolute",
  top,
  left: -40,
  width: 110,
  height: 3,
  borderRadius: 2,
  background:
    "linear-gradient(90deg, transparent 0%, #e6e0c8 55%, #b3542f 100%)",
  boxShadow: "0 0 8px rgba(230, 224, 200, 0.9)",
  animation: "hcg-bullet-fly 0.5s linear both",
  animationDelay: `${delay}s`,
});

export const bulletHoleStyles = (
  top: string,
  left: string,
  delay: number,
): SxProps<Theme> => ({
  position: "absolute",
  top,
  left,
  width: 16,
  height: 16,
  borderRadius: "50%",
  background: "radial-gradient(circle at 35% 30%, #000 0%, #060705 55%, #2b2b2b 100%)",
  boxShadow:
    "0 0 0 2px rgba(20, 22, 16, 0.9), 0 0 6px rgba(0, 0, 0, 0.9), inset 0 1px 1px rgba(255,255,255,0.15)",
  animation: "hcg-bullet-hole 0.25s ease-out both",
  animationDelay: `${delay}s`,
});

export const monsterStyles: SxProps<Theme> = {
  width: { xs: 180, md: 240 },
  height: "auto",
  filter: "drop-shadow(0 6px 24px rgba(123, 63, 110, 0.5))",
  animation: "hcg-monster 2.8s ease-in-out infinite",
};

export const vignetteStyles: SxProps<Theme> = {
  position: "absolute",
  inset: -40,
  zIndex: 0,
  pointerEvents: "none",
  background:
    "radial-gradient(ellipse at center, transparent 40%, rgba(179, 84, 47, 0.55) 100%)",
  animation: "hcg-vignette-pulse 1.6s ease-in-out infinite",
};

export const glitchTitleStyles: SxProps<Theme> = {
  animation: "hcg-flicker 2s steps(1, end) infinite, hcg-glitch-shift 0.4s infinite",
};

export const cardFallStyles = (
  left: string,
  rotate: number,
  delay: number,
): SxProps<Theme> => ({
  position: "absolute",
  top: -30,
  left,
  width: 42,
  height: 60,
  borderRadius: "4px",
  background: "#d8cfae",
  border: "1px solid rgba(0,0,0,0.25)",
  boxShadow: "0 8px 18px rgba(0,0,0,0.35)",
  "--r": `${rotate}deg`,
  animation: "hcg-card-fall 1s ease-in both",
  animationDelay: `${delay}s`,
} as SxProps<Theme>);

export const drunkStyles = (
  bottom: string,
  left: string,
  scale: number,
  delay: number,
): SxProps<Theme> => ({
  position: "absolute",
  bottom,
  left,
  transformOrigin: "center bottom",
  animation: "hcg-drunk-sway 3s ease-in-out infinite",
  animationDelay: `${delay}s`,
  transform: `scale(${scale})`,
});

export const tapeWrapStyles: SxProps<Theme> = {
  position: "absolute",
  top: -10,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 2,
};

export const tapeStyles: SxProps<Theme> = {
  display: "inline-block",
  padding: "2px 14px",
  color: "#141414",
  fontSize: "0.7rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  whiteSpace: "nowrap",
  background:
    "repeating-linear-gradient(45deg, #e6c229 0px, #e6c229 16px, #141414 16px, #141414 32px)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
  transformOrigin: "center",
  animation: "hcg-tape-sway 2.4s ease-in-out infinite",
};

export const chalkStyles: SxProps<Theme> = {
  position: "absolute",
  bottom: -8,
  left: "50%",
  transform: "translateX(-50%)",
  animation: "hcg-chalk-fade 1.4s ease-out both",
};
