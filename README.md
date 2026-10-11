# Carom

Carom is a top-down paddle duel for the browser. Two paddles trade shots across
a dark field, with a pair of fixed obstacles turning every rally into a small
bank-shot puzzle. Paddle motion at contact adds spin, so a well-timed swing can
curve the ball after the bounce and pull it around the center bars.

## Install

```sh
npm ci
```

## Development

```sh
npm run dev
```

Vite serves the game with hot reload. Open the local URL it prints and play in
the browser.

## Production Build

```sh
npm run build
```

The static site is written to `dist/`, with `dist/index.html` as the entry
point. It can be served from the root of any static host.

## Controls

- Left paddle: `W` / `S`
- Right paddle in Versus: `ArrowUp` / `ArrowDown`
- Solo mode: either paddle key pair controls the left paddle
- Confirm menu item: `Enter` or `Space`
- Back / pause: `Escape`
- Pause: `P`
- Mute: `M`

First to 11 wins, with a two-point lead required.
