<?php
include "config.php";
session_start();

$thesis_id = isset($_GET['thesis_id']) ? intval($_GET['thesis_id']) : 0;

$response = ['success' => false, 'reviews' => [], 'error' => 'Invalid thesis ID'];

if ($thesis_id > 0) {
    $sql = "SELECT * FROM review WHERE thesis_id = $thesis_id";
    $result = mysqli_query($link, $sql);

    if ($result && mysqli_num_rows($result) > 0) {
        $reviews = mysqli_fetch_all($result, MYSQLI_ASSOC);
        $response = ['success' => true, 'reviews' => $reviews];
    } else {
        $response['error'] = 'No review data found';
    }
}

echo json_encode($response);
mysqli_close($link);
?>
