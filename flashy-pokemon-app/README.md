# Flashy Pokémon Trio

A single-page app that fetches three random Pokémon (name, image, English species description) from **PokéAPI**, with a flashy animated background.

## How to run
1. Unzip the folder.
2. Open `index.html` in your browser. If your browser blocks network calls from `file://`, run a tiny local server (e.g. `python3 -m http.server 8000`) and open `http://localhost:8000/`.
3. Click **GOTTA CATCH EM ALL** to refresh a new trio.

## Endpoints referenced
- `GET /api/v2/pokemon?limit=...&offset=...` – paginated list of Pokémon, we request a large page to have the full list client-side.
- `GET /api/v2/pokemon/{id|name}` – includes `sprites` and a `species.url`.
- `GET /api/v2/pokemon-species/{id|name}` – includes `flavor_text_entries` (we pick English).

See: https://pokeapi.co/docs/v2

## Notes
- We prefer `sprites.other['official-artwork'].front_default` and fall back to `sprites.front_default` if missing.
- Description text from `flavor_text_entries` often contains line breaks/soft hyphens; we clean them for nicer display.
