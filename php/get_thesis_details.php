<?php
include "config.php";
session_start();

$user_id = $_GET['id'];

// Step 1: Retrieve the student's AM using the user_id
$studentQuery = "SELECT AM FROM students WHERE user_id = $user_id";
$studentResult = mysqli_query($link, $studentQuery);

if ($studentResult && mysqli_num_rows($studentResult) > 0) {
    $studentData = mysqli_fetch_assoc($studentResult);
    $student_AM = $studentData['AM'];
} else {
    echo json_encode(['success' => false, 'error' => 'Student AM not found']);
    exit;
}

$sql = "SELECT 
            t.thesis_id, t.title, t.abstract, t.pdf_attachment, t.status, t.assigned_at, t.external_link,
            u1.name AS supervisor_name, u1.surname AS supervisor_surname,
            u2.name AS co_supervisor1_name, u2.surname AS co_supervisor1_surname,
            u3.name AS co_supervisor2_name, u3.surname AS co_supervisor2_surname
        FROM theses t
        LEFT JOIN users u1 ON u1.user_id = t.supervisor_id
        LEFT JOIN users u2 ON u2.user_id = t.co_supervisor1_id
        LEFT JOIN users u3 ON u3.user_id = t.co_supervisor2_id
        WHERE t.student_id = '$student_AM'";

$result = mysqli_query($link, $sql);
if ($result && mysqli_num_rows($result) > 0) {
    $thesis = mysqli_fetch_assoc($result);
    echo json_encode(['success' => true, 'thesis' => $thesis]);
} else {
    echo json_encode(['success' => false, 'error' => 'Thesis not found']);
}

mysqli_close($link);
?>
