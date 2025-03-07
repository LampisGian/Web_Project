<?php
include "config.php";

// Validate and sanitize inputs
$thesis_id = isset($_GET['thesis_id']) ? intval($_GET['thesis_id']) : 0;

if ($thesis_id > 0) {
    // Query to fetch the presentation date
    $sql = "SELECT presentation_date FROM presentations WHERE thesis_id = $thesis_id";
    $result = mysqli_query($link, $sql);

    if ($result) {
        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            echo json_encode(['success' => true, 'presentation_date' => $row['presentation_date']]);
        } else {
            echo json_encode(['success' => false, 'error' => 'No presentation date found for the given thesis ID.']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Query failed.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid thesis ID provided.']);
}

mysqli_close($link);
?>
