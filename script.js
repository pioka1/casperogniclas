document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const navPill = document.getElementById('nav-pill');
    const navLinksContainer = document.querySelector('.nav-island > div.relative');

    if (!navLinks.length || !navPill || !navLinksContainer) {
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // 50% of the section must be visible
    };

    const updatePill = (activeLink) => {
        if (!activeLink) {
            navPill.style.opacity = '0';
            return;
        }

        const linkRect = activeLink.getBoundingClientRect();
        const containerRect = navLinksContainer.getBoundingClientRect();
        const paddingX = window.innerWidth < 768 ? 16 : 24;
        const fixedAdditionalSpacing = 6;

        navPill.style.width = `${linkRect.width + paddingX + (fixedAdditionalSpacing * 2)}px`;
        navPill.style.left = `${linkRect.left - containerRect.left - (paddingX / 2) - fixedAdditionalSpacing}px`;
        navPill.style.opacity = '1';
    };

    const observer = new IntersectionObserver((entries) => {
        let activeLink = null;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (entry.target.id !== 'home' && link) {
                    activeLink = link;
                }
            }
        });

        navLinks.forEach(navLink => navLink.classList.remove('active'));

        if (activeLink) {
            activeLink.classList.add('active');
            updatePill(activeLink);
        } else {
            // If no specific section is active, maybe we are at the top.
            // Check if home section is visible.
            const homeEntry = entries.find(e => e.target.id === 'home');
            if (homeEntry && homeEntry.isIntersecting) {
                 navPill.style.opacity = '0';
            } else if (!document.querySelector('.nav-link.active')) {
                 navPill.style.opacity = '0';
            }
        }

    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    window.addEventListener('resize', () => {
        const activeLink = document.querySelector('.nav-link.active');
        updatePill(activeLink);
    });
});