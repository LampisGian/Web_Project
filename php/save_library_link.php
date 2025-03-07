<?php
include 'config.php';
session_start();

$response = ['success' => false];
$thesis_id = $_POST['thesis_id'];
$library_link = $_POST['library_link'];

if ($thesis_id > 0 && !empty($link)) {
    $query = "UPDATE review SET library_link = '$library_link' WHERE thesis_id = $thesis_id";
    $result = mysqli_query($link, $query);

    if ($result) {
        $response['success'] = true;
    } else {
        $response['error'] = 'Database update failed.';
    }
} else {
    $response['error'] = 'Invalid thesis ID or empty link.';
}

echo json_encode($response);
mysqli_close($link);
?>
