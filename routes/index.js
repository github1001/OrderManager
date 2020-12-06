var express = require('express');
var router = express.Router();
var csurf = require('csurf');
var passport = require('passport');

var protectsession = csurf();
var Cart = require('../models/cart');

var Product = require('../models/products');
var Order = require('../models/orders');

//console.log("products are : "+product);

router.use(protectsession);

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
   Product.find(function(err, docs){

    console.log("docs are : "+docs);
     var productEach=[];
     var each=3;
     for(var i=0;i<docs.length; i+=each){
            productEach.push(docs.slice(i,i+each));
     }

    res.render('shop/index', { title: 'Papas Pizza', products:productEach, successMsg:successMsg, noMessage:!successMsg});

  });

});

router.get('/userAccounts/signUp', function(req, res, next){
    var msg = req.flash('error');
    res.render('userAccounts/signUp', {csrfToken: req.csrfToken(), messages:msg, hasErrors:msg.length>0});

});

router.post('/userAccounts/signUp', passport.authenticate('local.signup',{
       successRedirect:'/userAccounts/account',
       failureRedirect:'/userAccounts/signUp',
       failureFlash:true
}));

router.get('/userAccounts/account', isLoggedIn, function(req, res, next){
   res.render('userAccounts/account');


});

router.get('/logout',isLoggedIn, function(req, res, next){
  req.logout();
  res.redirect('/');


});




router.get('/userAccounts/signin', notLoggedIn,function(req, res, next){
  var msg = req.flash('error');
  res.render('userAccounts/signin', {csrfToken: req.csrfToken(), messages:msg, hasErrors:msg.length>0});

});

router.post('/userAccounts/signin',passport.authenticate('local.signin', {
  successRedirect:'/userAccounts/account',
  failureRedirect:'/userAccounts/signin',
  failureFlash:true


}));

router.get('/addToCart/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  
  Product.findById(productId, function (err, product) {

    if(err){
      return res.redirect('/');
    }
      cart.add(product, product.id);
      req.session.cart = cart;
      console.log(req.session.cart);
      res.redirect('/');
  });
});

router.get('/remove/:id', function(req,res,next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  
  cart.removeOne(productId);
  req.session.cart=cart;
  res.redirect('/myCart');

});

router.get('/removeAll/:id', function(req,res,next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  
  cart.removeAll(productId);
  req.session.cart=cart;
  res.redirect('/myCart');

});

router.get('/myCart', function(req, res, next){
  if(!req.session.cart){
    return res.render('shop/myCart', {products:null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/myCart', {products:cart.itemsArr(), totalPrice:cart.ttlPrice});
});

router.get('/checkout', function(req, res, next){
  if(!req.session.cart){
    return res.render('shop/myCart', {products:null});
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/payment', {csrfToken: req.csrfToken(),total: cart.ttlPrice, errMsg: errMsg, noError:!errMsg});


});

router.post('/checkout', function(req, res, next){
  if(!req.session.cart){
    return res.render('shop/myCart', {products:null});
  }
  var cart = new Cart(req.session.cart);

  var stripe = require('stripe')('sk_test_9Abai3g1Lovak8MIZydtIV93'); //your Stripe secret key

  // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
  stripe.charges.create({
    amount: cart.ttlPrice*100,
    currency: 'usd',
    source: req.body.stripeToken,
    description: 'My First Test Charge (created for API docs)'
  }, function(err, charge){
         if(err){
           req.flash('error', err.message);

           return res.redirect('/checkout');
         }
         var order = new Order({
           user:req.user,
           cart:cart,
           address:req.body.address,
           name:req.body.name,
           paymentId:charge.id
         });

         order.save(function(err, result){
          req.flash('success', 'Your order is on the way. Thank you very much.');
          req.session.cart=null;
          res.redirect('/');
         });



  });

});


function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}


module.exports = router;
