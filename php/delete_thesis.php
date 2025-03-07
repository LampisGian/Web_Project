<?php
include "config.php";
session_start();

// Retrieve data from the POST request
$thesis_id = isset($_POST['thesis_id']) ? intval($_POST['thesis_id']) : 0;

$sql = "DELETE FROM theses WHERE thesis_id = $thesis_id";

$result = mysqli_query($link, $sql);

// Check if the query was successful
if ($result) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Database update failed']);
}


// Close the database connection
mysqli_close($link);
?>
