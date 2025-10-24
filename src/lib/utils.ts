import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const navSections = [
  { id: "parallax", title: "Parallax" },
  { id: "clamp", title: "Clamp" },
  { id: "three", title: "Three" },
  { id: "image-parallax", title: "Image Parallax" },
  { id: "scrolly", title: "Scrolly" },
  { id: "header", title: "Header" },
  { id: "text", title: "Text" },
  { id: "particles", title: "Particles" },
] as const