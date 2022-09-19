const express = require('express');
const { conectarComMongo, pegarConexaoMongo } =require('./db')
const { ObjectId } = require('mongodb');

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
    const dataCriacao = new Date().toLocaleDateString();
    const blog = { ...req.body, dataCriacao: dataCriacao }
    db.collection('blogs')
        .insertOne(blog)
        .then(() => {
            res.status(200).sendFile(__dirname + '/web/addBlog.html');
        })
        .catch((erro) => {
            res.status(500).sendFile(__dirname + '/web/addBlog.html');
        })
})

/* GET one */
app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;

    if(ObjectId.isValid(id)) {
        db.collection('blogs')
        .findOne({ _id: ObjectId(id) })
        .then( (blog) => res.status(200).json(blog) )
        .catch( (erro) => res.send(500) )
    } else {
        res.send(500);
    }
    
})

app.get('/blogs/pagina/:id', (req, res) => {
    res.sendFile(__dirname + '/web/blog.html');
})

/*  DELETE */
app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    
    if(ObjectId.isValid(id)){
        db.collection('blogs')
            .deleteOne( { _id: ObjectId(id) } )
            .then( ( blog ) => {
                res.status(200).json(blog) 
            })
            .catch( ( erro ) => {
                res.send(500);
            })
    } else {
        res.send(500);
    }
   
})  