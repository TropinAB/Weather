import { RouteArgs } from "../types/Router";

type RouteMatchFunction = (path: string) => boolean;
type RouteType = RegExp | string | RouteMatchFunction;
type RouteOnEnter = (args: RouteArgs) => void;

type RouteData = {
  route: RouteType;
  onEnter: RouteOnEnter;
};

export class Router {
  private routes: RouteData[] = [];
  private currentPath: string = location.pathname;
  private previousPath: string | null = null;

  constructor() {
    window.addEventListener("popstate", this.processAllRoutes);
  }

  private isMatch(route: RouteType, path: string): boolean {
    return (
      (route instanceof RegExp && route.test(path)) ||
      (typeof route === "function" && (route as RouteMatchFunction)(path)) ||
      (typeof route === "string" && route === path)
    );
  }

  private processRoute(routeData: RouteData): void {
    const args: RouteArgs = {
      currentPath: this.currentPath,
      previousPath: this.previousPath,
      state: history.state,
    };

    routeData.onEnter &&
      this.isMatch(routeData.route, this.currentPath) &&
      routeData.onEnter(args);
  }

  private processAllRoutes(): void {
    this.routes.forEach(this.processRoute);
  }

  public on(route: RouteType, onEnter: RouteOnEnter): void {
    const routeData = { route, onEnter };
    this.routes.push(routeData);
    this.processRoute(routeData);
  }

  public go(url: string, state: Object): void {
    this.previousPath = this.currentPath;
    history.pushState(state, url, url);
    this.currentPath = location.pathname;

    this.processAllRoutes();
  }
}
