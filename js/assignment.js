$(document).ready(function () {
    const logged_user = JSON.parse(localStorage.getItem("logged_user"));
    const student_AM = logged_user[0].AM;
    const thesis_id = logged_user[0].thesis_id;
    
    loadInstructors(thesis_id);
    loadInvitationsStatus(student_AM, thesis_id);
});

// Load instructors into the dropdowns
function loadInstructors(thesis_id) {
    console.log("Loading instructors for Thesis ID:", thesis_id);
    
    $.ajax({
        url: './php/get_tutors.php',
        type: 'POST',
        dataType: 'json',
        data: { thesis_id: thesis_id },
        success: function (response) {
            console.log("Response from server:", response);
            
            if (response.success) {
                // Populate dropdowns with the tutors list while checking for existing invitations
                populateDropdown('#coSupervisor1Dropdown', response.tutors, response.theses, thesis_id);
                populateDropdown('#coSupervisor2Dropdown', response.tutors, response.theses, thesis_id);
            } else {
                console.error('Failed to load tutors:', response.error);
            }
        }
    });
}

function populateDropdown(selector, tutors, theses, thesis_id) {
    const dropdown = $(selector);
    dropdown.empty();
    if (!thesis_id) {
        dropdown.prop('disabled', true);
        dropdown.append('<option value="">No thesis selected</option>');
        return;
    } else {
        dropdown.prop('disabled', false); 
    }

    dropdown.append('<option value="">Select</option>');

    const currentThesis = theses.find(thesis => thesis.thesis_id === String(thesis_id)); // Find the thesis entry for the current thesis_id
    tutors.forEach(tutor => {
        const isInvited = currentThesis && ( 
            currentThesis.co_supervisor1_id === tutor.user_id ||
            currentThesis.co_supervisor2_id === tutor.user_id
        );
        const optionDisabled = isInvited ? 'disabled' : '';
        const labelSuffix = isInvited ? ' - Invitation already sent' : '';

        dropdown.append(
            `<option value="${tutor.user_id}" ${optionDisabled}>
            ${tutor.name} ${tutor.surname} - ${tutor.department}${labelSuffix}
            </option>`
        );
    });
}


// Send invitation based on the role
function sendInvitation(role) {
    let tutor_id;
    if (role === 'supervisor') {
        tutor_id = $('#supervisorDropdown').val();
    } else if (role === 'co-supervisor1') {
        tutor_id = $('#coSupervisor1Dropdown').val();
    } else if (role === 'co-supervisor2') {
        tutor_id = $('#coSupervisor2Dropdown').val();
    }

    const student_AM = JSON.parse(localStorage.getItem("logged_user"))[0].AM;
    const thesis_id = JSON.parse(localStorage.getItem("logged_user"))[0].thesis_id;

    if (!tutor_id) {
        Swal.fire('Error', 'Please select an instructor to invite.', 'error');
        return;
    }

    $.ajax({
        url: './php/send_invitation.php',
        type: 'POST',
        data: {
            tutor_id: tutor_id,
            role: role,
            student_AM: student_AM,
            thesis_id: thesis_id
        },
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                Swal.fire('Success', `Invitation sent successfully!`, 'success');
                loadInvitationsStatus(student_AM, thesis_id);
                loadInstructors(thesis_id);
            } else {
                Swal.fire('Error', response.error || 'Failed to send invitation.', 'error');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error sending invitation:', error);
        }
    });
}

