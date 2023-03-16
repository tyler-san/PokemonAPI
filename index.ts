const express = require('express');
const app = express();
const ejs= require('ejs');

app.set('view engine','ejs');
app.set('port', 3000);
app.use(express.static('public'));

app.get('/',(req:any,res:any)=>{
    res.render('index');
});

app.get('/home',(req:any,res:any)=>{
    res.render('home');
});

app.use((req:any, res:any) => {
    res.type('text/html');
    res.status(404);
    res.send('<p>Dit is niet een juiste url. Klik <a href="http://localhost:3000/">hier</a> om naar de landing pagina te gaan.</p>');
    }
);

app.listen(app.get('port'), 
    ()=>console.log( '[server] http://localhost:' + app.get('port')));