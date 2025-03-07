<?php
include "config.php"; 
session_start();

$thesis_id = isset($_POST['thesis_id']) ? intval($_POST['thesis_id']) : 0;


$sql = "SELECT u.user_id, u.name, u.surname, t.department FROM users u INNER JOIN tutors t ON u.user_id = t.tutor_id 
        LEFT JOIN theses th ON u.user_id = th.supervisor_id AND th.thesis_id = $thesis_id WHERE th.thesis_id IS NULL";

$sql2 = "SELECT thesis_id, co_supervisor1_id, co_supervisor2_id FROM thesis_selections";

$result = mysqli_query($link, $sql);
$result2 = mysqli_query($link, $sql2);

$tutors = array();
$theses = array();

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $tutors[] = $row;
    }
}

if ($result2) {
    while ($row2 = mysqli_fetch_assoc($result2)) {
        $theses[] = $row2;
    }
}

if ($result && $result2) {
    echo json_encode(['success' => true, 'tutors' => $tutors, 'theses' => $theses]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to fetch data', 'mysqli_error' => mysqli_error($link)]);
}

mysqli_close($link);
