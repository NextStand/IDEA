/**
 * 数据查询
 * Model.find(conditions, [projection], [options], [callback])
 * 条件查询Query
*/
const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/db_idea");
const db = mongoose.connection;
db.on("error", () => console.log("connection error"));
db.on("open", () => {
    const Schema = mongoose.Schema,
        phoneSchema = new Schema({
            device: String,    //设备名称
            isSmart: Boolean,   //是否为智能手机
            releaseTime: Date,      //发布时间 
            price: Number,    //售价
            apps: [{ name: String }], //手机中安装的App名称,是数组
            manufacturer: {         //手机厂商
                name: String,   //厂商名称
                country: String    //厂商国籍
            }
        }, {
                collection: "Phone"
            }),
        phone = mongoose.model("Phone", phoneSchema);
        phone.find({isSmart:false},{apps:true}).exec((err,res)=>{
            if(err){
                console.log(err);
            }else{
                console.log(JSON.stringify(res));
            }
        })
})