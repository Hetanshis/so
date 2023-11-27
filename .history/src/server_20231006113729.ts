import express from "express";
const app = express()

app.use(express.json());

app.listen(`${process.env.PORT}`, () =>{
    console.log(`Sever is running on this PORT:-${process.env.PORT}`)
})