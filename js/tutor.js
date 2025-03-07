let user_id, thesis_id, student_am; 
$(document).ready(function() {
    const logged_user = JSON.parse(localStorage.getItem("logged_user"));
    user_id = logged_user[0].user_id;
    if (logged_user[0].role == 'tutor') {
        checkProfile(user_id);
    } else {
        window.location.replace('404.html');
    }
    loadTheses(user_id);
    loadThesesCount(user_id);
});
let thesisData = {};

// Function to fetch and load thesis data
function loadTheses(user_id) {
    $.ajax({
        url: './php/get_theses.php',
        type: 'GET',
        data: { supervisor_id: user_id },
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                thesisData = data.theses; 
                console.log(thesisData);
                populateTheses(data.theses);
                populateThesisCards(data.theses);
            } else {
                console.error('Failed to load theses data');
            }
        }
    });
}

function populateTheses(theses) {
    const thesesList = $('#thesesList');
    thesesList.empty();

    theses.forEach((thesis, index) => {
        checkAssignment(thesis.title,thesis.assigned_at)
        let thesisItem;
        if (thesis.status === 'completed') {
            thesisItem = `
                <li class="bg-white border border-yellow-500 p-4 rounded-lg shadow-md">
                    <h3 onclick="openModal(${index})" class="text-lg line-through font-semibold text-gray-800 cursor-pointer hover:underline">${thesis.title}</h3>
                    <p class="text-gray-600 line-through">${thesis.abstract}</p>
                    <p class="mt-2 text-green-500 font-semibold">Completed</p>
                    <div class="mt-4 flex space-x-4">
                        <a href="${thesis.pdf_attachment}" class="text-blue-500 hover:text-blue-600 font-semibold flex items-center" target="_blank">
                            <i class="fas fa-file-pdf mr-1"></i> View PDF
                        </a>
                        <button class="text-red-500 hover:text-red-700 flex items-center font-semibold" onclick="deleteThesis(${thesis.thesis_id})">
                            <i class="fas fa-trash-alt mr-1"></i> Delete
                        </button>
                    </div>
                </li>
            `;
        } else  if (thesis.status === 'under review') {
            thesisItem = `
            <li class="bg-white border border-yellow-500 p-4 rounded-lg shadow-md">
            <h3 onclick="openModal(${index})" class="text-lg font-semibold text-gray-800 cursor-pointer hover:underline">${thesis.title}</h3>
            <p class="text-gray-600">${thesis.abstract}</p>
            <p class="mt-2 text-yellow-500 font-semibold">Under review</p>
            <div class="mt-4 flex space-x-4">
                <a href="${thesis.pdf_attachment}" class="text-blue-500 hover:text-blue-600 font-semibold flex items-center" target="_blank">
                    <i class="fas fa-file-pdf mr-1"></i> View PDF
                </a>
                <button class="text-red-500 hover:text-red-700 flex items-center font-semibold" onclick="deleteThesis(${thesis.thesis_id})">
                    <i class="fas fa-trash-alt mr-1"></i> Delete
                </button>
            </div>
        </li> `;
        }
        else {
            thesisItem = `
                <li class="bg-white border border-yellow-500 p-4 rounded-lg shadow-md">
                    <h3 onclick="openModal(${index})" class="text-lg font-semibold text-gray-800 cursor-pointer hover:underline">${thesis.title}</h3>
                    <p class="text-gray-600">${thesis.abstract}</p>
                    <p class="mt-2 text-gray-700 font-semibold">${thesis.status}</p>
                    <div class="mt-4 flex space-x-4">
                        <a href="${thesis.pdf_attachment}" class="text-blue-500 hover:text-blue-600 font-semibold flex items-center" target="_blank">
                            <i class="fas fa-file-pdf mr-1"></i> View PDF
                        </a>
                        ${
                            thesis.status !== 'in progress'
                                ? `
                                <button class="text-red-500 hover:text-red-700 flex items-center font-semibold" onclick="deleteThesis(${thesis.thesis_id})">
                                    <i class="fas fa-trash-alt mr-1"></i> Delete
                                </button>
                                <button class="text-yellow-500 hover:text-yellow-700 flex items-center font-semibold" onclick="openAssignModal(${thesis.thesis_id})">
                                    <i class="fa-solid fa-share"></i> Assign
                                </button>
                                `
                                : ''
                        }
                        ${
                            thesis.status !== 'in progress'
                                ? `<button class="text-red-500 hover:text-red-700 flex items-center font-semibold" onclick="undoAssignment(${thesis.thesis_id})">
                                        <i class="fa-solid fa-rotate-left"></i> Undo
                                    </button>`
                                : ''
                        }
                        <button class="text-green-500 hover:text-green-700 flex items-center font-semibold" onclick="openChangePdfModal(${thesis.thesis_id})">
                            <i class="fas fa-upload"></i> Change PDF
                        </button>
                    </div>
                </li>
            `;
        }
        
    
        thesesList.append(thesisItem);
    });
}


