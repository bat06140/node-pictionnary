var mysql = require('./../model/connectdb');
var logger = require('log4js').getLogger('Server');
var validator = require('validator');


exports.welcomeGet = function(req, res){
    mysql.selection("SELECT id, nom FROM drawings WHERE id_user = ?", [req.user.id], function(result){
        res.render('home/index', {user : req.user, draw: result});

    });
};

exports.viewPaint = function(req, res){
    if(!validator.isInt(req.params.paint)){
        res.render('error/500', {user: req.user});
    }else{
        mysql.selection("SELECT * FROM drawings WHERE id_user = ? AND id = ?", [req.user.id, req.params.paint], function(result){
            if(result.length != 1){
                res.render('error/404', {user: req.user});
            }else{
                res.render('draw/view', {user : req.user, draw : result[0]});
            }
        });
    }
};

exports.drawPaintGet = function(req, res){
    res.render('draw/paint', {user: req.user});
};

exports.drawPaintPost = function(req, res){
    errors = [];
    if(!validator.isAlphanumeric(req.body.picturename))
        errors[errors.length] = "Le nom de votre dessin contient des caractères incorrects";
    if(!validator.isLength(req.body.picturename, 2, 20))
        errors[errors.length] = "Le nom de votre dessin ne peut contenir que 2 à 20 caractères";

    if(errors.length != 0)
        res.render('draw/paint', {user: req.user, errors: errors});
    else{
        params = {
            id_user : req.user.id,
            commands: req.body.commands,
            dessin  : req.body.picture,
            nom     : req.body.picturename
        };
        mysql.selection("INSERT INTO drawings SET ?",params, function(result){
            res.redirect('/home/welcome');
        });
    }
};