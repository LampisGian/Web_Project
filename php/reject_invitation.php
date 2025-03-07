<?php
include 'config.php';

$id = isset($_POST['id']) ? intval($_POST['id']) : 0;
$user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : 0;
$response = ['success' => false];

// Check if both id and user_id are valid
if ($id > 0 && $user_id > 0) {
    // Step 1: Fetch the current supervisor and co-supervisor IDs
    $query = "SELECT co_supervisor1_id, co_supervisor2_id FROM thesis_selections WHERE id = $id";
    $result = mysqli_query($link, $query);

    if ($result && mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        $co_supervisor1_id = $row['co_supervisor1_id'];
        $co_supervisor2_id = $row['co_supervisor2_id'];
        
        // Step 2: Determine which co-supervisor field matches the user_id
        if ($user_id == $co_supervisor1_id) {
            // Set co_supervisor1_id and co_supervisor1_accepted to NULL
            $queryUpdate = "UPDATE thesis_selections 
                            SET co_supervisor1_id = NULL, updated_at = NOW()
                            WHERE id = $id";
        } elseif ($user_id == $co_supervisor2_id) {
            // Set co_supervisor2_id and co_supervisor2_accepted to NULL
            $queryUpdate = "UPDATE thesis_selections 
                            SET co_supervisor2_id = NULL, updated_at = NOW()
                            WHERE id = $id";
        } else {
            $response['error'] = 'User is not a co-supervisor for this thesis.';
            echo json_encode($response);
            mysqli_close($link);
            exit;
        }

        // Step 3: Execute the update query
        $updateResult = mysqli_query($link, $queryUpdate);

        if ($updateResult) {
            $response['success'] = true;
        } else {
            $response['error'] = 'Failed to update the thesis selections.';
        }
    } else {
        $response['error'] = 'Invalid thesis selection ID.';
    }
} else {
    $response['error'] = 'Invalid input parameters.';
}

echo json_encode($response);
mysqli_close($link);
?>
