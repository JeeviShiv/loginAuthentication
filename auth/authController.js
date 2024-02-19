const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const user = require('../user/user');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
const session = require('express-session');
const config = require('../config');
const {isAuthorized} = require('../tokenvalidation');

router.use(bodyParser.urlencoded({ extended:true }));
router.use(bodyParser.json());

router.get('/login',(req,res)=>{
    const { auth, decoded } = isAuthorized();
    if(!auth){
        res.render('login',{error: req.query.error?req.query.error:'',
                        success: req.query.success?req.query.success:'', 'tokenAuth':auth,page: 'login', 'role': decoded.role});
    }
    else{
        res.redirect(`/users/profile`);
    }
});

router.post('/loginUser',(req,res)=>{
    user.findOne({ username: req.body.username}).then((userData)=> { 
        if(!userData){ 
            const string = encodeURIComponent('Invalid username or password');
            res.redirect('/auth/login?error=' + string);
        }else {
            if (bcrypt.compareSync(req.body.password, userData.password)) {
                const token = jwt.sign({ id: userData._id, role:userData.role }, config.secret, {expiresIn: 86400});
                localStorage.setItem('authtoken', token)
                res.redirect(`/users/profile`);
            } else {
                const string = encodeURIComponent('Invalid password or password');
                res.redirect('/auth/login?error=' + string);
            }
        }
        });
});
router.get('/logout', (req,res) => {
    localStorage.removeItem('authtoken');
    res.redirect('/');
})
module.exports = router;