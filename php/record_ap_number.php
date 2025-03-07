<?php
include 'config.php';
session_start();

$thesis_id = isset($_POST['thesis_id']) ? intval($_POST['thesis_id']) : 0;
$protocol_number = isset($_POST['ap_number']) ? mysqli_real_escape_string($link, $_POST['ap_number']) : '';

$response = ['success' => false];

if ($thesis_id > 0 && !empty($protocol_number)) {
    $query = "UPDATE theses SET protocol_number = '$protocol_number' WHERE thesis_id = $thesis_id";
    
    if (mysqli_query($link, $query)) {
        $response['success'] = true;
    } else {
        $response['error'] = 'Database error: ' . mysqli_error($link);
    }
} else {
    $response['error'] = 'Invalid thesis ID or AP number';
}

echo json_encode($response);
mysqli_close($link);
?>
