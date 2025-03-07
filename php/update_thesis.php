<?php
include "config.php";
session_start();

$thesis_id = isset($data['thesis_id']) ? intval($data['thesis_id']) : 0;


// Update the thesis status in the database
$sql = "UPDATE theses SET status = 'in progress', updated_at = NOW() WHERE thesis_id = $thesis_id";

if (mysqli_query($link, $sql)) {
    echo json_encode(['success' => true, 'message' => 'Thesis status updated successfully']);
} else {
    echo json_encode(['success' => false, 'error' => mysqli_error($link)]);
}

// Close the database connection
mysqli_close($link);
?>
