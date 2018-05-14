/**
 * 数据查询
 * Model.find(conditions, [projection], [options], [callback])
 * 聚合
*/
const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/db_idea");
const db = mongoose.connection;
db.on("error", () => console.log("connection error"));
db.on("open", () => {
    const Schema = mongoose.Schema,
        phoneSchema = new Schema({
        }, {
                collection: "Phone"
            }),
        phone = mongoose.model("Phone", phoneSchema);
    phone.aggregate([
        {
            $project: {
                apps_count: {
                    $size: {
                        $ifNull: ["$apps", []]
                    }
                },
                device:1,
                price:1,
                apps:1
            }
        },
        { $sort: { "apps_count": -1 } }
    ]).limit(1).exec((err, res) => {
        console.log(res);
    })
})