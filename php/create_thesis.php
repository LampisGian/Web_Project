<?php
include "config.php";
session_start();

$title = mysqli_real_escape_string($link, $_POST['title']);
$abstract = mysqli_real_escape_string($link, $_POST['abstract']);
$supervisor_id = mysqli_real_escape_string($link, $_POST['supervisor_id']);

// Define the directory where the PDF will be uploaded
$uploadDir = __DIR__ . '/../attachments/';
$pdf_attachment = '';

// Ensure the upload directory exists
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Handle the PDF file upload if it exists
if (isset($_FILES['pdf']) && $_FILES['pdf']['error'] == 0) {
    $pdfName = basename($_FILES['pdf']['name']);
    $pdf_attachment = 'attachments/' . $pdfName;
    $uploadPath = $uploadDir . $pdfName;

    // Move the uploaded file to the attachments directory
    if (!move_uploaded_file($_FILES['pdf']['tmp_name'], $uploadPath)) {
        echo json_encode(['success' => false, 'error' => 'Failed to upload PDF']);
        exit;
    }
}

$stmt = $link->prepare("INSERT INTO theses (title, abstract, pdf_attachment, status, supervisor_id, created_at) 
        VALUES (?, ?, ?, 'under assignment', ?, NOW())");
$stmt->bind_param("sssi", $title, $abstract, $pdf_attachment, $supervisor_id);

$result = $stmt->execute();

if ($result) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to create thesis']);
}

mysqli_close($link);
?>
