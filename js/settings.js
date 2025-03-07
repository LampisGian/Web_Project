$(document).ready(function() {
    const logged_user = JSON.parse(localStorage.getItem("logged_user"));
    const user_id = logged_user[0].user_id;
    loadSettings(user_id);
    loadDepartments();
});

function loadSettings(user_id) {
    $.ajax({
        url: './php/get_settings.php',
        type: 'GET',
        data: { user_id: user_id }, 
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                if (data.settings.department){$('#departmentDiv').addClass("hidden");}
                $('#department').val(data.settings.department);
                $('#specialization').val(data.settings.specialization); 
                $('#address').val(data.settings.address);
                $('#email').val(data.settings.email);
                $('#mobile').val(data.settings.mobile);
                $('#phone').val(data.settings.phone);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to load settings',
                    confirmButtonColor: '#d97706'
                });
            }
        }
    });
}

function updateSetting(setting) {
    const logged_user = JSON.parse(localStorage.getItem("logged_user"));
    const user_id = logged_user[0].user_id;
    const value = $(`#${setting}`).val();

    $.ajax({
        url: './php/update_settings.php',
        type: 'POST',
        data: { setting, value, user_id },
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: `${setting.charAt(0).toUpperCase() + setting.slice(1)} updated successfully.`,
                    confirmButtonColor: '#d97706'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to update setting. Please try again.',
                    confirmButtonColor: '#d97706'
                });
            }
        }
    });
}

function loadDepartments() {
    $.ajax({
        url: './php/get_departments.php',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                const departments = response.departments;
                let departmentOptions = '<option value="">Select Department</option>';
                departments.forEach(department => {
                    departmentOptions += `<option value="${department}">${department}</option>`;
                });
                $('#department').html(departmentOptions);
            } else {
                console.error('Failed to load departments:', response.error);
            }
        }
    });
}

function updateTutorInfo(field) {
    const user_id = JSON.parse(localStorage.getItem("logged_user"))[0].user_id;
    let value = '';

    if (field === 'department') {
        value = $('#department').val().trim();
    } else if (field === 'specialization') {
        value = $('#specialization').val().trim();
    }

    if (!value) {
        Swal.fire('Error', `Please enter a valid ${field}`, 'warning');
        return;
    }
    console.log(user_id,value);
    $.ajax({
        url: './php/update_tutor.php',
        type: 'POST',
        data: { user_id, [field]: value },
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                Swal.fire('Success', `${field} updated successfully`, 'success');
            } else {
                Swal.fire('Error', response.error || `Failed to update ${field}`, 'error');
            }
        },
        error: function() {
            Swal.fire('Error', 'AJAX request failed', 'error');
        }
    });
}
