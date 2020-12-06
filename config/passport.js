var pass = require('passport');
var User = require('../models/user');
var local = require('passport-local').Strategy;

pass.serializeUser(function(user, done){
 done(null, user.id);


});

pass.deserializeUser(function(id, done){
   User.findById(id, function(err, user){
       done(err, user);
   });

});

pass.use('local.signup', new local({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
}, function(req, email, password, done) {
    User.findOne({'email':email}, function(err,user){
        if(err){
            return done(err);
        }
        if(user){
            return done(null, false, {message: 'Email is already in use '});
        }
        var newUser = new User();
        newUser.email=email;
        newUser.password=newUser.encryptPassword(password);
        newUser.save(function(err, result){
            if(err){
                return done(err);
            }
            return done(null, newUser);
        });
    });


}));

pass.use('local.signin', new local({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
}, function(req, email, password, done) {
    
    
    User.findOne({'email':email}, function(err,user){
        if(err){
            return done(err);
        }
        if(!user){
            return done(null, false, {message: 'No user found'});
        }
        if(!user.validPassword(password)){
            return done(null,false, {message:'wrong password'});
        }
        return done(null, user);
    });


}));