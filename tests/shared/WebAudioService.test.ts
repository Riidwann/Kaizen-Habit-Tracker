import { describe, it, expect, vi, beforeEach } from "vitest";
import { WebAudioService, webAudioService } from "@/shared/infrastructure/WebAudioService";

describe("WebAudioService", () => {
  let mockAudioContext: any;
  let mockOscillator: any;
  let mockGain: any;

  beforeEach(() => {
    mockOscillator = {
      type: "sine",
      frequency: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };

    mockGain = {
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    };

    mockAudioContext = {
      currentTime: 10,
      state: "running",
      createOscillator: vi.fn(() => ({ ...mockOscillator })),
      createGain: vi.fn(() => ({ ...mockGain })),
      destination: {},
      resume: vi.fn().mockResolvedValue(undefined),
    };

    (window as any).AudioContext = vi.fn(() => mockAudioContext);
  });

  it("should play a chime at requested frequency and duration", () => {
    const service = new WebAudioService();
    service.playChime(528, 1.5);

    expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    expect(mockAudioContext.createGain).toHaveBeenCalled();
  });

  it("should resume suspended audio context on play", () => {
    mockAudioContext.state = "suspended";
    const service = new WebAudioService();
    service.playChime();

    expect(mockAudioContext.resume).toHaveBeenCalled();
  });

  it("should play success chime sequence", () => {
    vi.useFakeTimers();
    const service = new WebAudioService();
    const spy = vi.spyOn(service, "playChime");

    service.playSuccessChime();
    expect(spy).toHaveBeenCalledWith(528, 1.8);

    vi.advanceTimersByTime(200);
    expect(spy).toHaveBeenCalledWith(660, 1.4);

    vi.useRealTimers();
  });

  it("should handle SSR or missing AudioContext gracefully without throwing", () => {
    const originalAudioContext = window.AudioContext;
    delete (window as any).AudioContext;

    const service = new WebAudioService();
    expect(() => service.playChime(440, 1)).not.toThrow();

    window.AudioContext = originalAudioContext;
  });

  it("should export a singleton webAudioService", () => {
    expect(webAudioService).toBeInstanceOf(WebAudioService);
  });
});
