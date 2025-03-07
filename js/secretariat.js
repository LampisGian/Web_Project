$(document).ready(function () {
    if (JSON.parse(localStorage.getItem("logged_user"))[0].role != 'secretariat') { 
        window.location.replace('404.html');
    }
    loadStats();
    loadThesesDetails();
});

function loadStats() {
    $.ajax({
        url: './php/secretary_stats.php',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                // Call functions to populate the data
                updateStudentsCount(response.students);
                updateTutorsList(response.tutors);
                updateThesesCount(response.theses);
                updateAnnouncementsList(response.announcements);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.error || 'Failed to fetch data',
                    confirmButtonColor: '#d33'
                });
            }
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: 'AJAX Error',
                text: 'An error occurred while fetching the report',
                confirmButtonColor: '#d33'
            });
        }
    });
}

function updateStudentsCount(students) {
    $('#totalStudents').text(students);
}

// Function to update the list of active tutors
function updateTutorsList(tutors) {
    let tutorsHTML = '';
    tutors.forEach(tutor => {
        tutorsHTML += `
            <div class="tutor-item bg-gray-100 p-2 mb-2 rounded shadow-sm inline-block transform transition-all duration-200 hover:-translate-y-1 hover:shadow-md self-start tooltip">
                <i class="fa-solid fa-chalkboard-user fa-flip" style="color: #FFD43B;"></i> ${tutor.tutor_name}
                 <span class="tooltip-text">${tutor.department} - ${tutor.specialization}</span>
            </div>`;
    });
    $('#activeTutors').html(tutorsHTML);
}

function updateThesesCount(theses) {
    let totalTheses = 0;
    let statusHTML = '';

    theses.forEach(thesis => {
        const status = thesis.status || 'Other';
        const count = thesis.total;
        totalTheses += parseInt(count);
        statusHTML += `
            <p class="status-item">
                <strong>${status}:</strong> ${count}
            </p>`;
    });

    $('#activeTheses').html(`
        <span class="inline-block text-3xl font-bold text-gray-800 mr-4">${totalTheses}</span>
        <span class="inline-block">${statusHTML}</span>
    `);
}

function updateAnnouncementsList(announcements) {
    let announcementsHTML = '';
    announcements.forEach(announcement => {
        announcementsHTML += `
            <div class="announcement-item bg-blue-50 p-3 mb-2 rounded shadow-sm tooltip">
               <i class="fa-solid fa-scroll fa-flip-horizontal" style="color: #FFD43B;"></i></i> ${announcement.announcement_text}
                 <span class="tooltip-text"> Thesis ID: ${announcement.thesis_id} - Title: ${announcement.title}</span>
            </div>`;
    });

    $('#announcementsList').html(announcementsHTML || '<p class="text-gray-500">No announcements available</p>');
}

let thesesData = []; 
function loadThesesDetails() {
    $.ajax({
        url: './php/secretary_theses.php',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                thesesData = response.theses;
                displayThesesDetails(thesesData);
            } else {
                $('#thesesDetailsCard').html('<p class="text-gray-600">No active or under review theses found.</p>');
            }
        }
    });
}

function displayThesesDetails(theses) {
    const thesesContainer = $('#thesesDetailsCard');
    thesesContainer.empty();

    if (theses.length === 0) {
        thesesContainer.html('<p class="text-gray-600">No active or under review theses found.</p>');
        return;
    }

    theses.forEach(thesis => {
        const thesisItem = `
            <div class="thesis-detail-item bg-gray-100 hover:bg-gray-200 p-4 rounded shadow mb-2 cursor-pointer"
                onclick="showThesisDetails(${thesis.thesis_id})">
                <h3 class="font-bold text-lg text-yellow-700">${thesis.title}</h3>
                <p class="text-gray-600">Status: <span class="text-yellow-600">${thesis.status}</span></p>
            </div>
        `;
        thesesContainer.append(thesisItem);
    });
}

function showThesisDetails(thesisId) {
    const thesis = thesesData.find(t => t.thesis_id == thesisId);
    const finalGrade = (thesis.co_sup1_detailed_grade && thesis.co_sup2_detailed_grade) ? thesis.final_grade : 'Not fully graded yet';
    $('#modalTitle').text(thesis.title);
    $('#modalContent').html(`
        <p><strong>Abstract:</strong> ${thesis.abstract}</p>
        <p><strong>Status:</strong> ${thesis.status}</p>
        <h3 class="text-yellow-500 font-semibold mt-6"> Three Member Comitee </h3>
        <ul class="ml-6">
            <li><i class="fa-solid fa-chalkboard-user fa-xs transform transition-transform duration-300 hover:scale-150" style="color: #FFD43B;"></i> Supervisor: ${thesis.supervisor_name || 'Not Assigned'}</li>
            <li><i class="fa-solid fa-chalkboard-user fa-xs transform transition-transform duration-300 hover:scale-150" style="color: #FFD43B;"></i> Co-Supervisor 1: ${thesis.co_supervisor1_name || 'Not Assigned'}</li>
            <li><i class="fa-solid fa-chalkboard-user fa-xs transform transition-transform duration-300 hover:scale-150" style="color: #FFD43B;"></i> Co-Supervisor 2: ${thesis.co_supervisor2_name || 'Not Assigned'}</li>
        </ul>
        <p class="mt-4"><strong>Final Grade:</strong> ${finalGrade || 'N/A'}</p>
        <p><strong>Library Link:</strong> ${thesis.library_link ? `<a href="${thesis.library_link}" target="_blank" class="text-yellow-400"><i class="fa-sharp-duotone fa-solid fa-book transform transition-transform duration-300 hover:scale-150"></i></a>` : 'N/A'}</p>
        <p><strong>Assigned: ${calculateTimeSinceAssignment(thesis.assigned_at) || 'N/A'}</p>
        `);

    $('#thesisDetailsModal').removeClass('hidden');
}

function closeModal() {
    $('#thesisDetailsModal').addClass('hidden');
}


function calculateTimeSinceAssignment(assignedDate) {
    const now = new Date();
    const assigned = new Date(assignedDate);
    const diffTime = Math.abs(now - assigned);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
}

function importJSON() {
    Swal.fire({
        title: 'Upload JSON File',
        input: 'file',
        inputAttributes: {
            accept: '.json',
            'aria-label': 'Upload your JSON file'
        },
        showCancelButton: true,
        confirmButtonText: 'Upload',
        preConfirm: (file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const formData = new FormData();
                    formData.append('file', file);

                    $.ajax({
                        url: './php/import_JSON.php',
                        type: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function (response) {
                            if (response.success) {
                                Swal.fire('Success', 'Users imported successfully!', 'success');
                                loadStats();
                                loadThesesDetails();
                            } else {
                                Swal.fire('Error', result.error || 'Failed to import users', 'error');
                            }
                        },
                        error: function () {
                            Swal.fire('Error', 'An error occurred while uploading', 'error');
                        }
                    });
                };
                reader.readAsText(file);
            });
        }
    });
}
