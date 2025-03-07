let user_id, selectedThesisId;
let thesesData = [];
let thesisData = [];
$(document).ready(function () {
    const logged_user = JSON.parse(localStorage.getItem("logged_user"));
    user_id = logged_user[0].user_id;
    if (logged_user[0].role != 'tutor') { 
        window.location.replace('404.html');
    }
    
    loadTheses(user_id);
    $('#statusFilter, #roleFilter').on('change', function () {
        loadTheses(user_id);
    });
});

 function loadTheses(userId) {
    const status = $('#statusFilter').val();
    const role = $('#roleFilter').val();

    $.ajax({
        url: './php/theses_supervising.php',
        type: 'GET',
        data: { status: status, role: role, user_id: userId },
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                thesesData = response.theses;
                displayTheses(thesesData);
            } else {
                $('#thesisList').html('<p class="text-gray-600">No theses found.</p>');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error fetching theses:', error);
        }
    });
}

// Function to display the list of theses
function displayTheses(theses) {
    const thesisList = $('#thesisList');
    thesisList.empty();
    theses.forEach(thesis => {
        thesisData = thesis;
        console.log(thesisData);
        let gradingButton = '';
        let inProgressButton = '';
        let generatePdfButton= '';
        if (thesis.status === 'under review') {
            gradingButton = `
                <button class="grade-btn bg-gray-800 hover:bg-gray-900 text-white py-1 px-3 rounded font-semibold mt-2 self-start"
                    onclick="openGradingModal(${thesis.thesis_id})">
                    Grade Thesis
                </button>`;
        }
        if (thesis.status === 'under assignment' && thesis.co_supervisor1_id && thesis.co_supervisor2_id && thesis.supervisor_id == user_id) {
            inProgressButton = `
                <button class="inProgress-btn bg-blue-800 hover:bg-blue-900 text-white py-1 px-3 rounded font-semibold mt-2 self-start tooltip"
                    onclick="markInProgress(${thesis.thesis_id})">
                    Mark in progress
                    <span class="tooltip-text">All co-supervisors have accepted. Do you want to mark this as in progress?</span>
                </button>`;
        }

        if (thesis.status === 'under review' && thesis.supervisor_grade > 0 && thesis.co_supervisor1_grade > 0 && thesis.co_supervisor2_grade > 0 && (thesis.venue || thesis.link) && thesis.supervisor_id == user_id) {
            
            generatePdfButton = `
                <button class="generate-pdf-btn bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded font-semibold mt-2 self-start"
                    onclick='generatePDF(${JSON.stringify(thesis)})'>
                    Generate PDF
                </button>`;
        }
        
        if (thesis.student_id){

            const thesisCard = `
                <div class="thesis-card bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between h-full" data-id="${thesis.thesis_id}">
                <div>
                        <h3 class="font-bold text-yellow-700 text-lg">${thesis.title}</h3>
                        <p><span class="font-semibold text-gray-600">Student ID:</span> <span class="text-yellow-600">${thesis.student_name} - AM:${thesis.student_id || 'N/A'}</span></p>
                        <p><span class="font-semibold text-gray-600">Status:</span> <span class="text-yellow-600">${thesis.status}</span></p>
                        <p><span class="font-semibold text-gray-600">Role:</span> <span class="text-yellow-600">${thesis.role}</span></p>
                        
                        <!-- Supervisor Grade and Detailed Grade -->
                        <p><span class="font-semibold text-gray-600">Supervisor Grade:</span> 
                            <span class="text-yellow-600">
                                ${thesis.supervisor_grade}
                            </span>
                        <span class="font-semibold text-gray-600">In detail:</span> 
                            <span class="text-yellow-600">
                                ${thesis.sup_detailed_grade && thesis.sup_detailed_grade !== 'null' ? thesis.sup_detailed_grade : 'Not graded yet!'}
                            </span>
                        </p>
                        <p><span class="font-semibold text-gray-600">Co Supervisor Grade 1:</span> 
                            <span class="text-yellow-600">
                                ${thesis.co_supervisor1_grade}
                            </span>
                            <span class="font-semibold text-gray-600">In detail:</span> 
                            <span class="text-yellow-600">
                                ${thesis.co_sup1_detailed_grade && thesis.co_sup1_detailed_grade !== 'null' ? thesis.co_sup1_detailed_grade : 'Not graded yet!'}
                            </span>
                        </p>
                        <p><span class="font-semibold text-gray-600">Co Supervisor Grade 2:</span> 
                            <span class="text-yellow-600">
                                ${thesis.co_supervisor2_grade}
                            </span>
                        <span class="font-semibold text-gray-600">In detail:</span> 
                            <span class="text-yellow-600">
                                ${thesis.co_sup2_detailed_grade && thesis.co_sup2_detailed_grade !== 'null' ? thesis.co_sup2_detailed_grade : 'Not graded yet!'}
                            </span>
                        </p>

                        <!-- Announcement -->
                        <p><span class="font-semibold text-gray-600">Announcement:</span> 
                            <span class="text-yellow-600">${thesis.announcement_text || 'No announcement yet!'}</span>
                        </p>
                    </div>

                    <button class="view-details-btn bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded font-semibold mt-2 self-start">
                        View Details
                    </button>
                    ${gradingButton}
                    ${inProgressButton}
                    ${generatePdfButton}
                </div>`;
            thesisList.append(thesisCard);
        }
    });
}


