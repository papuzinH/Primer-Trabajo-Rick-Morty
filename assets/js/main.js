const Card = personaje => {
  const { id, name, status, species, image } = personaje
  return `
      <div class="column is-one-quarter-desktop is-full-mobile">
          <a class="handleOpenModal" data-id=${id}><div class="card">
              <div class="card-image">
              <figure class="image is-4by3">
                  <img src="${image}" alt="Placeholder image">
              </figure>
              </div>
              <div class="card-content">
              <div class="media">
                  <div class="media-left">
                  <figure class="image is-48x48">
                      <img src="${image}" alt="Placeholder image">
                  </figure>
                  </div>
                  <div class="media-content">
                      <p class="title is-4">${name}</p>
                      <p class="subtitle is-6">${species}</p>
                  </div>
              </div>
              <div class="content">
                  <p>${status}</p>
              </div>
              </div>
          </div></a>
      </div>
  `
}
const Modal = personaje => {
  console.log(personaje)
  const { id, name, status, species, image, episodesData } = personaje
  //recorro todos los episodios y los voy acumulando en episodesLi
  let episodesLi = ''
  episodesData.forEach(({ name }) => {
    episodesLi += `<li class="episode-list-item">${name}</li>`
  })
  return `
  <div class="box">
      <article class="media">
          <div class="media-left">
              <figure class="image is-64x64">
                  <img src=${image} alt="Image">
              </figure>
              </div>
              <div class="media-content">
              <div class="content">
                  <h3 class="pj-title">
                  ${name}
                  </h3>
                  <div class="content-desc">
                  <p><span class="desc-status">Status:  </span>${status}</p>
                  <p><span class="desc-species">Species:  </span>${species}</p>
                  </div>
                  <h3 class="episodes-title">Episodes</h3>
                  <ul class="episode-list">${episodesLi}</ul>
              </div>
              <nav class="level is-mobile">
                    <div class="level-left">
                      <a class="level-item" aria-label="retweet">
                          <span class="icon is-small">
                            <i class="fas fa-retweet" aria-hidden="true"></i>
                          </span>
                        </a>
                        <a class="level-item" aria-label="like">
                          <span class="icon is-small">
                            <i class="fas fa-heart" aria-hidden="true"></i>
                        </span>
                      </a>
                  </div>
              </nav>
          </div>
      </article>
  </div>
  `
}
const appendElements = (characters, borrarGrilla = false) => {
  const $grid = document.querySelector('.grid');
  if (borrarGrilla) {
    $grid.innerHTML = null;
  }
  characters.forEach(character => {
    const cardItem = Card(character);
    $grid.innerHTML += cardItem;
  });
  const $modalOpenArr = document.querySelectorAll('.handleOpenModal');
  const $modal = document.querySelector('.modal');
  const $modalContent = document.querySelector('.modal-content');
  const $modalClose = document.querySelector('.modal-close');
  $modalClose.addEventListener('click', () => {
    $modal.classList.remove('is-active');
  })
    $modalOpenArr.forEach(($card) => {
      $card.addEventListener('click', () => {
        const id = $card.dataset.id;
        const character = characters.find(ch => ch.id == id); //Buscamos por id en el array
      const { episode } = character
      const getEpisodesData = async () => {
        return Promise.all(episode.map(item => getEpisode(item))) //Resuelvo cada una de las promesas (fetchs de episodes)
      }
      getEpisodesData().then(episodesData => {
        const characterWithEpisodes = { ...character, episodesData } //Junto los datos que tenia del character + sus episodes
        $modalContent.innerHTML = Modal(characterWithEpisodes) //Le mando todo junto a modal
        $modal.classList.add('is-active'); //Activo el modal
      })
    })
  })
}
const getCharacters = async (baseURL, from, to) => {
  const charactersRange = Array.from({ length: to - from + 1 }, (_, index) => index + 1).join(',');
  const url = `${baseURL}character/${charactersRange}`;
  const response = await fetch(url);
  const characters = await response.json();
  return characters;
}
const getEpisode = async (baseURL) => {
  const url = `${baseURL}`;
  const response = await fetch(url);
  const episode = await response.json();
  return episode;
}
const getCharactersByQuery = async (baseURL, valorABuscar) => {
  const url = `${baseURL}character/?name=${valorABuscar}`;
  const response = await fetch(url);
  const characters = await response.json();
  return characters;
}
const main = async () => {
  const baseURL = 'https://rickandmortyapi.com/api/';
  const characters = await getCharacters(baseURL, 1, 100);
  appendElements(characters)
  const $submit = document.querySelector('.handle_search');
  $submit.addEventListener('click', async (event) => {
    event.preventDefault();
    const $input = document.querySelector('.input_search')
    const value = $input.value;
    const charactersByQuery = await getCharactersByQuery(baseURL, value)
    const characters = charactersByQuery.results;
    appendElements(characters, true);
  })
}
main();




