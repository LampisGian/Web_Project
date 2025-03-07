<?php
include "config.php"; 

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

$sql = "SELECT theses.title, theses.abstract, cancellation.reason, cancellation.cancel_date, cancellation.cancelled_by, cancellation.assembly_number
        FROM theses INNER JOIN cancellation ON theses.thesis_id = cancellation.thesis_id WHERE cancelled_by = $user_id";

$result = mysqli_query($link, $sql);

if ($result) {
    $cancelledTheses = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $cancelledTheses[] = $row;
    }


    echo json_encode(['success' => true, 'theses' => $cancelledTheses]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to fetch cancelled theses']);
}

mysqli_close($link);
?>
