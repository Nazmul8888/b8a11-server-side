const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware assignment11 p-33u5Tcb9UMIyaB8S


app.use(
  cors({
      origin: ['http://localhost:5173', 'https://assignment-eleven-a2aa1.web.app'],
      credentials: true,
  }),
)
app.use(express.json());


// mongodb



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6nodxbc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    

    const courseCollection = client.db('course').collection('services');
    const assignmentSubmit = client.db('course').collection('creation')

    app.get('/course',async(req,res)=>{
        const cursor = courseCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/course/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const options = {
          projection: {title:1,image:1,description:1, price:1},
        };
        const result = await courseCollection.findOne(query, options);
        res.send(result);
    })

    // post section

    app.get('/creation',async(req,res)=>{
      console.log(req.query.email);
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result= await assignmentSubmit.find().toArray();
      res.send(result);
    })

    app.post('/creation', async(req,res)=>{
      const create = req.body;
      console.log(create);
      const result = await assignmentSubmit.insertOne(create);
      res.send(result);
    })

    app.patch('creation/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const updateAssignment = req.body;
      console.log(updateAssignment);
      const updateDoc = {
        $set:{
          status: updateAssignment.status
        },
      };
      const result = await assignmentSubmit.updateOne(filter,updateDoc);
      res.send(result);
    })

    app.delete('/creation/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await assignmentSubmit.deleteOne(query);
      res.send(result);

    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('project is running')

})

app.listen(port,()=>{
    console.log(`project server is running on port${port}`)
})