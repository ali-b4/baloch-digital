import LandingPage from "./landing-page";
import RouteTransition from "./route-transition";

export default function Home() {
  return (
    <RouteTransition>
      <LandingPage />
    </RouteTransition>
  );
}
