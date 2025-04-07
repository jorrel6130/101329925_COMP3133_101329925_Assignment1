// Jorrel Tigbayan
// 101329925    

const express = require('express')
const mongoose = require('mongoose')
const { buildSchema } = require('graphql')
const { graphqlHTTP } = require("express-graphql")
const UserModel = require('./models/Users')
const EmployeeModel = require('./models/Employees')
var cors = require('cors');

const app = express()
const SERVER_PORT = process.env.PORT || 6130;

app.route("/").get((req, res) => {
    res.send("Vercel API")
})

app.use(cors());

// http://localhost:6130/gql
const gqlSchema = buildSchema(
    `type Query{
        login(username: String, password: String): User
        test: String
        getAll: [Employee]
        searchById(_id: String): Employee
        searchByDesOrDep(option: String, query: String): [Employee]
    }
    
    type Mutation{
        signup(username: String, email: String, password: String): User
        addEmp(first_name: String, last_name: String, email: String, gender: String, designation: String, salary: Float, date_of_joining: String, department: String, employee_photo: String): Employee
        updEmp(_id: String, first_name: String, last_name: String, email: String, gender: String, designation: String, salary: Float, date_of_joining: String, department: String, employee_photo: String): Employee
        delEmp(_id: String): String
    }

    type User{
        _id: String
        username: String
        email: String
        password: String
        created_at: String
        updated_at: String
    }

    type Employee{
        _id: String
        first_name: String
        last_name: String
        email: String
        gender: String
        designation: String
        salary: Float
        date_of_joining: String
        department: String
        employee_photo: String
        created_at: String
        updated_at: String
    }
    `
)

const gqlResolver = {
    login: async (credentials) => {
        const { username, password } = credentials
        try {
            let user = await UserModel.findOne({ username: username })
            if (!user) {
                throw Error("Username does not exist.")
            } else if (user.password != password) {
                throw Error("Invalid password.")
            } else {
                return user
            }
        } catch (err) {
            return (err)
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
            return (err)
        }
    },
    test: () => {
        return "Functional"
    },
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
            return (err)
        }
    },
    searchByDesOrDep: async (input) => {
        const { option, query } = input
        let employee
        try {
            if (option != "designation" && option != "department") {
                throw Error('option field must be either "designation" or "department"')
            }
            if (employee = await EmployeeModel.find({[option]: query})) {
                return employee
            } else {
                throw Error("Employee does not exist.")
            }
        } catch (err) {
            return (err)
        }
    },
    addEmp: async (employee) => {
        const { first_name, last_name, email, gender, designation, salary, date_of_joining, department, employee_photo } = employee
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
                department,
                employee_photo
            })
            await newEmp.save()
            return newEmp
        } catch (err) {
            return (err)
        }
    },
    updEmp: async (update) => {
        const _id = { _id: update._id }
        const newDate = new Date
        let employee;
        try {
            if (update.salary) {
                if (update.salary < 1000) {
                    throw Error("Salary cannot be under 1000")
                }
            }
            if (employee = await EmployeeModel.findById(_id)) {
                employee = await EmployeeModel.findOneAndUpdate(_id, update)
                employee = await EmployeeModel.findOneAndUpdate(_id, { updated_at: newDate.now })
                return employee
            } else {
                throw Error("Employee does not exist.")
            }
        } catch (err) {
            return (err)
        }
    },
    delEmp: async (_id) => {
        try {
            if (employee = await EmployeeModel.findById(_id)) {
                await EmployeeModel.findOneAndDelete(_id)
                return (`Employee (id: ${_id._id}) successfully deleted.`)
            } else {
                throw Error("Employee does not exist.")
            }
        } catch (err) {
            return ("Employee deletion failed: " + err.message)
        }
    }
}

const gqlHTTP = graphqlHTTP({
    schema: gqlSchema,
    rootValue: gqlResolver,
    graphiql: true
})

app.use("/graphql", gqlHTTP)

const employeeResolver = {
    
}

app.listen(SERVER_PORT, () => {
    console.log('Server started')
    console.log('http://localhost:' + SERVER_PORT)
})