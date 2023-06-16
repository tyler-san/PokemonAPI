import express from 'express';
import { ObjectId, MongoClient } from 'mongodb';
import axios from 'axios';
const uri = "mongodb+srv://s142736:FEsWMmXgfLZ1hGlz@cluster0.bj9rw8s.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

const users = client.db("Pokedexpress").collection("Users");
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("port", 3001);


//Interfaces
interface Player {
    _id?: ObjectId;
    name: string;
    currentPokemon?: ObjectId;
    pokemon: Pokemon[];
};
interface User {
    nickname: string;
    password: string;
    region: string;
}
interface Pokemon {
    _id?: ObjectId;
    id: number;
    name: string;
    types: string[];
    isShiny: boolean;
    genderRate: number;
    gender?:string;
    //Stats
    height: number;
    weight: number;
    hp: number;
    attack: number;
    defense: number;
    nickname?: string;
    //Bio
    flavorText: string;
    region: string;
    genera: string;
    japanese: string;
    baby: boolean;
    legendary: boolean;
    mythical: boolean;
    habitat: string;
    //Evolution per "phase"
    evolution0: string;
    evolution1: string;
    evolution2: string;
    // All evolutions not always in order!
    //Images
    imageFront: string;
    imageBack: string;
    imageFrontFemale: string;
    imageBackFemale: string;
    gifFront: string;
    gifBack: string;
    gifFrontFemale: string;
    gifBackFemale: string;
    officialArtwork: string;
    shinyImageFront: string;
    shinyImageBack: string;
    shinyImageFrontFemale: string;
    shinyImageBackFemale: string;
    shinyGifFront: string;
    shinyGifBack: string;
    shinyGifFrontFemale: string;
    shinyGifBackFemale: string;
    shinyOfficialArtwork: string;
}
interface Evolution {
    name: string;
    id: number;
    image: string;
    gif: string;
    officialArt: string;
    shinyImage: string;
    shinyGif: string;
    shinyOfficialArt: string;
}
interface DamageRelations{
    quadruple_damage_to?: string[];
    double_damage_to: string[];
    half_damage_to: string[];
    quarter_damage_to?: string[];
    no_damage_to: string[];
    quadruple_damage_from?: string[];
    double_damage_from: string[];
    half_damage_from: string[];
    quarter_damage_from?: string[];
    no_damage_from: string[];

}
let players: Player[] = [];
let allPokemon: Pokemon[] = [];

