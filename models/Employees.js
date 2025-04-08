// Jorrel Tigbayan
// 101329925

const mongoose = require('mongoose')

try {
        console.log(`Attempting to connect to DB`);
        const DB_CONNECTION = `mongodb+srv://vercel-admin-user:4H16DPth9NEoOlnZ@cluster0.vd5kp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

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

const employeeSchema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, default: new mongoose.Types.ObjectId},
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
        default: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'
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