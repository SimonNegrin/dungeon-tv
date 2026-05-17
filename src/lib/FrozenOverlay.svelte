<div class="frozen-overlay"></div>

<style>
  .frozen-overlay {
    position: absolute;
    z-index: 1;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(
        circle at 30% 20%,
        rgba(var(--vfx-ice-soft-rgb), 0.35),
        transparent 55%
      ),
      radial-gradient(
        circle at 70% 80%,
        rgba(var(--vfx-ice-rgb), 0.25),
        transparent 60%
      ),
      linear-gradient(
        135deg,
        rgba(var(--vfx-ice-soft-rgb), 0.18),
        rgba(0, 0, 0, 0)
      );
    mix-blend-mode: screen;
    box-shadow:
      inset 0 0 0 1px rgba(var(--vfx-ice-rgb), 0.25),
      0 0 10px rgba(var(--vfx-ice-rgb), 0.25);
    animation: frozen-shimmer 900ms ease-in-out infinite alternate;
  }

  @keyframes frozen-shimmer {
    from {
      opacity: 0.55;
    }
    to {
      opacity: 0.85;
    }
  }
</style>
