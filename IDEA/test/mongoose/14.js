/**
 * 数据查询
 * Model.find(conditions, [projection], [options], [callback])
 * 删除文档
*/
const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/db_idea");
const db = mongoose.connection;
db.on("error", () => console.log("connection error"));
db.on("open", () => {
    const Schema = mongoose.Schema,
        phoneSchema = new Schema({
            apps: Array,//更新的key必须存在
        }, {
                collection: "Phone"
            }),
        phone = mongoose.model("Phone", phoneSchema);
    phone.remove({isSmart:false},err=>{
        console.log(err);
    })
})