// Function to open modal with the data already available in the global object
function openModal(index) {
    const thesis = thesisData[index];

    $('#modalTitle').val(thesis.title);
    $('#modalAbstract').val(thesis.abstract);
    const studentInfo = `${thesis.student_name || 'Not Assigned'} ${thesis.student_surname || ''} - AM: ${thesis.student_AM || 'N/A'}`;
    $('#modalStudent').val(studentInfo);
    $('#modalSupervisor').val(thesis.supervisor_name || 'Not Assigned');
    const sup1Info = `${thesis.co_supervisor1_name || 'N/A'} - ${thesis.co_supervisor1_status || 'Not Assigned'}`;
    $('#modalCoSupervisor1').val(sup1Info);
    const sup2Info = `${thesis.co_supervisor2_name || 'N/A'} - ${thesis.co_supervisor2_status || 'Not Assigned'}`;
    $('#modalCoSupervisor2').val(sup2Info);
    
    $('#modalAcceptance').val(thesis.acceptance_date || 'Not Accepted');
    $('#modalAssigned').val(thesis.assigned_at || 'Not Assigned');

    $('#thesisModal').data('thesisId', thesis.thesis_id);
    $('#thesisModal').removeClass('hidden');
}


function closeModal() {
    $('#thesisModal').addClass('hidden');
}

// Function to save the updated thesis data
function saveThesisChanges() {
    const thesisId = $('#thesisModal').data('thesisId');
    const updatedData = {
        thesis_id: thesisId,
        title: $('#modalTitle').val(),
        abstract: $('#modalAbstract').val(),
        assigned_at: $('#modalAssigned').val()
    };

    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to save these changes?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#22c55e',
        cancelButtonColor: '#4b5563',
        confirmButtonText: 'Yes, save it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Send updated data to server via AJAX
            $.ajax({
                url: './php/edit_thesis.php',
                type: 'POST',
                data: updatedData,
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Thesis updated successfully!',
                            confirmButtonColor: '#28a745'
                        }).then(() => {
                            closeModal();
                            loadTheses(user_id); // Reload theses list to show updated data
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: response.error || 'Failed to update thesis.',
                            confirmButtonColor: '#d33'
                        });
                    }
                },
                error: function(xhr, status, error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'AJAX Error',
                        text: 'An error occurred while updating the thesis.',
                        confirmButtonColor: '#d33'
                    });
                    console.error('AJAX error:', status, error);
                }
            });
        }
    });
}

function editThesis(thesisId) {
    openModal(thesisId);
}

// Function to handle deleting a thesis
function deleteThesis(thesisId) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this thesis?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: './php/delete_thesis.php',
                type: 'POST',
                data: { thesis_id: thesisId },
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Thesis deleted successfully.',
                            confirmButtonColor: '#28a745'
                        });
                        loadTheses(user_id);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: response.error || 'Failed to delete thesis.',
                            confirmButtonColor: '#d33'
                        });
                    }
                }
            });
        }
    });
}

