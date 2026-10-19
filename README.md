# Naruto Draft — Shinobi Auction Game

A browser-based fantasy character auction game built with React and Vite. Draft a 6-shinobi squad (Captain, Attacker, Tank, Support, Medic, and Traitor) within a $30 budget in either Solo VS CPU or Local 1v1 mode.

## Features
- **50-Character Shinobi Roster**: All characters include verified localized WebP artwork, canon role affinities, stats, and traitor risks.
- **Dynamic Auction Engine**: Turn-based bidding, $0 zero-claim opportunities, outbid cascades, and auto-assignment.
- **Smart CPU AI**: Strategic valuation, dynamic traitor liability mitigation, and real-time bidding decisions.
- **Battlefield Gameplay Atmosphere**: Fullscreen retro-pixelated Naruto battlefield gameplay backdrop with 16-bit aesthetic and dark translucent navy HUD panels.
- **Pure Client-Side SPA**: Zero runtime backend or external network dependencies needed during gameplay.

## Scripts
```bash
# Start local development server
npm run dev

# Run linting
npm run lint

# Build production bundle
npm run build

# Preview production build locally
npm run preview

# Verify all 50 character images exist locally
npm run check:images

# Import/update missing character artwork (Dev Tooling only)
npm run import:artwork
```

## Deployment to Vercel
This project is configured for seamless deployment to Vercel with zero additional configuration needed:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
