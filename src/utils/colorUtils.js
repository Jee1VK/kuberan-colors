import { colord, extend } from "colord";
import labPlugin from "colord/plugins/lab";

extend([labPlugin]);

// Color Dictionary with common & expert names
export const COLOR_DICTIONARY = [
  { name: "Crimson", hex: "#DC143C" },
  { name: "Chartreuse", hex: "#7FFF00" },
  { name: "Cerulean", hex: "#007BA7" },
  { name: "Vermilion", hex: "#E34234" },
  { name: "Viridian", hex: "#40826D" },
  { name: "Coral", hex: "#FF7F50" },
  { name: "Electric Indigo", hex: "#6F00FF" },
  { name: "Amber", hex: "#FFBF00" },
  { name: "Teal", hex: "#008080" },
  { name: "Magenta", hex: "#FF00FF" },
  { name: "Periwinkle", hex: "#CCCCFF" },
  { name: "Ochre", hex: "#CC7722" },
  { name: "Celadon", hex: "#ACE1AF" },
  { name: "Ultramarine", hex: "#3F00FF" },
  { name: "Burnt Sienna", hex: "#E97451" }
];

export function getRandomColor() {
  const item = COLOR_DICTIONARY[Math.floor(Math.random() * COLOR_DICTIONARY.length)];
  const c = colord(item.hex);
  const hsl = c.toHsl();
  return {
    name: item.name,
    hex: item.hex.toUpperCase(),
    h: Math.round(hsl.h),
    s: Math.round(hsl.s),
    l: Math.round(hsl.l)
  };
}

export function generateRandomHex() {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 70) + 30;
  const l = Math.floor(Math.random() * 60) + 20;
  const c = colord({ h, s, l });
  return {
    hex: c.toHex().toUpperCase(),
    h, s, l
  };
}

// Perceptual Accuracy Calculation (Scale 0 to 100%)
export function calculateAccuracy(targetHex, guessHex) {
  const c1 = colord(targetHex);
  const c2 = colord(guessHex);
  
  // Perceptual Lab distance proxy
  const lab1 = c1.toLab();
  const lab2 = c2.toLab();
  
  const deltaE = Math.sqrt(
    Math.pow(lab1.l - lab2.l, 2) +
    Math.pow(lab1.a - lab2.a, 2) +
    Math.pow(lab1.b - lab2.b, 2)
  );

  // Map Delta E (0 - 100 max range) to percentage
  const score = Math.max(0, 100 - (deltaE * 1.25));
  return Math.round(score * 10) / 10;
}
