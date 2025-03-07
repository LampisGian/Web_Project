function setupDropdown(menuId, dropdownId) {
            const menu = document.getElementById(menuId);
            const dropdown = document.getElementById(dropdownId);

            menu.addEventListener('mouseenter', () => {
                dropdown.classList.remove('hidden');
            });

            dropdown.addEventListener('mouseenter', () => {
                dropdown.classList.remove('hidden');
            });
            menu.addEventListener('mouseleave', (e) => {

                setTimeout(() => {
                    if (!menu.matches(':hover') && !dropdown.matches(':hover')) {
                        dropdown.classList.add('hidden');
                    }
                }, 50);
            });

            dropdown.addEventListener('mouseleave', (e) => {
                setTimeout(() => {
                    if (!menu.matches(':hover') && !dropdown.matches(':hover')) {
                        dropdown.classList.add('hidden');
                    }
                }, 50);
            });
        }
        setupDropdown('dashboardMenu', 'dashboardDropdown');
        setupDropdown('thesesMenu', 'thesesDropdown');
        setupDropdown('studentsMenu', 'studentsDropdown');