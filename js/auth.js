console.log("✅ Файл auth.js успешно загружен");

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('auth-modal');
    const closeBtn = document.querySelector('.modal__close');
    const profileLink = document.getElementById('profile-link');
    
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    console.log("🔍 Найдена ссылка профиля:", profileLink);
    console.log("🔍 Найдено модальное окно:", modal);

    // Обработка клика на "Профиль"
    if (profileLink) {
        profileLink.addEventListener('click', (e) => {
            console.log("🖱️ Клик по ссылке 'Профиль' зарегистрирован!");
            
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            console.log("👤 Текущий пользователь:", currentUser);
            
            if (!currentUser) {
                console.log("⚠️ Пользователь не авторизован. Открываем модалку...");
                e.preventDefault(); // Отменяем переход по ссылке
                if (modal) {
                    modal.style.display = 'flex';
                    switchToLogin();
                } else {
                    console.error("❌ ОШИБКА: Элемент с id='auth-modal' не найден в HTML!");
                }
            } else {
                console.log("✅ Пользователь авторизован. Переход на profile.html...");
                // Если авторизован, ничего не делаем, ссылка сработает как обычно
            }
        });
    } else {
        console.error("❌ ОШИБКА: Элемент с id='profile-link' не найден в HTML!");
    }
    
    // Закрытие модалки
    if (closeBtn) {
        closeBtn.addEventListener('click', () => { 
            modal.style.display = 'none'; 
        });
    }
    
    window.addEventListener('click', (e) => { 
        if (e.target === modal) {
            modal.style.display = 'none'; 
        }
    });

    // Переключение между формами
    if (showRegisterBtn) showRegisterBtn.addEventListener('click', switchToRegister);
    if (showLoginBtn) showLoginBtn.addEventListener('click', switchToLogin);

    function switchToLogin() {
        loginView.style.display = 'block';
        registerView.style.display = 'none';
    }

    function switchToRegister() {
        loginView.style.display = 'none';
        registerView.style.display = 'block';
    }

    // Обработка Регистрации
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = {
                firstName: document.getElementById('reg-firstname').value,
                lastName: document.getElementById('reg-lastname').value,
                age: document.getElementById('reg-age').value,
                email: document.getElementById('reg-email').value,
                password: document.getElementById('reg-password').value,
                testResult: null
            };
            
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.find(u => u.email === user.email)) {
                alert('Пользователь с таким email уже существует!');
                return;
            }
            
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            modal.style.display = 'none';
            registerForm.reset();
            window.location.href = 'profile.html';
        });
    }

    // Обработка Входа
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                modal.style.display = 'none';
                loginForm.reset();
                window.location.href = 'profile.html';
            } else {
                alert('Неверный email или пароль!');
            }
        });
    }

    // Глобальная функция для разблокировки результата на странице теста
    window.unlockFullResult = function() {
        const lockedContent = document.getElementById('locked-content');
        const unlockBtn = document.getElementById('unlock-result-btn');
        const saveMessage = document.getElementById('save-message');
        
        if (lockedContent && unlockBtn) {
            lockedContent.classList.add('unlocked');
            unlockBtn.style.display = 'none';
            if (saveMessage) saveMessage.style.display = 'block';
            
            const currentTestResult = localStorage.getItem('tempTestResult');
            if (currentTestResult) {
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                currentUser.testResult = JSON.parse(currentTestResult);
                
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                let users = JSON.parse(localStorage.getItem('users') || '[]');
                const userIndex = users.findIndex(u => u.email === currentUser.email);
                if (userIndex !== -1) {
                    users[userIndex] = currentUser;
                    localStorage.setItem('users', JSON.stringify(users));
                }
            }
        }
    }
});