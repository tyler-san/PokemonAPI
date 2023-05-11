import axios from "axios";
import express from "express";
const vang = express.Router()

interface Pokemon {
    id: number,
    name: string,
    img: Sprites,
    gen: string,
}

interface Sprites {
    front_default: string;
    animated?: Sprites;
}
let allPokemonNames: string[]
let allPokemon: Pokemon[]

const getAllPokemonNames = async (): Promise<void> => {
    let response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
    let pokemonList: Pokemon[] = response.data.results;
    allPokemonNames = pokemonList.map((pokemon) => pokemon.name);
}

const getAllPokemon = async (): Promise<void> => {
    allPokemonNames.forEach(async pokemon => {
        let response = await axios.get('https://pokeapi.co/api/v2/pokemon/' + pokemon);
        console.log(response.data.results.id)
    });
}
vang.get("/catch", (req: any, res: any) => {
    res.render("catch");
});

module.exports = vang