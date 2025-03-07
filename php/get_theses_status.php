<?php
include "config.php";
session_start();

$user_id = $_POST['user_id'];
$response = [
    'in_progress' => 0,
    'under_assignment' => 0,
    'completed' => 0
];

// Query to get the count of theses by status
$sql = "SELECT status, COUNT(*) as count FROM theses WHERE supervisor_id = $user_id GROUP BY status";
$result = mysqli_query($link, $sql);

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $status = $row['status'];
        $count = intval($row['count']);

        if ($status == 'in progress') {
            $response['in_progress'] = $count;
        } elseif ($status == 'under assignment') {
            $response['under_assignment'] = $count;
        } elseif ($status == 'completed') {
            $response['completed'] = $count;
        }
    }
    echo json_encode(['success' => true, 'data' => $response]);
} else {
    echo json_encode(['success' => false, 'error' => 'Database query failed']);
}

mysqli_close($link);
?>
