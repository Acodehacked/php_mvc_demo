<?php

namespace app\core;

class Request
{
    public function getPath(){
        $path = $_SERVER['REQUEST_URI'] ?? '/';
        $position = strpos($path,'?');
        if($position === false){
            return $path;
        }
        return substr($path,0,$position);
    }
    public function getPathOnly(){
        $path = $_SERVER['REQUEST_URI'] ?? '/';
        $position = strpos($path,'?');
        if($position === false){
            $path = explode('/',$path);
            return '/'.$path[1];
        }
        return substr($path,0,$position);
    }
    public function getSubVar(){
        $path = $_SERVER['REQUEST_URI'] ?? '/';
        $path = explode('/',$path);
//        djabhyyz.com/remix/dj-thappakoothu
        return $path[2]?? 0;
    }
    public function getDevice(){
        return $_SERVER['HTTP_USER_AGENT'];

    }

    public function head(string $link)
    {
        header("Location:$link");
    }
    public function method(){
        return strtolower($_SERVER['REQUEST_METHOD']);
    }
    public function isGet()
    {
        return Application::$app->request->method() === "get";
    }

    public function isPost()
    {
        return Application::$app->request->method() === "post";
    }
    public function isAdmin(){
        $path = $_SERVER['REQUEST_URI'];
        $patharray = explode('/',$path);
        if($patharray[1] === "admin"){
            return "isAdmin";
        }else{
            return false;
        }
    }
    public function getFileName()
    {
        $path = $_SERVER['REQUEST_URI'];
//        echo $path;
        return $path;
    }
    public function setStatusCode(int $code){
        http_response_code($code);
    }
    public function isAdminLogged()
    {
//        return isset($_SESSION['admin_mail']) ?? false;
        return "logged";
    }

    public function getBody()
    {
        $body =[];
        if($this->method() ==='get'){
            if(str_contains($_SERVER['REQUEST_URI'],'?')){
                $requestUrl = explode('?',$_SERVER['REQUEST_URI']);
                $keys = explode('&',$requestUrl[1]);
                    foreach ($keys as $c => $key) {
                        if($key !== ""){
                            $main = explode('=',$key);
                            $body[$main[0]] = $main[1];
                        }
                    }
            }
            foreach ($_GET as $key => $value) {
                $body[$key] = $value;
            }
        }
        if($this->method() ==='post'){
            if(str_contains($_SERVER['REQUEST_URI'],'?')){
                $requestUrl = explode('?',$_SERVER['REQUEST_URI']);
                $keys = explode('&',$requestUrl[1]);
                foreach ($keys as $c => $key) {
                    $main = explode('=',$key);
                    $body[$main[0]] = $main[1];
                }
            }
            foreach ($_POST as $key => $value) {
                $body[$key] = $value;
            }

        }
        return $body;
    }
}