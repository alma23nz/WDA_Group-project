const express = require("express");
const app = express() ;
const PORT = 3000;
const sqlite3 =require ("sqlite3")
const cors = require("cors")

const stores = require("./stores.json");

app.use(express.json());   
app.use(express.static("public"));

app.get("/" , (req , res)=>{
    res.send("welcom to the rest API");
});

app.get("/api/stores", (req, res) => {
  res.json(stores);
});
app.get("/api/products/:id", (req,res)=>{
    let storesID= parseInt(req.params.id);
    let store = stores.find(p=>p.id === storesID);

    if(store){
        res.json(store);
    }else{
        res.status(404).json({message: "store not found"});
    }

});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});