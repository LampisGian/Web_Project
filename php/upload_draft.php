<?php
include "config.php";
session_start();

$response = ['success' => false];

$thesis_id = isset($_POST['thesis_id']) ? intval($_POST['thesis_id']) : 0;

// Check if thesis ID is valid and a file is provided
if ($thesis_id > 0 && isset($_FILES['draftFile']) && $_FILES['draftFile']['error'] == 0) {
    // Define the upload directory for drafts
    $uploadDir = __DIR__ . '/../drafts/';
    $draftName = basename($_FILES['draftFile']['name']);
    $draftPath = $uploadDir . $draftName;
    $draftLink = 'drafts/' . $draftName;

    // Create the upload directory if it doesn't exist
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Move the uploaded file to the attachments directory
    if (move_uploaded_file($_FILES['draftFile']['tmp_name'], $draftPath)) {
        // Update the `theses` table with the draft link
        $updateQuery = "UPDATE theses SET draft_file = '$draftLink' WHERE thesis_id = $thesis_id";
        $result = mysqli_query($link, $updateQuery);

        if ($result) {
            $response['success'] = true;
        } else {
            $response['error'] = 'Database update failed';
        }
    } else {
        $response['error'] = 'Failed to upload draft file';
    }
} else {
    $response['error'] = 'Invalid thesis ID or file upload';
}

// Return the JSON response
echo json_encode($response);
mysqli_close($link);
?>
