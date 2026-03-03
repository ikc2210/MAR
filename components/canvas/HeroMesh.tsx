'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PALETTE: [number, number, number][] = [
  [0, 229, 255],   // cyan
  [63, 81, 181],   // indigo
  [156, 39, 176],  // purple
  [255, 0, 110],   // pink
  [255, 80, 50],   // red-orange
];

function lerpColor(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function paletteColor(t: number): [number, number, number] {
  const clamped = Math.max(0, Math.min(1, t));
  const segment = clamped * (PALETTE.length - 1);
  const idx = Math.floor(segment);
  const frac = segment - idx;
  const a = PALETTE[Math.min(idx, PALETTE.length - 1)];
  const b = PALETTE[Math.min(idx + 1, PALETTE.length - 1)];
  return lerpColor(a, b, frac);
}

export function HeroMesh() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 22, 28);
    camera.lookAt(0, -2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Geometry
    const WIDTH = 100;
    const HEIGHT = 100;
    const geo = new THREE.PlaneGeometry(60, 60, WIDTH, HEIGHT);
    geo.rotateX(-Math.PI / 2);

    const positions = geo.attributes.position as THREE.BufferAttribute;
    const count = positions.count;

    // Store original XZ positions
    const origX = new Float32Array(count);
    const origZ = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      origX[i] = positions.getX(i);
      origZ[i] = positions.getZ(i);
    }

    // Vertex colors
    const colors = new Float32Array(count * 3);
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      vertexColors: true,
      size: 0.1,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geo, material);
    scene.add(points);

    // Animation
    let animId: number;
    let t = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.008;

      let yMin = Infinity;
      let yMax = -Infinity;

      for (let i = 0; i < count; i++) {
        const x = origX[i];
        const z = origZ[i];
        const y =
          Math.sin(x * 0.3 + t) * 1.8 +
          Math.sin(z * 0.25 + t * 0.7) * 1.4 +
          Math.sin((x + z) * 0.15 + t * 1.2) * 1.0 +
          Math.cos(x * 0.4 - z * 0.2 + t * 0.5) * 0.8;

        positions.setY(i, y);
        if (y < yMin) yMin = y;
        if (y > yMax) yMax = y;
      }

      const range = yMax - yMin || 1;
      for (let i = 0; i < count; i++) {
        const y = positions.getY(i);
        const norm = (y - yMin) / range;
        const [r, g, b] = paletteColor(norm);
        colors[i * 3] = r / 255;
        colors[i * 3 + 1] = g / 255;
        colors[i * 3 + 2] = b / 255;
      }

      positions.needsUpdate = true;
      (geo.attributes.color as THREE.BufferAttribute).needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geo.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}
