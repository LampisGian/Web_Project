<?php
include "config.php";
session_start();

// Retrieve data from the POST request
$thesis_id = isset($_POST['thesis_id']) ? intval($_POST['thesis_id']) : 0;
$title = $_POST['title'];
$abstract = $_POST['abstract'];
$assigned_at = $_POST['assigned_at'];

if ($thesis_id > 0) {
    // Update query using plain mysqli_query
    $sql = "UPDATE theses 
            SET title = '$title', 
                abstract = '$abstract', 
                assigned_at = '$assigned_at' 
            WHERE thesis_id = $thesis_id";
    
    $result = mysqli_query($link, $sql);

    // Check if the query was successful
    if ($result) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Database update failed']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid thesis ID']);
}

// Close the database connection
mysqli_close($link);
?>
