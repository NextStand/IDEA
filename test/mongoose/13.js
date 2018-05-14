/**
 * 数据查询
 * Model.find(conditions, [projection], [options], [callback])
 * 更新数组
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
    phone.update({ _id: '5a502ca21d78d8316c1b4681' },
        { $pop: { apps: 1} },
        (err, raw) => {
            if (err) {
                console.log(err);
            } else {
                console.log(raw);
            }
        })
})