<?php
include "config.php";
session_start();

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
$response = ['success' => false];

if ($user_id > 0) {
    // Fetch average completion time, number of theses supervised
    $query_supervisor = "
        SELECT 
            AVG(DATEDIFF(th.updated_at, th.created_at)) AS avg_completion_supervisor,
            COUNT(*) AS total_supervised
        FROM theses th
        WHERE th.supervisor_id = $user_id AND th.status = 'completed' AND th.updated_at IS NOT NULL
    ";
    $result_supervisor = mysqli_query($link, $query_supervisor);
    $data_supervisor = mysqli_fetch_assoc($result_supervisor);

    // Fetch average grades where the user is a supervisor
    $query_supervisor_grades = "
        SELECT 
            AVG(r.supervisor_grade) AS avg_grade_supervisor
        FROM review r
        INNER JOIN theses th ON r.thesis_id = th.thesis_id
        WHERE th.supervisor_id = $user_id AND th.status = 'completed'
    ";
    $result_supervisor_grades = mysqli_query($link, $query_supervisor_grades);
    $data_supervisor_grades = mysqli_fetch_assoc($result_supervisor_grades);

    // Fetch average completion time, number of theses for committee members
    $query_committee = "
        SELECT 
            AVG(DATEDIFF(th.updated_at, th.created_at)) AS avg_completion_committee,
            COUNT(*) AS total_committee
        FROM theses th
        WHERE (th.co_supervisor1_id = $user_id OR th.co_supervisor2_id = $user_id) 
        AND th.status = 'completed' AND th.updated_at IS NOT NULL
    ";
    $result_committee = mysqli_query($link, $query_committee);
    $data_committee = mysqli_fetch_assoc($result_committee);

    // Fetch average grades where the user is a committee member
    $query_committee_grades = "
        SELECT 
            AVG(r.co_supervisor1_grade) AS avg_grade_co1,
            AVG(r.co_supervisor2_grade) AS avg_grade_co2
        FROM review r
        INNER JOIN theses th ON r.thesis_id = th.thesis_id
        WHERE (th.co_supervisor1_id = $user_id OR th.co_supervisor2_id = $user_id)
        AND th.status = 'completed'
    ";
    $result_committee_grades = mysqli_query($link, $query_committee_grades);
    $data_committee_grades = mysqli_fetch_assoc($result_committee_grades);

    // Calculate overall average for committee grades
    $avg_grade_committee = round(($data_committee_grades['avg_grade_co1'] + $data_committee_grades['avg_grade_co2']) / 2, 2);

    $response['success'] = true;
    $response['data'] = [
        'avg_completion_supervisor' => round($data_supervisor['avg_completion_supervisor'], 2),
        'avg_grade_supervisor' => round($data_supervisor_grades['avg_grade_supervisor'], 2),
        'total_supervised' => $data_supervisor['total_supervised'],

        'avg_completion_committee' => round($data_committee['avg_completion_committee'], 2),
        'avg_grade_committee' => $avg_grade_committee,
        'total_committee' => $data_committee['total_committee']
    ];
} else {
    $response['error'] = 'Invalid user ID';
}

echo json_encode($response);
mysqli_close($link);
?>
