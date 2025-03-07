<?php
include "config.php";
session_start();

// Retrieve data from the POST request
$tutor_id = isset($_POST['tutor_id']) ? intval($_POST['tutor_id']) : 0;
$role = isset($_POST['role']) ? $_POST['role'] : '';
$student_AM = isset($_POST['student_AM']) ? intval($_POST['student_AM']) : 0;
$thesis_id = isset($_POST['thesis_id']) ? intval($_POST['thesis_id']) : 0;

// Check if the required data is provided
if (!$tutor_id || !$role || !$student_AM || !$thesis_id) {
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
    exit;
}

// Initialize query variables
$selectionField = '';
$isAcceptedField = '';
$sql = '';

// Determine which field to update based on the selected role
if ($role === 'co-supervisor1') {
    $selectionField = 'co_supervisor1_id';
    $isAcceptedField = 'co_supervisor1_accepted';

    // Insert or update co-supervisor1
    $sql = "INSERT INTO thesis_selections (student_AM, thesis_id, co_supervisor1_id, co_supervisor1_accepted) 
            VALUES ('$student_AM', '$thesis_id', '$tutor_id', 0)
            ON DUPLICATE KEY UPDATE co_supervisor1_id = '$tutor_id', co_supervisor1_accepted = 0";

} elseif ($role === 'co-supervisor2') {
    $selectionField = 'co_supervisor2_id';
    $isAcceptedField = 'co_supervisor2_accepted';

    // Insert or update co-supervisor2
    $sql = "INSERT INTO thesis_selections (student_AM, thesis_id, co_supervisor2_id, co_supervisor2_accepted) 
            VALUES ('$student_AM', '$thesis_id', '$tutor_id', 0)
            ON DUPLICATE KEY UPDATE co_supervisor2_id = '$tutor_id', co_supervisor2_accepted = 0";

} else {
    echo json_encode(['success' => false, 'error' => 'Invalid role']);
    exit;
}

// Execute the query
if (mysqli_query($link, $sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => mysqli_error($link)]);
}

mysqli_close($link);
?>
