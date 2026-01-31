document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    function showSection(targetId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            showSection(targetId);
            
            window.history.pushState(null, '', targetId);
        });
    });

    if (window.location.hash) {
        showSection(window.location.hash);
    }

    window.addEventListener('popstate', function() {
        if (window.location.hash) {
            showSection(window.location.hash);
        } else {
            showSection('#home');
        }
    });
});
