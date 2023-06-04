import axios from "axios";
const express = require("express");
const app = express();
const ejs = require("ejs");
const {MongoClient} = require('mongodb');




const uri:string = "mongodb+srv://rolly:124501@pokemonapi.wg5kecx.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(uri, { useUnifiedTopology: true });

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


interface User {
  _id?:string
  name:string
  email:string
  password:string
  catchedPokemon?:[
    {}
  ]
  huidigePokemon?:{

  }
}

let currentUser:User = {
  _id:"",
  name:"Guest",
  email:"",
  password:""
}



const compareRoute = require('./routes/compare')
const mypokemonRoute = require('./routes/mypokemon')

let pokemonApI:any = [];
let nameOfPokemon = "";
let whoPokemonImage = "";
let catchPokemonImage = "";
let errorMessage:string = "";
let errorMessageClass:string = "Error";
let huidigePokemonNaam:string = "";

const loadPokemon = async (gen?:string) => {
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
        catchPokemonImage = pokemon.data.sprites.other["official-artwork"].front_default;
        } else if (pokemon.data.sprites.versions["generation-v"]["black-white"].animated.front_default !== null) {
          catchPokemonImage = pokemon.data.sprites.versions["generation-v"]["black-white"].animated.front_default;
          whoPokemonImage = pokemon.data.sprites.other["official-artwork"].front_default;
        }
        else {
            whoPokemonImage = pokemon.data.sprites.other["official-artwork"].front_default;
            catchPokemonImage = pokemon.data.sprites.front_default;
          }      
  } catch (error) {
      console.log(error);
  }
};

randomPokemonGenarator();

const romanToNumber = (roman:any) => {
  const romanNumerals:any = {
    i: 1,
    v: 5,
    x: 10,
    l: 50,
    c: 100,
    d: 500,
    m: 1000
  };

  let result = 0;

  for (let i = 0; i < roman.length; i++) {
    const currentNumeral = romanNumerals[roman[i]];
    const nextNumeral = romanNumerals[roman[i + 1]];
    if (currentNumeral < nextNumeral) {
      result -= currentNumeral;
    } else {
      result += currentNumeral;
    }
  }

  return result;
}

app.use('/', compareRoute)
app.use('/', mypokemonRoute)

app.get('/eigenPokemonExtra',(req:any,res:any)=>{
    res.render('eigenPokemonExtra');
});

app.get("/battler", (req: any, res: any) => {
  res.render("battler");
});

app.get("/home", (req: any, res: any) => {
  huidigePokemonNaam = "Charmander"
  currentUser.huidigePokemon = {
    naam:huidigePokemonNaam
  }
  res.render("home",{currentUser});
});

app.get("/catch", async (req: any, res: any) => {

  await loadPokemon()
  randomPokemonGenarator();

  res.render("catch",{pokemon:pokemonApI.data.results,imageSrc:catchPokemonImage,nameOfPokemon:nameOfPokemon});
});



app.get("/who", async (req: any, res: any) => {
  
  await loadPokemon()
  randomPokemonGenarator();

  res.render("who",{pokemon:pokemonApI.data.results,whoImageSrc:whoPokemonImage,nameOfPokemon:nameOfPokemon});
});


app.get("/chooseGeneration", async (req: any, res: any) => {
  res.render("chooseGeneration");
});

let gens:string ="generation-i";

app.post("/chooseGeneration", async (req: any, res: any) => {

let inputGen = ""
inputGen = req.body.generations



if (inputGen == "allPokemons") {
  res.redirect("who")
} else {
  
  gens = inputGen;
  res.redirect("whoGenerations")
}
});


app.get("/whoGenerations", async (req: any, res: any) => {


  let pokemon:any = {
    data: {
      sprites: {
        other: {
          ["official-artwork"]: {
            front_default: 
              "https://icon-library.com/images/no-picture-available-icon/no-picture-available-icon-1.jpg"
          }
        }
      }
    }
  }
  let genPokeName:string = "";
  let errMessage:string = "";
  let numberGen = romanToNumber(gens.substring(11));
  let generationOfPokemon:any = {
    data: {
      pokemon_species: {
        name: "wrongDefault"
      }
    }
  }
  
  try {

    
    
    generationOfPokemon = await axios.get(`https://pokeapi.co/api/v2/generation/${gens}`);
  
  
  let randomNumber = Math.floor(Math.random() * generationOfPokemon.data.pokemon_species.length) + 1;
 
  genPokeName = generationOfPokemon.data.pokemon_species[randomNumber].name;
  
  pokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${genPokeName}`);


  } catch (error) {
    
    errMessage = "Slow down , too many requests (reload the page)"
    console.log("oops");
  }

    res.render("whoGenerations",{whoImageSrc:pokemon.data.sprites.other["official-artwork"].front_default,nameOfPokemon:`${genPokeName.substring(0,1).toUpperCase()}${genPokeName.substring(1)}`,inputGen:numberGen,errMessage:errMessage})
});

app.get("/login", async (req: any, res: any) => {
  res.render("login")
});

app.post("/login", async (req: any, res: any) => {
  
  
  let cursor = await client.db('PokemonDB').collection('Users').findOne({email:req.body.email})
  let cursor2 = await client.db('PokemonDB').collection('Users').findOne({password:req.body.password})
  cursor._id = cursor._id.toString()
  
  currentUser = cursor;
  
    if (cursor == null || cursor2 == null ) {
      errorMessage = "Foute Email of passwoord"
      res.render("login",{errorMessage:errorMessage,errorMessageClass:errorMessageClass})
    } else {
      res.redirect("home")
    }

  
});

app.get("/signUp", async (req: any, res: any) => {
  res.render("signUp")
});

app.post("/signUp", async (req: any, res: any) => {
  
  let newUser:User = {
    name:req.body.username,
    email:req.body.email,
    password:req.body.password
  }
  console.log(newUser)
  
   try {
    await client.connect();
    
    
    let cursor = await client.db('PokemonDB').collection('Users').findOne({email:req.body.email})
    
    if (cursor == null) {
      await client.db('PokemonDB').collection('Users').insertOne(newUser);
      errorMessage = "Account succevol aangemaakt!"
      errorMessageClass = "Succes"
    } 
    else if (req.body.email === cursor.email) {
      errorMessage = "Email bestaat al"
    };
    
    
} catch (e) {
    console.error(e);
    errorMessageClass = "Error"
    errorMessage = "Aanmaak mislukt, probeer terug opnieuw"
} finally {
    await client.close();
} 


  res.render("signUp",{errorMessage:errorMessage,errorMessageClass:errorMessageClass})
});

app.use((req: any, res: any) => {
  res.status(404);
  res.render("error");
});

app.listen(app.get("port"), () =>
  console.log("[server] http://localhost:" + app.get("port"))
);