// Event delegation for "View Details" button
$('#thesisList').on('click', '.view-details-btn', function () {
    const thesisId = $(this).closest('.thesis-card').data('id');
    const thesis = thesesData.find(t => t.thesis_id == thesisId);
    const finalGrade = (thesis.co_sup1_detailed_grade && thesis.co_sup2_detailed_grade) ? thesis.final_grade : 'Not completed and not fully graded yet!';
    if (thesis) {
        console.log("thesis data",thesis);
        loadReviewDetails(thesis.thesis_id)
        $('#modalTitle').html(`<a href="./tutor.html" target="_blank">${thesis.title}</a>`);
        $('#modalContent').html(`
            <p><strong>Abstract:</strong> ${thesis.abstract}</p>
            <p><strong>Student:</strong> ${thesis.student_name} - ${thesis.student_id || 'N/A'}</p>
            <p><strong>Committee:</strong> ${thesis.supervisor_name}, ${thesis.co_supervisor1_name || 'not assigned'}, ${thesis.co_supervisor2_name || 'not assigned'}</p>
            <p><strong>Status:</strong> ${thesis.status}</p>
            <p><strong>Venue:</strong> ${thesis.venue || 'N/A'}</p>
            <p><strong>Final Grade:</strong> ${finalGrade}</p>
            <p><strong>Library Link:</strong> ${thesis.library_link ? `<a href="${thesis.library_link}" target="_blank" class="text-yellow-500"><i class="fa-solid fa-link"></i></a>` : 'N/A'}</p>
            ${thesis.status === 'under review' && thesis.draft_file ? `
                <p><strong>Draft File:</strong> 
                    <i class="fa-solid fa-file text-yellow-500 cursor-pointer" onclick="viewFileModal('${thesis.draft_file}', 'Draft File')"></i>
                </p>
            ` : ''}
            <p><strong>Report File:</strong> ${thesis.evaluation_report ? 
                `<i class="fa-solid fa-newspaper text-yellow-500 cursor-pointer" onclick="viewFileModal('${thesis.evaluation_report}', 'Report File')"></i>` : 
                'N/A'}</p>
                <div class="timeline">
                    <h3 class="text-xl font-semibold text-yellow-700 mb-4 text-center">Status Timeline</h3>
                    <ul id="statusTimeline" class="horizontal-timeline text-gray-700 text-sm">
                    </ul>
                </div>
        `);
        openModal();

        if ((thesis.venue || thesis.link) && thesis.status == 'under review' && thesis.supervisor_id == user_id) { // the announcement for the presentation
            $('#modalContent').append(`
                <label class="block text-gray-700 font-semibold mb-2"> <p><strong>Presentation Date:</strong> ${thesis.presentation_date}</p></label>
                <input type="text" id="announcementText" class="font-semibold p-2 w-1/2 border border-yellow-400 rounded-md mb-4" placeholder="Write the announcement text" />
                <button id="generateAnnouncementBtn" class="bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 px-4 mt-4 rounded shadow">
                    Generate Announcement
                </button>

            `);
        }

        openModal();

        $('#generateAnnouncementBtn').on('click', function () {
            generateAnnouncement(thesis);
        });
        }
});


