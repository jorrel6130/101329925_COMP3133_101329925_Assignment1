// Jorrel Tigbayan
// 101329925    

const express = require('express')
const mongoose = require('mongoose')
const { buildSchema } = require('graphql')
const { graphqlHTTP } = require("express-graphql")
const UserModel = require('./models/Users')
const EmployeeModel = require('./models/Employees')

const app = express()
const SERVER_PORT = 6130

// http://localhost:6130/user
const userSchema = buildSchema(
    `type Query{
        login(username: String, password: String): String
    }
    
    type Mutation{
        signup(username: String, email: String, password: String): String
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

const userResolver = {
    login: async (credentials) => {
        const { username, password } = credentials
        try {
            let findUser = await UserModel.findOne({ username: username })
            if (findUser.length === 0) {
                throw Error("Username does not exist.")
            } else if (findUser.password != password) {
                throw Error("Invalid password.")
            } else {
                return username
            }
        } catch (err) {
            return ('Login unsuccessful: ' + err.message)
        }
    },
    signup: async (user) => {
        const { username, email, password } = user
        try {
            const newUser = UserModel({
                username,
                email,
                password
            })
            await newUser.save()
            return newUser
        } catch (err) {
            return ('Sign Up Failed: ' + err.message)
        }
    }
}

const userHTTP = graphqlHTTP({
    schema: userSchema,
    rootValue: userResolver,
    graphiql: true
})

app.use("/user", userHTTP)

// http://localhost:6130/employee
const employeeSchema = buildSchema(
    `type Query{
        getAll: [Employee]
        searchById(_id: Int)
        searchByDesOrDep(option: String, query: String)
    }
    
    type Mutation{
        addEmp(first_name: String, last_name: String, email: String, gender: String, designation: String, salary: Float, date_of_joining: String, employee_photo: String): String
        updEmp(_id: Int, first_name: String, last_name: String, email: String, gender: String, designation: String, salary: Float, date_of_joining: String, employee_photo: String): String
        delEmp(_id: Int): String
    }

    type Employee{
        first_name: String
        last_name: String
        email: String
        gender: String
        designation: String
        salary: Float
        date_of_joining: String
        employee_photo: String
        created_at: String
        updated_at: String
    }
    `
)

const employeeResolver = {
    getAll: async () => {
        let employees = await EmployeeModel.find({});
        return employees
    },
    searchById: async (_id) => {
        let employee
        try {
            if (employee = await EmployeeModel.findById(_id)) {
                return employee
            } else {
                throw Error("Employee does not exist.")
            }
        } catch (err) {
            return ("Could not find employee: " + err.message)
        }
    },
    searchByDesOrDep: async (input) => {
        const { option, query } = input
        if (option != "designation" && option != "department") {
            return ('Error: option field must be either "designation" or "department"')
        }
        let employee
        try {
            if (employee = await EmployeeModel.find({ [option]: query })) {
                return employee
            } else {
                throw Error("Employee does not exist.")
            }
        } catch (err) {
            return ("Could not find employee: " + err.message)
        }
    },
    addEmp: async (employee) => {
        const { first_name, last_name, email, gender, designation, salary, date_of_joining, employee_photo } = employee
        const formatted_date = Date.parse(date_of_joining)
        let newEmp
        try {
            newEmp = EmployeeModel({
                first_name,
                last_name,
                email,
                gender,
                designation,
                salary,
                date_of_joining: formatted_date,
                employee_photo
            })
            await newEmp.save()
            return newEmp
        } catch (err) {
            return ("Employee could not be created: " + err.message)
        }
    },
    updEmp: async (update) => {
        const _id = update._id
        let employee;
        try {
            employee = await EmployeeModel.findOneAndUpdate(_id, update)
            employee = await EmployeeModel.findOneAndUpdate(_id, { updated_at: new Date })
            return employee
        } catch (err) {
            return("Employee does not exist or cannot be updated." + err.message)
        }
    },
    delEmp: async (_id) => {
        try {
            await EmployeeModel.findOneAndDelete(_id)
            return (`Employee (id: ${_id}) successfully deleted.`)
        } catch (err) {
            return("Employee does not exist or cannot be deleted: " + err.message)
        }
    }
}

const employeeHTTP = graphqlHTTP({
    schema: employeeSchema,
    rootValue: employeeResolver,
    graphiql: true
})

app.use("/employee", employeeHTTP)

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
    console.log('http://localhost:6130')
})