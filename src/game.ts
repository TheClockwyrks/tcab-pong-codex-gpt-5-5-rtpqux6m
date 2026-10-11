import type {
  Game,
  InitApi,
  PointerSample,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import {
  ACTIONS,
  AI_DEADZONE,
  AI_HOME_DEADZONE,
  AI_HOME_Y,
  AI_REACT,
  AI_SPEED,
  BALL_R,
  BINDINGS,
  CAROM_DEBUG_VERSION,
  CUES,
  FIELD_CX,
  FIELD_CY,
  FIELD_H,
  FIELD_W,
  HOLD_TIME,
  MATCHOVER_ITEMS,
  MAX_BOUNCE_ANGLE,
  MAX_SUBSTEP,
  NET_X,
  OBSTACLE_CENTERS,
  OBSTACLE_H,
  OBSTACLE_HH,
  OBSTACLE_HW,
  OBSTACLE_W,
  OBSTACLES,
  P1_X0,
  P1_X1,
  P2_X0,
  P2_X1,
  PADDLE_HALF,
  PADDLE_H,
  PADDLE_MAX_CY,
  PADDLE_MIN_CY,
  PADDLE_SPEED,
  PADDLE_W,
  PAUSE_ITEMS,
  SERVE_ANGLE,
  SERVE_SPEED,
  SPEED_CAP,
  SPEED_MULT,
  SPIN_CLAMP,
  SPIN_FROM_PADDLE,
  SPIN_HALFLIFE,
  TITLE_ITEMS,
  TITLE_TEXT,
  TRAIL_TIME,
  WIN_LEAD,
  WIN_SCORE,
} from "./constants";
import type { ActionName, CueName, Rect } from "./constants";

export type Screen =
  "title" | "howto" | "countdown" | "playing" | "paused" | "matchover";

export type Mode = "solo" | "versus";

export type Side = "left" | "right";

export interface PaddleState {
  readonly cy: number;
  readonly vy: number;
  readonly driven: boolean;
  readonly drivenVy: number;
}

export interface AiState {
  readonly tracking: boolean;
  readonly movement: boolean;
}

export interface TrailSample {
  readonly x: number;
  readonly y: number;
  readonly t: number;
}

export interface BallState {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly spin: number;
  readonly held: boolean;
  readonly holdTimer: number;
  readonly serveSign: 1 | -1;
  readonly trail: readonly TrailSample[];
}

export interface ObstacleState {
  readonly index: number;
  readonly cx: number;
  readonly cy: number;
}

export interface CaromState {
  readonly screen: Screen;
  readonly mode: Mode;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly resumeScreen: "countdown" | "playing";

  readonly score: { readonly p1: number; readonly p2: number };
  readonly winner: Side | null;

  readonly paddles: { readonly left: PaddleState; readonly right: PaddleState };
  readonly ai: AiState;

  readonly receiver: Side;
  readonly ball: BallState | null;
  readonly obstacles: readonly ObstacleState[];

  readonly simTime: number;
  readonly muted: boolean;

  readonly pointerPressIndex: number | null;
  readonly touchPresses: readonly TouchPress[];
}

interface TouchPress {
  readonly id: number;
  readonly index: number | null;
}

interface MenuRect {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export interface SnapshotBall extends BallState {
  readonly speed: number;
}

export interface CaromSnapshot {
  readonly version: 1;
  readonly screen: Screen;
  readonly mode: Mode;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly resumeScreen: "countdown" | "playing";
  readonly score: { readonly p1: number; readonly p2: number };
  readonly winner: Side | null;
  readonly muted: boolean;
  readonly paddles: { readonly left: PaddleState; readonly right: PaddleState };
  readonly ai: AiState;
  readonly receiver: Side;
  readonly ball: SnapshotBall | null;
  readonly obstacles: readonly ObstacleState[];
  readonly simTime: number;
}

export interface CaromDebugApi {
  readonly version: 1;
  clearWorld(state: DeepReadonly<CaromState>): CaromState;
  spawnBall(state: DeepReadonly<CaromState>): CaromState;
  spawnObstacle(state: DeepReadonly<CaromState>, index: number): CaromState;
  reset(state: DeepReadonly<CaromState>): CaromState;
  reconcile(state: DeepReadonly<CaromState>): CaromState;
  setScreen(state: DeepReadonly<CaromState>, screen: Screen): CaromState;
  setMode(state: DeepReadonly<CaromState>, mode: Mode): CaromState;
  setMenuIndex(state: DeepReadonly<CaromState>, index: number): CaromState;
  setTitleIndex(state: DeepReadonly<CaromState>, index: number): CaromState;
  setResumeScreen(
    state: DeepReadonly<CaromState>,
    screen: "countdown" | "playing",
  ): CaromState;
  setScore(state: DeepReadonly<CaromState>, p1: number, p2: number): CaromState;
  setWinner(state: DeepReadonly<CaromState>, side: Side | null): CaromState;
  setReceiver(state: DeepReadonly<CaromState>, side: Side): CaromState;
  setPaddleCy(
    state: DeepReadonly<CaromState>,
    side: Side,
    cy: number,
  ): CaromState;
  setPaddleVy(
    state: DeepReadonly<CaromState>,
    side: Side,
    vy: number,
  ): CaromState;
  setPaddleDriven(
    state: DeepReadonly<CaromState>,
    side: Side,
    driven: boolean,
  ): CaromState;
  setBallPosition(
    state: DeepReadonly<CaromState>,
    x: number,
    y: number,
  ): CaromState;
  setBallVelocity(
    state: DeepReadonly<CaromState>,
    vx: number,
    vy: number,
  ): CaromState;
  setBallSpin(state: DeepReadonly<CaromState>, spin: number): CaromState;
  setBallHeld(state: DeepReadonly<CaromState>, held: boolean): CaromState;
  setBallHoldTimer(
    state: DeepReadonly<CaromState>,
    seconds: number,
  ): CaromState;
  setBallServeSign(state: DeepReadonly<CaromState>, sign: 1 | -1): CaromState;
  drawBallServeSign(state: DeepReadonly<CaromState>): CaromState;
  setAiTracking(state: DeepReadonly<CaromState>, enabled: boolean): CaromState;
  setAiMovement(state: DeepReadonly<CaromState>, enabled: boolean): CaromState;
  setMuted(state: DeepReadonly<CaromState>, muted: boolean): CaromState;
  snapshot(state: DeepReadonly<CaromState>): CaromSnapshot;
  menuItemRect(state: DeepReadonly<CaromState>, index: number): MenuRect | null;
}

export const BACKGROUND = "#071116";

const COLORS = {
  field: BACKGROUND,
  line: "#27515d",
  text: "#e8fbff",
  dim: "#79a0a8",
  left: "#33d6ff",
  right: "#ff5f8a",
  ball: "#fff16b",
  obstacle: "#39e58c",
  panel: "rgba(5, 13, 18, 0.72)",
  shade: "rgba(0, 0, 0, 0.45)",
};

const HOWTO_ITEMS = ["BACK"] as const;
const MODE_LABEL: Record<Mode, string> = {
  solo: "SOLO DUEL",
  versus: "VERSUS DUEL",
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function randomServeSign(): 1 | -1 {
  return Math.random() < 0.5 ? -1 : 1;
}

function speed(ball: Pick<BallState, "vx" | "vy">): number {
  return Math.hypot(ball.vx, ball.vy);
}

function copyState(state: DeepReadonly<CaromState>): CaromState {
  return {
    ...state,
    score: { ...state.score },
    paddles: {
      left: { ...state.paddles.left },
      right: { ...state.paddles.right },
    },
    ai: { ...state.ai },
    ball: state.ball
      ? { ...state.ball, trail: state.ball.trail.map((sample) => sample) }
      : null,
    obstacles: state.obstacles.map((obstacle) => ({ ...obstacle })),
    touchPresses: state.touchPresses.map((press) => ({ ...press })),
  };
}

function createBall(): BallState {
  return {
    x: FIELD_CX,
    y: FIELD_CY,
    vx: 0,
    vy: 0,
    spin: 0,
    held: true,
    holdTimer: HOLD_TIME,
    serveSign: randomServeSign(),
    trail: [],
  };
}

function createObstacles(): readonly ObstacleState[] {
  return OBSTACLE_CENTERS.map((center, index) => ({
    index,
    cx: center.x,
    cy: center.y,
  }));
}

function createTitleState(muted: boolean, simTime = 0): CaromState {
  return {
    screen: "title",
    mode: "solo",
    menuIndex: 0,
    titleIndex: 0,
    resumeScreen: "playing",
    score: { p1: 0, p2: 0 },
    winner: null,
    paddles: {
      left: { cy: FIELD_CY, vy: 0, driven: false, drivenVy: 0 },
      right: { cy: FIELD_CY, vy: 0, driven: false, drivenVy: 0 },
    },
    ai: { tracking: true, movement: true },
    receiver: "left",
    ball: createBall(),
    obstacles: createObstacles(),
    simTime,
    muted,
    pointerPressIndex: null,
    touchPresses: [],
  };
}

function startMatch(state: DeepReadonly<CaromState>, mode: Mode): CaromState {
  return {
    ...copyState(state),
    mode,
    screen: "countdown",
    resumeScreen: "playing",
    menuIndex: 0,
    score: { p1: 0, p2: 0 },
    winner: null,
    receiver: "left",
    ball: createBall(),
    paddles: {
      left: { ...state.paddles.left, cy: FIELD_CY, vy: 0 },
      right: { ...state.paddles.right, cy: FIELD_CY, vy: 0 },
    },
    pointerPressIndex: null,
    touchPresses: [],
  };
}

function returnToTitle(state: DeepReadonly<CaromState>): CaromState {
  return {
    ...createTitleState(state.muted, state.simTime),
    titleIndex: state.titleIndex,
    menuIndex: state.titleIndex,
  };
}

function integratePaddle(
  paddle: DeepReadonly<PaddleState>,
  desiredVy: number,
  dt: number,
): PaddleState {
  const nextCy = clamp(
    paddle.cy + desiredVy * dt,
    PADDLE_MIN_CY,
    PADDLE_MAX_CY,
  );
  const actualVy = dt > 0 ? (nextCy - paddle.cy) / dt : 0;
  return { ...paddle, cy: nextCy, vy: actualVy };
}

function humanVy(up: boolean, down: boolean): number {
  return (Number(down) - Number(up)) * PADDLE_SPEED;
}

function movePaddles(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
  dt: number,
): CaromState {
  const p1Up = api.input.value("p1-up") > 0;
  const p1Down = api.input.value("p1-down") > 0;
  const p2Up = api.input.value("p2-up") > 0;
  const p2Down = api.input.value("p2-down") > 0;

  const leftDesired = state.paddles.left.driven
    ? state.paddles.left.drivenVy
    : humanVy(
        p1Up || (state.mode === "solo" && p2Up),
        p1Down || (state.mode === "solo" && p2Down),
      );

  const rightDesired = state.paddles.right.driven
    ? state.paddles.right.drivenVy
    : state.mode === "versus"
      ? humanVy(p2Up, p2Down)
      : aiVy(state, dt);

  return {
    ...copyState(state),
    paddles: {
      left: integratePaddle(state.paddles.left, leftDesired, dt),
      right: integratePaddle(state.paddles.right, rightDesired, dt),
    },
  };
}

function aiVy(state: DeepReadonly<CaromState>, dt: number): number {
  if (!state.ai.movement || dt <= 0) return 0;

  let target = AI_HOME_Y;
  let deadzone = AI_HOME_DEADZONE;
  if (
    state.ai.tracking &&
    state.screen === "playing" &&
    state.ball &&
    state.ball.vx > 0
  ) {
    target = state.ball.y - state.ball.vy * AI_REACT;
    deadzone = AI_DEADZONE;
  }

  const diff = target - state.paddles.right.cy;
  if (Math.abs(diff) <= deadzone) return 0;
  return Math.sign(diff) * Math.min(AI_SPEED, Math.abs(diff) / dt);
}

type HitFace = "left" | "right" | "top" | "bottom";

interface RectHit {
  readonly ball: BallState;
  readonly face: HitFace | null;
  readonly bounced: boolean;
}

function resolveRect(ball: BallState, rect: Rect): RectHit {
  if (
    ball.x <= rect.x0 - BALL_R ||
    ball.x >= rect.x1 + BALL_R ||
    ball.y <= rect.y0 - BALL_R ||
    ball.y >= rect.y1 + BALL_R
  ) {
    return { ball, face: null, bounced: false };
  }

  const depths = [
    { face: "left" as const, value: ball.x - (rect.x0 - BALL_R) },
    { face: "right" as const, value: rect.x1 + BALL_R - ball.x },
    { face: "top" as const, value: ball.y - (rect.y0 - BALL_R) },
    { face: "bottom" as const, value: rect.y1 + BALL_R - ball.y },
  ];
  const face = depths.reduce((best, current) =>
    current.value < best.value ? current : best,
  ).face;

  let next = { ...ball };
  let bounced = false;
  if (face === "left") {
    next = { ...next, x: rect.x0 - BALL_R };
    if (next.vx > 0) {
      next = { ...next, vx: -next.vx };
      bounced = true;
    }
  } else if (face === "right") {
    next = { ...next, x: rect.x1 + BALL_R };
    if (next.vx < 0) {
      next = { ...next, vx: -next.vx };
      bounced = true;
    }
  } else if (face === "top") {
    next = { ...next, y: rect.y0 - BALL_R };
    if (next.vy > 0) {
      next = { ...next, vy: -next.vy };
      bounced = true;
    }
  } else {
    next = { ...next, y: rect.y1 + BALL_R };
    if (next.vy < 0) {
      next = { ...next, vy: -next.vy };
      bounced = true;
    }
  }

  return { ball: next, face, bounced };
}

function paddleRect(side: Side, cy: number): Rect {
  return {
    x0: side === "left" ? P1_X0 : P2_X0,
    x1: side === "left" ? P1_X1 : P2_X1,
    y0: cy - PADDLE_HALF,
    y1: cy + PADDLE_HALF,
  };
}

interface StepEvents {
  readonly paddleHit: boolean;
  readonly wallBounce: boolean;
  readonly obstacleBounce: boolean;
}

function bouncePaddle(
  ball: BallState,
  side: Side,
  paddle: DeepReadonly<PaddleState>,
): BallState {
  const dir = side === "left" ? 1 : -1;
  const offset = clamp((ball.y - paddle.cy) / PADDLE_HALF, -1, 1);
  const theta = offset * MAX_BOUNCE_ANGLE;
  const nextSpeed = Math.min(speed(ball) * SPEED_MULT, SPEED_CAP);
  return {
    ...ball,
    x: side === "left" ? P1_X1 + BALL_R : P2_X0 - BALL_R,
    vx: dir * nextSpeed * Math.cos(theta),
    vy: nextSpeed * Math.sin(theta),
    spin: clamp(
      ball.spin + paddle.vy * SPIN_FROM_PADDLE,
      -SPIN_CLAMP,
      SPIN_CLAMP,
    ),
  };
}

function advanceBall(
  state: DeepReadonly<CaromState>,
  dt: number,
): { readonly ball: BallState; readonly events: StepEvents } {
  if (!state.ball) {
    throw new Error("Carom: advanceBall called without a ball");
  }

  let ball: BallState = { ...state.ball, trail: [...state.ball.trail] };
  let paddleHit = false;
  let wallBounce = false;
  let obstacleBounce = false;
  const initialSpeed = speed(ball);
  const steps = Math.max(1, Math.ceil((initialSpeed * dt) / MAX_SUBSTEP));
  const h = dt / steps;

  for (let i = 0; i < steps; i += 1) {
    const currentSpeed = speed(ball);
    if (currentSpeed > 0) {
      const angle = (ball.spin / currentSpeed) * h;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      ball = {
        ...ball,
        vx: ball.vx * cos - ball.vy * sin,
        vy: ball.vx * sin + ball.vy * cos,
      };
    }
    ball = {
      ...ball,
      spin: ball.spin * Math.pow(0.5, h / SPIN_HALFLIFE),
      x: ball.x + ball.vx * h,
      y: ball.y + ball.vy * h,
    };

    if (ball.y - BALL_R < 0 && ball.vy < 0) {
      ball = { ...ball, y: BALL_R, vy: -ball.vy };
      wallBounce = true;
    } else if (ball.y + BALL_R > FIELD_H && ball.vy > 0) {
      ball = { ...ball, y: FIELD_H - BALL_R, vy: -ball.vy };
      wallBounce = true;
    }

    for (const side of ["left", "right"] as const) {
      const hit = resolveRect(ball, paddleRect(side, state.paddles[side].cy));
      ball = hit.ball;
      if (hit.face === "left" || hit.face === "right") {
        ball = bouncePaddle(ball, side, state.paddles[side]);
        paddleHit = true;
      } else if (hit.bounced) {
        wallBounce = true;
      }
    }

    for (const obstacle of state.obstacles) {
      const hit = resolveRect(ball, OBSTACLES[obstacle.index]);
      ball = hit.ball;
      obstacleBounce ||= hit.bounced;
    }
  }

  return { ball, events: { paddleHit, wallBounce, obstacleBounce } };
}

function serveBall(ball: DeepReadonly<BallState>, receiver: Side): BallState {
  const dir = receiver === "left" ? -1 : 1;
  return {
    ...ball,
    held: false,
    holdTimer: 0,
    trail: [],
    vx: dir * SERVE_SPEED * Math.cos(SERVE_ANGLE),
    vy: ball.serveSign * SERVE_SPEED * Math.sin(SERVE_ANGLE),
  };
}

function withTrail(ball: BallState, simTime: number): BallState {
  const trail = [...ball.trail, { x: ball.x, y: ball.y, t: simTime }].filter(
    (sample) => simTime - sample.t <= TRAIL_TIME,
  );
  return { ...ball, trail };
}

function winningSide(
  scoreState: DeepReadonly<CaromState["score"]>,
): Side | null {
  if (scoreState.p1 >= WIN_SCORE && scoreState.p1 - scoreState.p2 >= WIN_LEAD) {
    return "left";
  }
  if (scoreState.p2 >= WIN_SCORE && scoreState.p2 - scoreState.p1 >= WIN_LEAD) {
    return "right";
  }
  return null;
}

function advanceScreen(
  state: DeepReadonly<CaromState>,
  dt: number,
  api: UpdateApi,
): CaromState {
  if (state.screen !== "countdown" && state.screen !== "playing") {
    return copyState(state);
  }

  const next = movePaddles(state, api, dt);
  if (!next.ball) return next;

  if (next.screen === "countdown") {
    const holdTimer = Math.max(0, next.ball.holdTimer - dt);
    const ball =
      holdTimer <= 0
        ? serveBall({ ...next.ball, holdTimer }, next.receiver)
        : { ...next.ball, holdTimer, x: FIELD_CX, y: FIELD_CY };
    return {
      ...next,
      screen: holdTimer <= 0 ? "playing" : "countdown",
      ball: withTrail(ball, next.simTime),
    };
  }

  const advanced = advanceBall(next, dt);
  for (const [flag, cue] of [
    [advanced.events.paddleHit, CUES.paddleHit],
    [advanced.events.wallBounce, CUES.wallBounce],
    [advanced.events.obstacleBounce, CUES.obstacleBounce],
  ] as const) {
    if (flag) api.audio.play(cue);
  }

  let ball = withTrail(advanced.ball, next.simTime);
  if (ball.x - BALL_R > FIELD_W || ball.x + BALL_R < 0) {
    api.audio.play(CUES.score);
    const scorer: Side = ball.x - BALL_R > FIELD_W ? "left" : "right";
    const scoreState =
      scorer === "left"
        ? { p1: next.score.p1 + 1, p2: next.score.p2 }
        : { p1: next.score.p1, p2: next.score.p2 + 1 };
    const winner = winningSide(scoreState);
    if (winner) {
      return {
        ...next,
        score: scoreState,
        winner,
        screen: "matchover",
        menuIndex: 0,
        ball,
      };
    }
    ball = createBall();
    return {
      ...next,
      score: scoreState,
      receiver: scorer === "left" ? "right" : "left",
      screen: "countdown",
      ball,
    };
  }

  return { ...next, ball };
}

function menuItems(screen: Screen): readonly string[] {
  if (screen === "title") return TITLE_ITEMS;
  if (screen === "howto") return HOWTO_ITEMS;
  if (screen === "paused") return PAUSE_ITEMS;
  if (screen === "matchover") return MATCHOVER_ITEMS;
  return [];
}

function menuRectFor(screen: Screen, index: number): MenuRect | null {
  const items = menuItems(screen);
  if (!items[index]) return null;
  const w = screen === "howto" ? 300 : 360;
  const h = 56;
  const gap = 18;
  const startY =
    screen === "title"
      ? 360
      : screen === "howto"
        ? 585
        : screen === "paused"
          ? 326
          : 420;
  return {
    x: FIELD_CX - w / 2,
    y: startY + index * (h + gap),
    w,
    h,
  };
}

function rectIndex(screen: Screen, x: number, y: number): number | null {
  for (let index = 0; index < menuItems(screen).length; index += 1) {
    const rect = menuRectFor(screen, index);
    if (
      rect &&
      x >= rect.x &&
      x <= rect.x + rect.w &&
      y >= rect.y &&
      y <= rect.y + rect.h
    ) {
      return index;
    }
  }
  return null;
}

function wrapMenu(index: number, length: number, direction: -1 | 1): number {
  return (index + direction + length) % length;
}

function confirmMenu(state: DeepReadonly<CaromState>): CaromState {
  if (state.screen === "title") {
    if (state.menuIndex === 0) {
      return { ...startMatch(state, "solo"), titleIndex: 0 };
    }
    if (state.menuIndex === 1) {
      return { ...startMatch(state, "versus"), titleIndex: 1 };
    }
    return {
      ...copyState(state),
      screen: "howto",
      titleIndex: 2,
      menuIndex: 0,
    };
  }
  if (state.screen === "howto") return returnToTitle(state);
  if (state.screen === "paused") {
    if (state.menuIndex === 0)
      return { ...copyState(state), screen: state.resumeScreen };
    if (state.menuIndex === 1) return startMatch(state, state.mode);
    return returnToTitle(state);
  }
  if (state.screen === "matchover") {
    if (state.menuIndex === 0) return startMatch(state, state.mode);
    return returnToTitle(state);
  }
  return copyState(state);
}

function readEdges(api: UpdateApi): Record<ActionName, boolean> {
  return ACTIONS.reduce(
    (edges, action) => ({ ...edges, [action]: api.input.pressed(action) }),
    {} as Record<ActionName, boolean>,
  );
}

function handleKeyboardMenus(
  state: DeepReadonly<CaromState>,
  edges: Record<ActionName, boolean>,
): CaromState {
  if (edges.mute) {
    // The caller mirrors the engine bit after this function returns.
  }

  if (
    (state.screen === "countdown" || state.screen === "playing") &&
    edges.pause
  ) {
    return {
      ...copyState(state),
      resumeScreen: state.screen,
      screen: "paused",
      menuIndex: 0,
    };
  }

  if (state.screen === "paused" && (edges.pause || edges.back)) {
    return { ...copyState(state), screen: state.resumeScreen };
  }

  if (state.screen === "howto" && (edges.confirm || edges.back)) {
    return returnToTitle(state);
  }

  if (state.screen === "matchover" && edges.back) {
    return returnToTitle(state);
  }

  const items = menuItems(state.screen);
  if (items.length === 0) return copyState(state);

  const up = edges["p1-up"] || edges["p2-up"];
  const down = edges["p1-down"] || edges["p2-down"];
  if (up || down) {
    return {
      ...copyState(state),
      menuIndex: wrapMenu(state.menuIndex, items.length, up ? -1 : 1),
    };
  }

  if (edges.confirm) return confirmMenu(state);
  return copyState(state);
}

function applyPointerMenus(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
  keyboardConfirmed: boolean,
): CaromState {
  if (!["title", "howto", "paused", "matchover"].includes(state.screen)) {
    return {
      ...copyState(state),
      pointerPressIndex: null,
      touchPresses: [],
    };
  }

  let next = copyState(state);
  const pointer = api.input.pointer();
  const hoverIndex = rectIndex(next.screen, pointer.x, pointer.y);
  if (hoverIndex !== null) next = { ...next, menuIndex: hoverIndex };

  const samples = api.input.pointerSamples();
  const primaryPressIndex = sampleMenuIndex(
    next.screen,
    samples,
    "mouse",
    "down",
  );
  const primaryReleaseIndex = sampleMenuIndex(
    next.screen,
    samples,
    "mouse",
    "up",
  );
  if (primaryPressIndex !== undefined) {
    next = {
      ...next,
      pointerPressIndex: primaryPressIndex,
      menuIndex: primaryPressIndex ?? next.menuIndex,
    };
  }
  if (
    !keyboardConfirmed &&
    primaryReleaseIndex !== undefined &&
    primaryReleaseIndex !== null &&
    next.pointerPressIndex === primaryReleaseIndex
  ) {
    next = confirmMenu({ ...next, menuIndex: primaryReleaseIndex });
  }
  if (primaryReleaseIndex !== undefined) {
    next = { ...copyState(next), pointerPressIndex: null };
  }

  const touchResult = applyTouchSamples(next, samples, keyboardConfirmed);
  return touchResult;
}

function sampleMenuIndex(
  screen: Screen,
  samples: readonly PointerSample[],
  device: "mouse" | "touch",
  type: "down" | "up",
): number | null | undefined {
  const sample = samples.find(
    (entry) =>
      entry.primary &&
      entry.device === device &&
      entry.type === type &&
      (entry.button === "primary" || entry.button === null),
  );
  if (!sample) return undefined;
  return rectIndex(screen, sample.x, sample.y);
}

function applyTouchSamples(
  state: DeepReadonly<CaromState>,
  samples: readonly PointerSample[],
  keyboardConfirmed: boolean,
): CaromState {
  let next = copyState(state);
  for (const sample of samples.filter((entry) => entry.device === "touch")) {
    const index = rectIndex(next.screen, sample.x, sample.y);
    if (index !== null) next = { ...next, menuIndex: index };
    if (sample.type === "down") {
      next = {
        ...next,
        touchPresses: [
          ...next.touchPresses.filter((press) => press.id !== sample.id),
          { id: sample.id, index },
        ],
      };
    } else if (sample.type === "up") {
      const start = next.touchPresses.find((press) => press.id === sample.id);
      if (
        !keyboardConfirmed &&
        start?.index !== null &&
        start?.index === index
      ) {
        next = confirmMenu({ ...next, menuIndex: index ?? next.menuIndex });
      }
      next = {
        ...copyState(next),
        touchPresses: next.touchPresses.filter(
          (press) => press.id !== sample.id,
        ),
      };
    }
  }
  return next;
}

function updateInput(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
): CaromState {
  const edges = readEdges(api);
  if (edges.mute) api.audio.setMuted(!api.audio.muted());
  const keyboardConfirmed =
    edges.confirm &&
    ["title", "howto", "paused", "matchover"].includes(state.screen);
  const afterKeyboard = handleKeyboardMenus(state, edges);
  return applyPointerMenus(afterKeyboard, api, keyboardConfirmed);
}

function requireBall(state: DeepReadonly<CaromState>): BallState {
  if (!state.ball) throw new Error("Carom: no ball is present");
  return { ...state.ball, trail: state.ball.trail.map((sample) => sample) };
}

function setBall(state: DeepReadonly<CaromState>, ball: BallState): CaromState {
  return { ...copyState(state), ball };
}

function makeDebug(): CaromDebugApi {
  return {
    version: CAROM_DEBUG_VERSION,
    clearWorld: (state) => ({ ...copyState(state), ball: null, obstacles: [] }),
    spawnBall: (state) => ({ ...copyState(state), ball: createBall() }),
    spawnObstacle: (state, index) => {
      const center = OBSTACLE_CENTERS[index];
      if (!center) throw new Error(`Carom: obstacle ${index} does not exist`);
      return {
        ...copyState(state),
        obstacles: [
          ...state.obstacles.filter((obstacle) => obstacle.index !== index),
          { index, cx: center.x, cy: center.y },
        ].sort((a, b) => a.index - b.index),
      };
    },
    reset: (state) => createTitleState(state.muted),
    reconcile: (state) => copyState(state),
    setScreen: (state, screen) => ({ ...copyState(state), screen }),
    setMode: (state, mode) => ({ ...copyState(state), mode }),
    setMenuIndex: (state, index) => ({ ...copyState(state), menuIndex: index }),
    setTitleIndex: (state, index) => ({
      ...copyState(state),
      titleIndex: index,
    }),
    setResumeScreen: (state, screen) => ({
      ...copyState(state),
      resumeScreen: screen,
    }),
    setScore: (state, p1, p2) => ({ ...copyState(state), score: { p1, p2 } }),
    setWinner: (state, side) => ({ ...copyState(state), winner: side }),
    setReceiver: (state, side) => ({ ...copyState(state), receiver: side }),
    setPaddleCy: (state, side, cy) => ({
      ...copyState(state),
      paddles: {
        ...state.paddles,
        [side]: { ...state.paddles[side], cy },
      },
    }),
    setPaddleVy: (state, side, vy) => ({
      ...copyState(state),
      paddles: {
        ...state.paddles,
        [side]: { ...state.paddles[side], drivenVy: vy },
      },
    }),
    setPaddleDriven: (state, side, driven) => ({
      ...copyState(state),
      paddles: {
        ...state.paddles,
        [side]: { ...state.paddles[side], driven },
      },
    }),
    setBallPosition: (state, x, y) =>
      setBall(state, { ...requireBall(state), x, y }),
    setBallVelocity: (state, vx, vy) =>
      setBall(state, { ...requireBall(state), vx, vy }),
    setBallSpin: (state, spin) =>
      setBall(state, { ...requireBall(state), spin }),
    setBallHeld: (state, held) =>
      setBall(state, { ...requireBall(state), held }),
    setBallHoldTimer: (state, holdTimer) =>
      setBall(state, { ...requireBall(state), holdTimer }),
    setBallServeSign: (state, serveSign) =>
      setBall(state, { ...requireBall(state), serveSign }),
    drawBallServeSign: (state) =>
      setBall(state, { ...requireBall(state), serveSign: randomServeSign() }),
    setAiTracking: (state, tracking) => ({
      ...copyState(state),
      ai: { ...state.ai, tracking },
    }),
    setAiMovement: (state, movement) => ({
      ...copyState(state),
      ai: { ...state.ai, movement },
    }),
    setMuted: (state, muted) => ({ ...copyState(state), muted }),
    snapshot: (state) => ({
      version: CAROM_DEBUG_VERSION,
      screen: state.screen,
      mode: state.mode,
      menuIndex: state.menuIndex,
      titleIndex: state.titleIndex,
      resumeScreen: state.resumeScreen,
      score: { ...state.score },
      winner: state.winner,
      muted: state.muted,
      paddles: {
        left: { ...state.paddles.left },
        right: { ...state.paddles.right },
      },
      ai: { ...state.ai },
      receiver: state.receiver,
      ball: state.ball ? { ...state.ball, speed: speed(state.ball) } : null,
      obstacles: state.obstacles.map((obstacle) => ({ ...obstacle })),
      simTime: state.simTime,
    }),
    menuItemRect: (state, index) => menuRectFor(state.screen, index),
  };
}

function registerDiagnostics(api: InitApi<CaromState>): void {
  api.diagnostics.register("screen", (state) => state.screen);
  api.diagnostics.register("mode", (state) => state.mode);
  api.diagnostics.register(
    "score",
    (state) => `${state.score.p1}-${state.score.p2}`,
  );
  api.diagnostics.register("ball pos", (state) =>
    state.ball
      ? `${state.ball.x.toFixed(1)}, ${state.ball.y.toFixed(1)}`
      : "none",
  );
  api.diagnostics.register("ball vel", (state) =>
    state.ball
      ? `${state.ball.vx.toFixed(1)}, ${state.ball.vy.toFixed(1)}`
      : "none",
  );
  api.diagnostics.register("ball speed", (state) =>
    state.ball ? speed(state.ball) : 0,
  );
  api.diagnostics.register("ball spin", (state) =>
    state.ball ? state.ball.spin : 0,
  );
  api.diagnostics.register(
    "left paddle",
    (state) =>
      `${state.paddles.left.cy.toFixed(1)}, ${state.paddles.left.vy.toFixed(1)}`,
  );
  api.diagnostics.register(
    "right paddle",
    (state) =>
      `${state.paddles.right.cy.toFixed(1)}, ${state.paddles.right.vy.toFixed(1)}`,
  );
}

function registerAudio(api: InitApi<CaromState>): void {
  const cues: readonly [
    CueName,
    number,
    number,
    number,
    NonNullable<Parameters<typeof api.audio.define>[1]["wave"]>,
  ][] = [
    [CUES.paddleHit, 580, 260, 65, "square"],
    [CUES.wallBounce, 320, 180, 55, "triangle"],
    [CUES.obstacleBounce, 760, 420, 70, "sawtooth"],
    [CUES.score, 220, 880, 180, "sine"],
  ];
  for (const [cue, freq, freqTo, durationMs, wave] of cues) {
    api.audio.define(cue, { wave, freq, freqTo, durationMs, gain: 0.16 });
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
): void {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fill();
}

function drawField(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  ctx.fillStyle = COLORS.field;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);

  ctx.strokeStyle = COLORS.line;
  ctx.lineWidth = 2;
  for (let y = 20; y < FIELD_H; y += 44) {
    ctx.beginPath();
    ctx.moveTo(NET_X, y);
    ctx.lineTo(NET_X, y + 22);
    ctx.stroke();
  }

  ctx.fillStyle = COLORS.obstacle;
  ctx.shadowColor = COLORS.obstacle;
  ctx.shadowBlur = 18;
  for (const obstacle of state.obstacles) {
    roundRect(
      ctx,
      obstacle.cx - OBSTACLE_HW,
      obstacle.cy - OBSTACLE_HH,
      OBSTACLE_W,
      OBSTACLE_H,
      10,
    );
  }
  ctx.shadowBlur = 0;

  drawPaddle(ctx, state.paddles.left, "left");
  drawPaddle(ctx, state.paddles.right, "right");
  if (state.ball) drawBall(ctx, state.ball);
}

function drawPaddle(
  ctx: CanvasRenderingContext2D,
  paddle: DeepReadonly<PaddleState>,
  side: Side,
): void {
  const x = side === "left" ? P1_X0 : P2_X0;
  const color = side === "left" ? COLORS.left : COLORS.right;
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 20;
  roundRect(ctx, x, paddle.cy - PADDLE_HALF, PADDLE_W, PADDLE_H, 8);
  ctx.shadowBlur = 0;
}

function drawBall(
  ctx: CanvasRenderingContext2D,
  ball: DeepReadonly<BallState>,
): void {
  if (ball.trail.length > 1) {
    ctx.lineCap = "round";
    for (let i = 1; i < ball.trail.length; i += 1) {
      const alpha = i / ball.trail.length;
      ctx.strokeStyle = `rgba(255, 241, 107, ${alpha * 0.45})`;
      ctx.lineWidth = 5 + alpha * 6;
      ctx.beginPath();
      ctx.moveTo(ball.trail[i - 1].x, ball.trail[i - 1].y);
      ctx.lineTo(ball.trail[i].x, ball.trail[i].y);
      ctx.stroke();
    }
  }

  ctx.fillStyle = COLORS.ball;
  ctx.shadowColor = COLORS.ball;
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawHud(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  ctx.fillStyle = COLORS.text;
  ctx.font = "700 58px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(String(state.score.p1), FIELD_CX - 120, 74);
  ctx.fillText(String(state.score.p2), FIELD_CX + 120, 74);
  ctx.font = "700 20px ui-sans-serif, system-ui, sans-serif";
  ctx.fillStyle = COLORS.dim;
  ctx.fillText(MODE_LABEL[state.mode], FIELD_CX, 106);
  if (state.screen === "countdown" && state.ball) {
    ctx.font = "800 72px ui-sans-serif, system-ui, sans-serif";
    ctx.fillStyle = COLORS.text;
    ctx.fillText(Math.ceil(state.ball.holdTimer).toString(), FIELD_CX, 224);
  }
}

function drawMenu(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  const items = menuItems(state.screen);
  if (items.length === 0) return;

  ctx.fillStyle = COLORS.panel;
  roundRect(
    ctx,
    FIELD_CX - 260,
    278,
    520,
    state.screen === "howto" ? 380 : 330,
    16,
  );

  if (state.screen === "title") {
    ctx.font = "900 104px ui-sans-serif, system-ui, sans-serif";
    ctx.fillStyle = COLORS.text;
    ctx.textAlign = "center";
    ctx.fillText(TITLE_TEXT, FIELD_CX, 220);
    ctx.font = "600 22px ui-sans-serif, system-ui, sans-serif";
    ctx.fillStyle = COLORS.dim;
    ctx.fillText("curve the rally, bank the point", FIELD_CX, 258);
  } else if (state.screen === "howto") {
    drawHowTo(ctx);
  } else if (state.screen === "paused") {
    drawOverlayTitle(ctx, "PAUSED", 252);
  } else if (state.screen === "matchover") {
    drawOverlayTitle(
      ctx,
      `${state.winner === "left" ? "LEFT" : "RIGHT"} WINS`,
      270,
    );
    ctx.font = "700 36px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(`${state.score.p1} - ${state.score.p2}`, FIELD_CX, 330);
  }

  for (let index = 0; index < items.length; index += 1) {
    const rect = menuRectFor(state.screen, index);
    if (!rect) continue;
    const active = index === state.menuIndex;
    ctx.fillStyle = active ? COLORS.ball : "rgba(255, 255, 255, 0.08)";
    roundRect(ctx, rect.x, rect.y, rect.w, rect.h, 8);
    ctx.fillStyle = active ? COLORS.field : COLORS.text;
    ctx.font = "800 26px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(items[index], rect.x + rect.w / 2, rect.y + rect.h / 2);
  }
  ctx.textBaseline = "alphabetic";
}

function drawOverlayTitle(
  ctx: CanvasRenderingContext2D,
  text: string,
  y: number,
): void {
  ctx.font = "900 54px ui-sans-serif, system-ui, sans-serif";
  ctx.fillStyle = COLORS.text;
  ctx.textAlign = "center";
  ctx.fillText(text, FIELD_CX, y);
}

function drawHowTo(ctx: CanvasRenderingContext2D): void {
  drawOverlayTitle(ctx, "HOW TO PLAY", 170);
  ctx.fillStyle = COLORS.text;
  ctx.font = "700 24px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "center";
  const lines = [
    "Left paddle: W / S",
    "Right paddle: Arrow Up / Arrow Down",
    "P or Escape pauses. M mutes.",
    "Move as you hit to bend the ball with spin.",
    "Use the green bars for sharp bank shots.",
  ];
  lines.forEach((line, index) =>
    ctx.fillText(line, FIELD_CX, 245 + index * 48),
  );
}

export const game: Game<CaromState, CaromDebugApi> = {
  initialize(api: InitApi<CaromState>): [CaromState, CaromDebugApi] {
    for (const action of ACTIONS) {
      api.input.register(action, { keys: [...BINDINGS[action]] });
    }
    registerAudio(api);
    registerDiagnostics(api);
    return [createTitleState(false), makeDebug()];
  },

  update(
    state: DeepReadonly<CaromState>,
    api: UpdateApi,
    dt: number,
  ): CaromState {
    let next = { ...updateInput(state, api), simTime: state.simTime + dt };
    next = advanceScreen(next, dt, api);
    return { ...next, muted: api.audio.muted() };
  },

  render(state: DeepReadonly<CaromState>, api: RenderApi): void {
    const ctx = api.ctx;
    drawField(state, ctx);
    if (state.screen === "playing" || state.screen === "countdown") {
      drawHud(state, ctx);
    } else if (state.screen === "paused") {
      drawHud(state, ctx);
      ctx.fillStyle = COLORS.shade;
      ctx.fillRect(0, 0, FIELD_W, FIELD_H);
      drawMenu(state, ctx);
    } else {
      if (state.screen === "matchover") drawHud(state, ctx);
      ctx.fillStyle = COLORS.shade;
      ctx.fillRect(0, 0, FIELD_W, FIELD_H);
      drawMenu(state, ctx);
    }
  },
};
