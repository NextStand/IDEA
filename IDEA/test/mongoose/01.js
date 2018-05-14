const mongoose = require("mongoose");
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
        }, { collection: "Phone" });
    //添加实例方法
    phoneSchema.methods.printBrief = function () {
        console.log(this.device, "￥" + this.price);
    }
    //添加静态方法
    phoneSchema.statics.printCount = function () {
        this.count({}, (err, count) => {
            console.log('---printCount()-----------------------------')
            if (err) {
                console.log(err);
            } else {
                console.log('phone count=' + count);
            }
        });
    }
    //构建Model之前为Model创建自己添加的方法
    const Phone = mongoose.model("Phone", phoneSchema),
        phoneModel = new Phone({
            "device": "iPhone SE",
            "isSmart": "true",
            "releaseTime": "2016-03-21 10:00:00",
            "price": 4999,
            "apps": [{ "name": "Safari" }, { "name": "Map" }, { "name": "Tinder" }],
            "manufacturer": {
                "name": "Apple",
                "country": "The United States"
            }
        });

    phoneModel.printBrief();
    Phone.printCount();
})