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

function validateInput($userId, $token, $fakeAvg)
{
    return !empty($userId) && !empty($token) && !empty($fakeAvg);
}

function connectToDatabase($dsn, $username, $password)
{
    try {
        return new PDO($dsn, $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);
    } catch (PDOException $e) {
        error_log("Erro ao conectar ao banco de dados: " . $e->getMessage());
        throw new Exception("Erro ao conectar ao banco de dados.");
    }
}

function updateUserDeposit($pdo, $userId, $fakeAvg)
{
    try {
        $query = $pdo->prepare("
            UPDATE users
            SET fake_average = :fakeAvg
            WHERE id = :id
        ");
        $query->bindParam(':id', $userId, PDO::PARAM_INT);
        $query->bindParam(':fakeAvg', $fakeAvg, PDO::PARAM_STR);
        $query->execute();

        return ["message" => "Atualização bem-sucedida"];
    } catch (PDOException $e) {
        error_log("Erro ao executar atualização no banco de dados: " . $e->getMessage());
        throw new Exception("Erro ao executar atualização no banco de dados.");
    }
}

function sendResponse($statusCode, $data)
{
    header("HTTP/1.1 $statusCode");
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

try {
    if (isset($_GET['userId']) && isset($_GET['token']) && isset($_GET['fakeavg'])) {
        $userId = $_GET['userId'];
        $token = $_GET['token'];
        $fakeAvg = $_GET['fakeavg'];

        if (!validateInput($userId, $token, $fakeAvg)) {
            sendResponse(400, ["message" => "Requisição inválida"]);
        }

        $decodedToken = JWT::decode($token, new Key($_ENV['SECRET_KEY'], 'HS256'));

        if ($decodedToken->isAdmin) {
            $pdo = connectToDatabase($conn, $_ENV["DB_USERNAME"], $_ENV['DB_PASSWORD']);
            $result = updateUserDeposit($pdo, $userId, $fakeAvg);
            $pdo = null;

            sendResponse(200, $result);
        } else {
            sendResponse(403, ["message" => "Requisição não autorizada"]);
        }
    } else {
        sendResponse(400, ["message" => "Requisição inválida"]);
    }
} catch (Exception $e) {
    sendResponse(500, ["message" => $e->getMessage()]);
}
