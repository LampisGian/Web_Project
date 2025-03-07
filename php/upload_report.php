<?php
include "config.php";
session_start();

$thesis_id = $_POST['thesis_id'];
$uploadDir = __DIR__ . '/../reports/';
$pdf_attachment = '';

// Handle the PDF file upload if it exists
if (isset($_FILES['pdf']) && $_FILES['pdf']['error'] == 0) {
    $pdfName = basename($_FILES['pdf']['name']);
    $pdf_attachment = 'reports/' . $pdfName;
    $uploadPath = $uploadDir . $pdfName;

    // Move the uploaded file to the attachments directory
    if (!move_uploaded_file($_FILES['pdf']['tmp_name'], $uploadPath)) {
        echo json_encode(['success' => false, 'error' => 'Failed to upload PDF']);
        exit;
    }
}

// Insert the new thesis into the database
$sql = "UPDATE theses SET evaluation_report = '$pdf_attachment' WHERE thesis_id = $thesis_id";

$result = mysqli_query($link, $sql);

if ($result) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to create thesis']);
}

mysqli_close($link);
?>
