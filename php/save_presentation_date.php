<?php
include 'config.php';
session_start();

$thesis_id = isset($_POST['thesis_id']) ? intval($_POST['thesis_id']) : 0;
$presentation_date = isset($_POST['presentation_date']) ? $_POST['presentation_date'] : '';

$response = ['success' => false];

// Validate input
if ($thesis_id > 0 && !empty($presentation_date)) {

    $insertQuery = "INSERT INTO presentations (thesis_id, presentation_date, created_at) VALUES ($thesis_id, '$presentation_date', NOW())  ON DUPLICATE KEY UPDATE 
                    presentation_date = VALUES(presentation_date), updated_at = NOW();";

    if (mysqli_query($link, $insertQuery)) {
        $response['success'] = true;
        $response['message'] = 'Presentation details saved successfully';
    } else {
        $response['error'] = 'Failed to save presentation details';
    }
}


echo json_encode($response);
mysqli_close($link);
?>
