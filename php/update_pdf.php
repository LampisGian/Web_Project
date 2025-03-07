<?php
include "config.php";
session_start();

$thesis_id = isset($_POST['thesis_id']) ? intval($_POST['thesis_id']) : 0;

// Define the directory for uploading PDFs
$uploadDir = __DIR__ . '/../attachments/';
$pdfName = basename($_FILES['pdf']['name']);
$pdf_attachment = 'attachments/' . $pdfName;
$uploadPath = $uploadDir . $pdfName;

// Move the uploaded file to the attachments directory
if (!move_uploaded_file($_FILES['pdf']['tmp_name'], $uploadPath)) {
    echo json_encode(['success' => false, 'error' => 'Failed to upload PDF']);
    exit;
}

// Update the thesis record in the database with the new PDF path
$sql = "UPDATE theses SET pdf_attachment = '$pdf_attachment', updated_at = NOW() WHERE thesis_id = $thesis_id";
$result = mysqli_query($link, $sql);

echo 1;

mysqli_close($link);
?>
