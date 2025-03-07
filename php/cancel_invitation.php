<?php
include "config.php";
session_start();

$tutor_id = $_POST['tutor_id'];
$student_AM = $_POST['student_AM'];
$thesis_id = $_POST['thesis_id'];
$role = $_POST['role'];

$field = '';
if ($role === 'supervisor') {
    $field = 'supervisor_id';
} elseif ($role === 'co-supervisor1') {
    $field = 'co_supervisor1_id';
} elseif ($role === 'co-supervisor2') {
    $field = 'co_supervisor2_id';
}

// Remove the invitation for the given role
$sql = "UPDATE thesis_selections SET $field = NULL WHERE student_AM = '$student_AM' AND thesis_id = '$thesis_id' AND $field = '$tutor_id'";
$result = mysqli_query($link, $sql);

if ($result) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => mysqli_error($link)]);
}

mysqli_close($link);
?>
