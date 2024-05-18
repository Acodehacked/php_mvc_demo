<?php
namespace app\controllers;

use app\core\Application;
use app\core\Controller;
use app\core\Request;

class AdminSiteController extends Controller
{
    public function Admin(Request $request)
    {
        $admin = $this->checkAdminLogin($request,false);
        if($admin){
            $params = [
                'title' => 'Admin Login Page',
                'page'=>'',
                'admin'=>$admin
            ];
            $this->setMainLayout('admin_layout');
            return $this->render('admin/dashboard',$params);
        }else{
            if($request->isPost()){
                $username = $request->getBody()['username'];
                $password = $request->getBody()['password'];
                $stmt = Application::$app->db->pdo->prepare("SELECT * FROM admin_login WHERE username='$username'");
                $stmt->execute();
                $users = $stmt->fetchAll(\PDO::FETCH_ASSOC);
                if(count($users) > 0){
                    if($users[0]['password'] === $password){
                        echo "success";
                        Application::$app->admin_login($users[0]);
                        $request->head('/admin');
                        exit;
                    }else{
                        $request->head('/admin?error=Incorrect Username or password');
                        exit;
                    }
                }else{
                    $request->head('/admin?error=Incorrect Username or password');
                    exit;
                }
                exit;
            }
            $params = [
                'title' => 'Admin Login Page'
            ];
            $this->setMainLayout('blank');
            return $this->render('admin/login',$params);
        }
    }

    public function AdminLogout(Request $request)
    {
        Application::$app->adminlogout();
        $request->head('/admin');
        exit;
    }

    public function AdminRemixes(Request $request)
    {
        $admin = $this->checkAdminLogin($request,true);
        $remixes = Application::$app->db->getTable('all_music','ORDER BY added DESC');
            $params = [
                'title' => 'Admin Login Page',
                'page'=>'Remixes',
                'admin'=>$admin,
                'remixes'=>$remixes
            ];
            $this->setMainLayout('admin_layout');
            return $this->render('admin/remixes',$params);
    }

