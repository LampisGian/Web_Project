<?php
include "config.php";
session_start();

// Make sure the database connection is established
if (!$link) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit;
}

$thesis_id = isset($_POST['thesis_id']) ? intval($_POST['thesis_id']) : 0;
$link_input = isset($_POST['link']) ? trim($_POST['link']) : '';
$venue = isset($_POST['venue']) ? trim($_POST['venue']) : '';

// Check if thesis_id is valid
if ($thesis_id === 0) {
    echo json_encode(['success' => false, 'error' => 'Invalid thesis ID']);
    exit;
}

// Build the update query based on provided data
$updateFields = [];
if (!empty($link_input)) {
    $updateFields[] = "link = '" . mysqli_real_escape_string($link, $link_input) . "'";
}
if (!empty($venue)) {
    $updateFields[] = "venue = '" . mysqli_real_escape_string($link, $venue) . "'";
}

if (count($updateFields) > 0) {
    $updateQuery = "UPDATE theses SET " . implode(', ', $updateFields) . " WHERE thesis_id = $thesis_id";

    // Execute the query
    if (mysqli_query($link, $updateQuery)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => mysqli_error($link)]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'No data to update']);
}

// Close the database connection
mysqli_close($link);
?>
