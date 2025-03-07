<?php
include 'config.php';
session_start();

$response = ['success' => false];

$user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : 0;
$department = isset($_POST['department']) ? mysqli_real_escape_string($link, $_POST['department']) : null;
$specialization = isset($_POST['specialization']) ? mysqli_real_escape_string($link, $_POST['specialization']) : null;

if ($department) {
    $updateDeptQuery = "INSERT INTO tutors (tutor_id, department) VALUES ($user_id, '$department') ON DUPLICATE KEY UPDATE department = '$department'";
    $resultDept = mysqli_query($link, $updateDeptQuery);
}

// Insert or update the specialization
if ($specialization) {
    $updateSpecQuery = "INSERT INTO tutors (tutor_id, specialization) VALUES ($user_id, '$specialization') 
                        ON DUPLICATE KEY UPDATE specialization = '$specialization'";
    $resultSpec = mysqli_query($link, $updateSpecQuery);
}

$response['success'] = true;
echo json_encode($response);
mysqli_close($link);
?>
