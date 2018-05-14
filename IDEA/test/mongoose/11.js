/**
 * 数据查询
 * Model.find(conditions, [projection], [options], [callback])
 * 排重
*/
const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/db_idea");
const db = mongoose.connection;
db.on("error", () => console.log("connection error"));
db.on("open", () => {
    const Schema = mongoose.Schema,
        phoneSchema = new Schema({}, {
            collection: "Phone"
        }),
        phone = mongoose.model("Phone", phoneSchema);
        phone.find().distinct("manufacturer.country").exec((err,res)=>{
            if(err){
                console.log(err);
            }else{
                console.log(res);
            }
        })
        phone.find().count({"manufacturer.country":"China"}).exec((err,res)=>{
            if(err){
                console.log(err);
            }else{
                console.log("--------------------------");
                console.log(res);
            }
        })
})