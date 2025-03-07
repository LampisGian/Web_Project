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

// Determine the field to update based on the role
$selectionField = '';
$isAcceptedField = '';

if ($role === 'supervisor') {
    $selectionField = 'supervisor';
    $isAcceptedField = 'supervisor_accepted';
} elseif ($role === 'co-supervisor1') {
    $selectionField = 'selection1';
    $isAcceptedField = 'is_accepted1';
} elseif ($role === 'co-supervisor2') {
    $selectionField = 'selection2';
    $isAcceptedField = 'is_accepted2';
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid role']);
    exit;
}

// Step 1: Check if a record already exists for the given student_AM and thesis_id
$checkQuery = "SELECT * FROM thesis_selections WHERE student_AM = '$student_AM' AND thesis_id = '$thesis_id'";
$checkResult = mysqli_query($link, $checkQuery);

if ($checkResult && mysqli_num_rows($checkResult) > 0) {
    $updateQuery = "UPDATE thesis_selections 
                    SET $selectionField = '$tutor_id', $isAcceptedField = 0 
                    WHERE student_AM = '$student_AM' AND thesis_id = '$thesis_id'";
    $result = mysqli_query($link, $updateQuery);
} else {
    // Step 3: If no record exists, insert a new one
    $insertQuery = "INSERT INTO thesis_selections (student_AM, thesis_id, $selectionField, $isAcceptedField) 
                    VALUES ('$student_AM', '$thesis_id', '$tutor_id', 0)";
    $result = mysqli_query($link, $insertQuery);
}

// Step 4: Check if the query was successful
if ($result) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => mysqli_error($link)]);
}

// Close the database connection
mysqli_close($link);
?>