function loadThesesCount(user_id) {
    $.ajax({
        url: './php/get_theses_status.php',
        type: 'POST',
        data: { user_id: user_id },
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                const counts = response.data;
                $('#inProgressCount').text(counts.in_progress);
                $('#underAssignmentCount').text(counts.under_assignment);
                $('#completedCount').text(counts.completed);
            } 
        }
    });
}

function openAssignModal(thesisId) {
    thesis_id = thesisId;
    $('#assignModal').removeClass('hidden');
}
function closeAssignModal() {
    $('#assignModal').addClass('hidden');
}


function searchStudent() {
    const am = $('#searchAM').val();
    student_am = parseInt(am);
    if (am.trim() === '') {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please enter a valid AM',
            confirmButtonColor: '#d33'
        });
        return;
    }

    // AJAX request to search for student by AM
    $.ajax({
        url: './php/search_student.php',
        type: 'GET',
        data: { am: am },
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                $('#studentInfo').removeClass('hidden');
                $('#studentName').text(`${response.student.name} ${response.student.surname}`);
                $('#studentDepartment').text(response.student.department);
                $('#assignModal').data('studentId', response.student.user_id);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Student not found!',
                    confirmButtonColor: '#d33'
                });
            }
        }
    });
}

function confirmAssignment() {
    const logged_user = JSON.parse(localStorage.getItem("logged_user"));
    const user_id = logged_user[0].user_id;
    $.ajax({
        url: './php/assign_student.php',
        type: 'POST',
        data: { thesis_id: thesis_id, student_id: student_am, user_id: user_id },
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Assigned!',
                    text: 'Thesis assigned successfully!',
                    confirmButtonColor: '#28a745'
                });
                closeAssignModal();
                closeModal();
                loadTheses(user_id); 
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to assign!',
                    text: 'This student has already been assigned a thesis!',
                    confirmButtonColor: '#28a745'
                });
            }
        }
    });
}

function undoAssignment(thesisId) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to remove the student?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, remove!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: './php/undo_assignment.php',
                type: 'POST',
                data: { thesis_id: thesisId },
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Removed successfully.',
                            confirmButtonColor: '#28a745'
                        });
                        loadTheses(user_id);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: response.error || 'Failed to undo assignment.',
                            confirmButtonColor: '#d33'
                        });
                    }
                }
            });
        }
    });
}

let selectedThesisId;

function openChangePdfModal(thesisId) {
    selectedThesisId = thesisId;
    $('#changePdfModal').removeClass('hidden');
}

$('#cancelChangePdf').on('click', function () {
    $('#changePdfModal').addClass('hidden');
    $('#newPdfFile').val('');
});

$('#saveNewPdf').on('click', function () {
    const fileInput = $('#newPdfFile')[0];
    if (fileInput.files.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'No File Selected',
            text: 'Please select a PDF file to upload.',
            confirmButtonColor: '#f39c12'
        });
        return;
    }

    const formData = new FormData();
    formData.append('pdf', fileInput.files[0]);
    formData.append('thesis_id', selectedThesisId);
    console.log("Selected Thesis ID:", selectedThesisId);
    $.ajax({
        url: './php/update_pdf.php',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            const result = JSON.parse(response);
            if (result == 1) {
                Swal.fire({
                    icon: 'success',
                    title: 'PDF Updated',
                    text: 'The PDF has been successfully updated.',
                    confirmButtonColor: '#28a745'
                });
                $('#changePdfModal').addClass('hidden');
                $('#newPdfFile').val('');
                loadTheses(user_id); // Refresh the list
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: result.error || 'Failed to update the PDF.',
                    confirmButtonColor: '#d33'
                });
            }
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while uploading the PDF.',
                confirmButtonColor: '#d33'
            });
        }
    });
});

