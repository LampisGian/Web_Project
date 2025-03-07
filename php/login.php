<?php
session_start();

include "config.php";
$result = array();

$email = $_POST['email'];
$password = $_POST['password'];


$query = mysqli_query($link, "SELECT * FROM users WHERE email='$email'");

if (mysqli_num_rows($query) === 1) {
    $row = mysqli_fetch_assoc($query);
    $isPasswordCorrect = ($password == $row['password']);

    if ($isPasswordCorrect) {
        $_SESSION['role'] = $row['role'];
        $_SESSION['email'] = $row['email'];
        $_SESSION['user_id'] = $row['user_id'];


        $user_data = array(
            'email' => $row['email'],
            'user_id' => $row['user_id'],
            'role' => $row['role']
        );

        if ($row['role'] === 'student') {
            $studentQuery = mysqli_query($link, "SELECT AM FROM students WHERE user_id = {$row['user_id']} LIMIT 1");
            
            if ($studentQuery && mysqli_num_rows($studentQuery) === 1) {
                $studentRow = mysqli_fetch_assoc($studentQuery);
 
                $user_data['AM'] = $studentRow['AM'];
                $_SESSION['AM'] = $studentRow['AM'];
            
                $thesisQuery = "SELECT thesis_id FROM theses WHERE student_id = " . $studentRow['AM'];
                $thesisResult = mysqli_query($link, $thesisQuery);
            
                if ($thesisResult && mysqli_num_rows($thesisResult) === 1) {
                    $thesisRow = mysqli_fetch_assoc($thesisResult);
                    $user_data['thesis_id'] = $thesisRow['thesis_id'];
                    $_SESSION['thesis_id'] = $thesisRow['thesis_id'];
                } else {
                    $user_data['thesis_id'] = null;
                    $_SESSION['thesis_id'] = null;
                }
            }
        }

        array_push($result, $user_data);
        echo json_encode($result, true);
    } else {
        echo 2;
    }
} else {
    echo 2;
}

mysqli_close($link);
?>
