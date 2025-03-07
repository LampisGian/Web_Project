<?php
include 'config.php';
session_start();

$thesis_id = isset($_POST['thesis_id']) ? intval($_POST['thesis_id']) : 0;
$announcement_text = isset($_POST['announcement_text']) ? trim($_POST['announcement_text']) : '';

$response = ['success' => false];

// Validate input
if ($thesis_id > 0) {
    // Check if a record already exists for the given thesis_id
    $checkQuery = "SELECT * FROM presentations WHERE thesis_id = $thesis_id";
    $checkResult = mysqli_query($link, $checkQuery);

    if (mysqli_num_rows($checkResult) > 0) {
        // If a record exists, update it
        $updateQuery = "UPDATE presentations SET announcement_text = '$announcement_text' WHERE thesis_id = $thesis_id";

        if (mysqli_query($link, $updateQuery)) {
            $response['success'] = true;
            $response['message'] = 'Presentation details updated successfully';
        } else {
            $response['error'] = 'Failed to update presentation details';
        }
    } else {
        // If no record exists, insert a new one
        $insertQuery = "INSERT INTO presentations (announcement_text) VALUES ('$announcement_text')";

        if (mysqli_query($link, $insertQuery)) {
            $response['success'] = true;
            $response['message'] = 'Presentation details saved successfully';
        } else {
            $response['error'] = 'Failed to save presentation details';
        }
    }
} else {
    $response['error'] = 'Invalid input';
}

// Output the response as JSON
echo json_encode($response);
mysqli_close($link);
?>
