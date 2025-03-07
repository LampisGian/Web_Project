<?php
include 'config.php';

session_start();

$response = ['success' => false];

// Queries
$studentsQuery = "SELECT count(*) AS total_students FROM users WHERE role='student'";
$activeTutorsQuery = "SELECT DISTINCT CONCAT(t.name, ' ', t.surname) AS tutor_name, tut.department, tut.specialization FROM users t INNER JOIN theses th ON t.user_id = th.supervisor_id INNER JOIN tutors tut ON th.supervisor_id = tut.tutor_id";
$thesesQuery = "SELECT COUNT(thesis_id) AS total, status FROM theses GROUP BY status";
$announcementsQuery = "SELECT p.*, th.title FROM presentations p INNER JOIN theses th ON p.thesis_id = th.thesis_id";


$result1 = mysqli_query($link, $studentsQuery);
$result2 = mysqli_query($link, $activeTutorsQuery);
$result3 = mysqli_query($link, $thesesQuery);
$result4 = mysqli_query($link, $announcementsQuery);

$students = [];
$tutors = [];
$theses = [];
$announcements = [];


if ($result1) {
    $row = mysqli_fetch_assoc($result1);
    $students = $row['total_students'];
}

if ($result2) {
    while ($row = mysqli_fetch_assoc($result2)) {
        $tutors[] = [
            'tutor_name' => $row['tutor_name'],
            'department' => $row['department'],
            'specialization' => $row['specialization']
        ];
    }
}

if ($result3) {
    while ($row = mysqli_fetch_assoc($result3)) {
        $theses[] = $row;
    }
}

if ($result4) {
    while ($row = mysqli_fetch_assoc($result4)) {
        $announcements[] = $row;
    }
}

if ($result1 && $result2 && $result3 && $result4) {
    echo json_encode([
        'success' => true,
        'students' => $students,
        'tutors' => $tutors,
        'theses' => $theses,
        'announcements' => $announcements
    ]);
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Failed to fetch data',
        'mysqli_error' => mysqli_error($link)
    ]);
}

// Close the database connection
mysqli_close($link);
?>
