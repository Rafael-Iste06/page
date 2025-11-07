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
        'Python': " est un langage de programmation polyvalent et facile à apprendre, reconnu pour sa syntaxe claire et concise.<br>Il est utilisé dans de nombreux domaines comme le développement web, l’analyse de données, l’intelligence artificielle, l’automatisation et la science des données.<br>Grâce à sa vaste bibliothèque et sa communauté active, Python est un choix privilégié pour les débutants comme pour les développeurs expérimentés.",
        'Java': " est un langage de programmation orienté objet utilisé pour développer des applications et des systèmes embarqués.<br>Sa principale caractéristique est la portabilité, permettant d’exécuter les programmes sur n’importe quelle machine via la Java Virtual Machine (JVM).<br>Java est également réputé pour sa stabilité et sa sécurité, ce qui en fait un excellent choix pour les applications complexes et de grande envergure.",
        'HTML': " (HyperText Markup Language) est un langage de balisage servant à structurer le contenu des pages web.<br>Il définit les éléments tels que les titres, paragraphes, images et liens d’une page.<br>HTML est indispensable à toute interface web, mais ne gère pas la mise en forme ni la logique, assurées respectivement par CSS et JavaScript.",
        'CSS': " (Cascading Style Sheets) est un langage de style utilisé pour décrire la présentation des documents HTML.<br>Il définit la mise en page, les couleurs, les polices et les animations d’un site, offrant un contrôle complet sur son apparence visuelle.<br>Il permet de séparer la structure (HTML) de la présentation, rendant la maintenance des sites plus simple et plus flexible.",
        'JavaScript': " est un langage de programmation principalement utilisé pour créer des sites web interactifs et dynamiques.<br>Il permet d’ajouter des animations, des formulaires interactifs et des mises à jour de contenu sans recharger la page.<br>JavaScript est également utilisé côté serveur grâce à des technologies comme Node.js."
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

document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            smoothScroll(targetElement, 1750);
        }
    });
});