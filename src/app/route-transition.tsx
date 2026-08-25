import { type ReactNode, ViewTransition } from "react";

const routeTransitionClasses = {
  "nav-forward": "route-forward",
  "nav-back": "route-back",
  default: "none",
};

export default function RouteTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={routeTransitionClasses}
      exit={routeTransitionClasses}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
