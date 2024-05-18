<?php

namespace app\core;

class Application
{
    public static string $USER_PWD = 'u_password';
    public static string $ROOT_DIR;
    private static string $ADMIN_PASSWORD = 'a_password';
    public static string $APP_SETTINGS_TABLE = "app_settings";
    public Router $router;
    public Request $request;
    public Response $response;
    public string $isAdmin, $isUser;
    public Session $session;
    public Controller $controller;
    public Database $db;
    public static Application $app;
    public function __construct($rootpath , array $config)
    {
        self::$ROOT_DIR = $rootpath;
        self::$app = $this;
        $this->request = new Request();
        $this->response = new Response();
        $this->controller = new Controller();
        $this->session = new Session();
        $this->router = new Router($this->request,$this->response);
//        $this->db = new Database($config['db']);

    }
    public function userlogin(string $id,string $pwd){
        $this->session->set('user',$id);
        $this->session->set($this::$USER_PWD,$pwd);
    }

    public function userlogout()
    {
        if(!isset($_SESSION['user'])){ return; }
        unset($_SESSION['user']);
        unset($_SESSION[Application::$USER_PWD]);
    }

    public function updateDevice(string $device)
    {
        $id = Application::$app->session->get('user') ?? 0;
        $stmt = Application::$app->db->pdo->prepare("UPDATE data_users SET user_device='$device' WHERE id='$id'");
        $stmt->execute();
        return true;
    }
    public function run(){
        echo $this->router->resolve();
    }

    public function admin_login($admin)
    {
        if($this->session->isset('admin')){
            return false;
        }else{
            $this->session->set('admin',$admin['id']);
            $this->session->set($this::$ADMIN_PASSWORD,$admin['password']);
            return true;
        }
    }
    public function adminlogout()
    {
        if(!isset($_SESSION['admin'])){ return; }
        unset($_SESSION['admin']);
        unset($_SESSION[Application::$ADMIN_PASSWORD]);
        return true;
    }

    public function getadmin()
    {
        if(!$this->session->isset('admin')){ return false; }
        $username = $this->session->get('admin');
        $password = $this->session->get($this::$ADMIN_PASSWORD);
        $stmt = $this->db->pdo->prepare("SELECT * FROM admin_login WHERE id='$username'");
        $stmt->execute();
        if($stmt->rowCount() > 0){
            $user = $stmt->fetchAll(\PDO::FETCH_ASSOC)[0];
            if($password === $user['password']){
                return $user;
            }else{
                if($this->adminlogout()){
                    $this->request->head("/admin/login?error=User Password Changed!");
                }
                return false;
            }
        }
        return false;
    }

}