<?php
include("class.php");

$method = "";
$param = "";

isset($_GET["method"]) ? $method = $_GET["method"] : false;
isset($_GET["param"]) ? $param = $_GET["param"] : false;

$logic = new requestLogic();

$result = $logic->request($method, $param);

$status = $result == null ? 400 : 200;
response("GET", $status, $result);

function response($method, $httpStatus, $data)
{
    header('Content-Type: application/json');
    switch ($method) {
        case "GET":
            http_response_code($httpStatus);
            echo (json_encode($data));
            break;
        default:
            http_response_code(405);
            echo ("Unsupported method!");
    }
}
