<div class="confused-overlay"></div>

<style>
  .confused-overlay {
    position: absolute;
    z-index: 3;
    inset: -8px;
    pointer-events: none;
    background-image: radial-gradient(
        circle at 20% 10%,
        rgba(var(--vfx-arcane-mind-rgb), 0.7),
        transparent 18%
      ),
      radial-gradient(
        circle at 80% 25%,
        rgba(var(--vfx-arcane-mind-rgb), 0.7),
        transparent 18%
      ),
      radial-gradient(
        circle at 50% 80%,
        rgba(var(--vfx-arcane-mind-rgb), 0.7),
        transparent 18%
      );
    mix-blend-mode: screen;
    animation: confused-spin 900ms linear infinite;
  }

  @keyframes confused-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
