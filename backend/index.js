const express=require('express');
require('./Config/db');
const cors=require('cors');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.port || 5000;

const UserRouter=require('./API/user');
const ChatRouter=require('./API/chatbot');




const app=express();
app.use(express.json());
app.use(cors(
    {
  origin: 'http://localhost:5173', // Frontend origin (React dev server)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}
));

app.use('/user',UserRouter);
app.use('/interview',ChatRouter);
app.listen(PORT,()=>{
    console.log("server is running");
})



