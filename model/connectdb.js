var mysql = require('mysql');
var logger = require('log4js').getLogger('Server');
var SqlString = require('sqlstring');


var pool =  mysql.createPool({
    connectionLimit : 100, //important
    host : 'localhost',
    user : 'test',
    password: 'test',
    database: 'pictionnary'
});

exports.escape = function(value) {
    return SqlString.escape(value, false);
};

exports.selection = function(query,params,callback) {

    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            return callback({"erreur" : "Erreur de connection base de donnée"});
        }

        logger.debug('[QUERY] Connected as id ' + connection.threadId);

        connection.query(query, params, function(err, result){
            connection.release();
            if(!err) {
                return callback(result);
            }
        });

        connection.on('error', function(err) {
            return callback({"erreur" : "Erreur de connection base de donnée"});
        });
    });
};

exports.insertion = function(query, params, callback){
    pool.getConnection(function(err,connection){
        if(err){
            connection.release();
            return callback({"erreur" : "Erreur de connection base de donnée"});
        }

        logger.debug('[INSERT] Connected as id ' + connection.threadId);
        logger.debug('Insert : ' + query);

        connection.query(query, params, function(err, result){
            connection.release();
            if(!err) {
                return callback(result);
            }
        });

        connection.on('error', function(err) {
            return callback({"erreur" : "Erreur de connection base de donnée"});
        });
    });
};

exports.verifLogin = function(email, callback){
    pool.getConnection(function(err,connection){
        if(err){
            connection.release();
            return callback({"erreur" : "Erreur de connection base de donnée"});
        }

        logger.debug('[AUTH] Connected as id ' + connection.threadId);

        params = {email : email};
        connection.query('SELECT * FROM users WHERE ?', params, function(err, result){
            connection.release();
            if(!err) {
                return callback(result);
            }
        });

        connection.on('error', function(err) {
            return callback({"erreur" : "Erreur de connection base de donnée"});
        });
    });
};

exports.findOrCreate =  function(user, callback){
    pool.getConnection(function(err,connection){
        if(err){
            connection.release();
            return callback({"erreur" : "Erreur de connection base de donnée"});
        }

        connection.query('UPDATE users SET facebook = ?, facebook_picture = ?, prenom = ? WHERE email = ?', [user.id, user.photos[0].value, user.displayName, user.emails[0].value], function(err, result){
            connection.release();
            if(!err) {
                if(result.affectedRows == 0){
                    sql = "INSERT INTO users SET ?";
                    params = {
                        email: user.emails[0].value,
                        facebook : user.id,
                        facebook_picture : user.photos[0].value,
                        prenom : user.displayName
                    };
                    exports.insertion(sql, params, function(result){
                        logger.debug('[AUTH] Insert as id ' + connection.threadId);
                        user = {
                            id : result.insertId,
                            email : user.emails[0].value,
                            picture : user.photos[0].value,
                            name : user.displayName,
                            admin : result.admin
                        };
                        callback(user);
                    });
                } else {
                    exports.verifLogin(user.emails[0].value, function(result){
                        logger.debug('[AUTH] select as id ' + connection.threadId);
                        result = result[0];
                        user = {
                            id : result.id,
                            email : result.email,
                            picture : result.facebook_picture,
                            name : result.prenom,
                            admin : result.admin
                        };
                        callback(user);
                    });
                }
            }
        });

        connection.on('error', function(err) {
            return callback({"erreur" : "Erreur de connection base de donnée"});
        });
    });
};