"use client";

import * as React from "react";
import * as THREE from "three";

import { cn } from "@/lib/utils";

import styles from "./compass-sphere.module.css";

/**
 * Ported from the Figma Make "GB_Interaction_Compass-Data-Visualization"
 * prototype (https://www.figma.com/make/HdX0Ax0ci2ll4V2YMDsBTJ).
 *
 * An immersive visualization that draws 1200 particles distributed in a
 * sphere shape using three.js. Interaction:
 * - When the mouse enters the sphere's on-screen projected area
 *   (`isInSphere`), particle color gradually mixes and brightens from
 *   `--color-sphere-particle` to `--color-sphere-particle-hover`, and the
 *   particles cohere toward the sphere's surface.
 * - When the mouse comes close to an individual particle (`isOnParticle`),
 *   a pill badge appears and follows that particle, cycling through labels
 *   each time the mouse moves to a new particle.
 * - The background always moves subtly via per-axis rotation plus a
 *   noise-based wave.
 *
 * The background/badge are always a visualization on a dark background
 * regardless of the app theme (the original Figma Make file also has a
 * fixed black background), so they reference primitive tokens
 * (`--color-neutral-950`/`--color-neutral-50`) directly instead of
 * theme-responsive semantic tokens. The particle colors
 * (`--color-sphere-particle*`) were registered as new raw tokens (see
 * `src/tokens/colors.css`) because the Figma Make file is a file type that
 * doesn't support `get_variable_defs`, so they couldn't be cross-checked
 * against the original variables.
 *
 * The dotted background isn't drawn by this component — it's drawn by the
 * shared parent container in `app/compass/page.tsx`. Measuring against
 * Figma confirmed that background isn't specific to `CompassSphere`; it's a
 * page-level layer applied in common across all 5 Home/Analysis states.
 * Because the WebGL canvas itself uses `alpha: true` with a transparent
 * clearColor, this component shows the parent's dotted background through
 * as-is even without a background of its own.
 *
 * The original code kept `badgeLabelIndex`/`lastHoveredParticleIndex` as
 * module-scope globals, which would let state leak across instances if this
 * component were mounted more than once, so they were moved to per-instance
 * `useRef`s (behavior is unchanged; only reusability was fixed).
 */

const BADGE_LABELS = [
  "Gabrielle.ai",
  "Self",
  "Assets",
  "Personal Branding",
  "Know thyself",
];

/** Physics simulation geometry constants — particle distribution/motion calculation values, not design tokens */
const RADIUS = 3.68;
const PARTICLE_COUNT = 1200;
const WAVE_INTENSITY = 0.12;
const BREATHING_SPEED = 0.3;
const BREATHING_STRENGTH = 0.0;
const COHESION = 0.9;
const ROTATION_SPEED = 0.06;
const WAVE_CHAOS = 0.08;
const PARTICLE_SCALE = 1.0;
const PARTICLE_VARIABILITY = 0.3;
const PARTICLE_THRESHOLD = 0.06;

interface Particle {
  originalPosition: number[];
  position: number[];
  size: number;
  mass: number;
  phaseOffset: number;
  distanceRatio: number;
  breathingFactor: number;
  noiseOffset: number;
  velocity: number[];
}

