Документація проекту: Конвертація тексту в PDF
    Цей проект дозволяє користувачам конвертувати текст у PDF, переглядати і завантажувати результати. Також зберігається історія конвертацій у localStorage.

Структура проекту
    App.js — основний компонент з логікою.
    App.css — стилі.
    index.js — точка входу.
    public/index.html — HTML-шаблон.

Основні модулі
    React — для створення інтерфейсу та управління станом.
    react-pdf — для відображення PDF.
    localStorage — для збереження історії.
    API — для конвертації тексту в PDF через запит.

Функціональні можливості
    Конвертація тексту в PDF: текст перетворюється в PDF, який можна завантажити або переглянути.
    Перегляд PDF: через компоненти Document та Page.
    Історія конвертацій: зберігається в localStorage.
    
Ключові функції
    handleConvert: конвертує текст в PDF.
    downloadPdf: дозволяє завантажити PDF.
    onLoadSuccess: обробляє завантаження PDF.
    handleCreateNewFile: очищає введений текст і PDF.
    useEffect: зберігає історію в localStorage.

Як запускати проект

Клонувати репозиторій: Використовуйте Git для клонування репозиторію на ваш комп'ютер.

Встановити залежності:
    npm install

Запустити проект: Після встановлення залежностей запустіть проект за допомогою:
    npm start
    
Відкрийте браузер і перейдіть за адресою:
    http://localhost:3000
