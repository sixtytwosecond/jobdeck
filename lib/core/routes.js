var Promise=require("bluebird");
var redisjs = require("redis");
Promise.promisifyAll(redisjs);
var redis = redisjs.createClient();
var settings=require("../config/global_settings.js")
var socketuser = require("../model/socketuser.js")
//var JSX = require('node-jsx').install();
//var React = require('react');
//var ReactDOMServer = require('react-dom/server')
//var Renderchat = React.createFactory(require('../components/server.react.js'))
var account = require("../common/account.js")
var url = require("url");


module.exports = function(app_services) {
    var app=app_services.app
    var passport=app_services.passport

    app.get('/',function(req, res) {
        account.ipguard(req.headers['x-forwarded-for']||req.connection.remoteAddress).then(function(){
            if (req.isAuthenticated()){
                res.redirect('/chat');
            }else{
                res.render('index.ejs',{message: req.flash('systemmessage'),disabled:false}); 
            }
        }).catch(function(){
            req.flash("systemmessage","")
            req.flash("systemmessage",JSON.stringify({type:"danger",message:"Your Access is Suspended"}))
            res.render('index.ejs',{message: req.flash('systemmessage'),disabled:true}); 
        })
    });
       
    app.post('/login',valid_login_session,passport.authenticate('local-login', {
        successRedirect : '/chat', 
        failureRedirect : '/', 
        failureFlash : true 
    }));
    
    
    app.post('/resetpassword',valid_login_session, function (req, res, next) {
        var link=url.parse(req.headers.referer)
        var token=link.pathname.replace(/\/v\//,"")
        var request={
            verifykey:token,
            password:req.body.password
        }
        account.resetpassword(request).catch(function(err){console.log(err)})
        req.flash("systemmessage",JSON.stringify({type:"success",message:"Your Password is reset"}))
        res.redirect('/'); 
    });
    
    app.get('/forgetpassword',valid_login_session, function(req, res) {
        res.render('forgetpassword.ejs',{ message: req.flash('systemmessage') }); 
    });
    
    app.post('/forgetpassword',valid_login_session, function(req, res) {
        var request={
            email:req.body.email,
            ip:req.headers['x-forwarded-for']||req.connection.remoteAddress,
            useragent:req.headers["user-agent"],
        }
        
        account.forgetpassword(request).catch(function(err){console.log(err)})
        req.flash("systemmessage",JSON.stringify({type:"success",message:"Please Check Your Email"}))
        res.redirect('/'); 
    });
    
    
    app.get('/signup',valid_login_session,function(req, res) {
        res.render('signup.ejs', { message: req.flash('systemmessage') });
    });

    app.post('/signup',valid_login_session, function(req, res) {
        var link=url.parse(req.headers.referer,true)
        var user={
            username:req.body.username,
            password:req.body.password,
            email:req.body.email,
            delectedcountry:"testing",
            promocode:link.query.promocode
        }
        
        account.new(user).then(function(uuid){
            req.flash("systemmessage",JSON.stringify({type:"success",message:"Please Confirm Your Email"}))
            res.redirect("/signup")
        }).catch(function(err){
            if(err=="invalid_email"){
                req.flash("systemmessage",JSON.stringify({type:"danger",message:"Please enter a valid email"}))
            }else if(err=="invalid_username"){
                req.flash("systemmessage",JSON.stringify({type:"danger",message:"Username must not contain non-word charactor e.g. !@#$%^&*()' +=-"}))
            }else if(err=="invalid_password"){
                req.flash("systemmessage",JSON.stringify({type:"danger",message:"Password can not be empty"}))
            }else if(err=="email_already_exist"){
                req.flash("systemmessage",JSON.stringify({type:"danger",message:"Email Already Existed"}))   
            }else{
                req.flash("systemmessage",JSON.stringify({type:"danger",message:"User Already Existed"}))
            }
            res.redirect("/signup")
        })
    });
    
    app.get('/resendconfirmation',valid_login_session, function(req, res) {
        res.render('resend.ejs',{ message: req.flash('systemmessage') });        
    });
    
    app.post('/resendconfirmation',valid_login_session, function(req, res) {
        account.resendconfirmation(req.body.email).catch(function(err){
            console.log(err)
        })
        
        req.flash("systemmessage",JSON.stringify({type:"success",message:"Please Check Your Email"}))
        res.redirect("/")
    });
    
    app.get('/chat', valid_chat_session, function(req, res) {
        res.render('chat.ejs', {});        
    });
    
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    
    function valid_chat_session(req, res, next) {
        return new Promise(function(resolve,reject){
            account.ipguard(req.headers['x-forwarded-for']||req.connection.remoteAddress).then(function(){
                if (req.isAuthenticated()){
                    return next();
                }else{
                    res.redirect('/');
                }
            }).catch(function(){
                res.redirect('/');
            })
        })
    }
    
    function valid_login_session(req, res, next) {
        return new Promise(function(resolve,reject){
            account.ipguard(req.headers['x-forwarded-for']||req.connection.remoteAddress).then(function(){
                if (req.isAuthenticated()){
                    res.redirect('/chat');
                }else{
                    return next();
                }
            }).catch(function(){
                res.render('suspend.ejs',{message: req.flash('systemmessage')}); 
            })
        })
    }
    
    
    function valid_ip(req, res, next){
        return new Promise(function(resolve,reject){
            account.ipguard(req.headers['x-forwarded-for']||req.connection.remoteAddress).then(function(){
                return next()
            }).catch(function(){
                req.flash("systemmessage",JSON.stringify({type:"danger",message:"Your Access is Suspended"}))
                res.render('index.ejs',{message: req.flash('systemmessage')}); 
            })
        })
    }

};