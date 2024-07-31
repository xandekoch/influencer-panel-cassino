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
        $query = $pdo->prepare("
            SELECT * FROM Influencer_Withdraw_History WHERE user_id = :id              
        ");
        $query->bindParam(':id', $userId, PDO::PARAM_STR);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_OBJ);
    } catch (PDOException $e) {
        throw new Exception("Erro ao executar consulta no banco de dados: " . $e->getMessage());
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

        if ($decodedToken->isAdmin || $decodedToken->is_demo_agent) {
            $pdo = connectToDatabase($conn, $_ENV["DB_USERNAME"], $_ENV['DB_PASSWORD']);
            $result = getUserDeposits($pdo, $userId);
            $pdo = null;

            if ($decodedToken->isAdmin) {
                sendResponse(200, $result);
            } elseif ($decodedToken->is_demo_agent == 1 && $userId == $decodedToken->userId) {
                sendResponse(200, $result);
            } else {
                sendResponse(403, "Requisição não autorizada");
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
