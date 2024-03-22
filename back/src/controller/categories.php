<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
require_once '../config/PDOconfig.php';
require_once '../models/category_model.php';

$data = file_get_contents("php://input");

if ($data || $_GET['action']) {
    $data = json_decode($data);
    switch ($_GET['action']) {
        case 1:
            $category = new Category(
                $data->name,
                $data->tax
            );
            $category->insertCategory($conn);
            break;
        case 2:
            Category::deleteCategory($conn, $data->codeDelete);
            break;
        case 'get':
            $category = Category::getCategory($conn);
            echo json_encode($category);
            break;
    }
}