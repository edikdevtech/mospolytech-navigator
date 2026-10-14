// Сферы по Климову и соответствующие им факультеты Политеха
const sphereMapping = {
    nature: {
        name: "Человек-Природа",
        desc: "Тебе близка работа с живыми организмами, биологическими процессами, экологией и химическими материалами.",
        faculties: ["Факультет химической технологии и биотехнологии"]
    },
    tech: {
        name: "Человек-Техника",
        desc: "Твоя стихия – это механизмы, машины, строительство, транспорт и инженерные системы. Ты любишь создавать и улучшать материальные объекты.",
        faculties: ["Факультет машиностроения", "Транспортный факультет", "Факультет урбанистики и городского хозяйства", "Инженерная школа"]
    },
    people: {
        name: "Человек-Человек",
        desc: "Ты ориентирован на взаимодействие с людьми: обучение, управление, сервис или социальные коммуникации.",
        faculties: ["Факультет экономики и управления", "Факультет довузовской подготовки"]
    },
    sign: {
        name: "Человек-Знаковая система",
        desc: "Твой конек – работа с числами, кодом, формулами, чертежами, текстами и базами данных. Ты любишь точность и логику.",
        faculties: ["Факультет информационных технологий", "Факультет базовых компетенций"]
    },
    art: {
        name: "Человек-Художественный образ",
        desc: "Ты стремишься к созданию чего-то нового, красивого и выразительного: от дизайна и иллюстраций до медиаконтента и полиграфии.",
        faculties: ["Передовая школа инженерного дизайна", "Факультет графики и искусства книги имени В.А. Фаворского", "Факультет издательского дела и журналистики", "Полиграфический факультет"]
    }
};

// 15 вопросов по типу ДДО Климова (вынужденный выбор: А или Б)
const questions = [
    { a: { text: "Ухаживать за животными, растениями или изучать экологию", sphere: "nature" }, b: { text: "Налаживать, собирать или ремонтировать приборы и механизмы", sphere: "tech" } },
    { a: { text: "Разбираться в сложных чертежах, схемах и алгоритмах", sphere: "sign" }, b: { text: "Объяснять людям сложные вещи, обучать или консультировать их", sphere: "people" } },
    { a: { text: "Рисовать, проектировать внешний вид изделий или интерьеров", sphere: "art" }, b: { text: "Конструировать новые машины, роботов или здания", sphere: "tech" } },
    { a: { text: "Проводить химические или биологические опыты в лаборатории", sphere: "nature" }, b: { text: "Писать программный код или анализировать большие данные", sphere: "sign" } },
    { a: { text: "Организовывать работу команды, управлять проектами и людьми", sphere: "people" }, b: { text: "Создавать рекламные макеты, видео, тексты или иллюстрации", sphere: "art" } },
    { a: { text: "Разбираться в устройстве двигателей, транспорта или производственных линий", sphere: "tech" }, b: { text: "Вести экономические отчеты, работать с цифрами и документами", sphere: "sign" } },
    { a: { text: "Изучать переработку материалов, биотехнологии или защиту окружающей среды", sphere: "nature" }, b: { text: "Заниматься художественным оформлением, дизайном или искусством", sphere: "art" } },
    { a: { text: "Работать с базами данных, таблицами или системами информационной безопасности", sphere: "sign" }, b: { text: "Управлять транспортными потоками или строительством объектов", sphere: "tech" } },
    { a: { text: "Помогать людям решать их проблемы, работать в сфере сервиса или HR", sphere: "people" }, b: { text: "Наблюдать за природными явлениями, работать с микроскопом или реактивами", sphere: "nature" } },
    { a: { text: "Управлять сложными инженерными системами или гоночными болидами", sphere: "tech" }, b: { text: "Писать статьи, снимать фильмы, верстать книги или журналы", sphere: "art" } },
    { a: { text: "Заниматься созданием новых пищевых или фармацевтических продуктов", sphere: "nature" }, b: { text: "Вести переговоры, заключать сделки или управлять персоналом", sphere: "people" } },
    { a: { text: "Разрабатывать математические модели или фундаментальные алгоритмы", sphere: "sign" }, b: { text: "Создавать уникальные шрифты, иллюстрации или полиграфическую продукцию", sphere: "art" } },
    { a: { text: "Выступать на публике, организовывать мероприятия или работать в медиа", sphere: "people" }, b: { text: "Разрабатывать креативные концепции, 3D-модели или арт-объекты", sphere: "art" } },
    { a: { text: "Обучать других, наставлять или заниматься социальной работой", sphere: "people" }, b: { text: "Проектировать инженерные сети, системы водоснабжения или дороги", sphere: "tech" } },
    { a: { text: "Исследовать фундаментальные законы физики, химии или математики", sphere: "sign" }, b: { text: "Заниматься ландшафтным дизайном или городским озеленением", sphere: "nature" } }
];

let currentStep = 0;
let userAnswers = new Array(questions.length).fill(null);
let scores = { nature: 0, tech: 0, people: 0, sign: 0, art: 0 };