function openModal() { // view details modal
    $('#thesisModal2').removeClass('hidden');
}

$('#closeModalBtn').on('click', function () {
    $('#thesisModal2').addClass('hidden');
});

function generateAnnouncement(thesis) {
    const announcementText = $('#announcementText').val().trim();

    if (!announcementText) {
        Swal.fire({
            icon: 'warning',
            title: 'Missing Information',
            text: 'Please select a thesis, date/time, and write an announcement.',
            confirmButtonColor: '#f39c12'
        });
        return;
    }

    // Send the data to save in the database
    $.ajax({
        url: './php/presentation_announcement.php',
        type: 'POST',
        data: {
            thesis_id: thesis.thesis_id,
            announcement_text: announcementText
        },
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Announcement Saved',
                    text: 'The presentation details have been saved successfully.',
                    confirmButtonColor: '#28a745'
                });
                clearFormFields();
                loadTheses(user_id);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.error || 'Failed to save the presentation details.',
                    confirmButtonColor: '#d33'
                });
            }
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: 'AJAX Error',
                text: 'An error occurred while saving the presentation details.',
                confirmButtonColor: '#d33'
            });
        }
    });
}


// Export to CSV
$('#exportToCSV').on('click', function () {
    if (!thesesData || thesesData.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'No Data',
            text: 'No data available to export.',
            confirmButtonColor: '#f39c12'
        });
        return;
    }

    Swal.fire({
        icon: 'question',
        title: 'Export to CSV',
        text: 'You are about to download the data as a CSV file',
        showCancelButton: true,
        confirmButtonText: 'Download',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33'
    }).then((result) => {
        if (result.isConfirmed) {
            let csvContent = "data:text/csv;charset=utf-8,";
            const headers = Object.keys(thesesData[0]);
            csvContent += headers.join(",") + "\n";

            thesesData.forEach(row => {
                const values = headers.map(header => row[header] !== null ? `"${row[header]}"` : "");
                csvContent += values.join(",") + "\n";
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "theses_data.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            Swal.fire({
                icon: 'success',
                title: 'Downloaded!',
                text: 'CSV file has been downloaded.',
                confirmButtonColor: '#28a745'
            });
        }
    });
});

// Export to JSON
$('#exportToJSON').on('click', function () {
    if (!thesesData || thesesData.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'No Data',
            text: 'No data available to export.',
            confirmButtonColor: '#f39c12'
        });
        return;
    }

    Swal.fire({
        icon: 'question',
        title: 'Export to JSON',
        text: 'You are about to download the data as a JSON file',
        showCancelButton: true,
        confirmButtonText: 'Download',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33'
    }).then((result) => {
        if (result.isConfirmed) {
            const jsonContent = JSON.stringify(thesesData, null, 2);
            const blob = new Blob([jsonContent], { type: "application/json" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "theses_data.json";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            Swal.fire({
                icon: 'success',
                title: 'Downloaded!',
                text: 'JSON file has been downloaded.',
                confirmButtonColor: '#28a745'
            });
        }
    });
});

function clearFormFields() {
    document.getElementById('presentationDateTime').value = '';
    document.getElementById('announcementText').value = '';
}

function openGradingModal(thesisId) {
    selectedThesisId = thesisId;
    $('#gradingModal').removeClass('hidden');
}

