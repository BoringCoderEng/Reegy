// Why permission first: browsers block notifications by default — the
// user must explicitly click "Allow" once.
export function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
}

export function showBrowserNotification(title, body) {
  if ("Notification" in window && Notification.permission === "granted") new Notification(title, { body, icon: "/logo.png" });
}

let audio;
export function playNewOrderSound() {
  if (!audio) audio = new Audio("/sounds/new-order.mp3");
  // Why .catch(): browsers block autoplay until the user interacts with
  // the page at least once — without .catch() a blocked play() throws an
  // unhandled promise rejection in the console.
  audio.play().catch(() => {});
}