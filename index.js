// Jorrel Tigbayan
// 101329925    

const express = require('express')
const mongoose = require('mongoose')
const { buildSchema } = require('graphql')
const { graphqlHTTP } = require("express-graphql")
const UserModel = require('./model/Users')

const app = express()
const SERVER_PORT = 6130

const userSchema = buildSchema(
    `type Query{
        login(username: String, password: String): String
    }
    
    type Mutation{
        signup(username: String, email: String, password: String): User
    }

    type User{
        username: String
        email: String
        password: String
        created_at: String
        updated_at: String
    }
    `
)

const connectDB = async () => {
    try {
        console.log(`Attempting to connect to DB`);
        const DB_NAME = ""
        const DB_USER_NAME = "jorrel6130"
        const DB_PASSWORD = 'M2s8QblJdWZUUXOD'
        const CLUSTER_ID = 'kua6u'
        const DB_CONNECTION = `mongodb+srv://${DB_USER_NAME}:${DB_PASSWORD}@cluster0.${CLUSTER_ID}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`

        mongoose.connect(DB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log(`MongoDB connected`)
        }).catch((err) => {
            console.log(`Error while connecting to MongoDB : ${JSON.stringify(err)}`)
        });
    } catch (error) {
        console.log(`Unable to connect to DB : ${error.message}`);

    }
}

app.listen(SERVER_PORT, () => {
    console.log('Server started')
    connectDB()
    console.log('http://localhost:6130/')
})