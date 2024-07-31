<?php

require_once __DIR__ . '/../../config/config_db.php';

use \Firebase\JWT\JWT;

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


try {
    if (isset($_POST['email']) && isset($_POST['password'])) {
        $login = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
        $password = $_POST["password"];

        if (!filter_var($login, FILTER_VALIDATE_EMAIL)) {
            header('HTTP/1.1 400 Bad Request');
            echo "Credenciais inválidas";
            exit;
        }

        try {
            $pdo = new PDO($conn, $_ENV["DB_USERNAME"], $_ENV['DB_PASSWORD'], [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]);

            $query = $pdo->prepare("SELECT id, email, password, role_id, is_demo_agent FROM users WHERE email = :email");
            $query->bindParam(':email', $login, PDO::PARAM_STR);
            $query->execute();

            $result = $query->fetchAll(PDO::FETCH_OBJ);
            $pdo = null;

            if (empty($result)) {
                header('HTTP/1.1 401 Unauthorized');
                echo "Usuário não encontrado";
                exit;
            }

            if (password_verify($password, $result[0]->password)) {

                $payload = [
                    'iss' => $result[0]->email,
                    'iat' => time(),
                    'exp' => time() + (12 * 60 * 60),
                    'userId' => $result[0]->id,
                    'isAdmin' => $result[0]->role_id == 1,
                    'is_demo_agent' => $result[0]->is_demo_agent
                ];

                echo JWT::encode($payload, $_ENV["SECRET_KEY"], 'HS256');
            } else {
                header('HTTP/1.1 401 Unauthorized');
                echo "Credenciais inválidas";
            }
        } catch (PDOException $e) {
            header('HTTP/1.1 500 Internal Server Error');
            echo "Erro ao conectar ao banco de dados: " . $e->getMessage();
        }
    } else {
        header('HTTP/1.1 400 Bad Request');
        echo "Parâmetros ausentes";
    }
} catch (Exception $e) {
    header('HTTP/1.1 500 Internal Server Error');
    echo "Erro ao autenticar usuário: " . $e->getMessage();
}
