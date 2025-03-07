<?php
include "config.php";
session_start();

$user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : 0;
$setting = $_POST['setting'];
$value = $_POST['value'];

$sql = "UPDATE users SET $setting = '$value' WHERE user_id = $user_id";
$result = mysqli_query($link, $sql);

if ($result) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to update settings']);
}

mysqli_close($link);
?>
