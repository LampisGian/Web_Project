<?php
include "config.php";
session_start();


$review_id = $_POST['review_id'];
$link = isset($_POST['link']) ? trim($_POST['link']) : '';

if ($review_id > 0 && !empty($link)) {
    $sql = "UPDATE review SET link = ? WHERE thesis_id = ?";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, "si", $link, $review_id);
    
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Database update failed']);
    }

    mysqli_stmt_close($stmt);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
    }


mysqli_close($link);
?>
