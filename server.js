const express = require("express");
const app = express() ;
const PORT = 3000;
const sqlite3 =require ("sqlite3")
const cors = require("cors")


app.use(express.json());   
app.use(express.static("public"));

app.get("/" , (req , res)=>{
    res.send("welcom to the rest API");
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});