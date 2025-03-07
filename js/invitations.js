let user_id;
let thesis_id;
$(document).ready(function () {
    const logged_user = JSON.parse(localStorage.getItem("logged_user"));
    user_id = logged_user[0].user_id; 
    if (logged_user[0].role != 'tutor') { 
        window.location.replace('404.html');
    }
    
    loadInvitations(user_id);
});

function loadInvitations(user_id) { //load all pending invitations for 3-member commitee
    $.ajax({
        url: './php/tutor_invitations.php',
        type: 'POST',
        data: { user_id: user_id },
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                if (response.data.length == 0){
                    setTimeout(() => {
                        Swal.fire({
                            icon: 'info',
                            title: 'Not found!',
                            text: 'There are no pending invitations!',
                            confirmButtonColor: '#f39c12'
                        });
                    }, 1000);
                }
                populateInvitations(response.data);
                thesis_id = response.data[0].thesis_id;
            } else {
                $('#invitationsList').html('<p class="text-gray-500">No invitations found.</p>');
            }
        }
    });
}

function populateInvitations(invitations) {
    const invitationsList = $('#invitationsList');
    invitationsList.empty();

    invitations.forEach(invitation => {
        // Create action buttons for accepting or rejecting the invitation
        const actionButtons = `
            <button class="bg-yellow-500 hover:bg-green-600 text-white py-2 px-4 rounded font-semibold" onclick="handleInvitation(${invitation.id}, 'accept')">Accept</button>
            <button class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded font-semibold" onclick="handleInvitation(${invitation.id}, 'reject')">Reject</button>
        `;
        const listItem = `
           <div class="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
                <div class="flex justify-between items-center space-x-6">
                    <!-- Left Section with Thesis Info -->
                    <div class="flex-1">
                        <h3 class="font-bold text-yellow-700 text-l mb-2">Thesis: ${invitation.title}</h3>
                       <p class="text-gray-700 mb-2 text-sm">
                        <span class="font-semibold">Student AM:</span> 
                        <span class="font-semibold text-gray-800">${invitation.student_AM}</span>
                        </p>
                        <p class="text-gray-700 mb-2 text-sm">
                        <span class="font-semibold">Student Name:</span> 
                        <span class="font-semibold text-gray-800">${invitation.info}</span>
                        </p>
                    </div>
                    <div class="space-x-4">
                        ${actionButtons}
                    </div>
                </div>
                <!-- Abstract Section as an inner card -->
                <div class="bg-gray-50 p-4 mt-4 rounded-lg shadow-inner hover:bg-gray-100 transition-colors duration-200">
                    <h4 class="font-semibold text-gray-800 mb-2">Abstract:</h4>
                    <p class="text-gray-600 text-justify">${invitation.abstract}</p>
                </div>
            </div>
        `;
        invitationsList.append(listItem);
    });
}

function handleInvitation(id, action) {
    if (action == 'accept'){
        $.ajax({
            url: './php/accept_invitation.php',
            type: 'POST',
            data: { id: id, 
                    action: action,
                    user_id: user_id },
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Accepted!',
                        text: 'Invitation accepted!',
                        confirmButtonColor: '#28a745'
                    });
                    loadInvitations(user_id);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Could not accept the invitation!',
                        confirmButtonColor: '#28a745'
                    });
                }
            }
        });

        $.ajax({
            url: './php/update_cosupervisor.php',
            type: 'POST',
            data: {id: id, thesis_id: thesis_id, user_id},
            dataType: 'json',
            success: function (response) {
            }
        });


    }
    else if (action == 'reject'){
        $.ajax({
            url: './php/reject_invitation.php',
            type: 'POST',
            data: { id: id, user_id: user_id},
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Rejected!',
                        text: 'Invitation rejected!',
                        confirmButtonColor: '#f39c12'
                    });
                    loadInvitations(user_id);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Could not accept the invitation!',
                        confirmButtonColor: '#28a745'
                    });
                }
            }
        });
    }
    
}
