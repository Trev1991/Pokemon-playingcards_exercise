// Flashy Pokémon Trio - uses PokéAPI
// Endpoints used and documented:
// - GET /pokemon?limit=&offset=  (resource list, pagination) - https://pokeapi.co/docs/v2
// - GET /pokemon/{name or id} -> sprites + species url      - https://pokeapi.co/docs/v2
// - GET /pokemon-species/{name or id} -> flavor_text_entries - https://pokeapi.co/docs/v2

(() => {
  const grid = document.getElementById('grid');
  const goBtn = document.getElementById('go');
  const toastEl = document.getElementById('toast');

  function toast(msg, ms=1400){
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(()=> toastEl.classList.remove('show'), ms);
  }

  const j = (url) => fetch(url).then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
    return r.json();
  });

  function pickN(arr, n){
    const copy = arr.slice();
    const out = [];
    while(out.length < n && copy.length){
      const i = Math.floor(Math.random() * copy.length);
      out.push(copy.splice(i,1)[0]);
    }
    return out;
  }

  function skeletonCards(){
    grid.innerHTML = '';
    for (let i=0;i<3;i++){
      const el = document.createElement('article');
      el.className = 'card skeleton';
      el.innerHTML = '<div class="media"></div><h3>Loading…</h3><p class="desc"> </p>';
      grid.appendChild(el);
    }
  }

  function renderCards(list){
    grid.innerHTML = list.map(p => `
      <article class="card">
        <div class="media">
          ${p.image ? `<img src="${p.image}" alt="${p.name}">` : ''}
        </div>
        <h3>${p.name}</h3>
        <p class="desc">${p.description}</p>
      </article>
    `).join('');
  }

  function getAllNames(){
    // ask for a big page so we don't have to paginate client-side
    return j('https://pokeapi.co/api/v2/pokemon?limit=20000&offset=0').then(d => d.results);
  }

  function getThree(){
    return getAllNames()
      .then(list => pickN(list, 3))
      .then(chosen =>
        Promise.all(chosen.map(p =>
          j(p.url).then(pkmn => {
            const image =
              (pkmn.sprites && pkmn.sprites.other && pkmn.sprites.other['official-artwork'] && pkmn.sprites.other['official-artwork'].front_default)
              || pkmn.sprites.front_default || '';
            return j(pkmn.species.url).then(species => {
              const en = (species.flavor_text_entries || []).find(e => e.language && e.language.name === 'en');
              const desc = en ? en.flavor_text.replace(/[\f\n\r]+/g, ' ').replace(/\u00AD/g,' ').replace(/\s{2,}/g,' ').trim()
                              : 'No English description found.';
              return { name: pkmn.name, image, description: desc };
            });
          })
        ))
      );
  }

  function loadThree(){
    goBtn.disabled = true;
    skeletonCards();
    getThree()
      .then(renderCards)
      .catch(err => {
        console.error(err);
        toast('Something went wrong. Try again.');
      })
      .finally(() => { goBtn.disabled = false; });
  }

  goBtn.addEventListener('click', loadThree);

  // initial render
  loadThree();
})();
