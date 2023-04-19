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

app.get("/who", (req: any, res: any) => {
  res.render("who");
});

app.use((req: any, res: any) => {
  res.status(404);
  res.render("error");
});

app.listen(app.get("port"), () =>
  console.log("[server] http://localhost:" + app.get("port"))
);
