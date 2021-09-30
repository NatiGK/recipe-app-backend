const {ApolloServer} = require('apollo-server-express');
const express = require('express');
const expressPlayground = require('graphql-playground-middleware-express').default
const mongoose = require('mongoose');
const {graphqlUploadExpress} = require('graphql-upload');
const typeDefs = require('./schema/typeDef').typeDef;
const resolvers = require('./resolvers/resolvers').resolvers;
const Recipe = require("./models/RecipeModel");

let app = express();
app.use(express.json({limit: '2mb'}));
app.use(express.urlencoded({limit: '2mb'}));
app.use(express.static('public'));
const server = new ApolloServer({
    typeDefs,
    resolvers
});

const startup = async () =>{
    await server.start();
    server.applyMiddleware({app});
}
app.use((req,res,next)=>{graphqlUploadExpress();next()});
startup();
app.get('/', (req, res)=> res.end('Welcome to the All-Recipes API'));
app.get('/playground', expressPlayground({endpoint: '/graphql'}));
app.listen({port: 4000},()=>
    console.log(`GraphQL Server running @ http://localhost:4000${server.graphqlPath}`)
)

mongoose.connect(
    'mongodb://localhost:27017/recipe-app',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
    console.log('Successfully connected to the database.');
});