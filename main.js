document.addEventListener('DOMContentLoaded', function() {

    const themeToggle = document.getElementById('themeToggle');
    const body = document.getElementById('body');
        
    function applyTheme() {
        if (themeToggle.checked) {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
        } else {
            body.classList.add('light-theme');
            body.classList.remove('dark-theme');
        }
    }

    applyTheme();
        
    themeToggle.addEventListener('change', applyTheme);

    const languageLogos = document.querySelectorAll('.language-logo');
    const languageDescription = document.getElementById('language-description');

    let currentLanguage = 'Python';

    const languageDescriptions = {
        'Python': " is a versatile and easy-to-learn programming language known for its clear and concise syntax.<br>It is used in many fields such as web development, data analysis, artificial intelligence, automation, and data science.<br>With its extensive library and active community, Python is a popular choice for both beginner and experienced developers.",
        'Java': " is an object-oriented programming language used to develop applications and embedded systems.<br>Its main feature is portability, allowing programs to run on any machine through the Java Virtual Machine (JVM).<br>Java is also known for its stability and security, making it an ideal choice for large and complex applications.",
        'HTML': " (HyperText Markup Language) is a markup language used to structure the content of web pages.<br>It defines elements like headings, paragraphs, images, and links on a webpage.<br>HTML is essential for creating any web interface but does not handle styling or logic, which are managed by CSS and JavaScript.",
        'CSS': " (Cascading Style Sheets) is a styling language used to describe the presentation of HTML documents.<br>It defines the layout, colors, fonts, and animations of a webpage, providing full control over the visual appearance of websites.<br>It allows for the separation of content structure (HTML) from presentation, making website maintenance easier and more flexible.",
        'JavaScript': " is a programming language primarily used to create interactive and dynamic websites.<br>It enables features like animations, interactive forms, and content updates without reloading the page.<br>JavaScript is also used for server-side development with technologies like Node.js."
    };

    languageDescription.innerHTML = `<p><strong>${currentLanguage}</strong>${languageDescriptions[currentLanguage]}</p>`;

    languageLogos.forEach(logo => {
        logo.addEventListener('click', function() {
            const selectedLanguage = logo.getAttribute('data-language');
            currentLanguage = selectedLanguage;
            languageDescription.innerHTML = `<p><strong>${currentLanguage}</strong>${languageDescriptions[currentLanguage]}</p>`;
        });
    });
});

// Fonction de défilement en douceur personnalisée
function smoothScroll(target, duration) {
    const targetPosition = target.getBoundingClientRect().top + window.scrollY;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}
// Ajout d'un défilement en douceur pour les liens de navigation

document.querySelectorAll('nav a').forEach(anchor => {

    anchor.addEventListener('click', function(e) {

        const targetId = this.getAttribute('href');


        // Vérifie si le lien est un lien vers une section de la même page

        if (targetId.startsWith('#')) {

            e.preventDefault(); // Empêche le comportement par défaut uniquement pour les liens internes


            const targetElement = document.querySelector(targetId);

            // Appel de la fonction de défilement en douceur avec une durée de 2000 ms

            smoothScroll(targetElement, 1750);

        }

        // Si c'est un lien vers une autre page, ne rien faire (laisser le comportement par défaut)

    });

});