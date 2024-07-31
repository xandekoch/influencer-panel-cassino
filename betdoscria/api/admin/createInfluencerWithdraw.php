<?php

use Firebase\JWT\Key;
use Firebase\JWT\JWT;

require_once __DIR__ . '/../../config/config_db.php';
require_once '../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

if (isset($_SERVER['HTTP_ORIGIN'])) {
    // You can decide if the origin in $_SERVER['HTTP_ORIGIN'] is something you want to allow, or use a wildcard to allow any origin
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        // may also be using PUT, PATCH, HEAD etc
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

function validateInput($userId, $token)
{
    return !empty($userId) && !empty($token);
}

function connectToDatabase($conn, $username, $password)
{
    try {
        return new PDO($conn, $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);
    } catch (PDOException $e) {
        throw new Exception("Erro ao conectar ao banco de dados: " . $e->getMessage());
    }
}

function getUserDeposits($pdo, $userId)
{
    try {
        $pdo->beginTransaction();

        // Prepare the INSERT statement
        $queryAdd = $pdo->prepare("
            INSERT INTO Influencer_Withdraw_History (user_id, depositors_Amount, sum_of_deposits, fake_average, created_at)
            SELECT 
                :id, 
                (SELECT COUNT(user_id) 
                 FROM deposits d 
                 JOIN users u ON u.id = d.user_id 
                 WHERE d.user_id IN (SELECT id FROM users WHERE inviter = :id)
                   AND d.affiliated_paid = 0
                ), 
                (SELECT SUM(d.amount) 
                 FROM deposits d 
                 JOIN users u ON u.id = d.user_id 
                 WHERE d.user_id IN (SELECT id FROM users WHERE inviter = :id) 
                   AND d.affiliated_paid = 0
                ), 
                (SELECT fake_average FROM users WHERE id = :id), 
                current_timestamp()
            WHERE EXISTS (
                SELECT 1 
                FROM deposits d 
                WHERE d.user_id IN (SELECT id FROM users WHERE inviter = :id) 
                  AND d.affiliated_paid = 0
            )
        ");

        // Execute the INSERT statement
        $queryAdd->execute([':id' => $userId]);

        // Prepare and execute the UPDATE statement
        $queryUpdate = $pdo->prepare("
            UPDATE deposits 
            SET affiliated_paid = 1 
            WHERE id IN (
                SELECT d.id 
                FROM deposits d 
                JOIN users u ON u.id = d.user_id 
                WHERE d.user_id IN (SELECT id FROM users WHERE inviter = :id) 
                  AND d.affiliated_paid = 0
            )
        ");

        $queryUpdate->execute([':id' => $userId]);

        // Commit the transaction

        return $pdo->commit() ? 200 : 1;
    } catch (PDOException $e) {
        throw new Exception("Erro ao executar consulta no banco de dados ou influencer ja foi pago. " . $e->getMessage());
    }
}

function sendResponse($statusCode, $data)
{
    header("Http/1.1 $statusCode");
    echo json_encode($data);
    exit;
}

try {
    if (isset($_GET['userId']) && isset($_GET['token'])) {
        $userId = $_GET['userId'];
        $token = $_GET['token'];

        if (!validateInput($userId, $token)) {
            sendResponse(400, "Requisição inválida");
        }

        $decodedToken = JWT::decode($token, new Key($_ENV['SECRET_KEY'], 'HS256'));

        if ($decodedToken->isAdmin) {
            $pdo = connectToDatabase($conn, $_ENV["DB_USERNAME"], $_ENV['DB_PASSWORD']);
            $result = getUserDeposits($pdo, $userId);
            $pdo = null;
            if ($result > 1) {
                if ($decodedToken->isAdmin) {
                    sendResponse(200, $result);
                } else {
                    sendResponse(404, "Requisição não autorizada");
                }
            } else {
                sendResponse(400, "Não há pagamento disponível");
            }
        } else {
            sendResponse(403, "Acesso negado");
        }
    } else {
        sendResponse(400, "Requisição inválida");
    }
} catch (Exception $e) {
    sendResponse(500, $e->getMessage());
}