    public function AdminEditRemixes(Request $request)
    {
        $admin = $this->checkAdminLogin($request,true);
        $id = $request->getBody()['id'] ?? 0;
        if(isset($request->getBody()['delete'])){
            $d = $request->getBody()['delete'];
            $data = Application::$app->db->findColumn('all_music','id',$d,'');
            if(count($data)){
                $id = $data[0]['id'];
                $stmt = Application::$app->db->DeleteRow('all_music',"id='$id'");
                if($stmt){
                    var_dump($data);
                    $request->head('/AdminEditRemixes?success=Deleted Successfully');
                    exit;
                }
            }else{
                $request->head('/AdminRemix');
                exit;
            }
        }
        if($request->isPost()){
            $id = $request->getBody()['id'];
            $title = $request->getBody()['title'];
            $subtitle = $request->getBody()['subtitle'];
            $slug = $request->getBody()['slug'];
            $desc = $request->getBody()['desc'];
            $file = $request->getBody()['file'];
            $cover = $request->getBody()['cover'];
            $downloadable = isset($request->getBody()['downloadable']) ? 1 : 0;
            $categories = $request->getBody()['categories'];
            $values = [
                'title'=>$title,
                'subtitle'=>$subtitle,
                'slug'=>$slug,
                'description'=>$desc,
                'file'=>$file,
                'cover'=>$cover,
                'file_down'=>$downloadable,
                'playlist_id'=>$request->getBody()['playlist_id']??'',
                'categories'=>$categories,
                'modified'=>"CURR"
            ];
            $stmt = Application::$app->db->UpdateValues($values,'all_music',"WHERE id='$id'");
            if($stmt){
                echo json_encode(array(
                    'data'=>'Updated Successfully',
                    'status'=>'success'
                ));
                exit;
            }
        }
        $playlists = Application::$app->db->getTable('playlist','') ?? [];
        $categories = Application::$app->db->getTable('categories','') ?? [];
        $remix = Application::$app->db->findColumn('all_music','id',$id);
        if(count($remix) === 0){
            $request->head('/AdminEditRemixes');
            exit;
        }else{
            $remix = $remix[0];
        }
        $params = [
            'title' => '',
            'page'=>'EditRemix',
            'admin'=>$admin,
            'playlists'=>$playlists,
            'remix'=>$remix,
            'categories'=>$categories
        ];
        $this->setMainLayout('admin_layout');
        return $this->render('admin/editRemix',$params);
    }
    public function AdminAddRemixes(Request $request)
    {
        $admin = $this->checkAdminLogin($request,true);
        if($request->isPost()){
            $title = $request->getBody()['title'];
            $subtitle = $request->getBody()['subtitle'];
            $slug = $request->getBody()['slug'];
            $desc = $request->getBody()['desc'];
            $file = $request->getBody()['file'];
            $cover = $request->getBody()['cover'];
            $downloadable = isset($request->getBody()['downloadable']) ? 1 : 0;
            $categories = $request->getBody()['categories'];
            $playlist_id = $request->getBody()['playlist_id'];
            $stmt = Application::$app->db->pdo->prepare("SELECT * FROM all_music WHERE slug='$slug'");
            $stmt->execute();
            $data = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            if(count($data) > 0){
                echo json_encode(array(
                    'status'=>'error',
                    'data'=>'Slug Already Exists'
                ));
                exit;
            }else{
                $query = "INSERT INTO all_music(title,slug,cover,file,subtitle,playlist_id,added,modified,categories,description,file_down) 
VALUES('$title','$slug','$cover','$file','$subtitle','$playlist_id',CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP(),'$categories','$desc',$downloadable)";
                $stmt = Application::$app->db->pdo->prepare($query);
                $stmt->execute();
                echo json_encode(array(
                    'status'=>'success',
                    'data'=>"Data added successfully"
                ));
                exit;
            }
            exit;
        }
        $id = $request->getBody()['id'] ?? 0;
        $remix = Application::$app->db->findColumn('all_music','id',$id)[0] ?? [];
        $categories = Application::$app->db->getTable('categories','') ?? [];
        $playlists = Application::$app->db->getTable('playlist','') ?? [];
        $params = [
            'title' => '',
            'page'=>'EditRemix',
            'admin'=>$admin,
            'remix'=>$remix,
            'playlists'=>$playlists,
            'add'=>'1',
            'categories'=>$categories
        ];
        $this->setMainLayout('admin_layout');
        return $this->render('admin/editRemix',$params);
    }
    public function AdminEditAbout(Request $request)
    {
        $admin = $this->checkAdminLogin($request,true);
        if($request->isPost()){
            $titles = $request->getBody()['title'];
            $values = $request->getBody()['value'];
            foreach ($titles as $key=> $title){
                $json = [
                        'value'=>$values[$key],
                ];
                $stmt = Application::$app->db->UpdateValues($json,'page_contents'," WHERE title='$title'");
            }
            $request->head('/AdminEditRemixes?success=Edited Successfully');
            exit;
        }
        $pagecontents = Application::$app->db->getTable('page_contents',' ORDER BY id ASC');
        $params = [
            'title' => 'Admin Login Page',
            'page'=>'EditAbout',
            'admin'=>$admin,
            'contents'=>$pagecontents
        ];
        $this->setMainLayout('admin_layout');
        return $this->render('admin/editabout',$params);
    }

