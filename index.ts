const express = require("express");
const app = express();
const ejs = require("ejs");

app.set("view engine", "ejs");
app.set("port", 3000);
app.use(express.static("public"));

app.get("/", (req: any, res: any) => {
  res.render("index");
});

app.get("/eigenPokemonBekijken", (req: any, res: any) => {
  res.render("eigenPokemonBekijken");
});

app.get("/home", (req: any, res: any) => {
  res.render("home");
});

app.get("/compare", (req: any, res: any) => {
  res.render("compare");
});

app.get("/battler", (req: any, res: any) => {
  res.render("battler");
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
