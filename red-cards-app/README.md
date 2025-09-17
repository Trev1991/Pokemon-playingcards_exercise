# Red Table Cards

A tiny single-page app that draws cards from the Deck of Cards API and lays them onto a red table background, styled to mimic the provided GIF (with a red felt instead of green).

## How to run
1. Unzip.
2. Open `index.html` in a modern browser. If your browser blocks network calls when opening local files, run a tiny local server (examples):
   - Python: `python3 -m http.server 8000` then visit http://localhost:8000/
   - VS Code: Live Server extension.
3. Click **GIMME A CARD!** to draw. When the deck is empty, it auto-shuffles a fresh deck.

## Notes
- Uses the official Deck of Cards API (`/api/deck/new/shuffle/` and `/api/deck/{deck_id}/draw/?count=1`).
- No build tools; plain HTML/CSS/JS.
