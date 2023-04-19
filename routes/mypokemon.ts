import axios from "axios";
const express = require('express')
const mypokemon = express.Router()

interface Pokemon {
    name: string;
    image: string;
    id:number
  }
let allPokemonNames:string[] = [];

//functie om alle pokemon namen in een variabele te steken
// const getAllPokemonNames = async (): Promise<void> => {
//     let response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
//     let pokemonList: Pokemon[] = response.data.results;
//     allPokemonNames = pokemonList.map((pokemon) => pokemon.name);
// }

let pokemon : Pokemon[] = [
    {name: "Pikachu", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png", id:1},
    {name: "Pidgey", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png", id:2},
    {name: "Weedle", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/13.png", id:3},
    {name: "Butterfree", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/12.png", id:4},
];

mypokemon.get("/eigenPokemonBekijken", (req: any, res: any) => {
    res.render("eigenPokemonBekijken",{pokemonlist:pokemon});
});



module.exports = mypokemon