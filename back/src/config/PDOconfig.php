<?php

$host = "pgsql_desafio";
$db = "applicationphp";
$user = "root";
$pw = "root";

try{
    $conn = new PDO("pgsql:host=$host;dbname=$db", $user, $pw);
}catch (PDOException $e) {
    die("Não foi possível se conectar ao banco de dados");
}

