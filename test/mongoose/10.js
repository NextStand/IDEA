/**
 * 数据查询
 * Model.find(conditions, [projection], [options], [callback])
 * 排序
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
        phone.find().sort({"price":-1}).limit(1).exec((err,res)=>{
            if(err){
                console.log(err);
            }else{
                console.log(res);
            }
        })
})