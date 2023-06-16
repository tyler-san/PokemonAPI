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
  catchPokemon?:[
    {}
  ]
  huidigePokemon?:Pokemon
}

export interface Pokemon {
  id?: number
  naam?: string
  stats?: number
  sprite?:string
}

let currentUser:User = {
  _id:"1",
  name:"Guest",
  email:"",
  password:"",
  huidigePokemon: {
    naam:"Charmander",
    stats:1,
    sprite:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"
  }
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
let pokemon:any = [];

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

app.get("/mine", async(req: any, res: any) => {
  
  
  

  try {
  await client.connect();
    
  let cursor = await client.db('PokemonDB').collection('Users').findOne({email:currentUser.email})
  


  
  
  
  console.log(currentUser)
  

} catch (e) {
    
} finally {
    await client.close();
} 

  res.render("mine",{currentUser:currentUser});
});

app.get("/home", (req: any, res: any) => {
  res.render("home",{currentUser});
});

app.get("/catch", async (req: any, res: any) => {

  
  let targetPokemon:any
  let randomPokemonNameCap = ""
  let message = "";
    try {
      await client.connect();
      
      let randomPokemonName:string = ""
      
  await loadPokemon()
  await randomPokemonGenarator;

 
  let randomNumber = Math.floor(Math.random() * 1010) + 1;

  randomPokemonName = pokemonApI.data.results[randomNumber].name
  

  await spriteOfPokemon(randomPokemonName)

 
  

  randomPokemonNameCap = `${randomPokemonName.substring(0,1).toUpperCase()}${randomPokemonName.substring(1)}`
  

  targetPokemon = pokemon.data;


    let test =  currentUser?.huidigePokemon?.stats ?? 1
    let catchChance = 100-targetPokemon.stats[2].base_stat + test

    let catchProbab = catchChance /100;

    
  
    console.log(catchProbab)
    const  chanceToPerformAction = (chance:number) => {
      const randomNumber = Math.random(); 
      if (randomNumber < chance) {
        
        currentUser?.catchPokemon?.push(randoPokemon)
        message = "Pokemon gevangen"
        console.log(currentUser.catchPokemon)
        
      } else {
        
        console.log('Action skipped.');
        message = "Niet gevangen"
      }
    }

    
    
    
    const chanceValue = 0; 
    

    let randoPokemon:Pokemon = {
      naam:randomPokemonNameCap,
      stats:targetPokemon.stats[1].base_stat,
      sprite:catchPokemonImage
    }

    chanceToPerformAction(catchProbab);
      
    await client.db('PokemonDB').collection('Users').updateMany({email:currentUser.email},{$set:{catchPokemon:currentUser.catchPokemon}},{upsert:true})
      
  } catch (e) {
      console.error(e);
      
  } finally {
      await client.close();
  }
  

  res.render("catch",{pokemon:pokemonApI.data.results,imageSrc:catchPokemonImage,nameOfPokemon:targetPokemon.name,message:message});
});



app.get("/who", async (req: any, res: any) => {
  
  await loadPokemon();
  await randomPokemonGenarator();
  

  res.render("who",{pokemon:pokemonApI.data.results,whoImageSrc:whoPokemonImage,nameOfPokemon:pokemon.data.name});
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
  console.log(currentUser)
  if (currentUser._id !== "1") {
    res.redirect("home")
  } else {
    res.render("login")
  }
  
});

app.post("/login", async (req: any, res: any) => {
  
  

  try {
      await client.connect();
      
      
      
  let cursor = await client.db('PokemonDB').collection('Users').findOne({email:req.body.email})
  let cursor2 = await client.db('PokemonDB').collection('Users').findOne({password:req.body.password})
 

  

  
  
  

  
  
    if (cursor == null || cursor2 == null ) {
      errorMessageClass = "Error"
      errorMessage = "Foute Email of passwoord"
      res.render("login",{errorMessage:errorMessage,errorMessageClass:errorMessageClass})
    } else {
      currentUser = cursor;
      if (currentUser.huidigePokemon == null) {
        huidigePokemonNaam = "Charmander"
        currentUser.huidigePokemon = {
        naam:huidigePokemonNaam,
        stats:52,
        sprite:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"
      }
      currentUser.catchPokemon = [currentUser.huidigePokemon]
      await client.db('PokemonDB').collection('Users').updateMany({email:currentUser.email},{$set:{catchPokemon:currentUser.catchPokemon}},{upsert:true})
      await client.db('PokemonDB').collection('Users').updateOne({email:currentUser.email}, {$set:{huidigePokemon:currentUser.huidigePokemon}},{upsert:true})
      
      }
      res.redirect("home")
    }
      
      
  } catch (e) {
      console.error(e);
      errorMessageClass = "Error"
      errorMessage = "Login mislukt error 404"
  } finally {
      await client.close();
  } 
    
  
});

app.get("/signUp", async (req: any, res: any) => {

  if (currentUser._id !== "1") {
    res.redirect("home");
  } else {
    res.render("signUp");
  }
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
      if (req.body.password.length > 6) {
        await client.db('PokemonDB').collection('Users').insertOne(newUser);
      errorMessage = "Account succevol aangemaakt!"
      errorMessageClass = "Succes"
      } else if (req.body.password.length <= 6) {
        errorMessage = "Passwoord bevat minder dan 7 karakaters"
        errorMessageClass = "Error"
      }
    } 
    if (cursor != null) {
      
        errorMessage = "Email bestaat al"
        errorMessageClass = "Error"
        cursor = null
      
    }
    
    
} catch (e) {
    console.error(e);
    errorMessageClass = "Error"
    errorMessage = "Aanmaak mislukt, probeer terug opnieuw"
} finally {
    await client.close();
} 


  res.render("signUp",{errorMessage:errorMessage,errorMessageClass:errorMessageClass})
});

app.get("/signUp", async (req: any, res: any) => {

  if (currentUser._id !== "1") {
    res.redirect("home");
  } else {
    res.render("signUp");
  }
});

app.use((req: any, res: any) => {
  res.status(404);
  res.render("error");
});

app.listen(app.get("port"), () =>
  console.log("[server] http://localhost:" + app.get("port"))
);