// Function to close the grading modal
function closeGradingModal() {
    $('#gradingModal').addClass('hidden');
}

function saveGrades() {
    const thesisId = selectedThesisId; // Use the globally stored thesis ID
    const criteria = {
        criteria1: parseFloat($('#criteria1').val()) || 0,
        criteria2: parseFloat($('#criteria2').val()) || 0,
        criteria3: parseFloat($('#criteria3').val()) || 0,
        criteria4: parseFloat($('#criteria4').val()) || 0
    };
    // Calculate total grade
    const totalGrade = (criteria.criteria1 * 0.6) + 
                   (criteria.criteria2 * 0.15) + 
                   (criteria.criteria3 * 0.15) + 
                   (criteria.criteria4 * 0.1);
    const normalizedGrade = Math.round(totalGrade * 2) / 2;

    if (isNaN(normalizedGrade)) {
        Swal.fire({
            icon: 'warning',
            title: 'Invalid Input',
            text: 'Please enter valid grades for all criteria.',
            confirmButtonColor: '#d33'
        });
        return;
    }

    $.ajax({
        url: './php/save_grades.php',
        type: 'POST',
        data: {
            thesis_id: thesisId,
            total_grade: normalizedGrade,
            criteria: JSON.stringify(criteria),
            user_id: user_id
        },
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Grades Saved',
                    text: 'The grades have been successfully saved.',
                    confirmButtonColor: '#28a745'
                });
                closeGradingModal();
                loadTheses(user_id);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.error || 'Failed to save grades.',
                    confirmButtonColor: '#d33'
                });
            }
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: 'AJAX Error',
                text: 'An error occurred while saving the grades.',
                confirmButtonColor: '#d33'
            });
        }
    });
}


function markInProgress(thesisId) {
    Swal.fire({
        title: 'Mark in progress',
        text: "Do you want to mark this thesis as in progress?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#F59E0B',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, mark it'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: './php/mark_in_progress.php',
                type: 'POST',
                data: { thesis_id: thesisId },
                success: function (response) {
                    Swal.fire('In progress', 'Thesis has been marked in progress!', 'success');
                    loadTheses(user_id);
                }
            });
        }
    });  
}

