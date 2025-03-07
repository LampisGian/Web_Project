<?php
include "config.php";
session_start();

$thesis_id = isset($_GET['thesis_id']) ? intval($_GET['thesis_id']) : 0;

$response = ['success' => false];

if ($thesis_id > 0) {
    // Fetch the notes for the given thesis ID
    $query = "SELECT notes FROM theses WHERE thesis_id = $thesis_id";
    $result = mysqli_query($link, $query);

    if ($result) {
        $row = mysqli_fetch_assoc($result);
        $response['success'] = true;
        $response['notes'] = $row['notes'] ? trim($row['notes']) : 'No notes available.';
    } else {
        $response['error'] = 'Failed to fetch notes: ' . mysqli_error($link);
    }
} else {
    $response['error'] = 'Invalid thesis ID';
}

echo json_encode($response);
mysqli_close($link);
?>
