import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Three.js particle canvas — warm golden floating dust motes
 * Renders as an absolute-positioned overlay within the hero section.
 * Uses NormalBlending for visibility in both light & dark themes.
 */
const HeroThreeCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const getSize = () => ({
      w: parent ? parent.clientWidth : window.innerWidth,
      h: parent ? parent.clientHeight : window.innerHeight,
    });

    let { w, h } = getSize();

    /* ── Scene ───────────────────────────────────────────── */
    const scene = new THREE.Scene();

    /* ── Camera ──────────────────────────────────────────── */
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 200);
    camera.position.z = 32;

    /* ── Renderer ─────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    /* ── Soft circular particle texture ──────────────────── */
    const texSize = 64;
    const offscreen = document.createElement('canvas');
    offscreen.width = texSize;
    offscreen.height = texSize;
    const ctx2d = offscreen.getContext('2d');
    const grad = ctx2d.createRadialGradient(
      texSize / 2, texSize / 2, 0,
      texSize / 2, texSize / 2, texSize / 2
    );
    grad.addColorStop(0,   'rgba(255,255,255,1)');
    grad.addColorStop(0.35,'rgba(255,255,255,0.85)');
    grad.addColorStop(0.7, 'rgba(255,255,255,0.3)');
    grad.addColorStop(1,   'rgba(255,255,255,0)');
    ctx2d.fillStyle = grad;
    ctx2d.fillRect(0, 0, texSize, texSize);
    const particleTex = new THREE.CanvasTexture(offscreen);

    /* ── Particle data ───────────────────────────────────── */
    const COUNT = 320;
    const positions = new Float32Array(COUNT * 3);
    const colors    = new Float32Array(COUNT * 3);

    // Warm gold / amber / parchment palette
    const palette = [
      new THREE.Color('#D4A84B'), // gold
      new THREE.Color('#E8C56A'), // light gold
      new THREE.Color('#B07830'), // amber
      new THREE.Color('#F8EDD4'), // parchment white
      new THREE.Color('#C86A30'), // warm amber
      new THREE.Color('#F0D890'), // pale gold
      new THREE.Color('#A06020'), // dark amber
    ];

    const vels = [];

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 55;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 45;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3]     = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      vels.push({
        x: (Math.random() - 0.5) * 0.012,
        y: Math.random() * 0.014 + 0.003,  // gentle upward drift
        z: (Math.random() - 0.5) * 0.007,
        wobble: Math.random() * Math.PI * 2, // phase offset for sinusoidal sway
      });
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      map: particleTex,
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      alphaTest: 0.01,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    /* ── Mouse parallax ──────────────────────────────────── */
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMouseMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth  - 0.5) * 5;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 3;
    };
    window.addEventListener('mousemove', onMouseMove);

    /* ── Resize ───────────────────────────────────────────── */
    const onResize = () => {
      const s = getSize();
      renderer.setSize(s.w, s.h);
      camera.aspect = s.w / s.h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    /* ── Animation loop ──────────────────────────────────── */
    let raf;
    let frame = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      frame++;

      const pos = geo.attributes.position.array;
      const t = frame * 0.01;

      for (let i = 0; i < COUNT; i++) {
        // Drift upward with gentle sinusoidal sway
        pos[i * 3]     += vels[i].x + Math.sin(t + vels[i].wobble) * 0.006;
        pos[i * 3 + 1] += vels[i].y;
        pos[i * 3 + 2] += vels[i].z;

        // Wrap vertically
        if (pos[i * 3 + 1] > 28) {
          pos[i * 3 + 1] = -28;
          pos[i * 3]     = (Math.random() - 0.5) * 80;
        }
        // Wrap horizontally
        if (pos[i * 3] >  40) pos[i * 3] = -40;
        if (pos[i * 3] < -40) pos[i * 3] =  40;
      }
      geo.attributes.position.needsUpdate = true;

      // Smooth camera parallax
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      camera.position.x = mouse.x;
      camera.position.y = -mouse.y;
      camera.lookAt(0, 0, 0);

      // Slow global rotation
      points.rotation.y = frame * 0.00018;
      points.rotation.x = Math.sin(frame * 0.0004) * 0.05;

      renderer.render(scene, camera);
    };

    tick();

    /* ── Cleanup ──────────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      geo.dispose();
      mat.dispose();
      particleTex.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 3,
      }}
    />
  );
};

export default HeroThreeCanvas;
