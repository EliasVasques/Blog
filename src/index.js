const express = require('express');
const { conectarComMongo, pegarConexaoMongo } =require('./db')

const app = express();

// conectar com o banco de dados
let db;
conectarComMongo( ( erro ) => {
    if(!erro) {
        app.listen(3000, () => console.log('Rodando na porta 3000'));
        db = pegarConexaoMongo();
    }
})



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/web/index.html')
})

app.get('/blogs', (req, res) => {
    const blogs = []
    db.collection('blogs')
        .find()
        .forEach(blog => blogs.push(blog))
        .then(() => {
            res.status(200).json(blogs)
        })
})