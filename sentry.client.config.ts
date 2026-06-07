const initSentry = () => {
  import("@sentry/nextjs").then((Sentry) => {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
      tracesSampleRate: 0.05,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 1.0,
    });
  });
};

if (typeof window !== "undefined") {
  // Defer until after page is interactive + 3 second buffer
  if (document.readyState === "complete") {
    setTimeout(initSentry, 3000);
  } else {
    window.addEventListener("load", () => setTimeout(initSentry, 3000));
  }
}
