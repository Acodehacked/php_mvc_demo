<?php

require_once __DIR__ . '/../vendor/autoload.php';

use app\controllers\AdminSiteController;
use app\controllers\SiteControllers;
use app\core\Application;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__.'/../');
$dotenv->load();
$config = [
    'db'=>[
        'dsn' => $_ENV['DB_DSN'],
        'user' => $_ENV['DB_USER'],
        'password' => $_ENV['DB_PASSWORD']
    ]
];

$app = new Application(dirname(__DIR__),$config);

$app->router->get('/',[SiteControllers::class,'home']);
//$app->router->getV('/remix',[SiteControllers::class,'remix'],'id');
$app->router->get('/admin',[AdminSiteController::class,'Admin']);
//$app->router->get('/logout',[AdminSiteController::class,'AdminLogout']);
//$app->router->get('/AdminAddRemix',[AdminSiteController::class,'AdminAddRemixes']);
//$app->router->get('/AdminEditRemixes',[AdminSiteController::class,'AdminRemixes']);
//$app->router->get('/AdminRemix',[AdminSiteController::class,'AdminEditRemixes']);
//$app->router->get('/AdminEditAbout',[AdminSiteController::class,'AdminEditAbout']);
//$app->router->get('/AdminCategories',[AdminSiteController::class,'AdminCategories']);
//$app->router->get('/AdminPlaylists',[AdminSiteController::class,'AdminPlaylists']);
///admin/uploadimage
//$app->router->post('/AdminEditAbout',[AdminSiteController::class,'AdminEditAbout']);
//$app->router->post('/adminlogin',[AdminSiteController::class,'Admin']);/
//$app->router->post('/AdminaddRemix',[AdminSiteController::class,'AdminAddRemixes']);
//$app->router->post('/AdmineditRemix',[AdminSiteController::class,'AdminEditRemixes']);
//$app->router->post('/adminuploadimage',[AdminSiteController::class,'UploadFile']);
//$app->router->post('/adminuploadFile',[AdminSiteController::class,'UploadSong']);
//$app->router->post('/AdminCategoryUpdate',[AdminSiteController::class,'AdminCategories']);
//$app->router->post('/AdminPlaylistUpdate',[AdminSiteController::class,'AdminPlaylists']);

$app->run();