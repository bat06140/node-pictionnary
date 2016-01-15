<?php
$dir = '/websemantique/public';
require __DIR__.'/../app/core/Autoloader.php';
use core\Autoloader;

Autoloader::register();

if(isset($_GET['page'])){
    $page = $_GET['page'];
}else{
    $page = 'home';
}

ob_start();
if(!file_exists(__DIR__.'/../pages/'. $page . '.php')){
    require __DIR__ . '/../pages/errors/404.php';
}else {
    require __DIR__ . '/../pages/' . $page . '.php';
}

$content = ob_get_clean();

require __DIR__.'/../pages/default.php';
