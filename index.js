const app = require('./app');
const express = require('express');
const {isAuthorized} = require('./tokenvalidation');

var port = 4350;

app.use(express.urlencoded({ extended: true}));
app.use(express.static(__dirname + '/public'));

app.set('views','src/views');
app.set('view engine','ejs');

app.get('/',(req,res)=>{
    const {auth, decoded} = isAuthorized();
    res.render('home',{'tokenAuth':auth, page: 'home', 'role': decoded.role});
})

app.listen(port,(err,res)=>{
    if(err) throw err;
    console.log("Server Running on :"+port);
})