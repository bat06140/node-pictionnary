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

exports.welcomePost = function(req, res){
    if(!validator.isNumeric(req.body.dessin)){
        res.redirect('/error');
    }else{
        mysql.selection("DELETE FROM drawings WHERE id = ? AND id_user = ?", [req.body.dessin, req.user.id], function(result){
            logger.info(result);
            if(result.affectedRows != 1){
                res.redirect('/error');
            }else{
                res.redirect('/home/welcome');
            }
        })
    }
};

exports.settingGet = function(req, res){
    mysql.selection("SELECT * FROM users WHERE id = ?", [req.user.id], function(result){
        res.render('user/setting', {user: req.user, champ: result[0]});
    });
};

exports.settingPost = function(req, res){
    errors = [];
    if(!validator.isAlpha(req.body.prenom))
        errors[errors.length] = "Format du prénom invalide";
    if(!validator.isNull(req.body.nom) && !validator.isAlpha(req.body.nom))
        errors[errors.length] = "Format du nom invalide";
    if(!validator.isNull(req.body.tel) && !validator.isMobilePhone(req.body.tel, 'fr-FR'))
        errors[errors.length] = "Format du numéro de téléphone invalide";
    if(!validator.isNull(req.body.website) && !validator.isURL(req.body.website, {protocols: ['http','https']}))
        errors[errors.length] = "Format du site web invaldie";
    if(!validator.isNull(req.body.ville) && !validator.isAlpha(req.body.ville))
        errors[errors.length] = "Format de la ville invalide";
    if(!validator.isNull(req.body.couleur) && !validator.isHexColor(req.body.couleur))
        errors[errors.length] = "Format de la couleur invalide";
    if(!validator.isNull(req.body.taille) && !validator.isFloat(req.body.taille, {min: 0, max: 2.5}))
        errors[errors.length] = "Format de la taille invalide";

    if(errors.length != 0){
        res.render('user/setting', {user: req.user, champ:req.body, errors:errors});
    }else{
        mysql.selection("UPDATE users SET prenom = ?, nom = ?, tel = ?, website = ?, ville = ?, couleur = ?, taille = ? WHERE id = ?",
        [req.body.prenom, req.body.nom, req.body.tel, req.body.website, req.body.ville, req.body.couleur, req.body.taille, req.user.id],
        function(result){
            if(result.affectedRows != 1){
                res.render('user/setting', {user: req.user, champ: req.body, errors: ["Erreurs inconnus"]})
            }else{
                res.redirect("/home/welcome");
            }
        });
    }
};