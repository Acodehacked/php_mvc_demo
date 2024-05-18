<?php

namespace app\core;

use mysqli;

class Database
{
    public \PDO $pdo;
    public \mysqli $conn;
    public function __construct(array $config)
    {
        $dsn = $config['dsn'] ?? '';
        $user = $config['user'] ?? '';
        $password = $config['password'] ?? '';
        $host = $config['host'] ?? '';

        $this->pdo = new \PDO($dsn,$user,$password);
        $this->pdo->setAttribute(\PDO::ATTR_ERRMODE,\PDO::ERRMODE_EXCEPTION);
// Create connection
        $this->conn = new mysqli($host, $user, $password,'vachanavayal2');
// Check connection
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    public function applyMigrations()
    {
        $this->createMigrationTable();
        $appliedMigrations = $this->getAppliedMigrations();

        var_dump($appliedMigrations);
        $newMigrations = [];
        $files = scandir(Application::$ROOT_DIR.'/migrations');
        $toApplyMigrations = array_diff($files,$appliedMigrations);
        foreach ($toApplyMigrations as $migration){
            if($migration === "." || $migration === '..'){
                continue;
            }
            require_once Application::$ROOT_DIR.'/migrations/'.$migration;
            $className = pathinfo($migration,PATHINFO_FILENAME);
            var_dump($className);
            $instance = new $className;
            $instance->up();
            array_push($newMigrations,$migration);
        }
        if(!empty($newMigrations)){
            $this->saveMigrations($newMigrations);
        }else{
            echo "All Migrations Applied";
        }
    }

    public function createMigrationTable()
    {
        $this->pdo->exec("CREATE TABLE IF NOT EXISTS migrations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            migration VARCHAR(255),
            created_at TIMESTAMP DEFAULT  CURRENT_TIMESTAMP 
            ) ENGINE=INNODB;");
    }

    public function getAppliedMigrations(){
        $statement = $this->pdo->prepare("SELECT migration FROM migrations");
        $statement->execute();

        return $statement->fetchAll(\PDO::FETCH_COLUMN);
    }

    public function saveMigrations(array $migrations)
    {
        $str = implode(",",array_map(fn($m) => "('$m')",$migrations));
        $statement = $this->pdo->prepare("INSERT INTO migrations (migration) VALUES
            $str
        ");
        $statement->execute();
    }

    public function getUserLogin()
    {
        $id = Application::$app->session->get('user') ?? '';
        $stmt = $this->pdo->prepare("SELECT * FROM data_users WHERE id='$id'");
        $stmt->execute();
        $data = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        return $data[0] ?? 0;
    }
    public function getTable($table,$condition) :array{
        $stmt = $this->pdo->prepare("SELECT * FROM $table $condition");
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
    public function findColumn(string $table,string $columnname,string $findvalue,string $conditions = ''){
        $c = ($conditions === '') ? '' : 'AND '.$conditions;
        $f = $findvalue;
        $q = "SELECT * FROM $table WHERE $columnname=:find $c";
        $stmt = $this->pdo->prepare($q);
        $stmt->bindValue(':find',$f,\PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function Insertvalues(array $json,string $tablename,array $extra = []){
        if($this->checkAlready((array)$json[0],$tablename)){
            return false;
        }
        $params = [];
        $colparam = [];
        $p = [];
        //add parameters
        $id = 0;
        for($i=0;$i<count($json);$i++){
            $colparam = [];
            foreach ($json[0] as $key => $itemi) {
                $colparam[] = ':'.$key.$i;
            }
            //foreeach ecxtra
            foreach ($extra as $k=> $item) {
                $colparam[] = ":$k$i";
            }
            $p[] = $colparam;
        }
        $values = [];
        foreach ($p as $key=> $param){
            $values[] = '('.join(',',$param).')';
        }
        foreach ($json[0] as $ky=> $item) {
            $params[] = $ky;
        }
        $q = "INSERT INTO $tablename (".implode(',',$params).")
            VALUES ".join(',',$values);
            $statement = $this->pdo->prepare($q);
            for($i=0;$i<count($json);$i++){
                $type = \PDO::PARAM_STR;
                foreach($json[$i] as $key => $item) {
                    $j = (array)$json[$i];
                    if(!str_contains($key,'_no')){ $type = \PDO::PARAM_STR; }
                    $pval = $j[$key].'';
                    $statement->bindValue(":$key$i",$pval,$type);
                }
                foreach ($extra as $key=> $item){
                    $statement->bindValue(":$key$i",$item);
                }
            }
            $statement->execute();

//            $statement->execute();;

        return true;
    }
    public function UpdateValues(array $json,string $tablename,string $WHERE){
        $col = [];
        foreach ($json as $Key=> $item){
            if($item === 'CURR'){
                $col[] = "$Key=CURRENT_TIMESTAMP() ";
            }else{
                $col[] = "$Key='$item' ";
            }
        }
        $q = "UPDATE $tablename SET ".join(',',$col)." $WHERE";
        $statement = $this->pdo->prepare($q);
        $statement->execute();
        return true;
    }
    public function DeleteRow($tablenname,$WHERE){
        $q = "DELETE FROM $tablenname WHERE $WHERE";
        $statement = $this->pdo->prepare($q);
        $statement->execute();
        return true;
    }
    private function checkAlready(array $json, string $tablename)
    {
        $p = [];
        foreach ($json as $Key=> $item) {
            $p[] = $Key.' = \''.$item.'\'';
        }
        $statement = $this->pdo->prepare("SELECT * FROM $tablename WHERE ".join(' AND ',$p));
        $statement->execute();
        if(!empty($statement->fetchAll(\PDO::FETCH_ASSOC))){
            return true;
        }else{
            return false;
        }
    }
}