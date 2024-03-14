<?php 
class Order {
    private float $Total;
    private float $Tax;

    public function __construct(float $total, float $tax) {
        $this->Total = $total;
        $this->Tax = $tax;
    }

    public function insertOrder($conn) : void{
        $result = [];
        try{
            $conn->beginTransaction();
            $sql = 'INSERT INTO ORDERS (TOTAL, TAX) VALUES (:total, :tax)';
            $query = $conn->prepare($sql);
            $query->bindValue(':total', $this->Total);
            $query->bindValue(':tax', $this->Tax);
            if($query->execute()){
                $conn->commit();
            }else{
                $result = array('status' => 500, 'message' => 'Algo de errado com o servidor!');
            }
        }catch (Exception $e) {
            $conn->rollBack();
            $result = array('status' => 500, 'message' => $e);
        }
        error_log(json_encode($result));
    }

    public static function getOrders($conn) : array{
        $result = [];
        $orders = [];
        try{
            $conn->beginTransaction();
            $sql = 'SELECT * FROM ORDERS';
            $query = $conn->prepare($sql);
            if($query->execute()){
                $conn->commit();
                $orders = $query->fetchAll(PDO::FETCH_OBJ);
            }else{
                $result = array('status' => 500, 'message' => 'Algo de errado com o servidor!');
            }
        }catch (Exception $e) {
            $conn->rollBack();
            $result = array('status' => 500, 'message' => $e);
        }
        error_log(json_encode($result));
        return $orders;
    }

    public function getCode($conn) : array
    {
        try{
            $conn->beginTransaction();
            $sql = 'SELECT CODE FROM ORDERS ORDER BY CODE DESC LIMIT 1';
            $query = $conn->prepare($sql);
            if($query->execute()){
                $conn->commit();
                $code = $query->fetchAll(PDO::FETCH_OBJ);
            }else{
                $result = array('status' => 500, 'message' => 'Algo de errado com o servidor!');
            }
        }catch (Exception $e) {
            $conn->rollBack();
            $result = array('status' => 500, 'message' => $e);
        }
        error_log(json_encode($result));
        return $code;
    }
}