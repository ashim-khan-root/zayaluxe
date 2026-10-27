# Known issues

Open defects and environment traps, with the evidence needed to fix them. Not a bug tracker —
each entry states what breaks, why, and what the options are.

---

## KI-1 — `medusa build` fails in this monorepo (React 18 vs React 19 hoisting)

**Breaks:** `npm run build` at the root, and CI's build step. `medusa develop` / `medusa
db:migrate` are unaffected.

**Symptom**

```
info:    Generating types...
error:   Unable to compile frontend source
[vite:css] [postcss] Patterns must be a string (non empty) or an array of strings
```

**Why**

1. `@medusajs/admin-bundler` builds a Tailwind config whose `content` array includes
   `require.resolve("@medusajs/ui")` and `require.resolve("@medusajs/dashboard")`.
2. Those resolves are wrapped in `try/catch`, and on failure the variable stays `""`
   (`admin-bundler/dist/index.js`, `createTailwindConfig`). An empty string then goes straight
   into `fast-glob`, which throws exactly the message above. So the real error is a failed
   resolve, misreported as a CSS error.
3. `@medusajs/ui` is currently installed *nested* at
   `node_modules/@medusajs/dashboard/node_modules/@medusajs/ui` instead of hoisted to
   `node_modules/@medusajs/ui`, so `require.resolve` from `admin-bundler` cannot see it.
4. It nests because it cannot hoist: `@medusajs/ui@4.2.8` peers `react@^18.3.1`, while the
   workspace root holds `react@19.3.1` (required by Next 16 for the storefront). npm refuses
   two React majors at the same position — adding `@medusajs/ui` + `react@18` to the root
   `package.json` produces an `ERESOLVE` against `@medusajs/ui`'s peer.

**Why the storefront is not the problem:** `next build` succeeds today — `/en` and `/ar`
prerender static, 4 pages, no errors. Only Medusa's admin bundle is affected.

**Options**

| Option | Effect | Cost |
|---|---|---|
| Split installs: drop `apps/*` from root `workspaces`, keep `packages/*`; backend and storefront each get their own `package-lock.json` and `node_modules` | Removes the hoisting conflict by construction — the backend tree only ever has React 18. Matches how Medusa projects are deployed (backend and storefront as separate projects) | Root scripts + CI workflow rewrite, 3 lockfiles, `architecture.md` §3 needs an ADR |
| Link shim: a `postinstall` that symlinks `node_modules/@medusajs/dashboard/node_modules/@medusajs/ui` to `node_modules/@medusajs/ui` | Two-line fix; the path is only used as a Tailwind glob, never imported | Papers over an npm hoisting gap; must survive `npm ci` and is invisible to anyone reading package.json |
| Put the backend on React 19 | Would hoist cleanly | Not possible — `@medusajs/ui` peer is `^18.3.1` and the admin dashboard is React 18 |

**Not the cause** (tested and ruled out): Tailwind v4 leaking from the storefront into the
admin build. Installing Tailwind 3.4.19 + postcss into `apps/backend` changes nothing —
`admin-bundler` carries its own Tailwind 3 copy. Those two devDependencies were removed.

---

## KI-2 — npm 11 blocks 6 install scripts

`npm install` reports:

```
npm warn allow-scripts 6 packages have install scripts not yet covered by allowScripts:
  @swc/core@1.16.20, @medusajs/telemetry@2.22.1, msgpackr-extract@3.0.4,
  @parcel/watcher@2.6.0, esbuild@0.25.12, esbuild@0.28.2
```

npm 11's script gate skips these unless approved. Verified after the fact: `require("esbuild")`
→ 0.25.12 and `require("@swc/core")` → 1.16.20 both load, because their platform binaries ship
as `optionalDependencies` (`@esbuild/win32-x64`), not as postinstalls.

**Still unresolved:** `@parcel/watcher` and `msgpackr-extract` need `node-gyp` builds. Neither is
exercised yet (no watch mode, no msgpack path), but `medusa develop` may want the watcher.
If it does: `npm approve-scripts <pkg>` and rerun the install.

---

## KI-3 — Next 16 deprecates `middleware.ts`

`next build` warns: `middleware-to-proxy`. Next 16 renames the convention to `proxy.ts`. Not a
failure; rename `apps/storefront/src/middleware.ts` → `src/proxy.ts` (and its export) when the
locale routing is next touched.
