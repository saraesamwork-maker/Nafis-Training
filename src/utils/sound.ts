class SoundEffects {
  private ctx: AudioContext | null = null;
  private muted = false;

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    delay = 0,
    gainVal = 0.08
  ) {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + delay;

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(gainVal, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  public playClick() {
    this.playTone(580, 0.055, 'sine', 0, 0.045);
  }

  public playStart() {
    this.playTone(440, 0.09, 'triangle', 0, 0.07);
    this.playTone(554.37, 0.09, 'triangle', 0.07, 0.07);
    this.playTone(659.25, 0.16, 'triangle', 0.14, 0.08);
  }

  public playRetry() {
    this.playTone(392, 0.08, 'sine', 0, 0.06);
    this.playTone(493.88, 0.12, 'sine', 0.07, 0.07);
  }

  public playReveal() {
    this.playTone(349.23, 0.1, 'triangle', 0, 0.05);
    this.playTone(440, 0.12, 'triangle', 0.08, 0.05);
  }

  public playCorrect(reduced = false) {
    if (reduced) {
      this.playTone(493.88, 0.1, 'triangle', 0, 0.07);
      this.playTone(587.33, 0.14, 'triangle', 0.08, 0.07);
      return;
    }
    this.playTone(523.25, 0.12, 'triangle', 0, 0.09);
    this.playTone(659.25, 0.12, 'triangle', 0.08, 0.09);
    this.playTone(783.99, 0.18, 'triangle', 0.16, 0.09);
  }

  public playWrong() {
    this.playTone(260, 0.14, 'sawtooth', 0, 0.05);
    this.playTone(195, 0.22, 'sawtooth', 0.1, 0.05);
  }

  public playSkipPenalty() {
    this.playTone(310, 0.11, 'triangle', 0, 0.06);
    this.playTone(230, 0.18, 'triangle', 0.09, 0.06);
  }

  public playCaught() {
    this.playTone(300, 0.12, 'square', 0, 0.05);
    this.playTone(220, 0.15, 'square', 0.11, 0.05);
    this.playTone(150, 0.28, 'square', 0.22, 0.05);
  }

  public playStageWin() {
    this.playTone(523.25, 0.12, 'triangle', 0, 0.09);
    this.playTone(659.25, 0.12, 'triangle', 0.1, 0.09);
    this.playTone(783.99, 0.14, 'triangle', 0.2, 0.09);
    this.playTone(1046.5, 0.32, 'triangle', 0.3, 0.1);
  }
}

export const soundFx = new SoundEffects();