let noteThesisID;
function populateThesisCards(theses) {
    const container = $('#thesisCardsContainer');
    container.empty(); // Clear any existing cards

    theses.forEach(thesis => {
        if (thesis.status == 'in progress') {
            container.append(`
                <div class="thesis-card bg-white border border-yellow-400 p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer mt-4"
                     data-thesis-id="${thesis.thesis_id}" onclick="selectThesis('${thesis.thesis_id}', '${thesis.title}')">
                    <h3 class="font-bold text-lg">${thesis.title}</h3>
                    <p class="text-gray-600 mt-1">Status: ${thesis.status}</p>
                </div>
            `);
        } else if (thesis.status != 'completed') {
            container.append(`
                <div class="bg-gray-100 border-l-4 border-gray-400 text-gray-700 p-4 rounded-lg shadow-md mt-4">
                    <h3 class="font-bold text-lg">${thesis.title}</h3>
                    <p class="mt-1">This thesis is currently <strong>${thesis.status}</strong>. You cannot change status at the moment.</p>
                </div>
            `);
        }
    });

    // Add the "View Notes" button
    const notesSection = `
        <button id="viewNotesButton" class="transform transition-transform duration-200 hover:scale-150 w-6 h-6"
                onclick="viewNotes(noteThesisID)" disabled>
           <i class="fa-regular fa-note-sticky fa-lg" style="color: #f39c12;"></i>
        </button>
    `;
    $('#notesContainer').html(notesSection);
}

function selectThesis(thesisId, thesisTitle) {
    // Clear previous selection and styles
    noteThesisID = thesisId;
    $('.thesis-card').removeClass('bg-blue-500 border-yellow-500'); // Reset styling for all cards
    $(`[data-thesis-id="${thesisId}"]`).addClass('bg-blue-500 bg-opacity-90 border-yellow-500'); // Add styling to the selected card
    $('#viewNotesButton').prop('disabled', false); // Enable "View Notes" button
}

function saveNote() {
    const noteContent = $('#noteTextArea').val().trim();

    // Check if a thesis is selected
    if (!noteThesisID) {
        Swal.fire({
            icon: 'warning',
            title: 'No Thesis Selected',
            text: 'Please select a thesis.',
            confirmButtonColor: '#f39c12'
        });
        return;
    }

    // Check if the note content is empty
    if (noteContent === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Empty Note',
            text: 'Please write a note before saving.',
            confirmButtonColor: '#f39c12'
        });
        return;
    }

    // Check if the note exceeds 300 characters
    if (noteContent.length > 300) {
        Swal.fire({
            icon: 'warning',
            title: 'Note Too Long',
            text: 'The note cannot exceed 300 characters.',
            confirmButtonColor: '#f39c12'
        });
        return;
    }

    // Send the note to the server via AJAX
    $.ajax({
        url: './php/save_note.php',
        type: 'POST',
        data: {
            thesis_id: noteThesisID,
            note: noteContent
        },
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Note Saved',
                    text: 'Your note has been saved successfully!',
                    confirmButtonColor: '#28a745'
                });
                clearFormFields();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.error || 'Failed to save the note.',
                    confirmButtonColor: '#d33'
                });
            }
        }
    });
}

function viewNotes(noteThesisID) {
    if (!noteThesisID) {
        Swal.fire({
            icon: 'warning',
            title: 'No Thesis Selected',
            text: 'Please select a thesis to view notes.',
            confirmButtonColor: '#f39c12'
        });
        return;
    }

    $.ajax({
        url: './php/get_notes.php',
        type: 'GET',
        data: { thesis_id: noteThesisID },
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                const notes = response.notes || 'No notes available.';
                Swal.fire({
                    title: 'Notes',
                    html: `<p class="text-left">${notes}</p>`,
                    icon: 'info',
                    confirmButtonColor: '#f39c12'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.error || 'Failed to load notes.',
                    confirmButtonColor: '#d33'
                });
            }
        },
        error: function() {
            Swal.fire({
                icon: 'error',
                title: 'AJAX Error',
                text: 'An error occurred while fetching the notes.',
                confirmButtonColor: '#d33'
            });
        }
    });
}

