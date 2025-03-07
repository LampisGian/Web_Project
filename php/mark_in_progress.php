<?php
include "config.php";
session_start();

$response = ['success' => false];

// Retrieve thesis_id using POST
$thesis_id = isset($_POST['thesis_id']) ? intval($_POST['thesis_id']) : 0;

if ($thesis_id > 0) {
    // Update the status to in progress
    $query = "UPDATE theses SET status = 'in progress', assigned_at = NOW() WHERE thesis_id = $thesis_id";
    $result = mysqli_query($link, $query);

    if ($result) {
        $response['success'] = true;
    } else {
        $response['error'] = 'Failed to update: ' . mysqli_error($link);
    }
} else {
    $response['error'] = 'Invalid thesis ID';
}

echo json_encode($response);
mysqli_close($link);
?>
