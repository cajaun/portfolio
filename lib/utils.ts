import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function formatDate(date: string) {
  const currentDate = new Date().getTime();
  const normalizedDate = date.includes("T") ? date : `${date}T00:00:00`;
  const targetDate = new Date(normalizedDate).getTime();

  if (Number.isNaN(targetDate)) {
    return date;
  }

  const fullDate = new Date(normalizedDate).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeDifference = currentDate - targetDate;

  if (timeDifference < 0) {
    return fullDate;
  }

  const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (daysAgo < 1) {
    return "Today";
  } else if (daysAgo < 7) {
    return `${fullDate} (${daysAgo}d ago)`;
  } else if (daysAgo < 30) {
    const weeksAgo = Math.floor(daysAgo / 7);
    return `${fullDate} (${weeksAgo}w ago)`;
  } else if (daysAgo < 365) {
    const monthsAgo = Math.floor(daysAgo / 30);
    return `${fullDate} (${monthsAgo}mo ago)`;
  } else {
    const yearsAgo = Math.floor(daysAgo / 365);
    return `${fullDate} (${yearsAgo}y ago)`;
  }
}
