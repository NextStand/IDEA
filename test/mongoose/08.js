/**
 * 数据查询
 * Model.find(conditions, [projection], [options], [callback])
 * 组合条件查询
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

    phone.find({
        $or: [
            { "manufacturer.country": "China" },
            { "manufacturer.country": "South Korea" }
        ],
        $and: [
            { 'price': { $gte: 1000 } },
            { 'price': { $lt: 4000 } }
        ]
    }, (err, res) => {
        console.log(res);
    });

    /* phone.find().or([
        {"manufacturer.country":"China"},
        {"manufacturer.country":"South Korea"}
    ]).where("price").gte(1000).lt(4000).exec((err,res)=>{
        console.log(res);
    }) */
    
    //多条件限制
    phone.find().where("price")
        .gte(1000)
        .lt(4000)
        .where("manufacturer.name")
        .equals("Samsung").exec((err, res) => {
            console.log("--------------------------");
            console.log(res);
        })
})