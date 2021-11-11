const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const port = 5000;
const app = express();


// middlware
app.use(cors());
app.use(express.json());



// user: mydbuser1
// pass : j7dmtd4t6ezXR56L



const uri = "mongodb+srv://mydbuser1:j7dmtd4t6ezXR56L@cluster0.wgw4c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// user: mydbuser1
// pass : j7dmtd4t6ezXR56L

async function run() {
    try {
        await client.connect();
        const database = client.db('foodMaster');
        const usersCollection = database.collection('users');
        // GET API
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        });

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await usersCollection.findOne(query);
            console.log('load user with id: ', id);
            res.send(user);
        })

        // POST API
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            console.log('got new user', req.body);
            console.log('added user', result);
            res.json(result);
        });

        //UPDATE API
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
        })

        // DELETE API
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);

            console.log('deleting user with id ', result);

            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir)




app.get('/', (req, res) => {
    res.send('running my CURD server.')
});

app.listen(port, () => {
    console.log('running server on port', port);
});







// client.connect(err => {
//     const collection = client.db("foodMaster").collection("users");
//     // perform actions on the collection object
//     console.log('Hitting the database');

//     const user = { name: 'mahia mahi', email: 'mahi@gamil.com', phone: '019999999' };
//     collection.insertOne(user)
//         .then(() => {
//             console.log('insert success');
//         })
//     // client.close();
// });


// const { MongoClient } = require('mongodb');
// const uri = "mongodb+srv://mydbuser1:<password>@cluster0.wgw4c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });