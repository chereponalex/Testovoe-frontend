import type { ComponentType, LazyExoticComponent } from "react";

export type Route = {
  key: string;
  path: string;
  component: LazyExoticComponent<ComponentType<any>>;
  authority: string[];
};

export type Routes = Route[];