/*

const Card = personaje => {
  const { id, name, status, species, image } = personaje
  return `
  <div class="column is-one-quarter-desktop is-half-tablet is-full-mobile">
    <div class="card openModal">
      <div class="card-image">
        <figure class="image is-4by3">
          <img src="${image}" alt="Placeholder image">
        </figure>
      </div>
      <div class="card-content">
        <div class="media">
          <div class="media-left">
            <figure class="image is-48x48">
              <img src="${image}" alt="Placeholder image">
            </figure>
          </div>
          <div class="media-content">
            <p class="title is-4">${name}</p>
            <p class="subtitle is-6">${species}</p>
          </div>
        </div>

        <div class="content">
          <p>${status}</p>
        </div>
      </div>
    </div>
  </div>
  `
}

const Modal = personaje => {
  const { name, status, species, image } = personaje
  return `
  <div class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <article class="media">
          <div class="media-left">
            <figure class="image is-64x64">
              <img src=${image} alt="Image">
            </figure>
          </div>
          <div class="media-content">
            <div class="content">
              <p>
                <strong>${name}</strong>
                <br>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean efficitur sit amet massa fringilla
                egestas. Nullam condimentum luctus turpis.
              </p>
            </div>
            <nav class="level is-mobile">
              <div class="level-left">
                <a class="level-item" aria-label="retweet">
                  <span class="icon is-small">
                    <i class="fas fa-retweet" aria-hidden="true"></i>
                  </span>
                </a>
                <a class="level-item" aria-label="like">
                  <span class="icon is-small">
                    <i class="fas fa-heart" aria-hidden="true"></i>
                  </span>
                </a>
              </div>
            </nav>
          </div>
        </article>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close"></button>
  </div>
  `

}


const appendElements = (characters, cleanGrid = false) => {
  const grid = document.querySelector(".grid");
  if (cleanGrid) {
    grid.innerHTML = null;
  }
  characters.forEach(one_character => {
    const cardItem = Card(one_character);
    grid.innerHTML += cardItem;
  })

  const modalOpen = document.querySelectorAll(".openModal");
  modalOpen.forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      console.log(id);
    })
  })
}


const getCharacters = async (baseURL, from, to) => {
  //Crear un array de numeros separados por comas:
  const charactersRange = Array.from({ length: to - from + 1 }, (_, index) => index + 1).join(',');
  const url = `${baseURL}character/${charactersRange}`;
  const response = await fetch(url);
  const characters = await response.json();
  return characters;
}

const getCharactersByQuery = async (baseURL, valueToSearch) => {
  const url = `${baseURL}character/?name=${valueToSearch}`;
  const response = await fetch(url);
  const characters = await response.json();
  return characters;
}

const main = async () => {
  const baseURL = 'https://rickandmortyapi.com/api/';
  const characters = await getCharacters(baseURL, 1, 40);
  appendElements(characters);
  const submit = document.querySelector(".search-button");
  submit.addEventListener("click", async (event) => {
    event.preventDefault();
    const inputSearch = document.querySelector(".search-input");
    const inputValue = inputSearch.value;
    const charactersByQuery = await getCharactersByQuery(baseURL, inputValue)
    const characters = charactersByQuery.results;
    appendElements(characters, true);

  })
}




main();

*/