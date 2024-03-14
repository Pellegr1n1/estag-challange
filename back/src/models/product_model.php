<?php
class Product
{
    private string $Name;
    private int $Amount;
    private float $Price;
    private int $CategoryCode;

    public function __construct(string $name, int $amount, float $price, int $categoryCode)
    {
        $this->Name = $name;
        $this->Amount = $amount;
        $this->Price = $price;
        $this->CategoryCode = $categoryCode;
    }

    public function insertProduct($conn): void
    {
        $result = [];
        try {
            $conn->beginTransaction();
            $sql = 'INSERT INTO PRODUCTS (NAME, AMOUNT, PRICE, CATEGORY_CODE) VALUES (:name, :amount, :price, :categoryCode)';
            $query = $conn->prepare($sql);
            $query->bindValue(':name', $this->Name);
            $query->bindValue(':amount', $this->Amount);
            $query->bindValue(':price', $this->Price);
            $query->bindValue(':categoryCode', $this->CategoryCode);
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

    public static function updateProduct($conn, $code, $amount): void
    {
        $result = [];
        try {
            $conn->beginTransaction();
            $sql = 'UPDATE PRODUCTS SET AMOUNT = AMOUNT - :amount WHERE CODE = :code';
            $query = $conn->prepare($sql);
            $query->bindValue(':amount', $amount);
            $query->bindValue(':code', $code);
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

    public static function deleteProduct($conn, $code): void
    {
        $result = [];
        try {
            $conn->beginTransaction();
            $sql = 'DELETE FROM PRODUCTS WHERE CODE = :code';
            $query = $conn->prepare($sql);
            $query->bindValue(':code', $code);
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
        echo json_encode($result);
    }

    public static function getProducts($conn): array
    {
        $result = [];
        $products = [];
        try {
            $conn->beginTransaction();
            $sql = 'SELECT p.code, p.name, p.amount, p.price, c.tax, c.name AS name_category FROM products p
            INNER JOIN categories c ON c.code = p.category_code ORDER BY p.code ASC';
            $query = $conn->prepare($sql);
            if ($query->execute()) {
                $conn->commit();
                $products = $query->fetchAll(PDO::FETCH_OBJ);
            } else {
                $result = array('status' => 500, 'message' => 'Algo de errado com o servidor!');
            }
        } catch (Exception $e) {
            $conn->rollBack();
            $result = array('status' => 500, 'message' => $e);
        }
        error_log(json_encode($result));
        return $products;
    }

    public static function getProductById($conn, $code): array
    {
        $result = [];
        $products = [];
        try {
            $conn->beginTransaction();
            $sql = 'SELECT p.code, p.name, p.amount, p.price, c.tax, c.name AS name_category FROM products p
            INNER JOIN categories c ON c.code = p.category_code WHERE p.code = :code ORDER BY p.code ASC ';
            $query = $conn->prepare($sql);
            $query->bindValue(':code', $code);
            if ($query->execute()) {
                $conn->commit();
                $products = $query->fetchAll(PDO::FETCH_OBJ);
            } else {
                $result = array('status' => 500, 'message' => 'Algo de errado com o servidor!');
            }
        } catch (Exception $e) {
            $conn->rollBack();
            $result = array('status' => 500, 'message' => $e);
        }
        error_log(json_encode($result));
        return $products;
    }

    public static function setAmountProduct($conn, $amount, $code): void
    {
        $result = [];
        try {
            $conn->beginTransaction();
            $sql = 'UPDATE PRODUCTS SET AMOUNT = :amount WHERE CODE = :code';
            $query = $conn->prepare($sql);
            $query->bindValue(':amount', $amount);
            $query->bindValue(':code', $code);
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

}
