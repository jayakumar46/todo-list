const express = require("express");
const data = require("./sample.json");
const cors= require("cors");
const fs = require("fs");
// const data = require("./sample.json");
const app = express();

app.use(express.json());
app.use(cors({
  origin:"http://localhost:5173",
  methods:["GET","POST","PATCH","DELETE"],
}))

const PORT = 5000;

app.get("/users",(req,res)=>{    
   return res.json(data)

});
app.delete("/users/:id",(req,res)=>{ 
  let id = Number(req.params.id);
  let filteredusers = data.filter((user)=>user.id != id);
  fs.writeFile("./sample.json",JSON.stringify(filteredusers),(err,data)=>{
    return res.json(filteredusers);
  });
});

app.post("/users",(req,res)=>{
  let {name,age,city}=req.body;
  if(!name || !age || !city){
    res.status(400).json({message:"All fields required"})
  }
  let id = Date.now();
  data.push({id,name,age,city})
  fs.writeFile("./sample.json",JSON.stringify(data),(err,data)=>{
    return res.json({message:"user detailed added success"});
  });
})

app.patch("/users/:id",(req,res)=>{
  let id = Number(req.params.id);
  let {name,age,city}=req.body;
  if(!name || !age || !city){
    res.status(400).json({message:"All fields required"})
  }
  let index = data.findIndex((user)=>{
    user.id == id
  })
  data.splice(index,1,{...req.body})
  fs.writeFile("./sample.json",JSON.stringify(data),(err,data)=>{
    return res.json({message:"user detailed updated success"});
  });
})


app.listen(PORT, () => {
  console.log(`this server running on http://localhost:${PORT}`);
});

