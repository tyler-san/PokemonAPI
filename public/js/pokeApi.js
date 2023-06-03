let allGenerationOfPokemon = [];

const selectGenerationOfPokemon = async() => {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/generation/`);
        allGenerationOfPokemon = await res.json();

        let containerSelectPokemon = document.getElementById("generations");
        
        let generation = allGenerationOfPokemon.results.map((generations,i) => {
            return`
            <option value="${generations.name}">Generation ${i+1} </option>`
        }
        ) .join("")
        containerSelectPokemon.innerHTML = generation + `<option value="allPokemons">All Pokemons</option>`;
        let err = document.getElementById("err")
        if (err.innerText != "" ) {
            document.location.reload(true)
        } 
        
    } catch (error) {
        console.log(error)
    }
    
}

selectGenerationOfPokemon();

const displayPokemon = async() => {
    
    document.getElementById("whoPokemonImage").id="whoPokemonImageBright"
    document.getElementById("whoIsThatPokemonText").style.display= "none";
    document.getElementById("whoIsThatPokemonAni").style.display= "block";
    document.getElementById("resultText").style.display= "block";   
}

