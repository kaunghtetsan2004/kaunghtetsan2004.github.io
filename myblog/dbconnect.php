<?php 

try{    
$server_name = "localhost";
$dbname = "my_blog";
$dbuser = "root";
$dbpassword = "";

//Data source name

$dsn = "mysql:host=$server_name;dbname=$dbname";
$conn = new PDO($dsn,$dbuser,$dbpassword);

$conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION); //ERROR SHOW

    //echo "Connection Successfull";

}Catch (PDOException $e){
    die ("Connection Fail:".$e->getMessage());
}   

?>