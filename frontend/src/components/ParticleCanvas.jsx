import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ParticleCanvas — reusable Three.js particle backdrop
 *
 * Props:
 *  preset  'auth' | 'embers'   visual theme (default: 'auth')
 *  style   object               extra inline styles on the <canvas>
 *
 * The canvas is absolutely positioned to fill its nearest
 * `position: relative` ancestor, with pointer-events: none so it
 * never blocks interaction.
 */

// ─── Preset definitions ────────────────────────────────────────────────────
const PRESETS = {
  /**
   * auth — icy blue / silver starfield for Login & Signup pages
   * Sparse, gentle upward drift, feels like a night sky.
   */
  auth: {
    count: 200,
    colors: [
      '#8FAAD8', // steel blue
      '#B4CCEE', // light blue
      '#D6EAFF', // ice blue
      '#EEF6FF', // near-white blue
      '#6880B8', // mid indigo-blue
      '#A0BEE0', // muted cornflower
      '#FFFFFF', // pure white star
      '#C8DCFA', // pale lavender-blue
    ],
    size: 0.90,
    opacity: 0.42,
    spreadX: 70,
    spreadY: 52,
    spreadZ: 42,
    speedYMin: 0.005,
    speedYMax: 0.013,
    wobbleAmp: 0.005,
    cameraZ: 32,
    rotationY: 0.00016,
    parallaxX: 4.0,
    parallaxY: 2.5,
    lerpSpeed: 0.032,
  },

  /**
   * embers — warm amber / crimson floating embers for AuthorBanner
   * Rises faster, slight random sideways drift, like a candle flame.
   */
  embers: {
    count: 160,
    colors: [
      '#C86430', // burnt amber
      '#E09040', // orange
      '#D03818', // crimson
      '#F0B050', // gold
      '#A02810', // dark red
      '#E87030', // warm orange
      '#F8D060', // pale gold
      '#B84820', // rust
    ],
    size: 0.80,
    opacity: 0.52,
    spreadX: 82,
    spreadY: 42,
    spreadZ: 36,
    speedYMin: 0.010,
    speedYMax: 0.022,
    wobbleAmp: 0.008,
    cameraZ: 28,
    rotationY: 0.00012,
    parallaxX: 3.0,
    parallaxY: 2.0,
    lerpSpeed: 0.028,
  },
};

// ─── Component ─────────────────────────────────────────────────────────────
const ParticleCanvas = ({ preset = 'auth', style = {} }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cfg = PRESETS[preset] ?? PRESETS.auth;
    const parent = canvas.parentElement;

    const getSize = () => ({
      w: parent ? parent.clientWidth  : window.innerWidth,
      h: parent ? parent.clientHeight : window.innerHeight,
    });

    let { w, h } = getSize();

    // ── Scene ──────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();

    // ── Camera ─────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 200);
    camera.position.z = cfg.cameraZ;

    // ── Renderer ───────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // ── Soft circular sprite texture ───────────────────────────────────────
    const TEX_SIZE = 64;
    const offscreen = document.createElement('canvas');
    offscreen.width  = TEX_SIZE;
    offscreen.height = TEX_SIZE;
    const ctx2d = offscreen.getContext('2d');
    const half  = TEX_SIZE / 2;
    const grad  = ctx2d.createRadialGradient(half, half, 0, half, half, half);
    grad.addColorStop(0,    'rgba(255,255,255,1)');
    grad.addColorStop(0.35, 'rgba(255,255,255,0.85)');
    grad.addColorStop(0.65, 'rgba(255,255,255,0.35)');
    grad.addColorStop(1,    'rgba(255,255,255,0)');
    ctx2d.fillStyle = grad;
    ctx2d.fillRect(0, 0, TEX_SIZE, TEX_SIZE);
    const particleTex = new THREE.CanvasTexture(offscreen);

    // ── Particle geometry ──────────────────────────────────────────────────
    const { count, colors, spreadX, spreadY, spreadZ,
            speedYMin, speedYMax, size, opacity, wobbleAmp } = cfg;

    const threeColors = colors.map(hex => new THREE.Color(hex));
    const positions   = new Float32Array(count * 3);
    const colorsArr   = new Float32Array(count * 3);

    // Per-particle velocity data stored outside the buffer
    const vels = new Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * spreadX;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spreadY;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spreadZ;

      const col = threeColors[Math.floor(Math.random() * threeColors.length)];
      colorsArr[i * 3]     = col.r;
      colorsArr[i * 3 + 1] = col.g;
      colorsArr[i * 3 + 2] = col.b;

      vels[i] = {
        x:      (Math.random() - 0.5) * 0.010,
        y:      speedYMin + Math.random() * (speedYMax - speedYMin),
        z:      (Math.random() - 0.5) * 0.006,
        wobble: Math.random() * Math.PI * 2, // sinusoidal phase offset
      };
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colorsArr, 3));

    const mat = new THREE.PointsMaterial({
      map:           particleTex,
      size,
      vertexColors:  true,
      transparent:   true,
      opacity,
      sizeAttenuation: true,
      blending:      THREE.AdditiveBlending,
      depthWrite:    false,
      alphaTest:     0.01,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // ── Mouse parallax ─────────────────────────────────────────────────────
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const onMouseMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth  - 0.5) * cfg.parallaxX;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * cfg.parallaxY;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // ── Responsive resize ──────────────────────────────────────────────────
    const onResize = () => {
      const s = getSize();
      renderer.setSize(s.w, s.h);
      camera.aspect = s.w / s.h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize, { passive: true });

    // ── Animation loop ─────────────────────────────────────────────────────
    let raf;
    let frame = 0;
    const halfY = spreadY / 2;
    const halfX = spreadX / 2;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      frame++;

      const pos = geo.attributes.position.array;
      const t   = frame * 0.01;

      for (let i = 0; i < count; i++) {
        // Drift + sinusoidal horizontal sway
        pos[i * 3]     += vels[i].x + Math.sin(t + vels[i].wobble) * wobbleAmp;
        pos[i * 3 + 1] += vels[i].y;
        pos[i * 3 + 2] += vels[i].z;

        // Wrap vertically — respawn at the bottom when a particle exits the top
        if (pos[i * 3 + 1] > halfY) {
          pos[i * 3 + 1]  = -halfY;
          pos[i * 3]      = (Math.random() - 0.5) * spreadX;
        }

        // Wrap horizontally
        if (pos[i * 3] >  halfX) pos[i * 3] = -halfX;
        if (pos[i * 3] < -halfX) pos[i * 3] =  halfX;
      }

      geo.attributes.position.needsUpdate = true;

      // Smooth camera parallax (lerp toward mouse target)
      mouse.x += (mouse.tx - mouse.x) * cfg.lerpSpeed;
      mouse.y += (mouse.ty - mouse.y) * cfg.lerpSpeed;
      camera.position.x =  mouse.x;
      camera.position.y = -mouse.y;
      camera.lookAt(0, 0, 0);

      // Slow global rotation for depth
      points.rotation.y = frame * cfg.rotationY;
      points.rotation.x = Math.sin(frame * 0.0003) * 0.04;

      renderer.render(scene, camera);
    };

    tick();

    // ── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize',    onResize);
      geo.dispose();
      mat.dispose();
      particleTex.dispose();
      renderer.dispose();
    };
  }, [preset]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      'absolute',
        inset:         0,
        width:         '100%',
        height:        '100%',
        pointerEvents: 'none',
        zIndex:        2,
        ...style,
      }}
    />
  );
};

export default ParticleCanvas;
