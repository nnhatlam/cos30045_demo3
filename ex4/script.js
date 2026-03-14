document.addEventListener('DOMContentLoaded', () => { // ensures the html is fully loaded before using process any actions
    const navLinks = document.querySelectorAll('.nav-link');  // find all the elements that match the css selector .nav-link, like class
    
    // Function to update active navigation link
    const updateActiveNav = (pageId) => {
        // Remove active class from all nav links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to the matching nav link
        const activeLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    };
    
    const showPage = (pageId) => {
        const currentPage = document.querySelector('.page.active'); // find the current active page
        if (currentPage) {
            currentPage.classList.remove('active'); // hide the current active page
        }
        const pageElement = document.getElementById(pageId);
        if (pageElement) {
            pageElement.classList.add('active'); // show the target page
        }
        updateActiveNav(pageId); // update active nav link
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const targetPageId = link.getAttribute('data-page'); // get the target page id from data-page attribute
            const targetPage = document.getElementById(targetPageId);
            
            // Only prevent default and use SPA navigation if the target page exists in current document
            if (targetPage) {
                event.preventDefault(); // prevent the default link behavior
                history.pushState({ page: targetPageId}, targetPageId, `#${targetPageId}` );
                showPage(targetPageId); // show the target page
            } else {
                // For navigation to separate pages, update active state before navigation
                updateActiveNav(targetPageId);
            }
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.page) {
            showPage(e.state.page);
        } else {
            // Handle initial load or direct access to #hash
            const initialPage = window.location.hash ? window.location.hash.substring(1) : 'home';
            showPage(initialPage);
        }
    });

    // Set initial page on load
    const initialPage = window.location.hash ? window.location.hash.substring(1) : 'home';
    const pageElement = document.getElementById(initialPage);
    if (pageElement) {
        showPage(initialPage);
    } else {
        // If no page element exists (separate HTML files), just update the nav
        updateActiveNav(getCurrentPage());
    }
    
    // Helper function to determine current page from URL
    function getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('televisions.html')) return 'televisions';
        if (path.includes('insights.html')) return 'insights';
        if (path.includes('about.html')) return 'about';
        return 'home';
    }

});
