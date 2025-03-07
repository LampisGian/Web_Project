<?php
include 'config.php';
session_start();

$id = isset($_POST['id']) ? intval($_POST['id']) : 0;
$thesis_id = isset($_POST['thesis_id']) ? intval($_POST['thesis_id']) : 0;
$user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : 0;

$response = ['success' => false];

// Validate input parameters
if ($id > 0 && $thesis_id > 0 && $user_id > 0) {
    // Step 1: Fetch co-supervisor information from the thesis_selections table
    $query = "SELECT co_supervisor1_id, co_supervisor2_id FROM thesis_selections WHERE id = $id";
    $result = mysqli_query($link, $query);

    if ($result && mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        $co_supervisor1_id = $row['co_supervisor1_id'];
        $co_supervisor2_id = $row['co_supervisor2_id'];

        // Step 2: Determine which co-supervisor field to update based on whether the field is empty (NULL or 0)
        if ($user_id == $co_supervisor1_id) {
            // Assign to co_supervisor1_id if it's empty
            $queryUpdate = "UPDATE theses SET co_supervisor1_id = $user_id WHERE thesis_id = $thesis_id";
        } elseif ($user_id == $co_supervisor2_id) {
            // Assign to co_supervisor2_id if it's empty
            $queryUpdate = "UPDATE theses SET co_supervisor2_id = $user_id WHERE thesis_id = $thesis_id";
        } else {
            $response['error'] = 'Failed to upate theses table';
            echo json_encode($response);
            mysqli_close($link);
            exit;
        }

        // Step 3: Execute the update query
        $updateResult = mysqli_query($link, $queryUpdate);

        if ($updateResult) {
            $response['success'] = true;
        } else {
            $response['error'] = 'Failed to update co-supervisor in the theses table.';
        }
    } else {
        $response['error'] = 'Invalid thesis selection ID.';
    }
} else {
    $response['error'] = 'Invalid input parameters.';
}

// Return the JSON response
echo json_encode($response);
mysqli_close($link);
?>
