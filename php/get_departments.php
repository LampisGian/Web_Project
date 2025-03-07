<?php
include 'config.php';
session_start();

$response = ['success' => false];

// Query to get ENUM values from the column
$query = "SELECT COLUMN_TYPE FROM information_schema.COLUMNS WHERE TABLE_NAME = 'tutors' AND COLUMN_NAME = 'department' AND TABLE_SCHEMA = DATABASE()";

$result = mysqli_query($link, $query);

if ($result) {
    $row = mysqli_fetch_assoc($result);
    $enumValues = $row['COLUMN_TYPE'];

    // Extract ENUM values from the result string
    preg_match("/^enum\((.*)\)$/", $enumValues, $matches);
    $departments = str_getcsv($matches[1], ',', "'");

    $response['success'] = true;
    $response['departments'] = $departments;
} else {
    $response['error'] = 'Failed to fetch departments';
}

echo json_encode($response);
mysqli_close($link);
?>
