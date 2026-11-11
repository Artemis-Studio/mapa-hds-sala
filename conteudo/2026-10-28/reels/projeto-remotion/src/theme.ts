// Tokens do Manual de Identidade Visual Mapa HDS 2025 (design-system/tokens.css).
// Nenhuma cor fora desta lista. Roxo e lilás proibidos.
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadRoboto } from "@remotion/google-fonts/Roboto";

export const C = {
  orange: "#FF560B",
  amber: "#FF971A",
  petrol: "#065156",
  navy: "#162F42",
  red: "#D94021",
  ink: "#1A1A1A",
  white: "#FFFFFF",
  mist: "#E4EEF0",
  teal: "#549EA3",
} as const;

export const POPPINS = loadPoppins("normal", {
  weights: ["500", "700", "800"],
  subsets: ["latin", "latin-ext"],
}).fontFamily;
export const ROBOTO = loadRoboto("normal", {
  weights: ["400", "500"],
  subsets: ["latin", "latin-ext"],
}).fontFamily;

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const sec = (s: number) => Math.round(s * FPS);