document.addEventListener('DOMContentLoaded', () => {
    const questionText = document.getElementById('question-text');
    const answersBox = document.getElementById('answers-box');
    const quizBox = document.getElementById('quiz-box');
    const resultBox = document.getElementById('result-box');
    const progressFill = document.getElementById('progress-fill');
    
    const btnBack = document.getElementById('btn-back');
    const btnNext = document.getElementById('btn-next');
    const unlockBtn = document.getElementById('unlock-result-btn');

    if (!questionText) return; // Выход, если это не страница теста

    function renderQuestion() {
        const q = questions[currentStep];
        questionText.textContent = `Вопрос ${currentStep + 1} из ${questions.length}: Что тебе ближе?`;
        answersBox.innerHTML = '';
        
        const progress = ((currentStep + 1) / questions.length) * 100;
        progressFill.style.width = `${progress}%`;

        // Кнопка А
        const btnA = document.createElement('button');
        btnA.className = 'answer-btn';
        if (userAnswers[currentStep] === 'a') btnA.classList.add('selected');
        btnA.innerHTML = `<strong>Вариант А:</strong><br><br>${q.a.text}`;
        btnA.addEventListener('click', () => selectAnswer('a'));
        answersBox.appendChild(btnA);

        // Кнопка Б
        const btnB = document.createElement('button');
        btnB.className = 'answer-btn';
        if (userAnswers[currentStep] === 'b') btnB.classList.add('selected');
        btnB.innerHTML = `<strong>Вариант Б:</strong><br><br>${q.b.text}`;
        btnB.addEventListener('click', () => selectAnswer('b'));
        answersBox.appendChild(btnB);

        btnBack.disabled = currentStep === 0;
        btnNext.disabled = userAnswers[currentStep] === null;
        btnNext.textContent = currentStep === questions.length - 1 ? 'Узнать результат' : 'Далее →';
    }

    function selectAnswer(choice) {
        userAnswers[currentStep] = choice;
        const buttons = answersBox.querySelectorAll('.answer-btn');
        buttons.forEach((btn, i) => {
            const btnChoice = i === 0 ? 'a' : 'b';
            if (btnChoice === choice) btn.classList.add('selected');
            else btn.classList.remove('selected');
        });
        btnNext.disabled = false;
    }

    btnBack.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            renderQuestion();
        }
    });

    btnNext.addEventListener('click', () => {
        if (currentStep < questions.length - 1) {
            currentStep++;
            renderQuestion();
        } else {
            calculateAndShowResults();
        }
    });

    if (unlockBtn) {
        unlockBtn.addEventListener('click', () => {
            document.getElementById('auth-modal').style.display = 'flex';
        });
    }

    function calculateAndShowResults() {
        // Сброс и подсчет очков
        scores = { nature: 0, tech: 0, people: 0, sign: 0, art: 0 };
        userAnswers.forEach((choice, qIndex) => {
            if (choice) {
                const sphere = questions[qIndex][choice].sphere;
                scores[sphere]++;
            }
        });

        // Находим сферу с максимальным количеством очков
        let bestSphere = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
        const resultData = sphereMapping[bestSphere];

        // Формируем список факультетов для отображения
        const facultiesListHtml = resultData.faculties.map(f => `<li>🎓 ${f}</li>`).join('');

        // Краткий результат (для всех)
        document.getElementById('result-faculty-short').textContent = `Тип профессии: ${resultData.name}`;
        document.getElementById('result-desc-short').textContent = resultData.desc;

        // Полный результат (заблюрен для незарегистрированных)
        document.getElementById('result-faculty-full').textContent = `Рекомендуемые факультеты Московского Политеха:`;
        document.getElementById('result-desc-full').textContent = `На основе твоих ответов, мы рекомендуем тебе обратить внимание на следующие направления, которые идеально подходят под тип "${resultData.name}":`;
        document.getElementById('result-specialties').innerHTML = facultiesListHtml;

        localStorage.setItem('tempTestResult', JSON.stringify({ sphere: resultData.name, description: resultData.desc, faculties: resultData.faculties }));

        quizBox.style.display = 'none';
        resultBox.style.display = 'block';

        // ============================================================
        // === ОТПРАВКА СОБЫТИЯ И КОНВЕРСИИ В РАМБЛЕР (Задания 8 и 9) ===
        if (typeof _top100q !== 'undefined') {
            _top100q.push(function() {
                // 1. Отправляем кастомное событие (для Задания 8)
                top100.hit({
                    event: "test_completed",
                    event_category: "user_action",
                    event_action: "finish_quiz",
                    event_value: resultData.name 
                });
                
                // 2. Отправляем виртуальный просмотр как конверсию (для Задания 9)
                // В базовом Рамблере это основной способ трекинга целей
                top100.hit({
                    url: "/test-completed",
                    title: "Завершение теста: " + resultData.name
                });
            });
        }
        // ============================================================

        // Сохраняем результат в профиль пользователя
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            currentUser.testResult = {
                sphere: resultData.name,
                description: resultData.desc,
                faculties: resultData.faculties
            };
            
            // Обновляем текущую сессию
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Обновляем в общем списке пользователей
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.email === currentUser.email);
            if (userIndex !== -1) {
                users[userIndex] = currentUser;
                localStorage.setItem('users', JSON.stringify(users));
            }
            
            window.unlockFullResult();
        }
    }

    renderQuestion();
});