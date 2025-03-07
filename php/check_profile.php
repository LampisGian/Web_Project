<?php
include "config.php"; 
session_start();

$response = ['success' => false];

// Fetch the user ID from POST request
$tutor_id = isset($_POST['tutor_id']) ? intval($_POST['tutor_id']) : 0;

if ($tutor_id > 0) {
    // Query to fetch specialization and department
    $sql = "SELECT specialization, department FROM tutors WHERE tutor_id = $tutor_id LIMIT 1";
    $result = mysqli_query($link, $sql);

    // Check if the query was successful and fetch the row
    if ($result && mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        $response['success'] = true;
        $response['info'] = $row;
    } else {
        $response['error'] = 'No data found for the specified tutor';
    }
} else {
    $response['error'] = 'Invalid user ID';
}

echo json_encode($response);
mysqli_close($link);
?>
