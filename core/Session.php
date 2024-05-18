<?php

namespace app\core;

class Session
{
    public static string $FLASH_KEY = 'flash_key';
    public function __construct()
    {
        session_start();
        $flashMessages = $_SESSION[self::$FLASH_KEY] ?? [];
        foreach ($flashMessages as $key => $flashMessage){
            $flashMessage[$key]['remove'] = 'true';
        }
    }

    public function set(string $key,string $value)
    {
        $_SESSION[$key] = $value;
    }
    public function get(string $key)
    {
        return $_SESSION[$key] ?? false;
    }
    public function setFlash(string $key,string $value)
    {
        $_SESSION[self::$FLASH_KEY][$key][] = $value;
    }
    public function getFlash(string $Key){
        return $_SESSION[self::$FLASH_KEY][$Key] ?? [];
    }

    public function isset(string $key)
    {
        return $_SESSION[$key] ?? false;
    }
    public function __destruct()
    {
        if(empty($_SESSION[self::$FLASH_KEY])) $_SESSION[self::$FLASH_KEY] = [];
        foreach ($_SESSION[self::$FLASH_KEY] as $key => $value){
            unset($_SESSION[self::$FLASH_KEY][$key]);
        }
        // TODO: Implement __destruct() method.
    }

}