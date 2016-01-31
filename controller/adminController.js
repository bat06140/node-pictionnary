var validator = require('validator');
var mysql = require('./../model/connectdb');
var logger = require('log4js').getLogger('Server');
var sha256 = require('sha256');

exports.index = function(req, res){
    mysql.selection("SELECT * FROM users WHERE id <> ? ORDER BY prenom, email", [req.user.id], function(result){
        res.render("admin/index", {user : req.user, users : result});
    });
};

exports.viewUser = function(req, res){
    if(!validator.isInt(req.params.user)){
        res.render('error/500', {user: req.user});
    }else{
        mysql.selection("SELECT * FROM users WHERE id = ?", [req.params.user], function(result){
            if(result.length != 1){
                res.render('error/500', {user: req.user});
            }else{
                res.render('admin/user', {user: req.user, champ: result[0]})
            }
        })
    }
};

exports.updateUser = function(req, res){
    errors = [];
    if(!validator.isInt(req.params.user)){
        res.render('error/500', {user: req.user});
    }
    if(!validator.isEmail(req.body.email))
        errors[errors.length] = "Format de l'email invalide";
    if(!validator.isNull(req.body.passwd) && !validator.isAlphanumeric(req.body.passwd))
        errors[errors.length] = "Format du mot de passe invalide";
    if(!validator.isNull(req.body.prenom) && !validator.isAlpha(req.body.prenom))
        errors[errors.length] = "Format du prénom invalide";
    if(!validator.isAlpha(req.body.nom))
        errors[errors.length] = "Format du nom invalide";

    if(errors.length != 0){
        champ = {
            id: req.params.user,
            email : req.body.email,
            prenom : req.body.prenom,
            nom : req.body.nom
        };
        res.render('admin/user', {user: req.user, champ: champ, errors: errors})
    }else{
        if(validator.isNull(req.body.passwd))
            mysql.selection("UPDATE users SET prenom = ?, nom = ?, email = ? where id = ?",
                [req.body.prenom, req.body.nom, req.body.email, req.params.user], function(result){
                    res.redirect("/admin");
                });
        else
            mysql.selection("UPDATE users SET prenom = ?, nom = ?, email = ?, password = ? where id = ?",
                [req.body.prenom, req.body.nom, req.body.email, sha256(req.body.passwd), req.params.user], function(result){
                    res.redirect("/admin");
                });
    }
};

exports.deleteUser = function(req, res){
    if(!validator.isInt(req.params.user)){
        res.render('error/500', {user: req.user});
    }else{
        mysql.selection("DELETE FROM users WHERE id = ?", [req.params.user], function(result){
            mysql.selection("DELETE FROM drawings WHERE id_user = ?", [req.params.user], function(result){
                res.redirect('/admin')
            });
        })
    }
};