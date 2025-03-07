<?php
include "config.php";
session_start();

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

// Fetch the user's role first
$roleQuery = "SELECT role FROM users WHERE user_id = $user_id";
$roleResult = mysqli_query($link, $roleQuery);

if ($roleResult && mysqli_num_rows($roleResult) > 0) {
    $roleRow = mysqli_fetch_assoc($roleResult);
    $role = $roleRow['role']; 

    if ($role === 'tutor') {
        // Query for tutors
        $sql = "SELECT department, specialization, address, email, mobile, phone FROM users INNER JOIN tutors ON user_id = tutor_id WHERE user_id = $user_id";
    } elseif ($role === 'student') {
        // Query for students
        $sql = "SELECT s.department, u.address, u.email, u.mobile, u.phone FROM users u INNER JOIN students s ON s.user_id = u.user_id WHERE u.user_id = $user_id";
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid role']);
        mysqli_close($link);
        exit;
    }

    $result = mysqli_query($link, $sql);

    if ($result && mysqli_num_rows($result) > 0) {
        $settings = mysqli_fetch_assoc($result);
        echo json_encode(['success' => true, 'settings' => $settings]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Settings not found']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'User not found']);
}

mysqli_close($link);
?>
