# Build Status

## Active Work
- [x] Drafted updated prompt, reader, and status docs aligned with v0 vibe-coding conventions.
- [ ] Validate documentation against future design prompts in staging before rollout.

## Upcoming
- [ ] Prototype optional tag/drive-time filters as client components respecting current data immutability.
- [ ] Evaluate localized copy variants (EN/IT) once German baseline is approved.

## Risks
- Documentation drift if Tailwind tokens or layout primitives change without synchronized updates.
- Rate limit spikes from Deribit API may require clarifying fallback messaging in the prompt.

## Decisions
- Keep chip navigation sticky with current shadow treatment to preserve recognisable brand feel.
- Prioritize deterministic data loaders over real-time fetches to stay Vercel hobby-tier friendly.
