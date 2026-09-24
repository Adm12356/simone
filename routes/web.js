var express=require('express');
var router=express.Router();
var mysql=require('mysql2');
var util=require('util');

router.use(express.static('public'));
router.use(express.urlencoded({extended:true}));

var conn=mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'simone'
})
var exe=util.promisify(conn.query).bind(conn);

router.get('/',(req,res)=>{
    res.render('web/index.ejs');
})
router.get('/about',(req,res)=>{
    res.render('web/about.ejs');
})
router.get('/services',async(req,res)=>{
    var sql=`select * from service`;
    var service=await exe(sql);
    res.render('web/services.ejs',{service:service});
})
router.get('/resume',async(req,res)=>{
    var sql1=`select * from education`;
    var education=await exe(sql1);
    var sql2=`select * from experience`;
    var experience=await exe(sql2);
    var sql3=`select * from skill`;
    var skill=await exe(sql3);
    res.render('web/resume.ejs', {
        education: education,
        experience: experience,
        skill: skill
    });

})

router.get('/portfolio',async(req,res)=>{
    var sql4=`select * from work`;
    var work=await exe(sql4);
    res.render('web/portfolio.ejs',{work:work});
})
router.get('/clients',async(req,res)=>{
    var sql5=`select * from client`;
    var client=await exe(sql5);
    res.render('web/clients.ejs',{client:client});
})
router.get('/contact',(req,res)=>{
    res.render('web/contact.ejs');
})
router.post('/contact_save',async(req,res)=>{
    var {name,email,message}=req.body;
    var da=new Date();
    var date1=da.getDate()+"-"+Number(da.getMonth()+1)+"-"+da.getFullYear();
    var sql = `insert into contact_data(name,email,message,status,cdate)values(?,?,?,?,?)`;
    var data =await exe(sql,[name,email,message,'pending',date1]);
    res.redirect('/contact');
})


module.exports=router;