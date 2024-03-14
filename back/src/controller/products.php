<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, DELETE, GET, PUT");
require_once '../config/PDOconfig.php';
require_once '../models/product_model.php';

$data = file_get_contents("php://input");

if ($data || $_GET['action']) {
    $data = json_decode($data);
    switch ($_GET['action']) {
        case 1:
            $product = new Product(
                $data->name,
                $data->amount,
                $data->price_unit,
                $data->category->code
            );
            $product->insertProduct($conn);
            break;
        case 2:
            for ($i = 0; $i <= (count($data) - 1); $i++) {
                Product::updateProduct($conn, $data[$i]->code, $data[$i]->amount);
            }
            break;
        case 3:
            Product::deleteProduct($conn, $data->codeDelete);
            break;
        case 'get':
            $products = Product::getProducts($conn);
            echo json_encode($products);
            break;
        case 5:
            Product::setAmountProduct($conn, $data->amount, $data->codeProduct);
            break;
        case 'getById':
            $product = Product::getProductById($conn, $_GET['id']);
            echo json_encode($product);
            break;
    }
}