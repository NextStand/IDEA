/**
 * 测试db
 */
const db=require("./db");
setTimeout(function(){
    db.eval("get_mongcondtion",{f_id:"get_mongocfig_list"},(err,res)=>{
        console.log(res);
    })
   /*  db.find("sys_menu",{},(err,res)=>{
        console.log(res);
    }) */
},2000)