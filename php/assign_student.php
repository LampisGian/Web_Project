<?php
include 'config.php';
session_start();

$thesis_id = isset($_POST['thesis_id']) ? intval($_POST['thesis_id']) : 0;
$student_id = isset($_POST['student_id']) ? intval($_POST['student_id']) : 0;
$supervisor_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : 0;
$response = ['success' => false];

if ($thesis_id > 0 && $student_id > 0 && $supervisor_id > 0) {
    // Step 1: Check if the student already has an assigned thesis
    $checkQuery = "SELECT thesis_id FROM theses WHERE student_id = $student_id";
    $checkResult = mysqli_query($link, $checkQuery);

    if ($checkResult && mysqli_num_rows($checkResult) > 0) {
        // Student already has an assigned thesis
        $response['error'] = 'Student already has an assigned thesis';
    } else {
        // Step 2: Assign the student to the thesis
        $query1 = "UPDATE theses SET student_id = $student_id, assigned_at = NULL WHERE thesis_id = $thesis_id";
        $result1 = mysqli_query($link, $query1);

        if ($result1) {
            // Step 3: Insert into thesis_selections
            $query2 = "INSERT INTO thesis_selections 
                        (student_AM, thesis_id, supervisor_id, supervisor_accepted, created_at, updated_at) 
                        VALUES ($student_id, $thesis_id, $supervisor_id, 1, NOW(), NOW())";

            $result2 = mysqli_query($link, $query2);

            if ($result2) {
                $response['success'] = true;
            } else {
                $response['error'] = 'Failed to insert into thesis_selections';
            }
        } else {
            $response['error'] = 'Failed to update thesis assignment';
        }
    }
} else {
    $response['error'] = 'Invalid input parameters';
}

// Output the JSON response
echo json_encode($response);
mysqli_close($link);
?>