function buildParticles(): Particle[] {
  const particles: Particle[] = [];

  const maxS = 0.84;
  const minS = 0.2;

  const addParticle = (
    x: number,
    y: number,
    z: number,
    dist: number,
    isPeriphery = false,
  ) => {
    const jitter =
      (isPeriphery ? 0.15 : 0.15 * (0.5 + 0.5 * (dist / RADIUS))) * RADIUS;
    const off = isPeriphery ? 0.15 : 0.1 + 0.2 * Math.random();
    const df = isPeriphery
      ? 0.6 + 0.4 * Math.random()
      : 0.2 + 0.8 * (dist / RADIUS);
    const sf = isPeriphery ? 1 : 0.3 + 0.7 * df;
    particles.push({
      originalPosition: [
        x + (Math.random() - 0.5) * off * RADIUS,
        y + (Math.random() - 0.5) * off * RADIUS,
        z + (Math.random() - 0.5) * off * RADIUS,
      ],
      position: [
        x + (Math.random() - 0.5) * jitter,
        y + (Math.random() - 0.5) * jitter,
        z + (Math.random() - 0.5) * jitter,
      ],
      size: minS + (maxS - minS) * sf * Math.random(),
      mass: isPeriphery
        ? 0.5 + 0.7 * Math.random()
        : 0.6 + 0.8 * (1 - 0.3 * (dist / RADIUS)) + 0.3 * Math.random(),
      phaseOffset: Math.random() * Math.PI * 2,
      distanceRatio: isPeriphery ? 0.9 + 0.1 * Math.random() : dist / RADIUS,
      breathingFactor: isPeriphery
        ? 1.0 + 0.3 * Math.random()
        : 0.8 + 0.4 * Math.random(),
      noiseOffset: Math.random() * 100,
      velocity: [0, 0, 0],
    });
  };

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const r = RADIUS * Math.cbrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    addParticle(x, y, z, Math.sqrt(x * x + y * y + z * z));
  }

  const peripheryCount = Math.floor(PARTICLE_COUNT * 0.12);
  for (let i = 0; i < peripheryCount; i++) {
    const r = RADIUS * (0.72 + 0.22 * Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    addParticle(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi),
      r,
      true,
    );
  }

  return particles;
}

export interface CompassSphereProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {}

