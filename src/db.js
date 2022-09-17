const { MongoClient } = require('mongodb');

let conexaoMongo;

module.exports = {
    conectarComMongo: ( abrirPorta3000 ) => {
        MongoClient.connect('mongodb://localhost:27017/blog')
            .then(( conexao ) => {
                conexaoMongo = conexao.db();
                return abrirPorta3000();
            })
            .catch(( erro ) => {
                console.log(erro)
                return abrirPorta3000(erro)
            })
    },
    pegarConexaoMongo: () => conexaoMongo
}