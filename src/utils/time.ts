export const timeSince = (date: Date) => {
  const ms = Date.now() - date.getTime();

  const seconds = Math.floor(ms / 1000);
  if (seconds < 10) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 1) return seconds + "s";
  const hours = Math.floor(minutes / 60);
  if (hours < 1) return minutes + "m";
  const days = Math.floor(hours / 24);
  if (days < 1) return hours + "h";
  const weeks = Math.floor(days / 7);
  if (weeks < 1) return days + "d";
  const months = Math.floor(weeks / 4.34524);
  if (months < 1) return weeks + "w";
  const years = Math.floor(months / 12);
  if (years < 1) return months + "mo";
  return years + "y";
};
