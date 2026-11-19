type OrbitDiagramProps = {
  /** "sealed" holds still with a hollow core; "open" turns around a filled one. */
  state?: "open" | "sealed";
};

export default function OrbitDiagram({ state = "open" }: OrbitDiagramProps) {
  return (
    <svg
      className="orbit-diagram"
      data-state={state}
      viewBox="0 0 400 400"
      aria-hidden="true"
    >
      <path className="orbit-axes" d="M-18 200H418M200-18V418" />
      <circle className="orbit-ring" cx="200" cy="200" r="199" />
      <g className="orbit-spin">
        <circle className="orbit-ring-dashed" cx="200" cy="200" r="128" />
        <path
          className="orbit-ticks"
          d="M200 64v16M336 200h-16M200 336v-16M64 200h16"
        />
      </g>
      <g className="orbit-counterspin">
        <circle className="orbit-satellite" cx="200" cy="1" r="2.6" />
      </g>
      <circle className="orbit-core" cx="200" cy="200" r="7" />
    </svg>
  );
}
