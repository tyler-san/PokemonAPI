import axios from "axios";
const express = require('express')
const compare = express.Router()

interface Pokemon {
    name: string;
  }

let pokemon1Name = '';
let pokemon2Name = '';
let allPokemonNames:string[] = [];

//functie om alle pokemon namen in een variabele te steken
const getAllPokemonNames = async (): Promise<void> => {
    let response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
    let pokemonList: Pokemon[] = response.data.results;
    allPokemonNames = pokemonList.map((pokemon) => pokemon.name);
}

compare.get('/compare', async (req:any,res:any)=>{
    let resultPokemon1:any = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon1Name}`);
    let pokemon1stats:number=0;
    let pokemon1Id:number=0;  
    let resultPokemon2:any = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon2Name}`);
    let pokemon2stats:number=0;
    let pokemon2Id:number=0; 
    let pokemon1Weight:number=0; 
    let pokemon2Weight:number=0; 
    try {
        if (!(pokemon1Name===undefined)||!(pokemon2Name===undefined)) {
        pokemon1stats = resultPokemon1.data.stats
        pokemon1Id = resultPokemon1.data.id
        pokemon1Weight = resultPokemon1.data.weight
        pokemon2stats = resultPokemon2.data.stats
        pokemon2Id = resultPokemon2.data.id
        pokemon2Weight = resultPokemon2.data.weight
        }
        res.render('compare',{pokemon1Name:pokemon1Name, pokemon2Name: pokemon2Name, statsP1:pokemon1stats,picP1:pokemon1Id, statsP2:pokemon2stats,picP2:pokemon2Id, pokemon1Weight:pokemon1Weight,pokemon2Weight:pokemon2Weight})
    } catch (error) {
        console.log(error)
        res.redirect('error')
    }
    //console.log(pokemon1stats)
});

//informatie van pokemon 1 ophalen
compare.post('/getPokemon',(req:any,res:any)=>{
    let bestaatPokemon1:boolean = false;
    let bestaatPokemon2:boolean = false;
    pokemon1Name = req.body.pokemon1.toLowerCase().trimStart().trimEnd();
    pokemon2Name = req.body.pokemon2.toLowerCase().trimStart().trimEnd();
    //check of de naam die wordt meegegeven via de body tussen de pokemon namen zit
    getAllPokemonNames()
    .then(()=>{
        for (let i = 0; i < allPokemonNames.length; i++) {
            if (pokemon1Name == allPokemonNames[i].toLowerCase()) {
                bestaatPokemon1 = true;
                console.log(pokemon1Name)
                console.log(bestaatPokemon1)
            }
            if (pokemon2Name == allPokemonNames[i].toLowerCase()) {
                bestaatPokemon2 = true;
                console.log(pokemon2Name)
                console.log(bestaatPokemon2)
            }
        }
        if (bestaatPokemon1&&bestaatPokemon2) {
            res.redirect('compare')
        }
        else if (bestaatPokemon1&&(!bestaatPokemon2)) {
            pokemon2Name = allPokemonNames[Math.floor(Math.random()*(allPokemonNames.length+1))]
            res.redirect('compare')
        }
        else if ((!bestaatPokemon1)&&bestaatPokemon2) {
            pokemon1Name = allPokemonNames[Math.floor(Math.random()*(allPokemonNames.length+1))]
            res.redirect('compare')
        }
        else{
            pokemon1Name = allPokemonNames[Math.floor(Math.random()*(allPokemonNames.length+1))]
            pokemon2Name = allPokemonNames[Math.floor(Math.random()*(allPokemonNames.length+1))]
            res.redirect('compare')
        }
    })
})

module.exports = compare