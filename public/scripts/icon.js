    const userIcon = document.getElementById('userIcon');
        const userDropdown = document.getElementById('userDropdown');
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const navMenu = document.getElementById('navMenu');

        if (userIcon) {
            userIcon.addEventListener('click', () => {
                userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
            });

            document.addEventListener('click', (e) => {
                if (!userIcon.contains(e.target) && !userDropdown.contains(e.target)) {
                    userDropdown.style.display = 'none';
                }
            });
        }

        if (hamburgerMenu) {
            hamburgerMenu.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburgerMenu.classList.toggle('active');

                if (navMenu.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = 'auto';
                }
            });
        }

        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') &&
                !hamburgerMenu.contains(e.target) &&
                !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburgerMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 640) {
                navMenu.classList.remove('active');
                hamburgerMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });