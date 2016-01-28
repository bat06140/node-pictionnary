var validator = require('validator');
var mysql = require('./../model/connectdb');
var logger = require('log4js').getLogger('Server');
var sha256 = require('sha256');



exports.signInGet = function(req, res){
    if(req.isAuthenticated()){
        res.redirect('/home/welcome');
    }else{
        error = [];
        success = [];
        if(req.flash('error').length != 0)
            error[0] = 'Email ou mot de passe incorrect';
        if(req.flash('success').length != 0)
            success[0] = 'Vous êtes inscrit. Connectez vous pour accèder à votre compte.';
        logger.info(req.flash('success'));
        res.render('auth/signin', {errors: error, success: success});
    }
};



// Deconnexion
exports.signOut = function(req, res){
    if (req.isAuthenticated()) {
        req.logout();
    }
    res.redirect('/');
};


exports.signUpGet = function(req, res){
    if(req.isAuthenticated()){
        res.redirect('/home/welcome');
    }else{
        res.render('auth/signup');
    }
};

exports.signUpPost = function(req, res){
    if(req.isAuthenticated()){
        res.redirect('/home/welcome');
    } else {
        errors = [];
        if(!validator.isEmail(req.body.email))
            errors[errors.length] = "Format de l'email invalide";
        if(!validator.isAlphanumeric(req.body.passwd))
            errors[errors.length] = "Format du mot de passe invalide";
        if(!validator.isAlpha(req.body.firstname))
            errors[errors.length] = "Format du prénom invalide";
        if(!validator.isNull(req.body.lastname) && !validator.isAlpha(req.body.lastname))
            errors[errors.length] = "Format du nom invalide";
        if(!validator.isNull(req.body.number) && !validator.isMobilePhone(req.body.number, 'fr-FR'))
            errors[errors.length] = "Format du numéro de téléphone invalide";
        if(!validator.isNull(req.body.website) && !validator.isURL(req.body.website, {protocols: ['http','https']}))
            errors[errors.length] = "Format du site web invaldie";
        if(!validator.isDate(req.body.birthday))
            errors[errors.length] = "Format de l'anniversaire invalide";
        if(!validator.isNull(req.body.ville) && !validator.isAlpha(req.body.ville))
            errors[errors.length] = "Format de la ville invalide";
        if(!validator.isNull(req.body.color) && !validator.isHexColor(req.body.color))
            errors[errors.length] = "Format de la couleur invalide";
        if(!validator.isNull(req.body.taille) && !validator.isFloat(req.body.taille, {min: 0, max: 2.5}))
            errors[errors.length] = "Format de la taille invalide";

        if(errors.length != 0){
            res.render('auth/signup', {
                errors: errors,
                champ : req.body
            });
        } else {
            mysql.selection("SELECT id FROM users WHERE email = ?", [req.body.email], function(result) {
                logger.debug(result);
                if(result.length != 0){
                    res.render('auth/signup', {errors: ['Adresse email déjà existante'], champ: req.body});
                }else{
                    values = {
                        email: req.body.email,
                        password : sha256(req.body.passwd),
                        nom : req.body.lastname,
                        prenom : req.body.firstname,
                        tel : req.body.number,
                        website : req.body.website,
                        sexe : req.body.sexe,
                        birthdate : req.body.birthday,
                        ville : req.body.ville,
                        taille : req.body.taille,
                        couleur : req.body.color,
                        profilepic : req.body.picture
                    };
                    mysql.insertion('INSERT INTO users SET ?', values, function(response){
                        req.flash("success", "Vous êtes inscrit. Connectez vous pour accèder à votre compte");
                        res.redirect('/home/welcome');
                    });
                }
            });
        }
    }
};