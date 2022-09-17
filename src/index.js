const express = require('express');
const { conectarComMongo, pegarConexaoMongo } =require('./db')

const app = express();

// receber dados via post
const bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

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
        .catch((erro) => {
            res.status(500).json({ erro: 'Erro na busca dos blogs'})
        })
})

app.get('/blogs/addBlog', (req, res) => {
    res.sendFile(__dirname + '/web/addBlog.html')
})

app.post('/blogs/addBlog', (req, res) => {
    const blog = req.body
    db.collection('blogs')
        .insertOne(blog)
        .then(() => {
            res.status(200).sendFile(__dirname + '/web/addBlog.html');
        })
        .catch((erro) => {
            res.status(500).sendFile(__dirname + '/web/addBlog.html');
        })
})