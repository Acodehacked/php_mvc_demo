<?php
namespace app\controllers;

use app\core\Application;
use app\core\Controller;
use app\core\Request;
use League\ColorExtractor\Color;
use League\ColorExtractor\ColorExtractor;
use League\ColorExtractor\Palette;
class SiteControllers extends Controller
{
    public function home(Request $request)
    {
        $params = [
            'title' => 'DJABHYZZ | Dj Remix ',
        ];
        $this->setMainLayout('mainLayout');
        return $this->render('user/home',$params);
    }
    public function remix(Request $request)
    {
        $accentcolor = [];
        $remix = Application::$app->db->findColumn('all_music','slug',$request->getSubVar(),'');
        if(count($remix) > 0){
            $palette = Palette::fromFilename(ltrim($remix[0]['cover'],'/'));
            $extractor = new ColorExtractor($palette);
            $accents = $extractor->extract(5);
            foreach ($accents as $accent){
                $accentcolor[] = Color::fromIntToHex($accent);
            }
            $haveurl = explode('[/URL]',$remix[0]['description']);
//            foreach ($haveurl as $str){
//                $urlsr = explode('[URL]',$str);
//                if(count($urlsr) == 2){
//                    $url = "<a href='$urlsr[1]'>".$urlsr[1].'</a>';
//                    echo $url.'<br>';
//                }
//            }
            $reg_exUrl = "/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/";
// The Text you want to filter for urls
            $text = $remix[0]['description'];
// Check if there is a url in the text
            if(preg_match($reg_exUrl, $text, $url)) {
                // make the urls hyper links
                $Url = $url[0];
                $description = preg_replace($reg_exUrl,"<a href='$Url'>$Url</a>",$text);
//                echo preg_replace($reg_exUrl, "<a href="$url[0]">$url[0]</a> ", $text);
} else {
                // if no urls in the text just return the text

            }
//            $position = str($remix[0]['description'],'[URL]');
//            var_dump($accentcolor);
        }else{
            $request->head('/');
            exit;
        }
        $page_contents = Application::$app->db->getTable('page_contents','');
        $playlists = Application::$app->db->getTable('playlist','');
        $categories = Application::$app->db->getTable('categories','');
        $Allmusic = Application::$app->db->getTable('all_music','ORDER BY added DESC LIMIT 50');
        $new_music = [];
        foreach ($Allmusic as $item){
            $item['day'] = $this->getDayY($item['added']);
            $new_music[] = $item;
        }
        $params = [
            'title' => 'DJABHYZZ | Dj Remix ',
            'page_contents'=>$page_contents,
            'playlists'=>$playlists,
            'id'=>$request->getSubVar(),
            'categories'=>$categories,
            'description'=>$description ?? $text,
            'all_music'=>$new_music,
            'remix'=>$remix[0],
            'accent'=>$accentcolor
        ];
        $this->setMainLayout('blank');
        return $this->render('user/remix',$params);
    }
}