// Load the status of invitations
function loadInvitationsStatus(student_AM, thesis_id) {
    $.ajax({
        url: './php/get_invitations.php',
        type: 'GET',
        data: { student_AM: student_AM, thesis_id: thesis_id },
        dataType: 'json',
        success: function (data) {
            const invitationStatus = $('#invitationStatus');
            invitationStatus.empty();

            if (data.invitations) {
                const { supervisor, co_supervisor1, co_supervisor2, lastUpdate } = data.invitations;

                // Supervisor status
                if (supervisor) {
                    const supervisorStatus = supervisor.accepted === "1" ? 'Accepted' : 'Pending';
                    if (supervisorStatus === 'Accepted') {
                        $('#sendSupervisorInvitation').prop('disabled', true).addClass('opacity-50 cursor-not-allowed');
                        $('#supervisorDropdown').prop('disabled', true).addClass('opacity-40');
                    }
                    invitationStatus.append(`
                        <li class="p-4 bg-gray-100 rounded shadow-md flex flex-col justify-between items-center space-y-2">
                            <div class="w-full flex justify-between items-center">
                                <span>
                                    <strong>Supervisor:</strong> ${supervisor.name} ${supervisor.surname} - 
                                    <span class="${supervisorStatus === 'Accepted' ? 'text-green-600' : 'text-yellow-600'}">${supervisorStatus}</span>
                                </span>
                                ${supervisorStatus === 'Pending' ? `
                                    <button onclick="cancelInvitation(${supervisor.supervisorId}, 'supervisor')" class="text-red-500 hover:text-red-700 ml-4">
                                        <img src="icons/cancel.png" alt="Cancel">
                                    </button>
                                ` : ''}
                            </div>
                        </li>
                    `);
                }

                // Co-Supervisor 1 status
                if (co_supervisor1 && co_supervisor1.name) {
                    const coSupervisor1Status = co_supervisor1.accepted === "1" ? 'Accepted' : 'Pending';
                    if (coSupervisor1Status === 'Accepted') {
                        $('#sendCoSupervisor1Invitation').prop('disabled', true).addClass('opacity-50 cursor-not-allowed');
                        $('#coSupervisor1Dropdown').prop('disabled', true).addClass('opacity-40');
                    }
                    invitationStatus.append(`
                        <li class="p-4 bg-gray-100 rounded shadow-md flex justify-between items-center">
                            <span>
                                <strong>Co-Supervisor 1:</strong> ${co_supervisor1.name} ${co_supervisor1.surname} - 
                                <span class="${coSupervisor1Status === 'Accepted' ? 'text-green-600' : 'text-yellow-600'}">${coSupervisor1Status}</span>
                            </span>
                            ${coSupervisor1Status === 'Pending' ? `
                                <button onclick="cancelInvitation(${co_supervisor1.coSupervisor1Id}, 'co-supervisor1')" class="text-red-500 hover:text-red-700 ml-4">
                                    <img src="icons/cancel.png" alt="Cancel">
                                </button>
                            ` : ''}
                        </li>
                    `);
                } else {
                    invitationStatus.append(`
                        <li class="p-4 bg-gray-100 rounded shadow-md">
                            <strong>Co-Supervisor 1:</strong> <span class="text-gray-500">Not Assigned</span>
                        </li>
                    `);
                }

                // Co-Supervisor 2 status
                if (co_supervisor2 && co_supervisor2.name) {
                    const coSupervisor2Status = co_supervisor2.accepted === "1" ? 'Accepted' : 'Pending';
                    if (coSupervisor2Status === 'Accepted') {
                        $('#sendCoSupervisor2Invitation').prop('disabled', true).addClass('opacity-50 cursor-not-allowed');
                        $('#coSupervisor2Dropdown').prop('disabled', true).addClass('opacity-40');
                    }
                    invitationStatus.append(`
                        <li class="p-4 bg-gray-100 rounded shadow-md flex justify-between items-center">
                            <span>
                                <strong>Co-Supervisor 2:</strong> ${co_supervisor2.name} ${co_supervisor2.surname} - 
                                <span class="${coSupervisor2Status === 'Accepted' ? 'text-green-600' : 'text-yellow-600'}">${coSupervisor2Status}</span>
                            </span>
                            ${coSupervisor2Status === 'Pending' ? `
                                <button onclick="cancelInvitation(${co_supervisor2.coSupervisor2Id}, 'co-supervisor2')" class="text-red-500 hover:text-red-700 ml-4">
                                    <img src="icons/cancel.png" alt="Cancel">
                                </button>
                            ` : ''}
                        </li>
                    `);
                } else {
                    invitationStatus.append(`
                        <li class="p-4 bg-gray-100 rounded shadow-md">
                            <strong>Co-Supervisor 2:</strong> <span class="text-gray-500">Not Assigned</span>
                        </li>
                    `);
                }
                invitationStatus.append(`<div class="text-gray-500 text-sm font-semibold">
                <span><strong>Last Updated:</strong> ${supervisor.lastUpdate || 'N/A'}</span>
                 </div>`);
                
            }
        }
    });
}

// Function to cancel an invitation
function cancelInvitation(tutor_id, role) {
    const student_AM = JSON.parse(localStorage.getItem("logged_user"))[0].AM;
    const thesis_id = JSON.parse(localStorage.getItem("logged_user"))[0].thesis_id;

    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to cancel this invitation?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, cancel it'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: './php/cancel_invitation.php',
                type: 'POST',
                data: { tutor_id, student_AM, thesis_id, role },
                success: function (response) {
                    Swal.fire('Cancelled', 'Invitation has been cancelled.', 'success');
                    loadInvitationsStatus(student_AM, thesis_id);
                },
                error: function (xhr, status, error) {
                    console.error('Error cancelling invitation:', error);
                }
            });
        }
    });
}