const createUser = async (user: User) => {
    try {
        await client.connect();
        const db = client.db('Pokedexpress');
        const users = db.collection('Users');
        const result = await users.findOne({ nickname: user.nickname });
        if (result) {
            return 'Nickname already exists. Please choose another one.';
        } else {
            await users.insertOne(user);
            return 'Registration successful!';
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};
const loginUser = async (nickname: string, password: string) => {
    try {
        await client.connect();
        const db = client.db('Pokedexpress');
        const users = db.collection('Users');
        const result = await users.findOne({ nickname: nickname, password: password });
        if (result) {
            return 'Login successful!';
        } else {
            return 'Invalid nickname or password. Please try again.';
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};
const getPlayerById = (id: string) => {
    return players.find(p => p._id?.toString() == id);
}
const createPlayer = async (player: Player) => {
    try {
        await client.connect();

        await client.db("Pokedexpress").collection("Player").insertOne(player);

        await loadPlayersFromDb();
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};
const loadPlayersFromDb = async () => {
    try {
        await client.connect();
        players = await client.db("Pokedexpress").collection("Player").find<Player>({}).toArray();

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};
const updatePlayer = async (player: Player, isShiny:boolean, gender: string) => {
    try {
        await client.connect();
        if(isShiny == true){
            let newObjectId=  new ObjectId();
            player.pokemon[0]._id= newObjectId;
            player.pokemon[0].isShiny = true;
            player.pokemon[0].gender =gender;
            if (player.pokemon.length == 1) {
                console.log("woah")
                await client.db("Pokedexpress").collection("Player").updateOne({ _id: player._id }, {
    
                    $set: {
                        pokemon: player.pokemon,
                        currentPokemon: player.pokemon[0]._id
                    }
    
                })
            }
            else {
                await client.db("Pokedexpress").collection("Player").updateOne({ _id: player._id }, {
    
                    $set: {
                        pokemon: player.pokemon
                    }
    
                })
            }

        }else{
            player.pokemon[0]._id = new ObjectId();
            if (player.pokemon.length == 1) {
                console.log("woah")
                await client.db("Pokedexpress").collection("Player").updateOne({ _id: player._id }, {
    
                    $set: {
                        pokemon: player.pokemon,
                        currentPokemon: player.pokemon[0]._id
                    }
    
                })
            }
            else {
                await client.db("Pokedexpress").collection("Player").updateOne({ _id: player._id }, {
    
                    $set: {
                        pokemon: player.pokemon
                    }
    
                })
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
const loadPokemonFromDb = async () => {
    try {

        await client.connect();

        let dbPokemon = await client.db("Pokedexpress").collection("Pokemon").find<Pokemon>({}).toArray();



        if (dbPokemon.length >= 386) {
            console.log("Pokemon found in db... using these");
            allPokemon = dbPokemon;
            console.log(dbPokemon.length);
        } else {
            console.log("Pokemon loading from the api")


            for (let i = 1; i < 387; i++) {

                let randomPokemon = Math.floor(Math.random() * 1009) + 1;
                let response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);

                // Pokemon url's

                let speciesUrl = response.data.species.url;

                let responseSpecies = await axios.get(speciesUrl);

                let generationUrl = responseSpecies.data.generation.url;

                let responseGen = await axios.get(generationUrl);

                let evolutionUrl = responseSpecies.data.evolution_chain.url;

                let responeEvo = await axios.get(evolutionUrl);

                //data for each pokemon in evolution-chain
            
                //Shiny 20% kans
                let random1: number = Math.floor(Math.random() * 80);
                let random2: number = Math.floor(Math.random() * 80);

                //Gegevens pokemon ophalen
                let pokemon: Pokemon = {
                    id: response.data.id,
                    name: response.data.name,
                    types: response.data.types.map((t: any) => t.type.name),
                    isShiny: false,
                    genderRate: responseSpecies.data.gender_rate,
                    imageFront: response.data.sprites.front_default,
                    imageFrontFemale: response.data.sprites.front_shiny_female,
                    imageBack: response.data.sprites.back_default,
                    imageBackFemale: response.data.sprites.back_female,
                    gifFront: response.data.sprites.versions["generation-v"]["black-white"].animated.front_default,
                    gifFrontFemale: response.data.sprites.versions["generation-v"]["black-white"].animated.front_female,
                    gifBack: response.data.sprites.versions["generation-v"]["black-white"].animated.back_default,
                    gifBackFemale: response.data.sprites.versions["generation-v"]["black-white"].animated.back_female,
                    officialArtwork: response.data.sprites.other["official-artwork"].front_default,
                    shinyImageFront: response.data.sprites.front_shiny,
                    shinyImageFrontFemale: response.data.sprites.front_shiny_female,
                    shinyImageBack: response.data.sprites.back_shiny,
                    shinyImageBackFemale: response.data.sprites.back_shiny_female,
                    shinyGifFront: response.data.sprites.versions["generation-v"]["black-white"].animated.front_shiny,
                    shinyGifFrontFemale: response.data.sprites.versions["generation-v"]["black-white"].animated.front_shiny_female,
                    shinyGifBack: response.data.sprites.versions["generation-v"]["black-white"].animated.back_shiny,
                    shinyGifBackFemale: response.data.sprites.versions["generation-v"]["black-white"].animated.back_shiny_female,
                    shinyOfficialArtwork: response.data.sprites.other["official-artwork"].front_shiny,
                    height: response.data.height,
                    weight: response.data.weight,
                    hp: response.data.stats.find((s: any) => s.stat.name == "hp")?.base_stat,
                    attack: response.data.stats.find((s: any) => s.stat.name == "attack")?.base_stat,
                    defense: response.data.stats.find((s: any) => s.stat.name == "defense")?.base_stat,
                    region: responseGen.data.main_region.name,
                    flavorText: responseSpecies.data.flavor_text_entries.find((s: any) => s.language.name == "en")?.flavor_text,
                    genera: responseSpecies.data.genera.find((s: any) => s.language.name == "en").genus,
                    baby: responseSpecies.data.is_baby,
                    legendary: responseSpecies.data.is_legendary,
                    mythical: responseSpecies.data.is_mythical,
                    japanese: responseSpecies.data.names.find((s: any) => s.language.name == "ja-Hrkt").name,
                    habitat: (responseSpecies.data.habitat !== null) ? (responseSpecies.data.habitat.name) : undefined,
                    evolution0: responeEvo.data.chain.species.name,
                    evolution1: (responeEvo.data.chain.species.evolves_to !== null) ? (responeEvo.data.chain.evolves_to.map((t: any) => t.species.name)) : undefined,
                    evolution2: (responeEvo.data.chain.species.evolves_to !== null || responeEvo.data.chain.species.evolves_to.map((t: any) => t.evolves_to) !== null) ? (responeEvo.data.chain.evolves_to.map((t: any) => t.evolves_to.map((t: any) => t.species.name))) : undefined,
                }
                allPokemon = [...allPokemon, pokemon];
            }
            await client.db("Pokedexpress").collection("Pokemon").insertMany(allPokemon);
            console.log("Pokemon found in API... using these")


        }


    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }


}

//App.get

app.get("/", (req, res) => {
    res.render("index", { players: players, notification: req.query.notification });
});
app.get('/register', (req, res) => {
    res.render('register');
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.get(`/player/:id/pokemonSummary/pokemon/:_id`, async (req, res) => {
    let player = getPlayerById(req.params.id);
    let filter: string = req.query.filter as string;
    let pokemonId = req.body._id;

    if (!player) {
        return res.status(404).send("Player not found");
    }
    res.render('pokemonSummary', { player: player, pokemon: player.pokemon,pokemonId:pokemonId })
});
app.post(`/player/:id/pokemonSummary/pokemon/:_id`, async (req, res) => {
    let player = getPlayerById(req.params.id);
    let filter: string = req.query.filter as string;
    let pokemonId = req.body._id;

    if (!player) {
        return res.status(404).send("Player not found");
    }
    res.render('pokemonSummary', { player: player, pokemon: player.pokemon,pokemonId:pokemonId })
});

app.get("/player/:id", (req, res) => {
    let player = getPlayerById(req.params.id);

    if (!player) {
        return res.status(404).send("Player not found");
    }
    if (player.pokemon.length == 0) {
        res.redirect(`/player/${req.params.id}/starter`);

    }
    else if (player.pokemon.length > 0) {
        res.render("player", { player: player });

    }
    else {
        res.render("player", { player: player });
    }
});

app.get("/player/:id/starter", async (req, res) => {
    try {
        await client.connect();
        // Perform database operations here
        let player = getPlayerById(req.params.id);
        if (!player) {
            return res.status(404).send("Player not found");
        }
        if (player.pokemon.length > 0) {
            res.redirect(`/player/${req.params.id}`);
        }
        let kantoStarters = [1, 4, 7]; // Bulbasaur, Charmander, Squirtle
        let pokemons = await client.db("Pokedexpress").collection("Pokemon").find().toArray();
        let starters = await client.db("Pokedexpress").collection("Pokemon").find({ id: { $in: kantoStarters } }).toArray();
        res.render("starter", { player: player, starters: starters});
    }catch(e){
        console.error(e);
    }
     finally {
        await client.close();
    }

});

app.get("/player/:id/pokemonChooser", async (req, res) => {
    let player = getPlayerById(req.params.id);

    if (!player) {
        return res.status(404).send("Player not found");
    }
    let filteredPokemon = allPokemon.filter(pokemon => {
        return !player?.pokemon.find(p => p.id === pokemon.id)
    })

    res.render("pokemonChooser", { allPokemon: filteredPokemon, player: player});
});
app.get("/player/:id/pokemonList", async (req, res) => {
    let player = getPlayerById(req.params.id);

    if (!player) {
        return res.status(404).send("Player not found");
    }
    let filteredPokemon = allPokemon.filter(pokemon => {
        return !player?.pokemon.find(p => p.id === pokemon.id)
    })

    res.render("pokemonList", { allPokemon: filteredPokemon, player: player});
});


//App.post

app.post("/createPlayer", async (req, res) => {
    let name: string = req.body.name;

    console.log(`Creating player: ${name}`);

    await createPlayer({
        name: name,
        pokemon: [],
    });
    res.redirect("/");
});

// app.post('/register', async (req, res) => {
//     const nickname = req.body.nickname;
//     const password = req.body.password;
//     const confirm_password = req.body.confirm_password;
//     const region = req.body.region;
//     if (password !== confirm_password) {
//         res.render('register', { notification: 'Passwords do not match. Please try again.' });
//     } else {
//         const result = await createUser({ nickname, password, region });
//         if (result === 'Registration successful!') {
//             res.redirect('/?notification=' + encodeURIComponent(result));
//         } else {
//             res.render('register', { notification: result });
//         }
//     }
// });
// app.post('/login', async (req, res) => {
//     const nickname = req.body.nickname;
//     const password = req.body.password;
//     const result = await loginUser(nickname, password);
//     if (result === 'Login successful!') {
//         res.redirect('/?notification=' + encodeURIComponent(result));
//     } else {
//         res.render('login', { notification: result });
//     }
// });

app.post("/player/:id/pokemonChooser/add/:pokeId", async (req, res) => {
    let player = getPlayerById(req.params.id);
    let isShiny: boolean = req.body.shiny === 'true';
    let gender: string =req.body.gender;
    console.log(gender);
    console.log(isShiny);
    console.log(player)
    let pokemon: Pokemon | undefined = allPokemon.find(p => p.id === parseInt(req.params.pokeId));
    if (!player) {
        return res.status(404).send("Player not found");
    }
    if (!pokemon) {
        return res.status(404).send("Pokemon not found");
    }

    player.pokemon = [pokemon, ...player.pokemon];
    await updatePlayer(player,isShiny,gender);

    res.redirect(`/player/${player._id}/pokemonList`);

});

//App listen

app.listen(app.get("port"), async () => {
    await loadPlayersFromDb();
    await loadPokemonFromDb();
    console.log(`${players.length} player loaded from the database`);
    console.log(`${allPokemon.length} pokemon loaded from the database/api`)
    console.log(`local url: http://localhost:${app.get("port")}`);
});


//data for each pokemon in evolution-chain
// async function getPokemonEvolutionChain(randomPokemon: number): Promise<Evolution[]> {
//     const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${i}`);
//     const evolutionChainUrl = speciesResponse.data.evolution_chain.url;
//     const evolutionChainResponse = await axios.get(evolutionChainUrl);
//     const evolutionChainData = evolutionChainResponse.data.chain;

//     const evolutions: Evolution[] = [];
//     const extractEvolutions = async (data: any) => {
//         if (data.species) {
//             const pokemonResponse = await axios.get(data.species.url);
//             const pokemonId = pokemonResponse.data.id;
//             const pokemonDataResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
//             evolutions.push({
//                 name: data.species.name,
//                 id: pokemonId,
//                 image: pokemonDataResponse.data.sprites.front_default,
//                 gif: pokemonDataResponse.data.sprites.versions["generation-v"]["black-white"].animated.front_default,
//                 officialArt: pokemonDataResponse.data.sprites.other["official-artwork"].front_default,
//                 shinyImage: pokemonDataResponse.data.sprites.front_shiny,
//                 shinyGif: pokemonDataResponse.data.sprites.versions["generation-v"]["black-white"].animated.front_shiny,
//                 shinyOfficialArt: pokemonDataResponse.data.sprites.other["official-artwork"].front_shiny,

//             });
//         }
//         if (data.evolves_to && data.evolves_to.length > 0) {
//             console.log(data.evolves_to);
//             console.log(data.evolves_to.length);
//             for (const evolution of data.evolves_to) {
//                 console.log(evolution);
//                 console.log(data.evolves_to)
//                 await extractEvolutions(evolution);
//             }
//         }
//     };
//     await extractEvolutions(evolutionChainData);
//     return evolutions;
// }
// const evolutions = await getPokemonEvolutionChain(i);