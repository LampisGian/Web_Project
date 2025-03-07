$(document).ready(function () {
    const logged_user = JSON.parse(localStorage.getItem("logged_user"));
    const user_id = logged_user[0].user_id;

    if (logged_user[0].role != 'tutor') { 
        window.location.replace('404.html');
    }

    // Fetch statistics data from the server
    function loadStats() {
        $.ajax({
            url: './php/get_stats.php',
            type: 'GET',
            data: { user_id: user_id },
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    const data = response.data;
                    renderCharts(data);
                } else {
                    console.error('Failed to fetch statistics:', response.error);
                }
            },
            error: function (xhr, status, error) {
                console.error('AJAX error:', status, error);
            }
        });
    }

    // Function to render all charts 
    function renderCharts(data) {
        renderBarChart('supervisorChart', 'Avg Completion (Days)', [data.avg_completion_supervisor], '#f59e0b', 'Supervised Theses');
        renderBarChart('committeeChart', 'Avg Completion (Days)', [data.avg_completion_committee], '#10b981', 'Committee Theses');
        renderBarChart('avgGradeSupervisorChart', 'Avg Grade', [data.avg_grade_supervisor], '#3b82f6', 'Supervised Theses');
        renderBarChart('avgGradeCommitteeChart', 'Avg Grade', [data.avg_grade_committee], '#6366f1', 'Committee Theses');
        renderBarChart('totalSupervisedChart', 'Total Theses', [data.total_supervised], '#f97316', 'Supervised Theses');
        renderBarChart('totalCommitteeChart', 'Total Theses', [data.total_committee], '#34d399', 'Committee Theses');
    }

    // Function to render individual bar charts
    function renderBarChart(elementId, label, data, color, chartLabel) {
        const ctx = document.getElementById(elementId).getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [chartLabel],
                datasets: [{
                    label: label,
                    data: data,
                    backgroundColor: color,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
    loadStats();
});
