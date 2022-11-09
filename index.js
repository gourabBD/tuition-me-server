const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

//middle wares
app.use(cors());
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.m8joqcm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


//   function verifyJWT(req,res,next){
//     const authHeader=req.headers.authorization
//     if(!authHeader){
//       return res.status(401).send({message: 'Unauthorized access'})
//     }
//     const token=authHeader.split(' ')[1];
//     console.log(token)
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,function(err,decoded){
//       if(err){
//         return res.status(401).send({message:'Unauthorized access'})
//       }
//       req.decoded=decoded;
//       // console.log(decoded)
//       if(decoded.email !== req.query.email){
//         res.status(403).send({message: 'Unauthorized access'})
//       }
//       next();
//     })
//  }
async function run(){
  try{
     const serviceCollection= client.db('tuition-me').collection('services');
     const reviewCollection= client.db('tuition-me').collection('review');
      
    //   app.post('/jwt',(req,res)=>{
    //     const user=req.body;
    //     //require('crypto').randomBytes(64).toString('hex')
    //     const token = jwt.sign( user, process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'});
        
    //     res.send({token})
    //   })
     app.get('/services',async(req,res)=>{
      const query={}
      const cursor=serviceCollection.find(query)
      const services=await cursor.toArray();
      res.send(services)
     })
     app.get('/home',async(req,res)=>{
      const query={}
      const sort = { length: 1 };
      const limit = 3;
      serviceCollection.createIndex( { a: 1 } )
      const cursor=serviceCollection.find(query).sort({ a: -1 }).limit(limit);
      
      const services=await cursor.toArray();
      res.send(services)
     })
     app.get('/review',async(req,res)=>{
      const query={}
      reviewCollection.createIndex( { a: 1 } )
      const cursor=reviewCollection.find(query).sort({ a: -1 })
      const review=await cursor.toArray();
      res.send(review)
     })
     //according to individual id ,getting data by id from the main services  data
     app.get(`/services/:id`,async(req,res)=>{
      const id=req.params.id;
      const query={_id: ObjectId(id)}
      const service = await serviceCollection.findOne(query);
      res.send(service)
     })

     //service api create and get


     app.post('/services' , async(req,res)=>{
      const order=req.body;
      const result=await serviceCollection.insertOne(order)
      res.send(result)
     })
     app.post('/review' , async(req,res)=>{
      const review=req.body;
      const result=await reviewCollection.insertOne(review)
      res.send(result)
     })
     //Update
     app.get(`/review/:id`,async(req,res)=>{
      const id=req.params.id;
      const query={_id: ObjectId(id)}
      const service = await reviewCollection.findOne(query);
      res.send(service)
     })

     app.patch('/review/:id',async(req,res)=>{
      const id= req.params.id;
      const userReview = req.body.userReview
      const query={_id : ObjectId(id)}
      const updateDoc={
        $set:{
          userReview: userReview

        }
      
      }
      const result =await reviewCollection.updateOne(query,updateDoc)
      res.send(result)
     })

    //delete review
     app.delete('/review/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: ObjectId(id)}
      const result=await reviewCollection.deleteOne(query)
      res.send(result)
     })
  }
  finally{

  }

}
run().catch(err=>console.error(err))




app.get('/', (req, res) => {
  res.send('Tuition Me car server running')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})