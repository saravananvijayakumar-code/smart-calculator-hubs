import { PREFETCH_ROUTES } from "./prefetchRoutes";

export async function backgroundPrefetch() {
  if (typeof window === "undefined") return;

  setTimeout(() => {
    PREFETCH_ROUTES.forEach((path) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = path;
      document.head.appendChild(link);
    });

    const routes = import.meta.glob([
      "../pages/blog/**/*.tsx",
      "../pages/calculators/**/*.tsx",
      "../pages/tools/**/*.tsx",
      "../pages/ai/**/*.tsx",
    ]);

    const routeKeys = Object.keys(routes).slice(0, 10);
    routeKeys.forEach((key) => {
      setTimeout(() => {
        routes[key]().catch((err) => {
          console.warn("Prefetch failed:", key, err);
        });
      }, Math.random() * 5000);
    });
  }, 4000);
}
