const mongoose = require('mongoose')
require('dotenv').config()

if(process.argv.length<3) {
    process.exit(1)
}

const password = process.argv[2]

const url= `mongodb+srv://fullstack:${password}@cluster0.vovpj4p.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: function(v) {
                return /\d{2,3}-\d{7,}/.test(v);
            },
            messgae: props => `${props.value} is not a valid phone number!`,
        },
    },
});

const Phone = mongoose.model('Phone', personSchema);

if(process.argv.length === 3) {
    Phone.find({}).then(result => {
        console.log('phonebook:');
        result.forEach(person => {
            console.log(`${person.name} - ${person.number}`);
            })
            mongoose.connection.close();
        });
    } else if(process.argv.length === 5) {
        const person = new Phone({
            name: process.argv[3],
            number: process.argv[4],
        })
        
        person.save().then(() => {
            console.log(`added ${person.name} - ${person.number} to the phonebook`)
            mongoose.connection.close();
        });
    } else {
        console.log('Invalid number of arguments');
        mongoose.connection.close();
    }

