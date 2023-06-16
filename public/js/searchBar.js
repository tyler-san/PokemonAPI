/* search bar met hulp en inspiratie van video: https://www.youtube.com/watch?v=wxz5vJ1BWrc&t=4s */

let searchBarInput = document.getElementById("pokemonName");

let searchBarSection = document.getElementById("whoSearchBarSection");

let pokemonAnswer = document.getElementById("whoIsThatPokemonAni").innerText;

let allPokemonNames = [];

const loadAllPokemonNames = async() => {
    try {

        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`);
        let pokemonNames = await res.json();
        allPokemonNames = pokemonNames.results
        
    }
    catch (err) {
        console.error(err);
    }
}

loadAllPokemonNames();

searchBarInput.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();
        const filteredCharacters = allPokemonNames.filter((pokemon) => {
            
            
            return (
                pokemon.name.toLowerCase().includes(searchString)
            );
        });
        
            displayPokemonNames(filteredCharacters.slice(0,3));         
});


const displayPokemonNames = (pokemons) => {
    const htmlString = pokemons
        .map((pokemon) => {
                
        return `<li class="pokemonList">
                    <button onclick="changeInputValue(this.value)" class="searchBarPokemon" value="${pokemon.name.substring(0,1).toUpperCase()}${pokemon.name.substring(1)}">${pokemon.name.substring(0,1).toUpperCase()}${pokemon.name.substring(1)}</button>
                </li>
                `
        ;})
        .join('');
    whoSearchBarSection.innerHTML = htmlString;
};


const changeInputValue = (value) => {
    searchBarInput.value = value; /* https://www.kodeclik.com/how-to-get-value-of-button-clicked-in-javascript/ */
};

const disableForm = () => {
    searchBarInput.disabled = true;
    searchBarSection.style.display = "none";
    document.getElementById("resultText").style.display= "block"; 
    setTimeout(() => {
        document.getElementById("nextPokemon").style.display = "block"
      }, "1500");


    
      console.log(searchBarInput.value)
      console.log(pokemonAnswer)
      pokemonAnswer = pokemonAnswer.replace(/\s/g, '');
      searchBarInput.value =  searchBarInput.value.replace(/\s/g, '');
      
    if (searchBarInput.value.toLowerCase() == pokemonAnswer.toLowerCase()) {
        document.getElementById("resultText").innerHTML = "Juist";
    } else {
        document.getElementById("resultText").innerHTML = "Fout";
    }
}



  

