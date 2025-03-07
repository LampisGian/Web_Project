<?php
include 'config.php';

session_start();
$user_id = $_POST['user_id'];
$response = ['success' => false];

// Fetch invitations where the tutor is a co-supervisor and hasn't accepted yet
$query = "SELECT ts.id, ts.student_AM, ts.thesis_id, ts.supervisor_id, 
          ts.co_supervisor1_id, ts.co_supervisor2_id, 
          ts.supervisor_accepted, ts.co_supervisor1_accepted, ts.co_supervisor2_accepted, 
          t.title, t.abstract, CONCAT(s.name ,' ', s.surname) as info
          FROM thesis_selections ts 
          LEFT JOIN theses t ON ts.thesis_id = t.thesis_id 
          RIGHT JOIN students s ON t.student_id = s.AM
          WHERE (ts.co_supervisor1_id = $user_id AND ts.co_supervisor1_accepted = 0) 
          OR (ts.co_supervisor2_id = $user_id AND ts.co_supervisor2_accepted = 0)";

$result = mysqli_query($link, $query);

if ($result) {
    $invitations = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $invitations[] = $row;
    }
    $response['success'] = true;
    $response['data'] = $invitations;
}

echo json_encode($response);
mysqli_close($link);
?>
