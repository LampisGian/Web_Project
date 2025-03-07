let sec_id;
$(document).ready(function () {
    const logged_user = JSON.parse(localStorage.getItem("logged_user"));
    sec_id = logged_user[0].user_id;
    if (logged_user[0].role != 'secretariat') { 
        window.location.replace('404.html');
    }
    
    loadThesesManagement();
});

function loadThesesManagement() {
    $.ajax({
        url: './php/secretary_theses.php',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                displayThesesManagement(response.theses);
            } else {
                $('#thesesManagementContainer').html('<p class="text-gray-600">No theses found.</p>');
            }
        },
        error: function () {
            $('#thesesManagementContainer').html('<p class="text-gray-600">Failed to load theses data.</p>');
        }
    });
}

function displayThesesManagement(theses) {
    const container = $('#thesesManagementContainer');
    container.empty();

    if (theses.length === 0) {
        container.html('<p class="text-gray-600">No active or under review theses found.</p>');
        return;
    }

    theses.forEach(thesis => {
        let actions = '';

        if (thesis.status === 'in progress') {
            actions = `
                 <button class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-4 rounded-md mr-2" onclick="recordAPNumber(${thesis.thesis_id})">
                    Protocol Number
                </button>
                <button class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded-md" onclick="cancelThesis(${thesis.thesis_id})">
                    Cancel 
                </button>
            `;
        } else if (thesis.status === 'under review' && thesis.supervisor_grade && thesis.co_supervisor1_grade && thesis.co_supervisor2_grade && (thesis.venue || thesis.link)) {
            actions = `
                <button class="view-details-btn bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded font-semibold mt-2 self-start" onclick="markAsCompleted(${thesis.thesis_id})">
                    Mark as Completed
                </button>
            `;
        }

        const finalGrade = (thesis.co_sup1_detailed_grade && thesis.co_sup2_detailed_grade) ? thesis.final_grade : 'Not fully graded yet!';

        const thesisCard = `
            <div class="thesis-management-item bg-gray-100 hover:bg-gray-200 p-4 rounded shadow mb-4 ${
                thesis.library_link ? 'tooltip3' : ''
            }">
                <h3 class="font-bold text-lg text-yellow-700">${thesis.title}</h3>
                <p class="text-gray-600">Status: <span class="text-yellow-600">${thesis.status}</span></p>
                <p class="text-gray-600">Protocol Number: ${thesis.protocol_number || 'N/A'}</p>
                <p class="text-gray-600">Student ID: ${thesis.student_id || 'N/A'}</p>
                <p class="text-gray-600">Supervisor: ${thesis.supervisor_name || 'Not Assigned'}</p>
                <p class="text-gray-600">Assigned Date: ${thesis.assigned_at || 'Not Assigned'}</p>
                <p class="text-gray-600">Final Grade: ${finalGrade || 'Not Graded'}</p>
                <div class="mt-4">${actions}</div>
                ${
                    thesis.library_link
                        ? `<span class="tooltip3-text">This thesis is complete. Mark it as completed!</span>`
                        : ''
                }
            </div>
        `;


        container.append(thesisCard);
    });
}

// Function to record AP number
function recordAPNumber(thesisId) {
    Swal.fire({
        title: 'Record Protocol Number',
        input: 'text',
        inputLabel: 'Enter protocol number ',
        inputPlaceholder: 'Enter protocol number',
        showCancelButton: true,
        confirmButtonText: 'Save',
        preConfirm: (apNumber) => {
            if (!apNumber || !/^[a-zA-Z0-9-]+$/.test(apNumber)) {
                Swal.showValidationMessage('Please enter a valid AP number (letters, numbers, and dashes only)');
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: './php/record_ap_number.php',
                type: 'POST',
                data: { thesis_id: thesisId, ap_number: result.value },
                dataType: 'json',
                success: function (response) {
                    if (response.success) {
                        Swal.fire('Success', 'AP Number recorded successfully', 'success');
                        loadThesesManagement();
                    } else {
                        Swal.fire('Error', response.error || 'Failed to record AP Number', 'error');
                    }
                },
                error: function () {
                    Swal.fire('Error', 'AJAX request failed', 'error');
                }
            });
        }
    });
}

// Function to cancel thesis assignment
function cancelThesis(thesisId) {
    Swal.fire({
        title: 'Cancel Thesis Assignment',
        html: `
            <div>
                <label class="block text-left text-gray-600 font-semibold">Enter Cancellation Reason:</label>
                <input type="text" id="cancellationReason" class="swal2-input" placeholder="Cancellation Reason">
                <label class="block text-left text-gray-600 font-semibold">Enter Assembly Number:</label>
                <input type="text" id="assemblyNumber" class="swal2-input">
                <label class="block text-left text-gray-600 font-semibold">Enter Assembly Year:</label>
                <input type="text" id="assemblyYear" class="swal2-input" placeholder="e.g., 2024">
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Cancel Assignment',
        preConfirm: () => {
            const reason = document.getElementById('cancellationReason').value.trim();
            const year = document.getElementById('assemblyYear').value.trim();
            const assembly_number = document.getElementById('assemblyNumber').value.trim();

            if (!reason) {
                Swal.showValidationMessage('Please enter a cancellation reason');
            }
            if (!year || !/^\d{4}$/.test(year)) {
                Swal.showValidationMessage('Please enter a valid 4-digit assembly year');
            }
            if (!assembly_number) {
                Swal.showValidationMessage('Please enter an assembly number');
            }

            return {reason, year, assembly_number};
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { reason, year, assembly_number } = result.value;
            $.ajax({
                url: './php/secretary_cancel.php',
                type: 'POST',
                data: { 
                    thesis_id: thesisId, 
                    reason: reason, 
                    assembly_year: year,
                    assembly_number: assembly_number,
                    user_id: sec_id 
                },
                dataType: 'json',
                success: function (response) {
                    if (response.success) {
                        Swal.fire('Success', 'Thesis assignment cancelled', 'success');
                        loadThesesManagement();
                    } else {
                        Swal.fire('Error', response.error || 'Failed to cancel assignment', 'error');
                    }
                }
            });
        }
    });
}


function markAsCompleted(thesisId) {
    Swal.fire({
        title: 'Mark as Completed',
        text: 'Are you sure you want to mark this thesis as completed?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f59e0B',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: './php/secretary_completed.php',
                type: 'POST',
                data: { thesis_id: thesisId },
                success: function (response) {
                    if (response.success) {
                        Swal.fire('Success', 'Thesis marked as completed', 'success');
                        loadThesesManagement();
                    } else {
                        Swal.fire('Error', 'Failed to mark as completed', 'error');
                    }
                }
            });
        }
    });
}