async function generatePDF(thesis) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    if (!thesis) {
        console.error('No thesis data provided');
        return;
    }

    // Extract data from the thesis object
    const studentName = thesis.student_name;
    const supervisor = thesis.supervisor_name;
    const committee1 = thesis.co_supervisor1_name;
    const committee2 = thesis.co_supervisor2_name;
    const thesisTitle = thesis.title;
    const venue = thesis.venue;
    const final_grade = thesis.final_grade;
    const protocol_number = thesis.protocol_number;

    // Format the presentation date
    const presentationDate = thesis.presentation_date ? new Date(thesis.presentation_date) : null;
    let formattedDate = "N/A";

    if (presentationDate) {
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'Apri', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const day = presentationDate.getDate();
        const month = months[presentationDate.getMonth()];
        const year = presentationDate.getFullYear();
        const weekday = weekdays[presentationDate.getDay()];
        const hours = String(presentationDate.getHours()).padStart(2, '0');
        const minutes = String(presentationDate.getMinutes()).padStart(2, '0');

        formattedDate = `${weekday}, ${day} ${month} ${year} and time ${hours}:${minutes}`;
    }

    const grades = [
        parseFloat(thesis.supervisor_grade),
        parseFloat(thesis.co_supervisor1_grade),
        parseFloat(thesis.co_supervisor2_grade)
    ];
    const averageGrade = grades.reduce((a, b) => a + b, 0) / grades.length;

    // Set up the PDF content in English
    doc.setFontSize(12);
    doc.setFont("times", "normal");

    doc.text("STUDY PROGRAM", 105, 20, { align: 'center' });
    doc.text("“DEPARTMENT OF COMPUTER ENGINEERING AND INFORMATICS”", 105, 30, { align: 'center' });

    doc.text("SESSION REPORT", 105, 50, { align: 'center' });
    doc.text("OF THE THREE-MEMBER COMMITTEE", 105, 60, { align: 'center' });
    doc.text("FOR THE PRESENTATION AND EVALUATION OF THE THESIS", 105, 70, { align: 'center' });

    // Student information

    doc.text(`of the Student ${studentName}`, 60, 90);

    doc.text(`The session was held in venue ${venue} on ${formattedDate}`, 30, 100);

    doc.text("Present at the session were the members of the Three-Member Committee:", 20, 110);
    doc.setFont("times", "bold");
    doc.text(`1. ${supervisor}`, 30, 120);
    doc.text(`2. ${committee1}`, 30, 130);
    doc.text(`3. ${committee2}`, 30, 140);
    doc.setFont("times", "normal");
    doc.text("who were appointed by the assembly of the department council with protocol number:", 20, 145);
    doc.setFont("times", "bold");
    doc.text(`${[protocol_number]}`, 20, 150);
    doc.setFont("times", "normal");
    // Add thesis presentation details at the end of the first page
    doc.text(`The student in question presented their thesis on the topic: `, 20, 160);
    doc.setFont("times", "bold");
    doc.text(`“${thesisTitle}”`, 30, 170);


    doc.setFont("times", "normal");

    doc.text("Subsequently, the candidate was questioned by the members of the Committee to form a clear view", 20, 180);
    doc.text("of the content of the thesis and assess the scientific competence of theirs.", 20, 185);

    doc.setFont("times", "bold");
    doc.text(`The supervisor ${supervisor}:`, 20, 195);
    doc.setFont("times", "normal");
    doc.text(`proposes that the Three-Member Committee approve the thesis of ${studentName}`, 20, 200);
    
    const committeeMembers = [
        { name: supervisor, role: "Supervisor" },
        { name: committee1, role: "Committee Member" },
        { name: committee2, role: "Committee Member" }
    ];
    
    const sortedCommittee = committeeMembers.sort((a, b) => {
        const lastNameA = a.name.trim().split(" ").pop();
        const lastNameB = b.name.trim().split(" ").pop();
        return lastNameA.localeCompare(lastNameB);
    });

    doc.text("The Committee members vote in alphabetical order:", 20, 210);
    sortedCommittee.forEach((member, index) => {
        doc.text(`${index + 1}. ${member.name} (${member.role})`, 30, 215 + (index * 5));
    });
    doc.setFont("times", "bold");
    doc.text(`in favor of approving the thesis of ${studentName}, as they consider it`, 20, 240);
    doc.text("scientifically adequate and that its content corresponds to the assigned topic.", 20, 245);

    
    doc.addPage();
    doc.setFont("times", "normal");
    doc.text("Grades:", 20, 40);
    doc.text(`Supervisor: ${thesis.supervisor_grade}`, 30, 45);
    doc.text(`Co-Supervisor 1: ${thesis.co_supervisor1_grade}`, 30, 50);
    doc.text(`Co-Supervisor 2: ${thesis.co_supervisor2_grade}`, 30, 55);

    doc.text(`After approval, the supervisor ${supervisor} proposes to the members of the Three-Member`, 20, 70);
    doc.text(`Committee to award the student ${studentName} with the final grade  ${final_grade}.`, 20, 75);

    doc.text(`After approval and awarding the aforementioned final grade the Three-Member Committee`, 20, 85);
    doc.text(`proposes to proceed with the process of declaring ${studentName} as graduate of the`, 20, 90);
    doc.text(`Study Program of the DEPARTMENT OF COMPUTER ENGINEERING AND INFORMATICS,`, 20, 95);
    doc.text(`UNIVERSITY OF PATRAS and to confer upon them the Diploma of Computer Engineering and`, 20, 100);
    doc.text(`Informatics which is recognized as a Unified Postgraduate Level Degree`, 20, 105);
    

    // Save the PDF locally
    doc.save(`Thesis_${thesis.thesis_id}_Presentation.pdf`);

    // Convert the PDF to a Blob and upload it
    const pdfBlob = doc.output('blob');
    const fileName = `Thesis_${thesis.thesis_id}_Report.pdf`;
    const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

    uploadPDF(file, thesis.thesis_id);
}

