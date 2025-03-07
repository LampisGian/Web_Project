<?php
include "config.php";
session_start();

$thesis_id = isset($_POST['thesis_id']) ? intval($_POST['thesis_id']) : 0;
$user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : 0;
$assembly_number = isset($_POST['assembly_number']) ? $_POST['assembly_number'] : '';
$assembly_year = isset($_POST['assembly_year']) ? intval($_POST['assembly_year']) : 0;
$response = ['success' => false];

if ($thesis_id > 0) {
    $sql1 = "UPDATE theses SET student_id = NULL, status='under assignment', co_supervisor1_id = NULL, co_supervisor2_id = NULL, assigned_at = NULL, notes= NULL, protocol_number = NULL WHERE thesis_id = $thesis_id";
    $result1 = mysqli_query($link, $sql1);

    $sql2 = "DELETE FROM thesis_selections WHERE thesis_id = $thesis_id";
    $result2 = mysqli_query($link, $sql2);

    $sql3 = "INSERT INTO cancellation (thesis_id, cancel_date, reason, cancelled_by, assembly_number) VALUES ($thesis_id, $assembly_year, 'cancelled by supervisor', $user_id, '$assembly_number')";
    $result3 = mysqli_query($link, $sql3);


    if ($result1 && $result2 && $result3) {
        $response['success'] = true;
    } else {
        $response['error'] = 'Database update failed';
    }
} else {
    $response['error'] = 'Invalid thesis ID';
}

echo json_encode($response);
mysqli_close($link);
?>
