<?php
include 'config.php';
session_start();

$thesis_id = isset($_POST['thesis_id']) ? intval($_POST['thesis_id']) : 0;
$total_grade = isset($_POST['total_grade']) ? floatval($_POST['total_grade']) : 0;
$user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : 0;
$criteria = isset($_POST['criteria']) ? json_decode($_POST['criteria'], true) : [];

$response = ['success' => false];

// Check which role the user has in the thesis
$query = "SELECT supervisor_id, co_supervisor1_id, co_supervisor2_id FROM theses WHERE thesis_id = $thesis_id";
$result = mysqli_query($link, $query);

if ($result && mysqli_num_rows($result) > 0) {
    $thesis = mysqli_fetch_assoc($result);
    if ($user_id == $thesis['supervisor_id']) { // here we check which is the user from the previous query and we update the corresponding field 
        $grade_field = 'supervisor_grade';
        $detailed_field = 'detailed_grade1';
    } elseif ($user_id == $thesis['co_supervisor1_id']) {
        $grade_field = 'co_supervisor1_grade';
        $detailed_field = 'detailed_grade2';
    } elseif ($user_id == $thesis['co_supervisor2_id']) {
        $grade_field = 'co_supervisor2_grade';
        $detailed_field = 'detailed_grade3';
    } else {
        $response['error'] = 'User is not authorized to grade this thesis';
        echo json_encode($response);
        mysqli_close($link);
        exit;
    }

    $criteria_string = implode(',', [ // split the 4 grades with commas to insert into the detailed_grade field
        $criteria['criteria1'] ?? 0,
        $criteria['criteria2'] ?? 0,
        $criteria['criteria3'] ?? 0,
        $criteria['criteria4'] ?? 0
    ]);
    $criteria_string = mysqli_real_escape_string($link, $criteria_string);

    $check_query = "SELECT * FROM review WHERE thesis_id = $thesis_id";
    $check_result = mysqli_query($link, $check_query);

    if ($check_result && mysqli_num_rows($check_result) > 0) {
        // update if the record exists
        $update_query = "UPDATE review 
                         SET $grade_field = $total_grade, $detailed_field = '$criteria_string' 
                         WHERE thesis_id = $thesis_id";
        if (mysqli_query($link, $update_query)) {
            $response['success'] = true;
            $response['message'] = 'Grade and criteria updated successfully';
        } else {
            $response['error'] = 'Failed to update grade: ' . mysqli_error($link);
        }
    } else {
        $insert_query = "INSERT INTO review (thesis_id, $grade_field, $detailed_field) 
                         VALUES ($thesis_id, $total_grade, '$criteria_string')";
        if (mysqli_query($link, $insert_query)) {
            $response['success'] = true;
            $response['message'] = 'Grade and criteria added successfully';
        } else {
            $response['error'] = 'Failed to insert grade: ' . mysqli_error($link);
        }
    }
} else {
    $response['error'] = 'Thesis not found';
}

echo json_encode($response);
mysqli_close($link);
?>
