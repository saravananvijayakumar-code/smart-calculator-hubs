import { lazy, ComponentType } from "react";

const DISABLE_LAZY = import.meta.env.VITE_DISABLE_LAZY === "true";

export function safeLazy<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): T | ReturnType<typeof lazy> {
  if (DISABLE_LAZY) {
    let Component: T | null = null;
    importFn().then((mod) => {
      Component = mod.default;
    });
    return ((props: any) => {
      if (!Component) return null;
      return <Component {...props} />;
    }) as T;
  }
  return lazy(importFn);
}
