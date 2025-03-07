<?php
include 'config.php';

$thesis_id = isset($_GET['thesis_id']) ? intval($_GET['thesis_id']) : 0;
$response = ['success' => false];

if ($thesis_id > 0) {
    // Query to get thesis status and timeline data
    $query = "SELECT created_at, assigned_at, updated_at, status FROM theses WHERE thesis_id = $thesis_id";
    $result = mysqli_query($link, $query);
    $statusData = mysqli_fetch_assoc($result);

    if ($statusData) {
        $response['success'] = true;
        $response['statusTimeline'] = $statusData;
    } else {
        $response['error'] = 'Failed to fetch thesis status data.';
    }
}

echo json_encode($response);
mysqli_close($link);
?>
