import axios from "axios";
const express = require("express");
const app = express();
const ejs = require("ejs");

app.set('view engine','ejs');
app.set('port', 3000);
app.use(express.static('public'));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use('/js', express.static(__dirname + 'public/js'))

app.get("/", (req: any, res: any) => {
  res.render("index");
});

const compareRoute = require('./routes/compare')
const mypokemonRoute = require('./routes/mypokemon')

let pokemonApI:any = [];
let nameOfPokemon = "";
let whoPokemonImage = "";
const loadPokemon = async () => {
  try {
      pokemonApI = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`);
  }
  catch (err) {
      console.error(err);
  }
}
loadPokemon();

const randomPokemonGenarator = async() => {
    
  let randomNumber = Math.floor(Math.random() * 1010) + 1;
  await loadPokemon()
  nameOfPokemon = pokemonApI.data.results[randomNumber].name;
  nameOfPokemon = `${nameOfPokemon.substring(0,1).toUpperCase()}${nameOfPokemon.substring(1)}`
  spriteOfPokemon(pokemonApI.data.results[randomNumber].name);    
};

const spriteOfPokemon = async(nameOfPokemon:string) => {
  let pokemon:any = [];
  await randomPokemonGenarator
  try {
      pokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nameOfPokemon}`);
      if (pokemon.data.sprites.front_default == null) {
        whoPokemonImage = pokemon.data.sprites.other["official-artwork"].front_default;
        } else {
            whoPokemonImage = pokemon.data.sprites.front_default;
          }      
  } catch (error) {
      console.log(error);
  }
};

randomPokemonGenarator();

app.use('/', compareRoute)
app.use('/', mypokemonRoute)

app.get('/eigenPokemonExtra',(req:any,res:any)=>{
    res.render('eigenPokemonExtra');
});

app.get("/battler", (req: any, res: any) => {
  res.render("battler");
});

app.get("/home", (req: any, res: any) => {
  res.render("home");
});

app.get("/catch", (req: any, res: any) => {
  res.render("catch");
});

app.get("/who", async (req: any, res: any) => {
  
  await loadPokemon()
  randomPokemonGenarator();

  res.render("who",{pokemon:pokemonApI.data.results,whoImageSrc:whoPokemonImage,nameOfPokemon:nameOfPokemon});
});

app.post("/who")



app.use((req: any, res: any) => {
  res.status(404);
  res.render("error");
});

app.listen(app.get("port"), () =>
  console.log("[server] http://localhost:" + app.get("port"))
);
