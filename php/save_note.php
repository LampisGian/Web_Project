<?php
include "config.php";
session_start();

// Fetch input data
$thesis_id = isset($_POST['thesis_id']) ? intval($_POST['thesis_id']) : 0;
$note = isset($_POST['note']) ? trim($_POST['note']) : '';

$response = ['success' => false];

// Validate inputs
if ($thesis_id > 0 && !empty($note)) {
    // Fetch existing notes for the thesis
    $query = "SELECT notes FROM theses WHERE thesis_id = $thesis_id";
    $result = mysqli_query($link, $query);

    if ($result) {
        $row = mysqli_fetch_assoc($result);
        $existingNotes = isset($row['notes']) ? trim($row['notes']) : '';

        // Append new note if existing notes are not empty
        if (!empty($existingNotes)) {
            // Ensure the combined length does not exceed 300 characters
            $updatedNotes = $existingNotes . "\n" . $note;
            if (strlen($updatedNotes) > 300) {
                echo json_encode(['success' => false, 'error' => 'Note exceeded 300 characters limit!']);
                exit;
            }
        } else {
            // If no existing notes, just use the new note
            $updatedNotes = $note;
        }

        // Update the notes in the database
        $updateQuery = "UPDATE theses SET notes = '" . mysqli_real_escape_string($link, $updatedNotes) . "' WHERE thesis_id = $thesis_id";
        if (mysqli_query($link, $updateQuery)) {
            $response['success'] = true;
            $response['message'] = 'Thesis notes updated successfully';
        } else {
            $response['error'] = 'Failed to update notes: ' . mysqli_error($link);
        }
    } else {
        $response['error'] = 'Failed to fetch existing notes';
    }
} else {
    $response['error'] = 'Invalid input';
}

// Output the response as JSON
echo json_encode($response);
mysqli_close($link);
?>
