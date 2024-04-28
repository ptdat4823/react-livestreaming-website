import { clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatTime = (seconds) => {
  if (isNaN(seconds)) return "00:00";
  if (seconds < 0) return "00:00";
  const time = new Date(seconds * 1000);
  if (seconds > 3600) return format(time, "HH:mm:ss");
  return format(time, "mm:ss");
};
