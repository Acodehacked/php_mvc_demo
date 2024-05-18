<?php

namespace app\core;

class Router
{
    public static string $ERROR_PAGE ='404';
    public string $title = 'Dj Abhyzz Page';
    public string $css = '';
    public string $customjs = '';
    public array $subvarible = [];

    public Request $request;
    public Response $response;
    protected array $routes =[];

    /**
     * @param app\core\Request $request
     * @param app\core\Response $response
     */
    public function __construct(Request $request,Response $response)
    {
        $url = $_SERVER['REQUEST_URI'];
        $this->request = $request;
        $this->response = $response;
        if(str_ends_with($url,'/') && $url !== '/'){
            $urlu = substr_replace($url,"",-1);
            $this->request->head($urlu);
            exit();
        }

    }

    public function get($path,$callback){
        $this->routes['get'][$path]['callback'] = $callback;
    }
    public function getV($path,$callback,$variable){
        $this->routes['get'][$path]['callback'] = $callback;
        $this->routes['get'][$path]['variable'] = $variable;
    }
    public function post($path,$callback){
        $this->routes['post'][$path]['callback'] = $callback;
    }
    public function resolve()
    {
        $path = $this->request->getPathOnly();
        $method = $this->request->method();
        $callback = $this->routes[$method][$path]['callback'] ?? false;
        $variable = $this->routes[$method][$path]['variable'] ?? "";
        if($variable !== ""){
            $this->subvarible = [
                $variable =>  $this->request->getSubVar()
            ];
        }
        if($callback === false){
            ///
            if($this->request->getPathOnly() === "/phpmyadmin"){
                exit;
            }
            Application::$app->controller->setMainLayout('blank');
            Application::$app->request->setStatusCode(404);
            return Application::$app->controller->render('404',[]);
        }
        if(is_string($callback)){
            return $this->renderView($callback);
        }
        if(is_array($callback)){
            $callback[0] = new $callback[0]();
        }
            Application::$app->controller = new $callback[0];
            $callback[0] = Application::$app->controller;

        return call_user_func($callback,$this->request);

    }
    public function renderView($view, $params = []){
        $viewContent = $this->renderOnlyView($view, $params);
        $layoutContent = $this->layoutContent($params);
        return str_replace('{{content}}', $viewContent,$layoutContent);
        include_once Application::$ROOT_DIR."/views/$view.php";
    }
    public function renderContent($viewContent){
        $layoutContent = $this->layoutContent();
        return str_replace('{{content}}', $viewContent,$layoutContent);

    }
    protected function layoutContent($params = []){
        $message = Application::$app->request->getBody()['error'] ?? Application::$app->request->getBody()['success'] ?? '';
        $params[] = ['message' => $message];
        foreach ($params as $key => $value){
            $$key = $value;
        }
        ob_start();
        $layout = Application::$app->controller->layout;
        include_once Application::$ROOT_DIR."/views/layouts/$layout.php";
        return ob_get_clean();
    }

    protected function renderOnlyView($view, $params)
    {
        foreach ($params as $key => $value){
            $$key = $value;
        }
        ob_start();
        include_once Application::$ROOT_DIR."/views/$view.php";
        return ob_get_clean();
    }
    public function set404page($page){
        self::$ERROR_PAGE = $page;
    }

    public function getintominutes($Min){
        echo $Min/60000;
    }


}