import Link from "next/link";

type SiteHeaderProps = {
  location: "home" | "data" | "entry";
};

export default function SiteHeader({ location }: SiteHeaderProps) {
  const isDataRoom = location !== "home";
  const telemetry = (
    <span
      className={`site-header-status${isDataRoom ? " is-left" : ""}`}
      aria-hidden="true"
    >
      V. 4.0.9
      <br />
      SYNCHRONIZED
    </span>
  );

  return (
    <header className="site-header" style={{ viewTransitionName: "site-header" }}>
      <div className="site-header-inner">
        {isDataRoom ? (
          telemetry
        ) : (
          <Link
            href="/data"
            className="site-header-action"
            transitionTypes={["nav-forward"]}
          >
            Data Room
          </Link>
        )}

        {isDataRoom ? (
          <Link
            href={location === "entry" ? "/data" : "/"}
            className="site-header-action"
            transitionTypes={["nav-back"]}
          >
            Return // {location === "entry" ? "Data Room" : "Home"}
          </Link>
        ) : (
          telemetry
        )}
      </div>
    </header>
  );
}
