# Repository Governance Contract

Policy ID: `ng-repo-governance/1.0.0`
Bootstrap record: owner-authorized documentation commit on 2026-08-27; the direct-bootstrap exception expires with this commit.

## Identity

- Repository: `Yesol-Pilot/WebPilot-Engine`
- Lifecycle class: `product`
- Current owner: `Yesol-Pilot`
- Intended owner: `NeoGenesisAI`
- Canonical branch: `master`
- Canonical-branch target: `main`
- Visibility: `public`
- Production status: `MAINTENANCE_REPAIR`
- Transfer state: `REQUIRED`
- Archive relationship: `NONE_DECLARED`

`UNKNOWN` means not independently verified and must never be reported as PASS.

## Purpose

WebPilot Engine is a public NeoGenesis AI-native 3D world-generation product. Its public repository, deployment, dependency graph, generated assets, security posture, license, and product claims must remain aligned.

## Root-cause findings

1. The repository is approximately 611 MiB and requires a documented large-file and Git-history storage plan.
2. The latest observed canonical-branch CI failed and the repository has been inactive since 2026-05-14, so current buildability and deployment parity are not proven.
3. A public credential-registry document records that `.env` was historically tracked and enumerates client and server credential variable classes. No current secret value is proven by that document, but the full public Git history must be treated as unverified until scanned.
4. Public client-prefixed credential variables create a design risk even when values are not currently committed; only values explicitly safe for public exposure may be used client-side.
5. Product source, generated 3D assets, media, metadata, scripts, and deployment material require separate retention and distribution decisions.
6. Public claims, README links, deployed behavior, dependency versions, and security contact are not covered by one recurring release and maintenance gate.
7. The repository still uses `master`, which must be normalized only after GitHub Pages, Vercel, badges, links, CI, and local automation are verified.

## Immediate remediation

- [ ] Freeze production deployment changes until the canonical build and preview are green.
- [ ] Mirror-clone the full repository and run a redacted full-history secret scan.
- [ ] Treat any historical credential finding as compromised until revoked, rotated, or proven invalid; deleting the current file is insufficient.
- [ ] Remove or rewrite public documentation that normalizes tracked environment files or client-side secret use.
- [ ] Audit every `NEXT_PUBLIC_*` value and prove it is intentionally public; move privileged operations behind server boundaries.
- [ ] Run dependency and license audits and pin runtime and build tool versions.
- [ ] Run `git-sizer`, identify large blobs, and move generated assets and release artifacts to LFS, releases, or object storage.
- [ ] Restore canonical CI and verify the deployed preview from the exact commit.
- [ ] Transfer the existing repository to `NeoGenesisAI`, preserving public visibility and repository identity.

## Required checks

Merge checks:

- [ ] format and lint
- [ ] TypeScript typecheck
- [ ] unit and deterministic generation tests
- [ ] production Next.js build
- [ ] secret scan and dependency audit
- [ ] license and public-asset provenance checks
- [ ] repository-governance validation

Release checks for the exact candidate SHA:

- [ ] Vercel or approved preview deployment
- [ ] critical route and API boundary smoke tests
- [ ] 3D asset loading, fallback, timeout, and error behavior
- [ ] public client bundle scan for privileged keys or endpoints
- [ ] security headers, privacy, telemetry, and consent verification
- [ ] desktop and mobile visual review
- [ ] production promotion and rollback evidence

## Pull-request and branch rules

- One task, one branch, one isolated worktree.
- Draft inactivity limit: 14 days; maximum stack depth: 3.
- Ready WIP limit: 5; Draft WIP limit: 10.
- PRs require merge intent and resolved review conversations.
- Squash is the default merge method.
- Canonical branches are not force-pushed or deleted.

## Security and evidence status

- Full-history secret scan: `REQUIRED`
- Active credential disposition: `UNKNOWN`
- Dependency audit: `UNKNOWN`
- Large-history remediation: `REQUIRED`
- Canonical build: `FAILED_OR_STALE`
- Deployment parity: `UNKNOWN`
- Rollback verification: `REQUIRED`

## Exit criteria

The repository becomes `TRANSFERRED_COMPLIANT` only when the public Git history is cleared or remediated, active credentials are terminally classified, CI and preview deployment pass from one exact commit, large-file storage is documented, client/server credential boundaries are enforced, ownership is transferred to `NeoGenesisAI`, and production promotion and rollback are evidenced.

The presence of this file alone is not compliance.
