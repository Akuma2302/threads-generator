import React, { useEffect, useRef } from 'react';

// Cinematic blue bokeh/dust particle background. Two layers:
// 1. Tiny twinkling "stars" scattered across the frame.
// 2. Soft, glowing blue bokeh circles that drift slowly and pulse.
// Pure canvas, no dependencies — kept lightweight so it doesn't fight the
// UI for CPU on lower-end phones.
export default function BokehBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animationId;
    let stars = [];
    let bokehs = [];

    const BOKEH_COLORS = [
      'rgba(60, 130, 255, 1)',
      'rgba(90, 160, 255, 1)',
      'rgba(40, 100, 220, 1)',
      'rgba(120, 180, 255, 1)',
    ];

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    }

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    function initParticles() {
      const starCount = Math.round((width * height) / 6000);
      stars = Array.from({ length: starCount }, () => ({
        x: rand(0, width),
        y: rand(0, height),
        r: rand(0.4, 1.6),
        baseAlpha: rand(0.2, 0.9),
        twinkleSpeed: rand(0.5, 2),
        phase: rand(0, Math.PI * 2),
      }));

      const bokehCount = Math.round((width * height) / 45000);
      bokehs = Array.from({ length: bokehCount }, () => ({
        x: rand(0, width),
        y: rand(0, height),
        r: rand(18, 70),
        color: BOKEH_COLORS[Math.floor(rand(0, BOKEH_COLORS.length))],
        alpha: rand(0.08, 0.28),
        driftX: rand(-0.06, 0.06),
        driftY: rand(-0.12, -0.02),
        pulseSpeed: rand(0.2, 0.6),
        phase: rand(0, Math.PI * 2),
      }));
    }

    function drawBackground() {
      const grad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.55,
        0,
        width * 0.5,
        height * 0.55,
        Math.max(width, height) * 0.75
      );
      grad.addColorStop(0, '#0f2a5c');
      grad.addColorStop(0.55, '#081a3d');
      grad.addColorStop(1, '#020510');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    function drawStars(t) {
      stars.forEach((s) => {
        const twinkle = 0.5 + 0.5 * Math.sin(t * 0.001 * s.twinkleSpeed + s.phase);
        ctx.globalAlpha = s.baseAlpha * (prefersReducedMotion ? 0.7 : twinkle);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    function drawBokehs(t) {
      bokehs.forEach((b) => {
        if (!prefersReducedMotion) {
          b.x += b.driftX;
          b.y += b.driftY;
          if (b.y < -b.r) b.y = height + b.r;
          if (b.x < -b.r) b.x = width + b.r;
          if (b.x > width + b.r) b.x = -b.r;
        }
        const pulse = 0.85 + 0.15 * Math.sin(t * 0.001 * b.pulseSpeed + b.phase);
        const r = b.r * pulse;
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
        grad.addColorStop(0, b.color.replace('1)', `${b.alpha})`));
        grad.addColorStop(1, b.color.replace('1)', '0)'));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function frame(t) {
      drawBackground();
      drawBokehs(t);
      drawStars(t);
      animationId = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize);
    animationId = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="bokeh-background" aria-hidden="true" />;
}
