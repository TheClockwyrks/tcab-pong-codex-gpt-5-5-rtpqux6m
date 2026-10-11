import { describe, expect, it, vi } from "vitest";
import type { UpdateApi } from "@clockwyrks/simple-2d";
import { game } from "./game";
import type { CaromDebugApi, CaromState } from "./game";
import {
  FIELD_CX,
  FIELD_CY,
  HOLD_TIME,
  P1_X1,
  PADDLE_SPEED,
  SERVE_SPEED,
  WIN_SCORE,
} from "./constants";

function mockApi(held: Partial<Record<string, number>> = {}): UpdateApi {
  const played: string[] = [];
  return {
    input: {
      value: (name) => held[name] ?? 0,
      pressed: () => false,
      pointer: () => ({
        x: 0,
        y: 0,
        down: false,
        device: "mouse",
        buttons: [],
      }),
      pointerPressed: () => false,
      pointerReleased: () => false,
      pointerSamples: () => [],
      pointerContacts: () => [],
      wheel: () => ({ x: 0, y: 0 }),
    },
    audio: {
      play: (cue) => {
        played.push(cue);
      },
      loop: vi.fn(),
      stop: vi.fn(),
      looping: () => false,
      setMuted: vi.fn(),
      muted: () => false,
    },
    frame: () => ({ count: 0, timeMs: 0, lastDeltaMs: 0 }),
    viewport: () => ({
      width: 1280,
      height: 720,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    }),
  };
}

function initialized(): readonly [CaromState, CaromDebugApi] {
  const actions: string[] = [];
  const result = game.initialize({
    input: {
      register: (name) => actions.push(name),
      layout: () => null,
    },
    audio: {
      define: vi.fn(),
      load: vi.fn(),
    },
    assets: {
      loadImage: vi.fn(),
      loadAudio: vi.fn(),
      load: vi.fn(),
      resolve: (path) => path,
    },
    diagnostics: { register: vi.fn() },
    events: { on: vi.fn() },
    viewport: () => ({
      width: 1280,
      height: 720,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    }),
  });
  if (result instanceof Promise) {
    throw new Error("Carom initialize should be synchronous in tests");
  }
  const [state, debug] = result;
  expect(actions).toHaveLength(8);
  return [state, debug] as const;
}

describe("Carom simulation", () => {
  it("serves after the hold timer elapses without advancing the ball that frame", () => {
    const [title, debug] = initialized();
    const started = debug.setBallServeSign(
      debug.setScreen(title, "countdown"),
      1,
    );
    const next = game.update(started, mockApi(), HOLD_TIME);

    expect(next.screen).toBe("playing");
    expect(next.ball?.held).toBe(false);
    expect(next.ball?.x).toBe(FIELD_CX);
    expect(next.ball?.y).toBe(FIELD_CY);
    expect(Math.hypot(next.ball?.vx ?? 0, next.ball?.vy ?? 0)).toBeCloseTo(
      SERVE_SPEED,
    );
  });

  it("adds spin from the integrated paddle velocity on a paddle hit", () => {
    const [title, debug] = initialized();
    let state = debug.setScreen(title, "playing");
    state = debug.setBallHeld(state, false);
    state = debug.setBallPosition(state, P1_X1 + 14, FIELD_CY);
    state = debug.setBallVelocity(state, -500, 0);
    state = debug.setPaddleDriven(state, "left", true);
    state = debug.setPaddleVy(state, "left", PADDLE_SPEED);

    const next = game.update(state, mockApi(), 1 / 60);

    expect(next.ball?.vx).toBeGreaterThan(0);
    expect(next.ball?.spin).toBeGreaterThan(500);
    expect(next.paddles.left.vy).toBeCloseTo(PADDLE_SPEED);
  });

  it("scores points and enters matchover when the win rule is met", () => {
    const [title, debug] = initialized();
    let state = debug.setScreen(title, "playing");
    state = debug.setScore(state, WIN_SCORE - 1, 3);
    state = debug.setBallHeld(state, false);
    state = debug.setBallPosition(state, 1300, FIELD_CY);
    state = debug.setBallVelocity(state, 100, 0);

    const next = game.update(state, mockApi(), 1 / 60);

    expect(next.score.p1).toBe(WIN_SCORE);
    expect(next.winner).toBe("left");
    expect(next.screen).toBe("matchover");
  });

  it("debug snapshot reports derived speed and clearWorld removes entities", () => {
    const [state, debug] = initialized();
    const cleared = debug.clearWorld(state);
    const snapshot = debug.snapshot(cleared);

    expect(snapshot.version).toBe(1);
    expect(snapshot.ball).toBeNull();
    expect(snapshot.obstacles).toHaveLength(0);

    const spawned = debug.setBallVelocity(debug.spawnBall(cleared), 3, 4);
    expect(debug.snapshot(spawned).ball?.speed).toBe(5);
  });
});
