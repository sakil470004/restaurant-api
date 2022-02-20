const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT||5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.poyqe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)

const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        console.log('Connected to database');

        const database = client.db('foodFanda');
        const servicesCollection = database.collection('foods');

        // GET API
        app.get('/foods', async (req, res) => {
            const cursor = servicesCollection.find({});
            const foods = await cursor.toArray();
            res.send(foods);
        })
        // // get single foods
        // app.get('/foods/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const food = await servicesCollection.findOne(query);
        //     res.json(food);
        // })

        // POST API 
        // insert one
        app.post('/foods', async (req, res) => {
            const food = req.body;

            const result = await servicesCollection.insertOne(food);
            // console.log('hit the post api');
            console.log(food);
            res.json(result)
        })

        // Delete Api
        // delete one
        app.delete('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })


    } finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('your faaking restaurant app is working')
})

app.listen(port, () => {
    console.log('app is running ', port)

})
/*
1.heroku account open
2.heroku software install

Every project
1.git init
2. .gitignore(node_module , .env)
3.push everything to git
4.make sure you have this script :   "start": "node index.js",
5.make sure :put process.env.PORT in front of your port number
6.heroku login
7.heroku create(only one time for a project)
8.command :git push heroku main

------
update:
1.save everything check locally
2.git add , git commit -m ,"" git push
3. git push heroku main
*/
