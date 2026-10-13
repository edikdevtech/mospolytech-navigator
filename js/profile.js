document.addEventListener('DOMContentLoaded', () => {
    const profileContent = document.getElementById('profile-content');
    const notLoggedIn = document.getElementById('not-logged-in');
    
    // 1. Проверяем, вошел ли пользователь
    let currentUser;
    try {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
    } catch (e) {
        currentUser = null;
    }

    // 2. Если не вошел - показываем предупреждение
    if (!currentUser || !currentUser.firstName) {
        profileContent.style.display = 'none';
        notLoggedIn.style.display = 'block';
        return; // Останавливаем выполнение
    }

    // 3. Если вошел - показываем профиль и заполняем данные
    profileContent.style.display = 'grid'; // Включаем grid-сетку
    notLoggedIn.style.display = 'none';

    document.getElementById('profile-fullname').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    document.getElementById('profile-age').textContent = currentUser.age || '—';
    document.getElementById('profile-email').textContent = currentUser.email || '—';

    // Логика аватара
    const avatarPreview = document.getElementById('avatar-preview');
    const avatarInitials = document.getElementById('avatar-initials');
    const avatarInput = document.getElementById('avatar-input');

    if (currentUser.avatar) {
        avatarPreview.style.backgroundImage = `url(${currentUser.avatar})`;
        avatarInitials.style.display = 'none';
    } else {
        const initials = `${currentUser.firstName[0] || ''}${currentUser.lastName[0] || ''}`.toUpperCase();
        avatarInitials.textContent = initials || '?';
    }

    // Загрузка нового аватара
    avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            currentUser.avatar = event.target.result;
            saveUserToStorage(currentUser);
            
            avatarPreview.style.backgroundImage = `url(${currentUser.avatar})`;
            avatarInitials.style.display = 'none';
        };
        reader.readAsDataURL(file);
    });

    // 4. Логика отображения результата теста
    const noTestResult = document.getElementById('no-test-result');
    const testResultDisplay = document.getElementById('test-result-display');

    if (currentUser.testResult && typeof currentUser.testResult === 'object') {
        noTestResult.style.display = 'none';
        testResultDisplay.style.display = 'block';

        document.getElementById('result-sphere-name').textContent = currentUser.testResult.sphere || 'Не определено';
        document.getElementById('result-sphere-desc').textContent = currentUser.testResult.description || '';

        const facultiesList = document.getElementById('result-faculties-list');
        facultiesList.innerHTML = '';
        
        if (Array.isArray(currentUser.testResult.faculties)) {
            currentUser.testResult.faculties.forEach(faculty => {
                const li = document.createElement('li');
                li.textContent = `🎓 ${faculty}`;
                facultiesList.appendChild(li);
            });
        }
    } else {
        noTestResult.style.display = 'block';
        testResultDisplay.style.display = 'none';
    }

    // 5. Логика кнопки "Выйти"
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите выйти из аккаунта?')) {
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html'; // Перенаправляем на главную
            }
        });
    }

    // 6. Логика смены пароля
    const passwordModal = document.getElementById('password-modal');
    const changePasswordBtn = document.getElementById('change-password-btn');
    const closeBtn = document.querySelector('#password-modal .modal__close');
    const passwordForm = document.getElementById('password-form');
    const passwordError = document.getElementById('password-error');

    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', () => {
            passwordModal.style.display = 'flex';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            passwordModal.style.display = 'none';
            passwordForm.reset();
            passwordError.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === passwordModal) {
            passwordModal.style.display = 'none';
            passwordForm.reset();
            passwordError.style.display = 'none';
        }
    });

    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const oldPassword = document.getElementById('old-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (oldPassword !== currentUser.password) {
                showError('Неверный текущий пароль');
                return;
            }
            if (newPassword !== confirmPassword) {
                showError('Новые пароли не совпадают');
                return;
            }
            if (newPassword.length < 4) {
                showError('Пароль должен содержать минимум 4 символа');
                return;
            }

            currentUser.password = newPassword;
            saveUserToStorage(currentUser);

            passwordModal.style.display = 'none';
            passwordForm.reset();
            passwordError.style.display = 'none';
            alert('Пароль успешно изменён!');
        });
    }

    function showError(message) {
        passwordError.textContent = message;
        passwordError.style.display = 'block';
    }

    // Вспомогательная функция для сохранения данных
    function saveUserToStorage(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
            users[userIndex] = user;
            localStorage.setItem('users', JSON.stringify(users));
        }
    }
});