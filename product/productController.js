const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const product = require('../product/product');
const {isAuthorized, getUserRole} = require('../tokenvalidation');

router.use(bodyParser.urlencoded({ extended:true }));
router.use(bodyParser.json());

router.get('/list',(req,res)=>{
    const {auth, decoded} = isAuthorized();
    if(auth){
        product.find({}).then((productsList)=>{
            res.render('products', {data:productsList, page: 'list', 'tokenAuth':auth, 'role': decoded.role });
        });
    }
    else{
        res.redirect('/auth/login');
    }
});
router.get('/add',(req,res)=>{
    const {auth, decoded} = isAuthorized();
    if(auth && decoded.role =='admin'){
        res.render('addproduct',{ page: 'add', 'tokenAuth':auth, 'role': decoded.role});
    }
    else{
        res.redirect('/auth/login');
    }
});

router.post('/addProduct',(req,res)=>{
    product.create(req.body).then((results)=>{
        res.redirect('/product/list');
    }).catch((err)=>{
        if (err) {res.redirect('/product/addProduct')};
    });
});

module.exports = router;