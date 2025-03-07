const logged_user = JSON.parse(localStorage.getItem("logged_user"));
if (logged_user[0].role != 'tutor') { 
    window.location.replace('404.html');
}

function createThesis() {
    // Get the form data
    const title = $('#title').val();
    const abstract = $('#abstract').val();
    const pdfFile = $('#pdf')[0].files[0];
    const supervisorId = JSON.parse(localStorage.getItem("logged_user"))[0].user_id; 

    // Check if the required fields are filled
    if (!title || !abstract) {
        Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'Please fill in all the required fields.',
            confirmButtonColor: '#f39c12'
        });
        return;
    }

    // Create a FormData object to handle file uploads
    const formData = new FormData();
    formData.append('title', title);
    formData.append('abstract', abstract);
    formData.append('pdf', pdfFile);
    formData.append('supervisor_id', supervisorId);

    // AJAX request to submit the form
    $.ajax({
        url: './php/create_thesis.php',
        type: 'POST',
        data: formData,
        processData: false, 
        contentType: false, 
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thesis Created',
                    text: 'The thesis has been successfully created!',
                    confirmButtonColor: '#28a745'
                }).then(() => {
                    $('#title').val('');
                    $('#abstract').val('');
                    $('#pdf').val('');
                    $('#filename').val('');
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.error || 'Failed to create thesis.',
                    confirmButtonColor: '#d33'
                });
            }
        }
    });
}

