/**
 * 根据API手册走
*/
const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/db_idea");
const db = mongoose.connection;
db.on("error", () => console.log("connection error"));
db.on("open", () => {
    const kittySchema = new mongoose.Schema({
        name: String
    }, {
            collection: "Kitten"
        });
    kittySchema.methods.speak = function () {
        let greeting = this.name ? "Meow name is " + this.name : "I don't have a name";
        //console.log(greeting);
    };

    const Kitten = mongoose.model("Kitten", kittySchema),
        fluffy = new Kitten({ name: 'fluffy' });

    /* fluffy.save((err,fluffy)=>{
        if(err){
            console.log(err);
        }else{
            fluffy.speak();
        }
    }) */
    Kitten.find((err, res) => {
        if (err)
            console.error(err);
        //console.log(res);
    });
    Kitten.find({ name: /^Fluff/ }, (err, res) => {
        if (err)
            console.error(err);
        console.log("---------------------------");
       // console.log(res);
    })
    console.log(db.db);
    db.db.eval("test({a:1,b:2})", function (err, retVal) {
        console.log(retVal)
    }
    )
})