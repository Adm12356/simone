var express=require('express');
var router=express.Router();
var mysql=require('mysql2');
var util=require('util');
var session=require('express-session');
var fileupload=require('express-fileupload');
var path=require('path');

router.use(express.static('public'));

var conn=mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'simone'
})
var exe=util.promisify(conn.query).bind(conn);
router.use(express.urlencoded({extended:true}));
router.use(session({
    secret:'A2ZITHUB',
    resave : false,
    saveUninitialized:true 
}))
router.use(fileupload());

function logincheck(req,res,next){
    if(req.session.name){
        next();
    }else{
        res.redirect('/admin');
    }
}

router.get('/',(req,res)=>{
    res.render('admin/login.ejs');
})
router.post('/login_check',async(req,res)=>{
    // res.redirect('dashboard');
    // res.send(req.body);
    var {username,password}=req.body
    var sql=`select * from login where username=? and password=?`;
    var data=await exe(sql,[username,password]);
    // res.send(data);
    if(data[0]){
        // session data store
        req.session.id=data[0].lid;
        req.session.name=data[0].name;
        res.redirect('/admin/dashboard');
    }else{
        res.redirect('/admin');
    }

})
router.get('/dashboard',logincheck,(req,res)=>{
    var name=req.session.name;
    res.render('admin/dashboard.ejs',{name:name});
    // res.send(req.session.name);
})
router.get('/form',logincheck,(req,res)=>{
    res.render('admin/form.ejs')
})
router.get('/table',logincheck,(req,res)=>{
    res.render('admin/table.ejs')
})
router.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/admin')
})

router.get('/service_add',(req,res)=>{
    res.render('admin/service_add.ejs');
})
router.post('/service_save',async(req,res)=>{
    // res.send(req.body);
    var {s_icons,s_title,s_desc}=req.body;
    var sql = `insert into service(s_icons,s_title,s_desc)values(?,?,?)`;
    var service=await exe(sql,[s_icons,s_title,s_desc]);
    res.redirect('/admin/service_add');
})
router.get('/service_list',async(req,res)=>{
    var sql =`select * from service`;
    var service=await exe(sql);
    res.render('admin/service_list.ejs',{service:service});
})


router.get('/education_add',(req,res)=>{
    res.render('admin/education_add.ejs');
})
router.post('/education_save',async(req,res)=>{
    // res.send(req.body);
    var {e_year,e_title,e_university,e_desc}=req.body;
    var sql = `insert into education(e_year,e_title,e_university,e_desc)values(?,?,?,?)`;
    var education=await exe(sql,[e_year,e_title,e_university,e_desc]);
    res.redirect('/admin/education_add');
})
router.get('/education_list',async(req,res)=>{
    var sql=`select * from education`;
    var education=await exe(sql);
    res.render('admin/education_list.ejs',{education:education});
})

router.get('/experience_add',(req,res)=>{
    res.render('admin/experience_add.ejs');
})
router.post('/experience_save',async(req,res)=>{
    // res.send(req.body);
    var {ex_year,ex_title,ex_university,ex_desc}=req.body;
    var sql = `insert into experience(ex_year,ex_title,ex_university,ex_desc)values(?,?,?,?)`;
    var experience=await exe(sql,[ex_year,ex_title,ex_university,ex_desc]);
    res.redirect('/admin/experience_add');
})
router.get('/experience_list',async(req,res)=>{
    var sql=`select * from experience`;
    var experience=await exe(sql);
    res.render('admin/experience_list.ejs',{experience:experience});
})



router.get('/skill_add',(req,res)=>{
    res.render('admin/skill_add.ejs');
})
router.post('/skill_save',async(req,res)=>{
    // res.send(req.body);
    var {sk_title,sk_rating}=req.body;
    var sql = `insert into skill(sk_title,sk_rating)values(?,?)`;
    var skill=await exe(sql,[sk_title,sk_rating]);
    res.redirect('/admin/skill_add');
})
router.get('/skill_list',async(req,res)=>{
    var sql=`select * from skill`;
    var skill=await exe(sql);
    res.render('admin/skill_list.ejs',{skill:skill});
})

router.get('/work_add',(req,res)=>{
    res.render('admin/work_add.ejs');
})
router.post('/work_save',async(req,res)=>{
    // res.send(req.body);
    var {w_title,w_desc}=req.body;
    var img=req.files.w_img;
    var imgname=req.files.w_img.name;
    var newname=Date.now()+imgname;
    var imgpath=path.join(__dirname,'../public/image',newname);
    img.mv(imgpath);
    var sql = `insert into work(w_img,w_title,w_desc)values(?,?,?)`;
    var work=await exe(sql,[newname,w_title,w_desc]);
    res.redirect('/admin/work_add');
})
router.get('/work_list',async(req,res)=>{
    var sql=`select * from work`;
    var work=await exe(sql);
    res.render('admin/work_list.ejs',{work:work});
})


router.get('/client_add',(req,res)=>{
    res.render('admin/client_add.ejs');
})
router.post('/client_save',async(req,res)=>{
    // res.send(req.body);
    var {c_desc,c_title,c_location}=req.body;
    var img1=req.files.c_img;
    var imgname1=req.files.c_img.name;
    var newname1=Date.now()+imgname1;
    var imgpath1=path.join(__dirname,'../public/image',newname1);
    img1.mv(imgpath1);
    var sql = `insert into client(c_desc,c_img,c_title,c_location)values(?,?,?,?)`;
    var client=await exe(sql,[c_desc,newname1,c_title,c_location]);
    res.redirect('/admin/client_add');
})
router.get('/client_list',async(req,res)=>{
    var sql=`select * from client`;
    var client=await exe(sql);
    res.render('admin/client_list.ejs',{client:client});
})

router.get('/home_update',async(req,res)=>{
    var sql = `select * from home where hid=1`;
    home = await exe(sql);
    res.render('admin/home_update.ejs',{home:home[0]});
})

// router.get('/home_update_save/:id/:img',async(req,res)=>{
    
// })

router.get('/contact_pending',async(req,res)=>{
    var sql = `select * from contact_data where status=?`;
    contact = await exe(sql,['pending']);
    res.render('admin/contact_pending.ejs',{contact:contact });
})
router.get('/contact_pending_confirm/:id',async(req,res)=>{
    var id = req.params.id;
    var sql = `update contact_data set status=? where cid=?`;
    contact = await exe(sql,['confirm',id]);
    // res.render('admin/contact_pending.ejs',{contact:contact });
    res.redirect('/admin/contact_pending');
})
router.get('/contact_pending_reject/:id',async(req,res)=>{
    var id = req.params.id;
    var sql = `update contact_data set status=? where cid=?`;
    contact = await exe(sql,['reject',id]);
    res.redirect('admin/contact_pending',{contact:contact });
    // res.send(id);
})

router.get('/contact_complete',async(req,res)=>{
    var sql = `select * from contact_data where status=?`;
    contact = await exe(sql,['confirm']);
    res.render('admin/contact_complete.ejs',{contact:contact });
})
router.get('/contact_reject',async(req,res)=>{
    var sql = `select * from contact_data where status=?`;
    contact = await exe(sql,['reject']);
    res.render('admin/contact_reject.ejs',{contact:contact });
    // res.send("Hi")
})


module.exports=router;
