<?php
include "config.php";

session_start();
$thesis_id = isset($_POST['thesis_id']) ? intval($_POST['thesis_id']) : 0;
$external_link = isset($_POST['link']) ? mysqli_real_escape_string($link, $_POST['link']) : '';

    $sql = "UPDATE theses SET external_link = '$external_link' WHERE thesis_id = $thesis_id";

    if (mysqli_query($link, $sql)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to update the link.']);
    }



mysqli_close($link);
?>
