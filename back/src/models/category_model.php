<?php
class Category
{
    private string $Name;
    private float $Tax;

    public function __construct(string $name, float $tax)
    {
        $this->Name = $name;
        $this->Tax = $tax;
    }

    public function insertCategory($conn): void
    {
        $result = [];
        try {
            $conn->beginTransaction();
            $sql = "INSERT INTO CATEGORIES (NAME, TAX ) VALUES (:name, :tax)";
            $query = $conn->prepare($sql);
            $query->bindValue(':name', $this->Name);
            $query->bindValue(':tax', $this->Tax);
            if ($query->execute()) {
                $conn->commit();
                $result = array('status' => 200, 'message' => 'Categoria registrada com sucesso!');
            } else {
                $result = array('status' => 500, 'message' => 'Algo de errado com o servidor!');
            }
        } catch (Exception $e) {
            $conn->rollBack();
            $result = array('status' => 500, 'message' => $e);
        }
        echo json_encode($result);
    }

    public static function getCategory($conn): array
    {
        $result = [];
        $category = [];
        try {
            $conn->beginTransaction();
            $sql = 'SELECT * FROM CATEGORIES';
            $query = $conn->prepare($sql);
            if ($query->execute()) {
                $conn->commit();
                $category = $query->fetchAll(PDO::FETCH_OBJ);
            } else {
                $result = array('status' => 500, 'message' => 'Algo de errado com o servidor!');
            }
        } catch (Exception $e) {
            $conn->rollBack();
            $result = array('status' => 500, 'message' => $e);
        }
        error_log(json_encode($result));
        return $category;
    }

    public static function deleteCategory($conn, $code): void
    {
        $result = [];
        try {
            $conn->beginTransaction();
            $sql = 'DELETE FROM CATEGORIES WHERE CODE = :code';
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

}