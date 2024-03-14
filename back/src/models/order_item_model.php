<?php
class OrderItem
{
    private $OrderCode;
    private $ProductCode;
    private $Amount;
    private $Price;
    private $Tax;

    public function __construct($orderCode, $productCode, $amount, $price, $tax)
    {
        $this->OrderCode = $orderCode;
        $this->ProductCode = $productCode;
        $this->Amount = $amount;
        $this->Price = $price;
        $this->Tax = $tax;
    }

    public function insertOrderItem($conn): void
    {
        $result = [];
        try {
            $conn->beginTransaction();
            $sql = 'INSERT INTO ORDER_ITEM (ORDER_CODE, PRODUCT_CODE, AMOUNT, PRICE, TAX)
                VALUES (:orderCode, :productCode, :amount, :price, :tax)';
            $query = $conn->prepare($sql);
            $query->bindValue(':orderCode', $this->OrderCode);
            $query->bindValue(':productCode', $this->ProductCode);
            $query->bindValue(':amount', $this->Amount);
            $query->bindValue(':price', $this->Price);
            $query->bindValue(':tax', $this->Tax);
            if ($query->execute()) {
                $conn->commit();
            } else {
                $result = array('status' => 500, 'message' => 'Algo de errado com o servidor!');
            }
        } catch (Exception $e) {
            $conn->rollBack();
            $result = array('status' => 500, 'message' => $e);
        }
        error_log(json_encode($result));
    }
    public static function getOrderItem($conn, $codeOrder): array
    {
        $itens = [];
        $result = [];
        try {
            $conn->beginTransaction();
            $sql = 'SELECT p.code, p.name, c.name AS name_category, item.amount, p.price, item.tax,
			((item.amount * p.price) + item.tax) AS total FROM ORDERS ord
			INNER JOIN ORDER_ITEM item ON ord.code = item.order_code
			INNER JOIN PRODUCTS P ON item.product_code = p.code
			INNER JOIN CATEGORIES C ON p.CATEGORY_CODE = c.code
			WHERE ord.code = :codeOrder';
            $query = $conn->prepare($sql);
            $query->bindValue(':codeOrder', $codeOrder);
            if ($query->execute()) {
                $conn->commit();
                $itens = $query->fetchAll(PDO::FETCH_OBJ);
            } else {
                $result = array('status' => 500, 'message' => 'Algo de errado com o servidor!');
            }
        } catch (Exception $e) {
            $conn->rollBack();
            $result = array('status' => 500, 'message' => $e);
        }
        error_log(json_encode($result));
        return $itens;
    }

}