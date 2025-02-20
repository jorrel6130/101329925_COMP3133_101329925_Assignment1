// Jorrel Tigbayan
// 101329925

const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Emails must be unique"],
        trim: true,
        lowercase: true
    },
    gender: {
        type: String,
        required: true,
        trim: true,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say']
    },
    designation: {
        type: String,
        required: true,
        trim: true
    },
    salary: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 1000.0) {
                throw new Error("Salary must be $1000 or greater");
            }
        }
    },
    date_of_joining: {
        type: Date,
        required: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    employee_photo: {
        type: String,
        default: '../employee_photos/profile.png'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("employee", employeeSchema)