function changeToUnderReview() {
    if (!noteThesisID) {
        Swal.fire({
            icon: 'warning',
            title: 'No Thesis Selected',
            text: 'Please select a thesis from the dropdown.',
            confirmButtonColor: '#f39c12'
        });
        return;
    }
    $.ajax({
        url: './php/under_review.php',
        type: 'POST',
        data: {
            thesis_id: noteThesisID,
        },
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Under Review',
                    text: 'Status has been changed to under review!',
                    confirmButtonColor: '#28a745'
                });
                loadTheses(user_id);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.error || 'Failed update.',
                    confirmButtonColor: '#d33'
                });
            }
        }
    });
}

function checkAssignment(title,assignDay){
      // Calculate the difference between the assigned date and today
      const assignedDate = new Date(assignDay);
      const today = new Date();
      // Calculate the difference in days and warn about one month before 2 years
      const diffTime = Math.abs(today - assignedDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 730 - 30 && diffDays < 730) {
          Swal.fire({
              icon: 'warning',
              title: 'Ex Officio Cancellation',
              text: `The thesis titled "${title}" assigned on ${assignedDate.toLocaleDateString()} is nearing 2 years. Please review for ex officio cancellation.`,
              confirmButtonColor: '#d33',
              confirmButtonText: 'OK'
          });
      }
}

function cancelThesis() {
    if (!noteThesisID) {
        Swal.fire({
            icon: 'warning',
            title: 'No Thesis Selected',
            text: 'Please select a thesis to cancel.',
            confirmButtonColor: '#f39c12'
        });
        return;
    }

    Swal.fire({
        title: 'Cancel Thesis Assignment ',
        html: `
            <p> You are about to cancel this thesis assignment permanently! This action is</p> <p> <strong> irreversible! </p>
            <input type="text" id="swalAssemblyNumber" class="swal2-input" placeholder="General Assembly Number">
            <input type="text" id="swalAssemblyYear" class="swal2-input" placeholder="Year">
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Cancel Thesis',
        cancelButtonText: 'Abort',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#4cbb17',
        preConfirm: () => {
            const assemblyNumber = document.getElementById('swalAssemblyNumber').value.trim();
            const assemblyYear = document.getElementById('swalAssemblyYear').value.trim();

            if (!assemblyNumber || !assemblyYear) {
                Swal.showValidationMessage('Both Assembly Number and Year are required!');
                return false;
            }

            return { assemblyNumber, assemblyYear };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { assemblyNumber, assemblyYear } = result.value;
            $.ajax({
                url: './php/cancel_thesis.php',
                type: 'POST',
                data: {
                    thesis_id: noteThesisID,
                    user_id: user_id, 
                    assembly_number: assemblyNumber,
                    assembly_year: assemblyYear
                },
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Thesis Canceled',
                            text: 'The thesis assignment has been successfully canceled.',
                            confirmButtonColor: '#28a745'
                        });
                        clearFormFields();
                        loadTheses(user_id);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: response.error || 'Failed to cancel the thesis assignment.',
                            confirmButtonColor: '#d33'
                        });
                    }
                }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
                icon: 'info',
                title: 'Action Aborted',
                text: 'The thesis assignment remains unchanged.',
                confirmButtonColor: '#4cbb17'
            });
        }
    });
}

function clearFormFields() {
    noteThesisID = null; // Reset selected thesis ID
    $('.thesis-card').removeClass('bg-blue-100 border-blue-400'); // Reset card selection styling
     document.getElementById('noteTextArea').value = '';
}


function checkProfile(user_id) {
    $.ajax({
        url: './php/check_profile.php',
        type: 'POST',
        data: { tutor_id: user_id },
        dataType: 'json',
        success: function(response) {
            if (response.success && !(response.info.department && response.info.specialization)) {          
                    Swal.fire({
                    icon: 'info',
                    title: 'Missing data',
                    text: 'Please head to settings page and update your info!'
                });
            }
        }
    });
}