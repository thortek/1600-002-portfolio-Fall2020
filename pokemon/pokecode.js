// Reusable async function to fetch data from the provided url
async function getAPIData(url) {
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

// now, use the async getAPIData function
function loadPage() {
  getAPIData(`https://pokeapi.co/api/v2/pokemon?limit=3`).then(
    //?limit=25&offset=800
    async (data) => {
      for (const pokemon of data.results) {
        await getAPIData(pokemon.url).then((pokeData) => {
          populatePokeCard(pokeData)
        })
      }
    },
  )
}

const pokeGrid = document.querySelector('.pokemonGrid')
const loadButton = document.querySelector('.load')
const newPokemonButton = document.querySelector('.newPokemon')

newPokemonButton.addEventListener('click', () => {
    let pokeName = prompt('What is your new Pokemon name?')
  let newPokemon = new Pokemon(
    pokeName,
    400,
    200,
    ['gorge', 'sleep', 'cough'],
    ['eat', 'study','code'])
    populatePokeCard(newPokemon)
    // let's find pokemon by height or weight and combine to make new instances
})

loadButton.addEventListener('click', () => {
  loadPage()
  //loadButton.hidden = true
  loadButton.disabled = true
})

function populatePokeCard(singlePokemon) {
  let pokeScene = document.createElement('div')
  pokeScene.className = 'scene'
  let pokeCard = document.createElement('div')
  pokeCard.className = 'card'
  pokeCard.addEventListener('click', function () {
    pokeCard.classList.toggle('is-flipped')
  })
  pokeCard.appendChild(populateCardFront(singlePokemon))
  pokeCard.appendChild(populateCardBack(singlePokemon))
  pokeScene.appendChild(pokeCard)
  pokeGrid.appendChild(pokeScene)
}

function populateCardFront(pokemon) {
  let pokeFront = document.createElement('div')
  pokeFront.className = 'card__face card__face--front'
  let frontLabel = document.createElement('p')
  frontLabel.textContent = pokemon.name
  let frontImage = document.createElement('img')
  frontImage.src = `../images/pokemon/${getImageFileName(pokemon)}.png`
  pokeFront.appendChild(frontImage)
  pokeFront.appendChild(frontLabel)
  return pokeFront
}

function populateCardBack(pokemon) {
  let pokeBack = document.createElement('div')
  pokeBack.className = 'card__face card__face--back'
  let backLabel = document.createElement('p')
  backLabel.textContent = `${pokemon.moves.length} moves`
 //backLabel.addEventListener('click', () => getMovesDetails(pokemon.moves))
  pokeBack.appendChild(backLabel)
  return pokeBack
}

function getMovesDetails(pokemonMoves) {

  const nonNullMoves = pokemonMoves.filter(async (move) => {
    if(!move.move) return
    const moveData = await getAPIData(move.move.url)
    console.log(moveData.accuracy, moveData.power)
    if ((moveData.accuracy && moveData.power) !== null) {
      return moveData
    }
  })
  Promise.all(nonNullMoves).then((values) => {
    console.log(values)
  })
  
  
/*   const result = pokemonMoves.reduce(async (acc, move) => {
    const moveData = await getAPIData(move.move.url)
    console.log(moveData.accuracy, moveData.power)
  }, {}) */
}

function getImageFileName(pokemon) {
  if (pokemon.id < 10) {
    return `00${pokemon.id}`
  } else if (pokemon.id > 9 && pokemon.id < 100) {
    return `0${pokemon.id}`
  } else if (pokemon.id > 99 && pokemon.id < 810) {
    return `${pokemon.id}`
  }
  return `pokeball`
}

function Pokemon(name, height, weight, abilities, moves) {
    this.name = name
    this.height = height
    this.weight = weight
    this.abilities = abilities
  this.id = 900
  this.moves = moves
}
