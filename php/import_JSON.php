<?php
include 'config.php'; // Ensure this includes your database connection setup

$response = ['success' => false];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $file = $_FILES['file']['tmp_name'];
    $jsonData = file_get_contents($file);

    // Decode the JSON data
    $data = json_decode($jsonData, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['success' => false, 'error' => 'Invalid JSON format']);
        exit;
    }

    foreach ($data as $user) {
        // Prepare fields from the JSON object
        $user_id = isset($user['user_id']) ? intval($user['user_id']) : 0;
        $password = mysqli_real_escape_string($link, $user['password']);
        $role = mysqli_real_escape_string($link, $user['role']);
        $name = mysqli_real_escape_string($link, $user['name']);
        $surname = mysqli_real_escape_string($link, $user['surname']);
        $email = mysqli_real_escape_string($link, $user['email']);
        $phone = mysqli_real_escape_string($link, $user['phone']);
        $address = mysqli_real_escape_string($link, $user['address']);
        $mobile = isset($user['mobile']) ? mysqli_real_escape_string($link, $user['mobile']) : null;
        $created_at = date('Y-m-d H:i:s');

        // Check if the user already exists
        $checkQuery = "SELECT user_id FROM users WHERE user_id = '$user_id'";
        $result = mysqli_query($link, $checkQuery);

        if (mysqli_num_rows($result) > 0) {
            $updateQuery = "UPDATE users SET password = '$password', role = '$role', name = '$name', surname = '$surname', email = '$email', phone = '$phone', address = '$address', mobile = '$mobile' WHERE user_id = '$user_id'";
            mysqli_query($link, $updateQuery);
        } else {
            $insertQuery = " INSERT INTO users (user_id, password, role, name, surname, email, phone, address, mobile, created_at)
                             VALUES ('$user_id', '$password', '$role', '$name', '$surname', '$email', '$phone', '$address', '$mobile', '$created_at')";
            mysqli_query($link, $insertQuery);
        }
    }

    $response['success'] = true;
} else {
    $response['error'] = 'No file uploaded or invalid request';
}

echo json_encode($response);
mysqli_close($link);
?>
