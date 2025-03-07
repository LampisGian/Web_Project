<?php
include 'config.php';

$am = isset($_GET['am']) ? intval($_GET['am']) : 0;
$response = ['success' => false];

if ($am > 0) {
    $query = "
        SELECT s.AM, u.name, u.surname, s.department 
        FROM students s 
        JOIN users u ON s.user_id = u.user_id 
        WHERE s.AM = $am
    ";
    $result = mysqli_query($link, $query);

    if ($result && mysqli_num_rows($result) > 0) {
        $student = mysqli_fetch_assoc($result);

        // Mask the student's name and surname for GDPR compliance
        $maskedName = substr($student['name'], 0, 1) . str_repeat('*', strlen($student['name']) - 1);
        $maskedSurname = substr($student['surname'], 0, 1) . str_repeat('*', strlen($student['surname']) - 1);

        $response['success'] = true;
        $response['student'] = [
            'AM' => $student['AM'],
            'name' => $maskedName,
            'surname' => $maskedSurname,
            'department' => $student['department']
        ];
    }
}

echo json_encode($response);
mysqli_close($link);
?>
