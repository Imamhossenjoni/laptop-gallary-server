const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const express = require('express');
const cors = require('cors');
const res = require('express/lib/response');
const port = process.env.PORT || 4001;
require('dotenv').config();
const app = express();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.os7wm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const laptopCollection = client.db('laptopGallary').collection('laptops');
        const orderCollection = client.db('laptopGallary').collection('order')
        app.get('/laptops', async (req, res) => {
            const query = {};
            const cursor = laptopCollection.find(query);
            const laptops = await cursor.toArray();
            res.send(laptops);
        });
        app.get('/laptops/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            // console.log(query);
            const product = await laptopCollection.findOne(query);
            res.send(product);
        });
        //add product
        app.post('/laptops', async (req, res) => {
            const newService = req.body;
            const result = await laptopCollection.insertOne(newService);
            res.send(result);
        });
        //DELETE
        app.delete('/laptops/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const laptop = await laptopCollection.deleteOne(query);
            res.send(laptop);
        })
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const order = await laptopCollection.deleteOne(query);
            res.send(order);
        })
        

        //update product
        app.put('laptops/:id',async(req,res)=>{
            const id=req.params.id;
            const updatedQuantity=req.body;
            console.log(updatedQuantity);
            const filter={_id:ObjectId(id)}
            const options={upsert:true};
            const updatedDoc={
                $set:{
                    quantity:updatedQuantity.quantity
                }
            };
            console.log(updatedDoc)
            const result=await laptopCollection.updateOne(filter,updatedDoc,options);
            res.send(result);
        })
        app.get('/order', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            if (query.email !== undefined) {
                const cursor = orderCollection.find(query);
                const orders = await cursor.toArray();
                res.send(orders);
            } else {
                const cursor = orderCollection.find({});
                const orders = await cursor.toArray();
                res.send(orders);
            }
        })
        // order collection api
        // app.post('/order', async (req, res) => {
        //     const order = req.body;
        //     console.log({ order })
        //     const result = await orderCollection.insertOne(order);
        //     res.send(result);
        // })


    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send(' I am ready');
})
app.listen(port, () => {
    console.log('listening to port', port);
})