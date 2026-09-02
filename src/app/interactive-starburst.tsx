"use client";

import { useEffect, useRef } from "react";

const TAU = Math.PI * 2;
const POINT_COUNT = 108;
const FALLBACK_SIZE = 1000;
const REFERENCE_SIZE = 800;
const FIXED_STEP = 1 / 120;
const MAX_FRAME_TIME = 1 / 20;
const SPRING_FREQUENCY = 12;
const SPRING_DAMPING = 0.88;

type PointSeed = {
  angle: number;
  distance: number;
  dotRadius: number;
  accent: boolean;
};

type Particle = PointSeed & {
  homeX: number;
  homeY: number;
  targetX: number;
  targetY: number;
  targetInfluence: number;
  repulsionX: number;
  repulsionY: number;
  previousX: number;
  previousY: number;
  previousInfluence: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  influence: number;
};

type PointerField = {
  active: boolean;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
};

type Palette = {
  graphite: string;
  sage: string;
  paleSage: string;
};

function createRandom(seed: number) {
  let value = seed >>> 0;

  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function createPointSeeds() {
  const random = createRandom(0xb410c4);

  return Array.from({ length: POINT_COUNT }, (_, index): PointSeed => {
    const angleJitter = (random() - 0.5) * 0.88;
    const angle = ((index + 0.5 + angleJitter) / POINT_COUNT) * TAU - Math.PI / 2;
    const longRay = index % 13 === 0 || index % 29 === 0;
    const innerRay = index % 17 === 0;
    const distance = innerRay
      ? 0.105 + random() * 0.105
      : longRay
        ? 0.425 + random() * 0.058
        : 0.145 + Math.pow(random(), 0.78) * 0.302;
    const dotRadius =
      1.3 + Math.pow(random(), 1.7) * 1.25 + (index % 11 === 0 ? 0.55 : 0);

    return {
      angle,
      distance,
      dotRadius,
      accent: index % 9 === 0 || index % 23 === 0,
    };
  });
}

const POINT_SEEDS = createPointSeeds();

function projectSeed(seed: PointSeed, width: number, height: number) {
  const extent = Math.min(width, height);
  const centerX = width / 2;
  const centerY = height / 2;

  return {
    x: centerX + Math.cos(seed.angle) * seed.distance * extent,
    y: centerY + Math.sin(seed.angle) * seed.distance * extent,
  };
}

function appendCircle(path: string[], x: number, y: number, radius: number) {
  path.push(
    `M${(x - radius).toFixed(2)} ${y.toFixed(2)}a${radius.toFixed(2)} ${radius.toFixed(2)} 0 1 0 ${(radius * 2).toFixed(2)} 0a${radius.toFixed(2)} ${radius.toFixed(2)} 0 1 0 ${(-radius * 2).toFixed(2)} 0`,
  );
}

function createFallbackGeometry() {
  const center = FALLBACK_SIZE / 2;
  const coreRadius = 10.5;
  const graphiteLines: string[] = [];
  const sageLines: string[] = [];
  const graphiteDots: string[] = [];
  const sageDots: string[] = [];

  POINT_SEEDS.forEach((seed) => {
    const point = projectSeed(seed, FALLBACK_SIZE, FALLBACK_SIZE);
    const deltaX = point.x - center;
    const deltaY = point.y - center;
    const distance = Math.hypot(deltaX, deltaY) || 1;
    const startX = center + (deltaX / distance) * coreRadius;
    const startY = center + (deltaY / distance) * coreRadius;
    const linePath = seed.accent ? sageLines : graphiteLines;
    const dotPath = seed.accent ? sageDots : graphiteDots;
    const radius = seed.dotRadius * (FALLBACK_SIZE / REFERENCE_SIZE);

    linePath.push(
      `M${startX.toFixed(2)} ${startY.toFixed(2)}L${point.x.toFixed(2)} ${point.y.toFixed(2)}`,
    );
    appendCircle(dotPath, point.x, point.y, radius);
  });

  return {
    graphiteLines: graphiteLines.join(""),
    sageLines: sageLines.join(""),
    graphiteDots: graphiteDots.join(""),
    sageDots: sageDots.join(""),
  };
}

const FALLBACK_GEOMETRY = createFallbackGeometry();

function smoothstep(value: number) {
  return value * value * (3 - 2 * value);
}

function readPalette(): Palette {
  const styles = getComputedStyle(document.documentElement);
  const read = (property: string, fallback: string) =>
    styles.getPropertyValue(property).trim() || fallback;

  return {
    graphite: read("--foreground", "#1f1e1b"),
    sage: read("--accent-green-ink", "#435a49"),
    paleSage: read("--accent-green", "#c0cfbb"),
  };
}

export default function InteractiveStarburst() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const interactionSurface = stage?.closest<HTMLElement>(".hero");

    if (!stage || !canvas || !interactionSurface) {
      return;
    }

    const context = canvas.getContext("2d", { alpha: true });

    if (!context) {
      return;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointerQuery = window.matchMedia("(any-hover: hover) and (any-pointer: fine)");
    const palette = readPalette();
    const pointer: PointerField = {
      active: false,
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let particles: Particle[] = [];
    let frameId = 0;
    let previousTime = 0;
    let accumulator = 0;
    let isVisible = true;
    let canInteract = finePointerQuery.matches && !reducedMotionQuery.matches;

    const getInfluenceRadius = () => Math.min(152, Math.max(108, Math.min(width, height) * 0.18));
    const getMaxDisplacement = () =>
      Math.min(46, Math.max(30, Math.min(width, height) * 0.058));

    const updateTarget = (
      particle: Particle,
      influenceRadius: number,
      maxDisplacement: number,
    ) => {
      if (!pointer.active || !canInteract) {
        particle.targetX = particle.homeX;
        particle.targetY = particle.homeY;
        particle.targetInfluence = 0;
        return;
      }

      const deltaX = particle.homeX - pointer.x;
      const deltaY = particle.homeY - pointer.y;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance >= influenceRadius) {
        particle.targetX = particle.homeX;
        particle.targetY = particle.homeY;
        particle.targetInfluence = 0;
        return;
      }

      const radialX = Math.cos(particle.angle);
      const radialY = Math.sin(particle.angle);
      let directionX = particle.repulsionX;
      let directionY = particle.repulsionY;

      if (distance > 0.0001) {
        const normalizedX = deltaX / distance;
        const normalizedY = deltaY / distance;
        const directionBlend = smoothstep(Math.min(1, distance / 6));
        const blendedX = directionX + (normalizedX - directionX) * directionBlend;
        const blendedY = directionY + (normalizedY - directionY) * directionBlend;
        const blendedLength = Math.hypot(blendedX, blendedY);

        if (blendedLength > 0.0001) {
          directionX = blendedX / blendedLength;
          directionY = blendedY / blendedLength;
        } else {
          directionX = radialX;
          directionY = radialY;
        }

        particle.repulsionX = directionX;
        particle.repulsionY = directionY;
      }

      const fieldStrength = smoothstep(1 - distance / influenceRadius);
      const requestedDisplacement = maxDisplacement * fieldStrength;
      const dotScale = Math.max(0.8, Math.min(width, height) / REFERENCE_SIZE);
      const edgePadding = particle.dotRadius * dotScale + 1.5;
      let displacement = requestedDisplacement;

      if (directionX > 0.0001) {
        displacement = Math.min(displacement, (width - edgePadding - particle.homeX) / directionX);
      } else if (directionX < -0.0001) {
        displacement = Math.min(displacement, (edgePadding - particle.homeX) / directionX);
      }

      if (directionY > 0.0001) {
        displacement = Math.min(displacement, (height - edgePadding - particle.homeY) / directionY);
      } else if (directionY < -0.0001) {
        displacement = Math.min(displacement, (edgePadding - particle.homeY) / directionY);
      }

      displacement = Math.max(0, displacement);

      particle.targetX = particle.homeX + directionX * displacement;
      particle.targetY = particle.homeY + directionY * displacement;
      particle.targetInfluence = fieldStrength;
    };

    const draw = (interpolation = 1) => {
      if (width <= 0 || height <= 0) {
        return;
      }

      const centerX = width / 2;
      const centerY = height / 2;
      const extentScale = Math.max(0.8, Math.min(width, height) / REFERENCE_SIZE);
      const coreRadius = Math.min(9, Math.max(6, Math.min(width, height) * 0.0115));

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);
      context.lineCap = "round";
      context.lineWidth = 0.72;

      const traceLines = (accent: boolean) => {
        context.beginPath();

        particles.forEach((particle) => {
          if (particle.accent !== accent) {
            return;
          }

          const renderX = particle.previousX + (particle.x - particle.previousX) * interpolation;
          const renderY = particle.previousY + (particle.y - particle.previousY) * interpolation;
          const deltaX = renderX - centerX;
          const deltaY = renderY - centerY;
          const distance = Math.hypot(deltaX, deltaY) || 1;
          const lineStart = coreRadius + 0.8;

          context.moveTo(
            centerX + (deltaX / distance) * lineStart,
            centerY + (deltaY / distance) * lineStart,
          );
          context.lineTo(renderX, renderY);
        });

        context.globalAlpha = accent ? 0.3 : 0.23;
        context.strokeStyle = accent ? palette.sage : palette.graphite;
        context.stroke();
      };

      traceLines(false);
      traceLines(true);

      context.globalAlpha = 1;
      context.fillStyle = palette.paleSage;
      context.strokeStyle = palette.sage;
      context.lineWidth = 0.8;
      context.beginPath();
      context.arc(centerX, centerY, coreRadius, 0, TAU);
      context.fill();
      context.stroke();

      const traceDots = (accent: boolean) => {
        context.beginPath();

        particles.forEach((particle) => {
          if (particle.accent !== accent) {
            return;
          }

          const radius = particle.dotRadius * extentScale;
          const renderX = particle.previousX + (particle.x - particle.previousX) * interpolation;
          const renderY = particle.previousY + (particle.y - particle.previousY) * interpolation;
          context.moveTo(renderX + radius, renderY);
          context.arc(renderX, renderY, radius, 0, TAU);
        });

        context.globalAlpha = accent ? 0.94 : 0.88;
        context.fillStyle = accent ? palette.sage : palette.graphite;
        context.fill();
      };

      traceDots(false);
      traceDots(true);

      particles.forEach((particle) => {
        const renderInfluence =
          particle.previousInfluence +
          (particle.influence - particle.previousInfluence) * interpolation;

        if (renderInfluence < 0.025) {
          return;
        }

        const renderX = particle.previousX + (particle.x - particle.previousX) * interpolation;
        const renderY = particle.previousY + (particle.y - particle.previousY) * interpolation;
        const radius = particle.dotRadius * extentScale * (1 + renderInfluence * 0.16);
        context.globalAlpha = renderInfluence * 0.86;
        context.fillStyle = palette.sage;
        context.beginPath();
        context.arc(renderX, renderY, radius, 0, TAU);
        context.fill();
      });

    };

    const resetParticles = (nextWidth: number, nextHeight: number) => {
      particles = POINT_SEEDS.map((seed) => {
        const home = projectSeed(seed, nextWidth, nextHeight);

        return {
          ...seed,
          homeX: home.x,
          homeY: home.y,
          targetX: home.x,
          targetY: home.y,
          targetInfluence: 0,
          repulsionX: Math.cos(seed.angle),
          repulsionY: Math.sin(seed.angle),
          previousX: home.x,
          previousY: home.y,
          previousInfluence: 0,
          x: home.x,
          y: home.y,
          velocityX: 0,
          velocityY: 0,
          influence: 0,
        };
      });
    };

    const resize = () => {
      const nextWidth = stage.clientWidth;
      const nextHeight = stage.clientHeight;

      if (nextWidth <= 0 || nextHeight <= 0) {
        return;
      }

      const nextPixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const dimensionsChanged = nextWidth !== width || nextHeight !== height;
      const densityChanged = nextPixelRatio !== pixelRatio;

      if (!dimensionsChanged && !densityChanged) {
        return;
      }

      if (dimensionsChanged) {
        pointer.active = false;
        resetParticles(nextWidth, nextHeight);
      }

      width = nextWidth;
      height = nextHeight;
      pixelRatio = nextPixelRatio;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      draw();
      stage.classList.toggle("is-interactive", canInteract);
    };

    const simulate = (step: number) => {
      const pointerFollow = 1 - Math.exp(-28 * step);

      if (pointer.active && canInteract) {
        pointer.x += (pointer.targetX - pointer.x) * pointerFollow;
        pointer.y += (pointer.targetY - pointer.y) * pointerFollow;
      }

      const spring = SPRING_FREQUENCY * SPRING_FREQUENCY;
      const damping = 2 * SPRING_DAMPING * SPRING_FREQUENCY;
      const influenceFollow = 1 - Math.exp(-18 * step);
      const influenceRadius = getInfluenceRadius();
      const maxDisplacement = getMaxDisplacement();

      particles.forEach((particle) => {
        particle.previousX = particle.x;
        particle.previousY = particle.y;
        particle.previousInfluence = particle.influence;
        updateTarget(particle, influenceRadius, maxDisplacement);
        const accelerationX =
          spring * (particle.targetX - particle.x) - damping * particle.velocityX;
        const accelerationY =
          spring * (particle.targetY - particle.y) - damping * particle.velocityY;

        particle.velocityX += accelerationX * step;
        particle.velocityY += accelerationY * step;
        particle.x += particle.velocityX * step;
        particle.y += particle.velocityY * step;
        particle.influence +=
          (particle.targetInfluence - particle.influence) * influenceFollow;
      });
    };

    const isSettled = () => {
      const pointerSettled =
        !pointer.active ||
        Math.hypot(pointer.targetX - pointer.x, pointer.targetY - pointer.y) < 0.08;

      if (!pointerSettled) {
        return false;
      }

      return particles.every((particle) => {
        const positionError = Math.hypot(
          particle.targetX - particle.x,
          particle.targetY - particle.y,
        );
        const speed = Math.hypot(particle.velocityX, particle.velocityY);
        return (
          positionError < 0.045 &&
          speed < 0.45 &&
          Math.abs(particle.targetInfluence - particle.influence) < 0.003
        );
      });
    };

    const frame = (time: number) => {
      frameId = 0;

      if (!isVisible || document.hidden) {
        return;
      }

      const elapsed = previousTime
        ? Math.min((time - previousTime) / 1000, MAX_FRAME_TIME)
        : FIXED_STEP;
      previousTime = time;
      accumulator = Math.min(accumulator + elapsed, MAX_FRAME_TIME);

      while (accumulator >= FIXED_STEP) {
        simulate(FIXED_STEP);
        accumulator -= FIXED_STEP;
      }

      const settled = isSettled();
      draw(settled ? 1 : Math.min(1, accumulator / FIXED_STEP));

      if (!settled) {
        frameId = window.requestAnimationFrame(frame);
      } else {
        previousTime = 0;
        accumulator = 0;
      }
    };

    const wake = () => {
      if (frameId || !isVisible || document.hidden) {
        return;
      }

      previousTime = 0;
      accumulator = 0;
      frameId = window.requestAnimationFrame(frame);
    };

    const settleImmediately = () => {
      pointer.active = false;
      particles.forEach((particle) => {
        particle.x = particle.homeX;
        particle.y = particle.homeY;
        particle.targetX = particle.homeX;
        particle.targetY = particle.homeY;
        particle.targetInfluence = 0;
        particle.previousX = particle.homeX;
        particle.previousY = particle.homeY;
        particle.previousInfluence = 0;
        particle.velocityX = 0;
        particle.velocityY = 0;
        particle.influence = 0;
      });

      if (frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }

      previousTime = 0;
      accumulator = 0;
      draw();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!canInteract || event.pointerType === "touch") {
        return;
      }

      if (Math.min(window.devicePixelRatio || 1, 2) !== pixelRatio) {
        resize();
      }

      const bounds = stage.getBoundingClientRect();

      if (bounds.width <= 0 || bounds.height <= 0) {
        return;
      }

      const nextX = ((event.clientX - bounds.left) / bounds.width) * width;
      const nextY = ((event.clientY - bounds.top) / bounds.height) * height;

      if (!pointer.active) {
        pointer.x = nextX;
        pointer.y = nextY;
      }

      pointer.active = true;
      pointer.targetX = nextX;
      pointer.targetY = nextY;
      wake();
    };

    const handlePointerLeave = () => {
      if (!pointer.active) {
        return;
      }

      pointer.active = false;
      wake();
    };

    const handleMediaChange = () => {
      canInteract = finePointerQuery.matches && !reducedMotionQuery.matches;
      stage.classList.toggle("is-interactive", canInteract);

      if (!canInteract) {
        settleImmediately();
      } else {
        draw();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        pointer.active = false;
        if (frameId) {
          window.cancelAnimationFrame(frameId);
          frameId = 0;
        }
        previousTime = 0;
        accumulator = 0;
        return;
      }

      if (isVisible) {
        wake();
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;

        if (!isVisible) {
          pointer.active = false;
          if (frameId) {
            window.cancelAnimationFrame(frameId);
            frameId = 0;
          }
          previousTime = 0;
          accumulator = 0;
        } else {
          wake();
        }
      },
      { threshold: 0.01 },
    );

    resize();
    resizeObserver.observe(stage);
    visibilityObserver.observe(stage);
    interactionSurface.addEventListener("pointermove", handlePointerMove, { passive: true });
    interactionSurface.addEventListener("pointerleave", handlePointerLeave);
    interactionSurface.addEventListener("pointercancel", handlePointerLeave);
    window.addEventListener("scroll", handlePointerLeave, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotionQuery.addEventListener("change", handleMediaChange);
    finePointerQuery.addEventListener("change", handleMediaChange);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      interactionSurface.removeEventListener("pointermove", handlePointerMove);
      interactionSurface.removeEventListener("pointerleave", handlePointerLeave);
      interactionSurface.removeEventListener("pointercancel", handlePointerLeave);
      window.removeEventListener("scroll", handlePointerLeave);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotionQuery.removeEventListener("change", handleMediaChange);
      finePointerQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  return (
    <div ref={stageRef} className="starburst-stage">
      <svg
        className="starburst-fallback"
        viewBox={`0 0 ${FALLBACK_SIZE} ${FALLBACK_SIZE}`}
        fill="none"
        aria-hidden="true"
      >
        <path d={FALLBACK_GEOMETRY.graphiteLines} className="starburst-lines-graphite" />
        <path d={FALLBACK_GEOMETRY.sageLines} className="starburst-lines-sage" />
        <path d={FALLBACK_GEOMETRY.graphiteDots} className="starburst-dots-graphite" />
        <path d={FALLBACK_GEOMETRY.sageDots} className="starburst-dots-sage" />
        <circle cx="500" cy="500" r="10.5" className="starburst-core-field" />
      </svg>
      <canvas ref={canvasRef} className="starburst-canvas" aria-hidden="true" />
    </div>
  );
}
