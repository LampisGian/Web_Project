<?php
include "config.php";
session_start();

$student_AM = isset($_GET['student_AM']) ? intval($_GET['student_AM']) : 0;
$thesis_id = isset($_GET['thesis_id']) ? intval($_GET['thesis_id']) : 0;

// Check if student_AM and thesis_id are provided
if (!$student_AM || !$thesis_id) {
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
    exit;
}

// Fetch invitation statuses and details of the supervisors
$sql = "SELECT 
            ts.supervisor_accepted AS supervisor_status, 
            ts.co_supervisor1_accepted AS co_supervisor1_status, 
            ts.co_supervisor2_accepted AS co_supervisor2_status,
            u1.name AS supervisor_name, u1.surname AS supervisor_surname, u1.user_id AS supervisor_id,
            u2.name AS co_supervisor1_name, u2.surname AS co_supervisor1_surname, u2.user_id AS co_supervisor1_id,
            u3.name AS co_supervisor2_name, u3.surname AS co_supervisor2_surname, u3.user_id AS co_supervisor2_id,
            updated_at as last_update
            FROM thesis_selections ts
            LEFT JOIN users u1 ON u1.user_id = ts.supervisor_id
            LEFT JOIN users u2 ON u2.user_id = ts.co_supervisor1_id
            LEFT JOIN users u3 ON u3.user_id = ts.co_supervisor2_id
            WHERE ts.student_AM = $student_AM AND ts.thesis_id = $thesis_id";

$result = mysqli_query($link, $sql);

if ($result && mysqli_num_rows($result) > 0) {
    $row = mysqli_fetch_assoc($result);

    $invitations = [
        'supervisor' => [
            'name' => $row['supervisor_name'],
            'supervisorId' => $row['supervisor_id'],
            'surname' => $row['supervisor_surname'],
            'accepted' => $row['supervisor_status'],
            'lastUpdate' => $row['last_update']
        ],
        'co_supervisor1' => [
            'name' => $row['co_supervisor1_name'],
            'coSupervisor1Id' => $row['co_supervisor1_id'],
            'surname' => $row['co_supervisor1_surname'],
            'accepted' => $row['co_supervisor1_status']
        ],
        'co_supervisor2' => [
            'name' => $row['co_supervisor2_name'],
            'coSupervisor2Id' => $row['co_supervisor2_id'],
            'surname' => $row['co_supervisor2_surname'],
            'accepted' => $row['co_supervisor2_status']
        ]
    ];

    echo json_encode(['success' => true, 'invitations' => $invitations]);
} else {
    echo json_encode(['success' => false, 'error' => 'No invitations found']);
}

mysqli_close($link);
?>
