<?php
include "config.php";
session_start();

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

if ($user_id == 0) {
    echo json_encode(['success' => false, 'error' => 'Invalid user ID']);
    exit;
}

$sql = " SELECT t.thesis_id, t.title, t.status, t.link, t.venue, s.AM AS student_AM, s.name AS student_name, s.surname AS student_surname, u.user_id, u.name AS user_name, u.surname AS user_surname, u.role, u1.name AS supervisor_name, 
         u1.surname AS supervisor_surname, u2.name AS co_supervisor1_name, u2.surname AS co_supervisor1_surname, u3.name AS co_supervisor2_name, u3.surname AS co_supervisor2_surname FROM theses t INNER JOIN students s ON t.student_id = s.AM 
         INNER JOIN users u ON s.user_id = u.user_id LEFT JOIN users u1 ON t.supervisor_id = u1.user_id LEFT JOIN users u2 ON t.co_supervisor1_id = u2.user_id LEFT JOIN users u3 ON t.co_supervisor2_id = u3.user_id WHERE u.role = 'student' 
         AND u.user_id = ?
";

$stmt = mysqli_prepare($link, $sql);
mysqli_stmt_bind_param($stmt, 'i', $user_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$theses = [];
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $theses[] = $row;
    }
    echo json_encode(['success' => true, 'theses' => $theses]);
} else {
    echo json_encode(['success' => false, 'error' => 'No thesis data found']);
}

mysqli_close($link);
?>