    public function AdminPlaylists(Request $request)
    {
        $admin = $this->checkAdminLogin($request,true);
        if(isset($request->getBody()['delete'])){
            $id = $request->getBody()['delete'];
            $col = Application::$app->db->findColumn('playlist','id',$id,'');
            if(count($col) > 0){
                $stmt = Application::$app->db->DeleteRow('playlist', " id='$id'");
                $request->head('/AdminPlaylists?success=Deleted Successfully');
                exit;
            }
            $request->head('/AdminPlaylists');
            exit;
        }
        if($request->isPost()){
            $type = $request->getBody()['type'] ?? '';
            $id = $request->getBody()['id']??0;
            $name = $request->getBody()['name']??'';
            $json = [
                [
                    'name'=>$name
                ]
            ];
            if($type === 'add'){
                $stmt = Application::$app->db->Insertvalues($json,'playlist',[]);
                if($stmt){
                    echo json_encode(array(
                        'status'=>'success',
                        'data'=>'Added Successfully'
                    ));
                    $request->head('/AdminPlaylists?success=Added Successfully');
                    exit;
                }else{
                    echo json_encode(array(
                        'status'=>'error',
                        'data'=>'Data Already Exists'
                    ));
                    $request->head('/AdminPlaylists?error=Data Already Exists');
                    exit;
                }
            }else if($type === 'edit'){
                $json = [
                    'name'=>$name
                ];
                $stmt = Application::$app->db->UpdateValues($json,'playlist'," WHERE id='$id'");
                if($stmt){
                    echo json_encode(array(
                        'status'=>'success',
                        'data'=>'Edited Successfully'
                    ));
                    $request->head('/AdminPlaylists?success=Edited Successfully');
                    exit;
                }
            }
            exit;
        }

        $playlists = Application::$app->db->getTable('playlist','');
        $params = [
            'title' => 'Admin playlists Page',
            'page'=>'Playlists',
            'admin'=>$admin,
            'message'=>$request->getBody()['error']??$request->getBody()['success']??'',
            'playlists'=>$playlists
        ];
        $this->setMainLayout('admin_layout');
        return $this->render('admin/playlists',$params);
    }
    public function AdminCategories(Request $request)
    {
        $admin = $this->checkAdminLogin($request,true);
        if(isset($request->getBody()['delete'])){
            $id = $request->getBody()['delete'];
            $col = Application::$app->db->findColumn('categories','id',$id,'');
            if(count($col) > 0){
                $stmt = Application::$app->db->DeleteRow('categories', " id='$id'");
                $request->head('/AdminCategories?success=Deleted Successfully');
                exit;
            }
            $request->head('/AdminCategories');
            exit;
        }
        if($request->isPost()){
            $type = $request->getBody()['type'] ?? '';
            $id = $request->getBody()['id']??0;
            $name = $request->getBody()['name']??'';
            $json = [
                [
                    'name'=>$name
                ]
            ];
            if($type === 'add'){
                $stmt = Application::$app->db->Insertvalues($json,'categories',[]);
                if($stmt){
                    echo json_encode(array(
                        'status'=>'success',
                        'data'=>'Added Successfully'
                    ));
                    $request->head('/AdminCategories?success=Added Successfully');
                    exit;
                }else{
                    echo json_encode(array(
                        'status'=>'error',
                        'data'=>'Data Already Exists'
                    ));
                    $request->head('/AdminCategories?error=Data Already Exists');
                    exit;
                }
            }else if($type === 'edit'){
                $json = [
                    'name'=>$name
                ];
                $stmt = Application::$app->db->UpdateValues($json,'categories'," WHERE id='$id'");
                if($stmt){
                    echo json_encode(array(
                        'status'=>'success',
                        'data'=>'Edited Successfully'
                    ));
                    $request->head('/AdminCategories?success=Edited Successfully');
                    exit;
                }
            }
            exit;
        }

        $categories = Application::$app->db->getTable('categories','');
        $params = [
            'title' => 'Admin Categories Page',
            'page'=>'Categories',
            'admin'=>$admin,
            'message'=>$request->getBody()['error']??$request->getBody()['success']??'',
            'categories'=>$categories
        ];
        $this->setMainLayout('admin_layout');
        return $this->render('admin/categories',$params);
    }

    public function UploadFile(Request $request)
    {
        $admin = $this->checkAdminLogin($request,true);
        if($request->isPost()){
//            echo json_encode(array(
//                'status'=>'error',
//                'data'=>'File not allowed'
//            ));
            $result = $this->upload_file($_FILES['file'],['jpg','png','jpeg'],'/assets/uploads/');
            echo json_encode($result);
            exit;
        }
    }
    public function UploadSong(Request $request)
    {
        $admin = $this->checkAdminLogin($request,true);
        if($request->isPost()){
//            echo json_encode(array(
//                'status'=>'error',
//                'data'=>'File not allowed'
//            ));
            $result = $this->upload_samefile($_FILES['file'],['mp3','wav'],'/assets/files/');
            echo json_encode($result);
            exit;
        }
    }
}