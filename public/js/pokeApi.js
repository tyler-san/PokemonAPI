let pokemon=[];
let nameOfPokemon = "";

const loadPokemon = async () => {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`);
        pokemon = await res.json();
        
    }
    catch (err) {
        console.error(err);
    }
}


const generationOfPokemon = async (nameOfPokemon) => {
    let generationOfPokemon = "";
    try {
            
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${nameOfPokemon}`);
            generationOfPokemon = await res.json();
    }
    catch (err) {
        console.error(err);
    }
}



const randomPokemonGenarator = async() => {
    
    let randomNumber = Math.floor(Math.random() * 1010) + 1;
    await loadPokemon()
    nameOfPokemon = pokemon.results[randomNumber].name;
    spriteOfPokemon(pokemon.results[randomNumber].name);
    generationOfPokemon(pokemon.results[randomNumber].name);
    
}

const spriteOfPokemon = async(nameOfPokemon) => {
    let pokemon = "";
    await randomPokemonGenarator
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOfPokemon}`);
        pokemon = await res.json();

        let whoPokemonImage = document.getElementById("whoPokemonImage");
        setTimeout(() => {
            document.getElementById("loader").style.display = "none";
            whoPokemonImage.src = pokemon.sprites.front_default;
            whoPokemonImage.style.visibility = "visible"
          }, "500");
    } catch (error) {
        console.log(error);
    }
}

randomPokemonGenarator();



const displayPokemonName = async() => {
    
    await randomPokemonGenarator
    
    document.getElementById("whoPokemonImage").id="whoPokemonImageBright"
    let whoOfPokemon = document.getElementById("whoIsThatPokemonText");
    whoOfPokemon.id = "whoIsThatPokemonAni"
    whoOfPokemon.innerHTML = `${nameOfPokemon.substring(0,1).toUpperCase()}${nameOfPokemon.substring(1)}`;
}




/* note: some pokemon have no sprite, only an artwork */