// Function to upload the PDF
function uploadPDF(file, thesisId) {
    const formData = new FormData();
    formData.append('pdf', file); 
    formData.append('thesis_id', thesisId);

    $.ajax({
        url: './php/upload_report.php',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            const result = JSON.parse(response);
            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Report created',
                    text: 'The report has be succesfully created!',
                    confirmButtonColor: '#28a745'
                });
            } 
        }
    });
}

function loadReviewDetails(thesis_id) {
       $.ajax({
        url: './php/timeline.php',
        type: 'GET',
        data: { thesis_id: thesis_id },
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                populateStatusTimeline(data.statusTimeline);
            } else {
                console.error('Failed to load thesis status data:', data.error);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error fetching thesis status data:', error);
        }
    });
}


function populateStatusTimeline(statusData) {
    const statusTimeline = $('#statusTimeline');
    statusTimeline.empty();

    const events = [
        { label: 'Creation Date', date: statusData.created_at },
        { label: 'Assign Date', date: statusData.assigned_at },
        { label: 'Last Update', date: statusData.updated_at }
    ];

    // Add each event with a valid date
    events.forEach(event => {
        if (event.date) {
            statusTimeline.append(`
                <li>
                    <p class="time">${new Date(event.date).toLocaleString()}</p>
                    <p>${event.label}</p>
                </li>
            `);
        }
    });

    // Add the current status with special styling
    if (statusData.status) {
        statusTimeline.append(`
            <li class="highlight-status">
                <p class="status-current">${statusData.status}</p>
                <p>Current Status</p>
            </li>
        `);
    }
}


$('#cTheses').on('click', function() {
    $('#cThesesModal').removeClass('hidden');
    $('#modalTitle').text('Cancelled Theses');

    loadCancelledTheses();
});

// Attach event listener to the close button
$('#closecTheses').on('click', function() {
    $('#cThesesModal').addClass('hidden');
});


function loadCancelledTheses() {
$.ajax({
    url: './php/cancelled_theses.php', // Update with the correct server-side script
    type: 'GET',
    data: {user_id: user_id},
    dataType: 'json',
    success: function(response) {
        if (response.success) {
            const theses = response.theses;
            let content = '';
            if (theses.length > 0) {
                theses.forEach(thesis => {
                    content += `
                        <div class="p-4 border border-yellow-500 rounded">
                            <h3 class="text-lg font-bold text-yellow-700">${thesis.title}</h3>
                            <p class="text-gray-600">${thesis.abstract}</p>
                            <p class="text-gray-700 font-semibold">Cancelled by: ${thesis.cancelled_by}</p>
                            <p class="text-gray-500 text-sm">GAN: ${thesis.assembly_number}</p>
                            <p class="text-red-500 text-sm font-semibold">  ${thesis.reason}</p>
                        </div>
                    `;
                });
            } else {
                content = `<p class="text-gray-500">No cancelled theses available.</p>`;
            }

            // Insert content into the modal
            $('#cThesesContent').html(content);
        } else {
            $('#cThesesContent').html(`<p class="text-red-500">Failed to load cancelled theses: ${response.error}</p>`);
        }
    },
    error: function(xhr, status, error) {
        $('#cThesesContent').html(`<p class="text-red-500">Error loading cancelled theses: ${error}</p>`);
    }
});
}

function viewFileModal(fileUrl, fileType) {
    $('#modalTitle').text(fileType);
    $('#modalContent').html(`
        <div class="w-full h-[120vh] bg-gray-100 border border-yellow-500 rounded-md overflow-hidden">
            <iframe src="${fileUrl}" class="w-full h-96" frameborder="0"></iframe>
        </div>
    `);
    $('#mainModal').removeClass('hidden'); // Show the modal
}