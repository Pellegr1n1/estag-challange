<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, DELETE, GET, PUT");

require_once '../config/PDOconfig.php';
require_once '../models/order_model.php';
require_once '../models/order_item_model.php';

$data = file_get_contents("php://input");

if ($data || $_GET['action']) {
    $data = json_decode($data);
    switch ($_GET['action']) {
        case 1:
            $order = new Order($data->total, $data->tax);
            $order->insertOrder($conn);
            // inserindo itens pedido
            for ($i = 0; $i <= (count($data->products) - 1); $i++) {
                $order_item = new OrderItem(
                    $order->getCode($conn)[0]->code,
                    $data->products[$i]->code,
                    $data->products[$i]->amount,
                    $data->products[$i]->price,
                    $data->products[$i]->tax
                );
                $order_item->insertOrderItem($conn);
            }
            break;
        case 'get':
            $orders = Order::getOrders($conn);
            echo json_encode($orders);
            break;
        case 'getItem':
            $item = OrderItem::getOrderItem($conn, $_GET['id']);
            echo json_encode($item);
            break;
    }
}