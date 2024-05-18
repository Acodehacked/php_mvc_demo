<?php

namespace app\core;
use DateTime;
class Controller
{
    public string $layout = 'mainUser';
    public array $errors = [];
    public array $values = [];
    public function render($view, $params=[])
    {
        return Application::$app->router->renderView($view,$params);
    }
    public function setMainLayout($layout)
    {
        $this->layout = $layout;
    }
    public function isadmin()
    {
        if (Application::$app->session->isset('admin')) {
            return $_SESSION['admin'];
        } else {
            Application::$app->request->head('admin/login');
            return 'notadmin';
        }
    }
    public function checkAdminLogin(Request $request,bool $redirect)
    {
        if(Application::$app->session->isset('admin')){
            $admin = Application::$app->db->findColumn('admin_login','id',$_SESSION['admin'])[0];
            if($admin['password'] !== $_SESSION['a_password']){
                Application::$app->adminlogout();
                $request->head('/admin');
                exit;
            }
            return [
                'id'=>$_SESSION['admin'],
                'name'=>$admin['name'],
                'pass'=>$_SESSION['a_password']
            ];
        }else{
            if($redirect){
                $request->head('/admin');
                exit;
            }
            return false;
        }
    }
    public function checkUserLogin()
    {
        if(Application::$app->session->isset('user')){
            return true;
        }else{
            return false;
        }
    }
    public function getTheDay($date)
    {
        date_default_timezone_set('Asia/Kolkata');
        $date = new DateTime($date);
        $now = new DateTime();
        if($date < $now) {
            return 1;
        }else{
            return 0;
        }
    }
    public function getdayso($timestamp){
        date_default_timezone_set('Asia/Kolkata');
        $today = new DateTime("today"); // This object represents current date/time with time set to midnight
//        2023-11-15 21:38:06 \\ YY ":" MM ":" DD " " HH ":" II ":" SS
//        $match_date = DateTime::createFromFormat( "Y-m-d\\TH:i", $timestamp );
        $match_date = DateTime::createFromFormat( "Y-M-D\\H:I:S", $timestamp );
        $match_date->setTime(0,0,0,0); // set time part to midnight, in order to prevent partial comparison
//
        $diff = $today->diff( $match_date );
        $diffDays = (integer)$diff->format( "%R%a" ); // Extract days count in interval

        switch( $diffDays ) {
            case 0:
                return "Today";
            // break;
            case -1:
                return "Yesterday";
            // break;
            case +1:
                return "Tomorrow";
            // break;
            default:
                return 0;
        }
    }

    public function getDayY($timestamp)
    {
        $date = new DateTime();
        $match_date = new DateTime($timestamp);
        $interval = $date->diff($match_date);

        if($interval->days == 0) {

            //Today
            return 'today';

        } elseif($interval->days == 1) {
            if($interval->invert == 0) {
                //Yesterday
                return 'Tommorrow';

            } else {
                //Tomorrow
                return  'yesterday';

            }
        } else {
            //Sometime
            return "".$interval->days.' days ago';
        }

    }
    public function Validation(string $s,string $type){
        $s = trim($s);
        if(empty($s) || $s === '' || $s === 0){
            return $type.' is required';
        }else{
            $this->values[$type] = $s;
            return '';
        }
    }
    public function ValidationI(int $s = 0,string $type){
        $s = trim($s);
        if(empty($s) || $s === 0){
            return $type.' is required';
        }else{
            $this->values[$type] = $s;
            return '';
        }
    }
    public function ValidationA(array $s,string $type){
        $s = trim($s);
        if(empty($s)){
            return $type.' is required';
        }else{
            return '';
        }
    }
    public function getValues()
    {
        return $this->values;
    }
    public function AddError(string $er)
    {
        if(!empty($er)){
            $this->errors[] = $er;
        }
    }
    function upload_file($files, $allowed_exs, $path){


        $file_name = $files['name'];
        $tmp_name = $files['tmp_name'];
        $error = $files['error'];

        if($error === 0){
            $file_ex = pathinfo($file_name, PATHINFO_EXTENSION);

            $file_ex_lc = strtolower($file_ex);
//            $file_ex_lc = $files['type'];

            if(in_array($file_ex_lc, $allowed_exs)){

                $new_file_name = uniqid("",true).'.'.$file_ex_lc;

                //$_SERVER["DOCUMENT_ROOT"].
                $file_upload_path = $_SERVER["DOCUMENT_ROOT"].$path.$new_file_name;

                move_uploaded_file($tmp_name, $file_upload_path);
                //if($moved){
                $sm['status'] = 'success';
                $sm['filename'] = $new_file_name;
                $sm['data'] = $new_file_name;

                return $sm;
            }else{
                $em['status'] = 'error';
                $em['data'] = "This type of file can't be uploaded! type: $file_ex_lc";


                return $em;
            }
        }else{
            $em['status'] = 'error';
            $em['data'] = 'Error occured while uploading!';


            return $em;
        }
    }
    function upload_samefile($files, $allowed_exs, $path){


        $file_name = $files['name'];
        $tmp_name = $files['tmp_name'];
        $error = $files['error'];

        if($error === 0){
            $file_ex = pathinfo($file_name, PATHINFO_EXTENSION);

            $file_ex_lc = strtolower($file_ex);
//            $file_ex_lc = $files['type'];

            if(in_array($file_ex_lc, $allowed_exs)){

                $new_file_name = $file_name;
//                $new_file_name = uniqid("",true).'.jpg';

                //$_SERVER["DOCUMENT_ROOT"].
                $file_upload_path = $_SERVER["DOCUMENT_ROOT"].$path.$new_file_name;

                move_uploaded_file($tmp_name, $file_upload_path);
                //if($moved){
                $sm['status'] = 'success';
                $sm['filename'] = $new_file_name;
                $sm['data'] = $new_file_name;

                return $sm;
            }else{
                $em['status'] = 'error';
                $em['data'] = "This type of file can't be uploaded! type: $file_ex_lc";


                return $em;
            }
        }else{
            $em['status'] = 'error';
            $em['data'] = 'Error occured while uploading!';


            return $em;
        }
    }

}