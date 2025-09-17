// Red Table Cards - uses Deck of Cards API
// Docs: https://www.deckofcardsapi.com/ (draw endpoint & deck_id flow)

(() => {
  const btn = document.getElementById('drawBtn');
  const table = document.getElementById('table');
  const hud = document.getElementById('hud');
  const toastEl = document.getElementById('toast');

  let deckId = null;
  let z = 1; // stacking order for cards

  function toast(msg, ms=1500){
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(()=> toastEl.classList.remove('show'), ms);
  }

  function getJSON(url){
    return fetch(url).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    });
  }

  function shuffleNewDeck(){
    btn.disabled = true;
    hud.textContent = 'shuffling deck…';
    // Shuffle to get a deck_id
    getJSON('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(d => {
        deckId = d.deck_id;
        hud.textContent = `cards remaining: ${d.remaining}`;
        btn.disabled = false;
      })
      .catch(err => {
        console.error(err);
        hud.textContent = 'deck error — retrying…';
        toast('Could not initialize deck. Retrying…');
        setTimeout(shuffleNewDeck, 1000);
      });
  }

  function drawOne(){
    if (!deckId) return;
    btn.disabled = true; // prevent double taps
    getJSON(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
      .then(payload => {
        const ok = payload && payload.success && payload.cards && payload.cards.length;
        if (!ok) throw new Error('no card returned');
        const c = payload.cards[0];

        // Create and place the card
        const img = new Image();
        img.src = c.image;
        img.alt = `${c.value} of ${c.suit}`;
        img.className = 'card';
        img.style.zIndex = String(++z);

        // random rotation and position (avoid clipping edges)
        const angle = (Math.random() * 30) - 15; // -15..15 deg
        const pad = 24;
        const tableW = table.clientWidth;
        const tableH = table.clientHeight;
        const w = 130, h = 182;
        const x = Math.max(pad, Math.min(tableW - w - pad, Math.random() * (tableW - w)));
        const y = Math.max(pad+44, Math.min(tableH - h - pad, Math.random() * (tableH - h))); // keep away from toolbar

        img.style.left = `${x}px`;
        img.style.top = `${y}px`;
        img.style.transform = `rotate(${angle}deg)`;

        table.appendChild(img);

        hud.textContent = `cards remaining: ${payload.remaining}`;
        if (payload.remaining <= 0){
          btn.textContent = 'NO MORE CARDS';
          btn.disabled = true;
          toast('Deck empty. Shuffling a new one…', 1200);
          setTimeout(() => {
            // Clear table, reshuffle
            table.querySelectorAll('.card').forEach(el => el.remove());
            z = 1;
            btn.textContent = 'GIMME A CARD!';
            shuffleNewDeck();
          }, 1400);
          return;
        }
      })
      .catch(err => {
        console.error(err);
        toast('Draw failed. Try again.');
      })
      .finally(() => {
        if (deckId) btn.disabled = false;
      });
  }

  btn.addEventListener('click', drawOne);

  // Init
  shuffleNewDeck();
})();
