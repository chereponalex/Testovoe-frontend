import { lazy } from "react";
import type { Routes } from "@/@types/routes";
import routePrefix from "./route-prefix.config";

export const protectedRoutes: Routes = [
  {
    key: "home",
    path: routePrefix.home,
    component: lazy(() => import("@/views/PatientsPage")),
    authority: [],
  },
  {
    key: "main-page",
    path: routePrefix.mainPage,
    component: lazy(() => import("@/views/ContactsPage")),
    authority: [],
  },
];
