<?php
include 'config.php';
session_start();

$response = ['success' => false];


$query = "SELECT th.*, CONCAT(stud.name, ' ', stud.surname) AS student_name, CONCAT(sup.name, ' ', sup.surname) AS supervisor_name, CONCAT(co_sup1.name, ' ', co_sup1.surname) AS co_supervisor1_name, CONCAT(co_sup2.name, ' ', co_sup2.surname) AS co_supervisor2_name, venue, presentation_date, protocol_number
            FROM theses th LEFT JOIN students stud ON th.student_id = stud.AM  LEFT JOIN users sup ON th.supervisor_id = sup.user_id LEFT JOIN users co_sup1 ON th.co_supervisor1_id = co_sup1.user_id LEFT JOIN users co_sup2 ON th.co_supervisor2_id = co_sup2.user_id WHERE status = 'in progress' OR status = 'under review'";


$result = mysqli_query($link, $query);
$theses = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {

        $thesis_id = $row['thesis_id'];

        // Fetch grades and library link
        $reviewQuery = "SELECT *FROM review WHERE thesis_id = $thesis_id";
        $reviewResult = mysqli_query($link, $reviewQuery);
    
        $final_grade = null;
        $library_link = null;
        $grade1 = null;
        $grade2 = null;
        $grade3 = null;
        $detailed_grade1 = null;
        $detailed_grade2 = null;
        $detailed_grade3 = null;
        $announcement_text = null;

        if ($reviewResult && mysqli_num_rows($reviewResult) > 0) {
            $reviewData = mysqli_fetch_assoc($reviewResult);
            
            $supervisor_grade = $reviewData['supervisor_grade'];
            $co_supervisor1_grade = $reviewData['co_supervisor1_grade'];
            $co_supervisor2_grade = $reviewData['co_supervisor2_grade'];
            $library_link = $reviewData['library_link'];
            $grade1 = $reviewData['supervisor_grade'];
            $grade2 = $reviewData['co_supervisor1_grade'];
            $grade3 = $reviewData['co_supervisor2_grade'];
            $detailed_grade1 = $reviewData['detailed_grade1'];
            $detailed_grade2 = $reviewData['detailed_grade2'];
            $detailed_grade3 = $reviewData['detailed_grade3'];

            // Calculate the average of non-null grades
            $valid_grades = array_filter([$supervisor_grade, $co_supervisor1_grade, $co_supervisor2_grade]);
            if (count($valid_grades) > 0) {
                $average = array_sum($valid_grades) / count($valid_grades);
                $final_grade = round($average * 2) / 2; // Round to the nearest 0.5
            }
        }

        $announcementQuery = "SELECT announcement_text FROM presentations WHERE thesis_id = $thesis_id";
        $announcementResult = mysqli_query($link, $announcementQuery);
        $announcement_text = null;

        if ($announcementResult && mysqli_num_rows($announcementResult) > 0) {
            $announcementData = mysqli_fetch_assoc($announcementResult);
            $announcement_text = $announcementData['announcement_text'];
        }

        $row['final_grade'] = $final_grade;
        $row['library_link'] = $library_link; 
        $row['supervisor_grade'] = $grade1; 
        $row['co_supervisor1_grade'] = $grade2; 
        $row['co_supervisor2_grade'] = $grade3; 
        $row['announcement_text'] = $announcement_text; 
        $row['sup_detailed_grade'] = $detailed_grade1; 
        $row['co_sup1_detailed_grade'] = $detailed_grade2; 
        $row['co_sup2_detailed_grade'] = $detailed_grade3; 
        $theses[] = $row;
    }
    $response['success'] = true;
    $response['theses'] = $theses;
} else {
    $response['error'] = 'Failed to fetch theses';
}


// Output the JSON response
echo json_encode($response);
mysqli_close($link);
?>
