export class WebAudioService {
  private audioCtx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") {
      return null;
    }

    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }

    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch(() => {});
    }

    return this.audioCtx;
  }

  public playChime(frequency: number = 528, duration: number = 1.6): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, now);

      // Gentle attack and exponential decay for authentic Zen bell chime
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.3, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);

      // Add gentle harmonic overtone (Solfeggio resonant chime)
      const overtoneOsc = ctx.createOscillator();
      const overtoneGain = ctx.createGain();

      overtoneOsc.type = "sine";
      overtoneOsc.frequency.setValueAtTime(frequency * 1.5, now);

      overtoneGain.gain.setValueAtTime(0.0001, now);
      overtoneGain.gain.exponentialRampToValueAtTime(0.08, now + 0.03);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);

      overtoneOsc.connect(overtoneGain);
      overtoneGain.connect(ctx.destination);

      overtoneOsc.start(now);
      overtoneOsc.stop(now + duration * 0.7 + 0.05);
    } catch (err) {
      console.warn("[WebAudioService] Failed to play chime:", err);
    }
  }

  private runNonBlocking(task: () => void): void {
    if (
      typeof window !== "undefined" &&
      typeof window.requestAnimationFrame === "function" &&
      process.env.NODE_ENV !== "test"
    ) {
      window.requestAnimationFrame(task);
    } else {
      task();
    }
  }

  public playSuccessChime(): void {
    this.runNonBlocking(() => {
      this.playChime(528, 1.8);
      setTimeout(() => {
        this.playChime(660, 1.4);
      }, 180);
    });
  }

  public playCompletionChime(): void {
    this.runNonBlocking(() => {
      this.playChime(440, 1.2);
      setTimeout(() => this.playChime(528, 1.4), 140);
      setTimeout(() => this.playChime(660, 1.8), 280);
    });
  }
}

export const webAudioService = new WebAudioService();
