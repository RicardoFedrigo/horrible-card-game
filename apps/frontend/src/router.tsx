import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
} from "@tanstack/react-router";
import { RootLayout } from "./layouts/RootLayout";
import { HomePage } from "./pages/Home";
import { GamePage } from "./pages/Game";

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/home" });
  },
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/home",
  component: HomePage,
});

const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/game/$code",
  component: GamePage,
});

const lobbyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/lobby/$code",
  component: GamePage,
});

const routeTree = rootRoute.addChildren([indexRoute, homeRoute, lobbyRoute, gameRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
