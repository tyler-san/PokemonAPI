
let allGenerationOfPokemon = [];

const selectGenerationOfPokemon = async() => {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/generation/`);
        allGenerationOfPokemon = await res.json();

        let containerSelectPokemon = document.getElementById("generations");
        
        let generation = allGenerationOfPokemon.results.map((generations) => {
            return`
            <option value="${generations.name}">${generations.name}</option>`
        }
        ) .join("")
        containerSelectPokemon.innerHTML = generation + `<option value="allPokemons">All Pokemons</option>`;
        
        
    } catch (error) {
        console.log(error)
    }
    
}

const chosenGeneration = async(gen) => {
    
    let generationOfPokemon = "";
    const res = await fetch(`https://pokeapi.co/api/v2/generation/${gen}`);
    generationOfPokemon = await res.json();

    let randomNumber = Math.floor(Math.random() * generationOfPokemon.pokemon_species.length) + 1;
    console.log(generationOfPokemon.pokemon_species)

    /* make it so that you can choose generation then choose pokemon via query param? */
}

const inputSelect = () => {
    let inputUser = document.getElementById("generations").value;
    if (inputUser == "allPokemons") {
        console.log("you chose all gen")
    } else{ 
        chosenGeneration(inputUser)
    }
    console.log(inputUser)
}


selectGenerationOfPokemon();

inputSelect;

const displayPokemon = async() => {
    
    document.getElementById("whoPokemonImage").id="whoPokemonImageBright"
    document.getElementById("whoIsThatPokemonText").style.display= "none";
    document.getElementById("whoIsThatPokemonAni").style.display= "block";
    document.getElementById("resultText").style.display= "block";   
}





