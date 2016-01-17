var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session'); // Pour la session
var handlebars = require('handlebars');
var hbs = require('hbs'); // Pour handlebars
var morgan = require('morgan'); // Charge le middleware de logging
var favicon = require('serve-favicon'); // Charge le middleware de favicon
var logger = require('log4js').getLogger('Server');
var validator = require('validator');

var app = express();

// option
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.engine('html', require('hbs').__express);

app.use(session({secret: 'a2ze4rty485jh4g763fds3q64',
                 resave: true,
                 saveUninitialized: true}));
app.use(morgan('combined')); // Active le middleware de logging
app.use(express.static(__dirname + '/public')); // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

logger.info('Routes load');
require('./routes')(app);
logger.info('Routes start');

// Erreur 404
app.use(function(req, res){
    res.status(404);
    res.render('error/404');
});

logger.info('server start');
app.listen(1313);