export function CompassSphere({ className, ...props }: CompassSphereProps) {
  const mountRef = React.useRef<HTMLDivElement>(null);
  const badgeRef = React.useRef<HTMLDivElement>(null);
  const badgeLabelRef = React.useRef<HTMLParagraphElement>(null);
  const stateRef = React.useRef({
    audioLevel: 0,
    hoverIntensity: 0,
    colorIntensity: 0,
    isInSphere: false,
    isOnParticle: false,
    mouse: { x: 0, y: 0 },
  });
  const badgeLabelIndexRef = React.useRef(0);
  const lastHoveredParticleIndexRef = React.useRef(-1);

  React.useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const startTime = performance.now();
    const elapsed = () => (performance.now() - startTime) / 1000;

    const mountStyle = getComputedStyle(mount);
    const particleColor = mountStyle
      .getPropertyValue("--color-sphere-particle")
      .trim();
    const particleHoverColor = mountStyle
      .getPropertyValue("--color-sphere-particle-hover")
      .trim();

    // In environments without WebGL (test jsdom, browsers with GPU disabled,
    // etc.), skip the visualization — the badge/background are already
    // rendered via CSS, so only the sphere itself is omitted.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
    } catch {
      return;
    }
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 12);

    const particles = buildParticles();
    const positions = new Float32Array(particles.length * 3);
    const sizes = new Float32Array(particles.length);
    particles.forEach((p, i) => {
      positions[i * 3] = p.position[0];
      positions[i * 3 + 1] = p.position[1];
      positions[i * 3 + 2] = p.position[2];
      sizes[i] = p.size;
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(particleColor) },
        uHoverColor: { value: new THREE.Color(particleHoverColor) },
        uHoverIntensity: { value: 0.0 },
      },
      vertexShader: `
        attribute float size;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uHoverColor;
        uniform float uHoverIntensity;
        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;
          float alpha = (1.0 - smoothstep(0.3, 0.5, dist)) * (0.92 + uHoverIntensity * 0.15);
          vec3 finalColor = mix(uColor, uHoverColor, uHoverIntensity);
          float brightness = 1.0 + uHoverIntensity * 0.45;
          gl_FragColor = vec4(finalColor * brightness, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const onMouseMove = (e: MouseEvent) => {
      const s = stateRef.current;
      s.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      s.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let audioFrame: number;
    const tickAudio = () => {
      const t = elapsed();
      const level =
        ((Math.sin(t * 0.8) + 1) / 2) * 0.5 +
        ((Math.sin(t * 2.1) + 1) / 2) * 0.3 +
        ((Math.sin(t * 5.5) + 1) / 2) * 0.2;
      stateRef.current.audioLevel =
        stateRef.current.audioLevel * 0.9 + level * 0.08;
      audioFrame = requestAnimationFrame(tickAudio);
    };
    tickAudio();

    const dir = new THREE.Vector3();
    const projV = new THREE.Vector3();

    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const s = stateRef.current;
      const t = elapsed();

      // Sphere boundary: project sphere to screen ellipse, check if mouse is inside
      const aspect = mount.clientWidth / mount.clientHeight;
      const projRy = RADIUS / (12 * Math.tan((45 * Math.PI) / 360));
      const projRx = projRy / aspect;
      const inSphere =
        (s.mouse.x / projRx) ** 2 + (s.mouse.y / projRy) ** 2 < 1;
      s.isInSphere = inSphere;

      // Particle proximity detection (badge only)
      let onParticle = false;
      let hoveredNdcX = 0;
      let hoveredNdcY = 0;
      let hoveredParticleIndex = -1;
      for (let i = 0; i < particles.length; i += 3) {
        const p = particles[i];
        projV.set(p.position[0], p.position[1], p.position[2]);
        projV.applyMatrix4(points.matrixWorld);
        projV.project(camera);
        const dx = projV.x - s.mouse.x;
        const dy = projV.y - s.mouse.y;
        if (dx * dx + dy * dy < PARTICLE_THRESHOLD * PARTICLE_THRESHOLD) {
          onParticle = true;
          hoveredNdcX = projV.x;
          hoveredNdcY = projV.y;
          hoveredParticleIndex = i;
          break;
        }
      }
      s.isOnParticle = onParticle;

      // Badge position update
      const badge = badgeRef.current;
      const badgeText = badgeLabelRef.current;
      if (badge) {
        if (onParticle) {
          if (hoveredParticleIndex !== lastHoveredParticleIndexRef.current) {
            lastHoveredParticleIndexRef.current = hoveredParticleIndex;
            badgeLabelIndexRef.current =
              (badgeLabelIndexRef.current + 1) % BADGE_LABELS.length;
            if (badgeText) {
              badgeText.textContent = BADGE_LABELS[badgeLabelIndexRef.current];
            }
          }
          const parentEl = mount.parentElement;
          if (parentEl) {
            const mountRect = mount.getBoundingClientRect();
            const parentRect = parentEl.getBoundingClientRect();
            const sx =
              mountRect.left -
              parentRect.left +
              ((hoveredNdcX + 1) / 2) * mount.clientWidth;
            const sy =
              mountRect.top -
              parentRect.top +
              ((1 - hoveredNdcY) / 2) * mount.clientHeight;
            badge.style.left = `${sx}px`;
            badge.style.top = `${sy}px`;
          }
          badge.style.opacity = "1";
        } else {
          badge.style.opacity = "0";
        }
      }

      // Color: triggered by sphere area entry (fast)
      s.colorIntensity = s.colorIntensity * 0.82 + (s.isInSphere ? 0.18 : 0);
      material.uniforms.uHoverIntensity.value = s.colorIntensity;
      // Particle surface movement: triggered by sphere area entry (slow)
      s.hoverIntensity = s.hoverIntensity * 0.995 + (s.isInSphere ? 0.005 : 0);

      const breathAmp = BREATHING_STRENGTH * (0.5 + s.audioLevel * 0.5);
      const globalBreathing =
        Math.sin(t * BREATHING_SPEED * 2.0) * breathAmp + 1.0;
      const audioM = 1.0 + s.audioLevel * 0.8;

      const posArr = geometry.attributes.position.array as Float32Array;
      const sizeArr = geometry.attributes.size.array as Float32Array;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const ox = p.originalPosition[0];
        const oy = p.originalPosition[1];
        const oz = p.originalPosition[2];
        const px = p.position[0];
        const py = p.position[1];
        const pz = p.position[2];

        dir.set(ox, oy, oz).normalize();

        const breathE = p.breathingFactor * globalBreathing;
        const wavePhase = t * (0.7 - 0.2 * p.distanceRatio) + p.phaseOffset;
        const dynWF = 0.6 + 0.4 * p.distanceRatio;
        const scaledR = RADIUS * (0.9 + 0.2 * p.distanceRatio);
        const chaos = WAVE_CHAOS * (0.3 + 0.3 * p.distanceRatio);
        const no = p.noiseOffset;

        const rX = Math.sin(t * 0.3 + no * 1.1) * chaos * RADIUS * 0.5;
        const rY = Math.cos(t * 0.27 + no * 1.3) * chaos * RADIUS * 0.5;
        const rZ = Math.sin(t * 0.23 + no * 0.9) * chaos * RADIUS * 0.5;

        let tX =
          dir.x * scaledR * breathE +
          Math.sin(wavePhase * 0.8 + ox) *
            0.06 *
            dynWF *
            RADIUS *
            WAVE_INTENSITY +
          rX;
        let tY =
          dir.y * scaledR * breathE +
          Math.cos(wavePhase * 0.9 + oy) *
            0.06 *
            dynWF *
            RADIUS *
            WAVE_INTENSITY +
          rY;
        let tZ =
          dir.z * scaledR * breathE +
          Math.sin(wavePhase * 0.7 + oz) *
            0.06 *
            dynWF *
            RADIUS *
            WAVE_INTENSITY +
          rZ;

        tX += (tX - dir.x * scaledR) * (audioM - 1);
        tY += (tY - dir.y * scaledR) * (audioM - 1);
        tZ += (tZ - dir.z * scaledR) * (audioM - 1);

        const mvS = (0.05 * COHESION * (0.9 + 0.2 * p.distanceRatio)) / p.mass;
        p.velocity[0] = p.velocity[0] * 0.82 + (tX - px) * mvS * 0.18;
        p.velocity[1] = p.velocity[1] * 0.82 + (tY - py) * mvS * 0.18;
        p.velocity[2] = p.velocity[2] * 0.82 + (tZ - pz) * mvS * 0.18;

        if (s.isInSphere) {
          const surfX = dir.x * RADIUS;
          const surfY = dir.y * RADIUS;
          const surfZ = dir.z * RADIUS;
          const toSurface = (s.hoverIntensity * 0.25) / p.mass;
          p.velocity[0] += (surfX - px) * toSurface;
          p.velocity[1] += (surfY - py) * toSurface;
          p.velocity[2] += (surfZ - pz) * toSurface;
        }

        const nX = px + p.velocity[0];
        const nY = py + p.velocity[1];
        const nZ = pz + p.velocity[2];
        const cd = Math.sqrt(nX * nX + nY * nY + nZ * nZ);
        const rl = s.isInSphere
          ? RADIUS * 1.05
          : RADIUS * (1.0 + Math.sin(t * 0.5 + p.noiseOffset) * 0.14);
        if (cd > rl) {
          const s2 = rl / cd;
          p.position[0] = nX * s2;
          p.position[1] = nY * s2;
          p.position[2] = nZ * s2;
        } else {
          p.position[0] = nX;
          p.position[1] = nY;
          p.position[2] = nZ;
        }

        posArr[i * 3] = p.position[0];
        posArr[i * 3 + 1] = p.position[1];
        posArr[i * 3 + 2] = p.position[2];

        const sm =
          1.0 +
          Math.sin(t * BREATHING_SPEED + p.noiseOffset) *
            PARTICLE_VARIABILITY *
            0.5;
        sizeArr[i] =
          p.size *
          PARTICLE_SCALE *
          sm *
          (1 + s.audioLevel * 0.2) *
          (1 + s.hoverIntensity * 0.2);
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.size.needsUpdate = true;
      points.rotation.y = t * ROTATION_SPEED;
      points.rotation.x = Math.sin(t * 0.07) * 0.3;
      points.rotation.z = Math.sin(t * 0.05) * 0.15;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      cancelAnimationFrame(audioFrame);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={cn(styles.root, className)} {...props}>
      <div ref={mountRef} className={styles.mount} />
      <div ref={badgeRef} className={styles.badge}>
        <div className={styles.badgePill}>
          <div aria-hidden className={styles.badgeBorder} />
          <div className={styles.badgeContent}>
            <p ref={badgeLabelRef} className={styles.badgeLabel}>
              {BADGE_LABELS[0]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
