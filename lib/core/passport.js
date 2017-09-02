var Promise=require("bluebird");
var redisjs = require("redis");
Promise.promisifyAll(redisjs);
var redis = redisjs.createClient();
var LocalStrategy   = require('passport-local').Strategy;
var settings=require("../config/global_settings.js")
var account = require("../common/account.js")

// expose this function to our app using module.exports
module.exports = function(app_services) {
    var passport=app_services.passport

    passport.serializeUser(function(uuid, done) {
		done(null,uuid);
    });

    passport.deserializeUser(function(uuid, done) {
        done(null,uuid)
    });
	
    // LOCAL SIGNUP ============================================================
    // =========================================================================

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password,done) {
        var user={
            username:username,
            password:password,
            email:req.body.email,
            delectedcountry:"testing"
        }
        
        account.new(user).then(function(uuid){
            return done(null,uuid)
        }).catch(function(err){
            return done(null,false,req.flash("systemmessage",JSON.stringify({type:"danger",message:"User Already Existed"})))
        })
    }));
    

    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form
        var user={
            username:username,
            password:password,
            ip:req.headers['x-forwarded-for']||req.connection.remoteAddress,
            useragent:req.headers["user-agent"],
            detectedlocation:""
        }
        
        account.login(user).then(function(uuid){
            return done(null,uuid)  
        }).catch(function(err){
            var flashmessage=JSON.stringify({type:"danger",message:"Incorrect Login Credential"})
            if(err=="account_unconfirmed"){
                flashmessage=JSON.stringify({type:"success",message:"Please Check Your Email"})
            }else if(err=="account_locked"){
                flashmessage=JSON.stringify({type:"success",message:"Your Account is locked. Please contact Support"})
            }
            return done(null,false,req.flash("systemmessage",flashmessage))
        }) 
    }));

};