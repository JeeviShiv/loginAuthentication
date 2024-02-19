const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const user = require('./user');
const {isAuthorized} = require('../tokenvalidation');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/register',(req,res)=>{
    const {auth, decoded} = isAuthorized();
    if(auth){
        res.redirect('/users/profile');
    }
    else{
        res.render('register', { page: 'register', 'tokenAuth':auth, 'role': decoded.role});
    }
});

router.get('/newUser',(req,res)=>{
    const {auth, decoded} = isAuthorized();
    if(auth && decoded.role =='admin'){
        res.render('register', { page: 'newUser', 'tokenAuth':auth, 'role': decoded.role});
    }
    else {
        res.redirect('/auth/login');
    }
});

router.post('/addUser',(req,res)=>{
    let hash = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hash;
    user.create(req.body).then((result)=>{
        const string = encodeURIComponent('Successfully registered!!');
        res.redirect('/auth/login?success=' + string);
    }).catch((err)=>{
        if (err) {res.redirect('/user/register')};
    });
});

router.get('/profile',(req,res)=>{
    const { auth, decoded } = isAuthorized();
    if(auth){
        user.findById(decoded.id).then((userData) => {
            if (!userData) {res.redirect('/')};
            res.render('profile', { page: 'profile', 'tokenAuth':auth, user:userData, 'role': decoded.role });
        });
    }
    else{
        res.redirect('/auth/login');
    }
});
router.get('/all',(req,res)=>{
    const {auth, decoded} = isAuthorized();
    if(auth && decoded.role =='admin'){
        user.find({}).then((usersData) => {
            if (!usersData) {res.redirect('/')};
            res.render('users',{ page: 'all', 'tokenAuth':auth, data:usersData, 'role': decoded.role});
        }).catch((err)=>{
            if (err) {res.redirect('/')};
        });
    }else{
        res.redirect('/auth/login');
    }
});

module.exports = router;