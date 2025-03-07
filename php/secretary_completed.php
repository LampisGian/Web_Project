<?php
include "config.php";
session_start();

$thesis_id = isset($_POST['thesis_id']) ? intval($_POST['thesis_id']) : 0;

if ($thesis_id > 0) {
    $sql1 = "UPDATE theses SET status='completed'  WHERE thesis_id = $thesis_id";
    $result1 = mysqli_query($link, $sql1);


    if ($result1) {
        $response['success'] = true;
    } else {
        $response['error'] = 'Database update failed';
    }
} else {
    $response['error'] = 'Invalid thesis ID';
}

echo json_encode($response);
mysqli_close($link);
?>
