var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Connect to myToDoList database running on localhost
mongoose.connect('mongodb://localhost/contactListMeanStack');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Successfully connected to database");
});

// Create a contactSchema
var ContactSchema = mongoose.Schema({
    name: {
        type: String,
        validate: {
            validator: function(value) {
                return value && value.length > 0;
            },
            message: "{PATH} cannot be empty."
        },
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
            },
            message: "{VALUE} is not a valid email."
        }
    },
    number: {
        type: String,
        required: true
    }
});

var ContactItem = mongoose.model('ContactItem', ContactSchema);

// Validation
ContactItem.schema.path('name').validate(function(name) {
    validatePresenceOf(name);
}, "Name cannot be empty");

ContactSchema.path('number').validate(function(number) {
    return !!number;
}, "Number cannot be empty");

ContactSchema.path('email').validate(function(email) {
    return !!email;
}, "Email cannot be empty");

function validatePresenceOf(value) {
    if ( value != undefined )
        return value && value.length
    else
        return false;
}

// Static files (angular files...)
app.use(express.static(__dirname + "/public"));


app.get('/', function(req, res) {
    res.send("Hello world from node js server");
});

app.post('/contacts', function(req, res) {
    console.log('body', req.body);
    var contactItem = new ContactItem({
        name: req.body.name,
        number: req.body.number,
        email: req.body.email
    });

    contactItem.save(function(err, newContact) {
        if (err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            console.log("success");
            res.status(200).json(newContact);
        }
    })
});

app.get('/contacts', function(req, res) {
   ContactItem.find(function(err, contacts) {
       if (err) {
           res.status(500).json(err);
       }

       res.status(200).json(contacts);
   })
});

app.get('/contacts/:id', function(req, res) {
    ContactItem.findById(req.params.id, function(err, contact) {
        if (err) {
            console.error('Error', err);
            res.status(500).json(err);
        }

        if (!contact) {
            res.status(404).json("Contact not found");
        }

        res.status(200).json(contact);
    })

});

app.put('/contacts/:id', function(req, res) {
    ContactItem.findById(req.params.id, function(err, contact) {
        if (err) {
            console.error('Error', err);
            res.status(500).json(err);
        }

        if (!contact) {
            res.status(404).json("Contact not found");
        }

        contact.name = req.body.name;
        contact.number = req.body.number;
        contact.email = req.body.email;

        contact.save(function(err, savedContact) {
            if (err) {
                res.status(500).json(err);
            }

            res.status(200).json(savedContact);
        })
    })

});

app.delete('/contacts/:id', function(req, res) {
    ContactItem.remove({
        _id: req.params.id
    }, function(err){
        if (err) {
            res.status(500).json(err);
        }

        res.status(200).json("OK");
    });
});

app.listen(3000);
console.log("server running at port 3000");
