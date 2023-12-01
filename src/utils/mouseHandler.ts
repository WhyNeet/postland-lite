export const mouseHandler = (e: MouseEvent, card: HTMLElement) => {
  if (card.matches(":hover")) {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", e.clientX - rect.x - 40 + "px");
    card.style.setProperty("--mouse-y", e.clientY - rect.y - 40 + "px");

    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;

    const percentageY = (centerX - e.clientX) / (centerX - rect.x);
    const percentageX = (centerY - e.clientY) / (centerY - rect.y);

    const maxDegrees = 10;

    card.style.setProperty("--rotate-y", percentageY * maxDegrees + "deg");
    card.style.setProperty("--rotate-x", -percentageX * maxDegrees + "deg");
  }
};
