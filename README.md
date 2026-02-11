# Bible Study Reading MVP

React + TypeScript + MUI reading app MVP.

## Requirements

- Node.js 18+
- pnpm 10+

Install pnpm if needed:

```bash
npm i -g pnpm
```

## Install

```bash
pnpm install
```

## Run

```bash
pnpm dev
```

Default local URL is usually `http://localhost:5173`.

## Build

```bash
pnpm build
pnpm preview
```

## Capacitor Setup (Android/iOS Shell)

Capacitor has been wired into this repo with:

- `capacitor.config.ts`
- `@capacitor/core` dependency
- `@capacitor/cli` dev dependency
- scripts in `package.json`

### 1. Install dependencies

```bash
pnpm install
```

### 2. Add mobile platforms (first time only)

```bash
pnpm add @capacitor/android @capacitor/ios
pnpm exec cap add android
pnpm exec cap add ios
```

### 3. Build web assets and sync to native projects

```bash
pnpm build:mobile
```

Equivalent commands:

```bash
pnpm build
pnpm cap:sync
```

### 4. Open native projects

```bash
pnpm cap:open:android
pnpm cap:open:ios
```

Then run from Android Studio / Xcode.

## Useful Scripts

- `pnpm dev` - run Vite dev server
- `pnpm build` - build web app
- `pnpm preview` - preview built app
- `pnpm cap:sync` - sync web build and plugin changes to native projects
- `pnpm cap:copy` - copy web build to native projects
- `pnpm cap:open:android` - open Android Studio project
- `pnpm cap:open:ios` - open Xcode project
- `pnpm build:mobile` - build + capacitor sync

## MVP Features

- Article list page + article reading page
- Bookmark persistence via `localStorage`
- Saved vocabulary via `localStorage`
- Text selection to save words (Dialog flow)
- Subtle Bible Insight section in article view

## Project Structure

```text
src/
  components/
  pages/
  layouts/
  data/
  hooks/
  utils/
```
