    //project data
    const PROJECTS_DATA = [
        {
            id: 1,
            title: "Portfolio Website",
            description: "A beautiful portfolio showcasing my work",
            image: "https://i.redd.it/obvqaa0lhn841.jpg",
            link: "https://example.com/portfolio"
        },
        {
            id: 2,
            title: "E-commerce App",
            description: "Full-stack shopping application",
            image: "https://images.news18.com/ibnlive/uploads/2023/05/untitled-2023-05-23t161255.209.jpg",
            link: "https://example.com/ecommerce"
        },
        {
            id: 3,
            title: "Weather Dashboard",
            description: "Real-time weather information",
            image: "https://pbs.twimg.com/media/GRFkLbvXEAAQtVY.jpg",
            link: "https://example.com/weather"
        }
    ];

    // initialization
    document.addEventListener('DOMContentLoaded', () => {
        const header = document.querySelector('header');
        setTimeout(() => {
            header.style.transform = 'translateY(0)';
        }, 2000);
        
        loadProjects();
        loadYouTubeVideos();
    });

    // =header scroll
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    const SCROLL_THRESHOLD = 5;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (Math.abs(lastScrollTop - currentScroll) <= SCROLL_THRESHOLD) return;
        
        if (currentScroll > lastScrollTop) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollTop = currentScroll;
    }, { passive: true });

    // navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const headerOffset = 80;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    // carousel scroll
    function scrollCarousel(gridId, direction) {
        const grid = document.getElementById(gridId);
        const scrollAmount = 320;
        grid.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    }

    // projects
    function loadProjects() {
        const grid = document.getElementById('project-grid');
        grid.innerHTML = '';
        
        PROJECTS_DATA.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.onclick = () => window.open(project.link, '_blank');
            
            card.innerHTML = `
                <img src="${project.image}" alt="${project.title}" class="project-cover" 
                     onerror="this.src='https://via.placeholder.com/300x200/d81b60/ffffff?text=Image+Error'">
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                </div>
            `;
            
            grid.appendChild(card);
        });
    }

    // youtube
    async function loadYouTubeVideos() {
        const grid = document.getElementById('video-grid');
        
        try {
            // netlify functions
            const response = await fetch('/.netlify/functions/youtube');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            grid.innerHTML = '';
            
            if (data.items && data.items.length > 0) {
                data.items.forEach(item => {
                    const iframe = document.createElement('iframe');
                    iframe.src = `https://www.youtube.com/embed/${item.id.videoId}`;
                    iframe.loading = 'lazy';
                    iframe.frameBorder = '0';
                    iframe.allowFullscreen = true;
                    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                    grid.appendChild(iframe);
                });
            } else {
                grid.innerHTML = '<p class="loading">No videos found</p>';
            }
        } catch (error) {
            console.error('YouTube Loading Error:', error);
            grid.innerHTML = '<p class="loading">Unable to load videos. Please try again later.</p>';
        }
    }