#!/usr/bin/env node

// Rückwärtskompatibler Alias. Der allgemeine Builder verarbeitet dieses
// und alle zukünftigen Reels über timeline/reel-build-manifest.json.
await import('./build-finance-reel.mjs');
