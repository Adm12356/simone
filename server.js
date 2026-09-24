var express=require('express');
var app=express();

var web=require('./routes/web.js')
var admin=require('./routes/admin.js')

app.use('/',web);
app.use('/admin',admin);

app.listen(3000);