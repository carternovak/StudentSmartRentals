const exp = require("express")
const connectDB = require("./database");
const app = exp();
app.use(exp.json());

//db connection
connectDB();

//import API's
const communityAPI = require("./APIs/Communitydata");


//execute specific middleware based on path
app.use("/communitydata", communityAPI)


//handle invalid paths
app.use((err,req,res)=>{
    res.send({message : req.url+" is invalid path"})
})

//error handling
app.use((err,req,res,next)=>{
    res.send({message : "Error occured",reason:err.message});
})

app.listen(3000, ()=> console.log("server is on port 3000"))