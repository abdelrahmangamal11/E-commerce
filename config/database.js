const mongoose=require('mongoose')

const dbconnection=()=>{mongoose.connect(process.env.duri)
.then((e)=>{
    console.log('connected',e.connection.host);
})
// .catch
// (err=>console.log(err))
}
module.exports=dbconnection;