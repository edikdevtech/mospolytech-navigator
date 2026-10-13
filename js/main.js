document.addEventListener('DOMContentLoaded', () => {
    // 1. Управление темой
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // 2. Анимация шарика за мышкой (с исправлением "прыжка")
    const follower = document.querySelector('.cursor-follower');
    if (follower && window.innerWidth > 768) {
        // Скрываем курсор при загрузке
        follower.style.opacity = '0';
        
        let isFirstMove = true;
        document.addEventListener('mousemove', (e) => {
            if (isFirstMove) {
                follower.style.opacity = '0.7'; // Плавно показываем при первом движении
                isFirstMove = false;
            }
            follower.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
        });

        // Скрываем, если мышь ушла с окна (например, переключение вкладки)
        document.addEventListener('mouseleave', () => {
            follower.style.opacity = '0';
            isFirstMove = true;
        });
    }
});