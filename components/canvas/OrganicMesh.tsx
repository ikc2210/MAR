"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Organic morphing wireframe mesh — inspired by flowing 3D mesh surfaces
// Place in /components/canvas/OrganicMesh.tsx

export function OrganicMesh() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // --- Geometry: high-res sphere we'll deform ---
    const geometry = new THREE.SphereGeometry(1, 80, 80);

    // Store original positions for noise-based displacement
    const positionAttr = geometry.attributes.position;
    const originalPositions = new Float32Array(positionAttr.array.length);
    originalPositions.set(positionAttr.array);

    // --- Wireframe Material: white, semi-transparent ---
    const material = new THREE.MeshBasicMaterial({
      color: 0xd4aaff,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // --- Soft glow: a large sprite in the center ---
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = 256;
    glowCanvas.height = 256;
    const ctx = glowCanvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, "rgba(180,140,255,0.4)");
    gradient.addColorStop(0.3, "rgba(100,180,255,0.15)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    const glowMaterial = new THREE.SpriteMaterial({
      map: glowTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glowSprite = new THREE.Sprite(glowMaterial);
    glowSprite.scale.set(3.5, 3.5, 1);
    scene.add(glowSprite);

    // --- 3D Simplex-like noise (using sin/cos layering) ---
    function pseudoNoise(x: number, y: number, z: number, t: number): number {
      return (
        Math.sin(x * 2.1 + t * 0.7) * Math.cos(y * 1.8 + t * 0.5) * 0.3 +
        Math.sin(y * 2.5 + t * 0.9) * Math.cos(z * 2.0 + t * 0.6) * 0.25 +
        Math.sin(z * 1.9 + t * 0.8) * Math.cos(x * 2.3 + t * 0.4) * 0.2 +
        Math.sin(x * 3.7 + y * 2.1 + t * 1.1) * 0.15 +
        Math.cos(y * 3.2 + z * 1.5 + t * 0.95) * 0.12 +
        Math.sin(z * 4.1 + x * 1.7 + t * 1.3) * 0.1
      );
    }

    // --- Animation Loop ---
    let animationId: number;
    let time = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.004;

      // Deform geometry vertices
      const positions = positionAttr.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const ox = originalPositions[i];
        const oy = originalPositions[i + 1];
        const oz = originalPositions[i + 2];

        const displacement = pseudoNoise(ox, oy, oz, time);
        const scale = 1 + displacement * 0.55;

        positions[i] = ox * scale;
        positions[i + 1] = oy * scale;
        positions[i + 2] = oz * scale;
      }
      positionAttr.needsUpdate = true;
      geometry.computeVertexNormals();

      // Slow rotation
      mesh.rotation.y += 0.0025;
      mesh.rotation.x += 0.001;
      mesh.rotation.z += 0.0008;

      renderer.render(scene, camera);
    };
    animate();

    // --- Resize handler ---
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      glowMaterial.dispose();
      glowTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}
