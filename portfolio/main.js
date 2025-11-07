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

    const projects = [
        {
            "title": "To Do List Manager",
            "description": "Web app pour gérer différentes listes de tâches.",
            "github": "https://github.com/Rafael-Iste06/ToDoList",
            "hashtags": ["tool", "web"],
            "language": ["HTML", "Python"],
            "date": "2024-12-22",
            "images": ["image1.jpg"]
        },
        {
            "title": "Sudoku",
            "description": "Jeu de sudoku en Python.",
            "github": "https://github.com/Rafael06/Sudoku",
            "hashtags": ["game", "1player"],
            "language": ["Python"],
            "date": "2024-12-22",
            "images": ["image1.jpg"]
        }
    ];

    const projectsContainer = document.getElementById('projects-container');
    const hashtagsContainer = document.getElementById('hashtags-container');
    const selectedHashtagsContainer = document.getElementById('selected-hashtags-container');
    const languageFilter = document.getElementById('languageFilter');
    const sortOrder = document.getElementById('sortOrder');
    const searchInput = document.getElementById('searchInput');
    const contentContainer = document.getElementById('projectContent');

    let selectedHashtags = [];
    let currentFiles = [];

    function displayProjects(projectsToDisplay) {
        projectsContainer.innerHTML = '';
        projectsToDisplay.forEach(project => {
            const card = document.createElement('div');
            card.className = 'col-md-6 mb-4 project-card';
            card.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h2 class="card-title">${project.title}</h2>
                        <p class="card-text">${project.description}</p>
                        <div class="d-flex mt-2 flex-wrap">
                            <a class="btn btn-primary mr-2 mb-2 flex-fill" href="${project.github}" target="_blank"><i class="fab fa-github"></i> GitHub</a>
                            <a class="btn btn-success mr-2 mb-2 flex-fill" href="${project.github}/archive/refs/heads/main.zip" target="_blank"><i class="fas fa-file-archive"></i> Download ZIP</a>
                            <button class="btn btn-info mr-2 mb-2 flex-fill" onclick="lookInsideRepo('${project.github}')"><i class="fas fa-eye"></i> Look Inside</button>
                        </div>
                        <p class="mt-2">${project.hashtags.map(tag => `<span class='badge badge-secondary'>#${tag}</span>`).join(' ')}</p>
                    </div>
                </div>
            `;
            projectsContainer.appendChild(card);
            setTimeout(() => card.classList.add('fade-in'), 100);
        });
    }


    function displayHashtags() {
        const allHashtags = [...new Set(projects.flatMap(p => p.hashtags))];
        hashtagsContainer.innerHTML = allHashtags.map(tag =>
            `<button class='btn btn-outline-secondary m-1 hashtag-btn' data-tag='${tag}'>#${tag}</button>`
        ).join('');
    }

    function updateSelectedHashtags() {
        selectedHashtagsContainer.innerHTML = selectedHashtags.map(tag =>
            `<span class='badge badge-primary m-1 selected-badge'>#${tag} <button class='close' data-tag='${tag}'>&times;</button></span>`
        ).join('');
    }

    displayProjects(projects);
    displayHashtags();

    hashtagsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('hashtag-btn')) {
            const tag = e.target.getAttribute('data-tag');
            if (!selectedHashtags.includes(tag)) {
                selectedHashtags.push(tag);
                updateSelectedHashtags();
            }
            filterProjects();
        }
    });

    selectedHashtagsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('close')) {
            const tag = e.target.getAttribute('data-tag');
            selectedHashtags = selectedHashtags.filter(t => t !== tag);
            updateSelectedHashtags();
            filterProjects();
        }
    });

    searchInput.addEventListener('input', filterProjects);
    languageFilter.addEventListener('change', filterProjects);
    sortOrder.addEventListener('change', filterProjects);

    function filterProjects() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedLanguage = languageFilter.value;
        const order = sortOrder.value;

        const filtered = projects.filter(project =>
            (selectedLanguage === '' || project.language.includes(selectedLanguage)) &&
            project.title.toLowerCase().includes(searchTerm) &&
            selectedHashtags.every(tag => project.hashtags.includes(tag))
        );

        if (order === 'title') filtered.sort((a, b) => a.title.localeCompare(b.title));
        else if (order === 'date') filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        displayProjects(filtered);
    }

    filterProjects();

    function decodeBase64(content) {
        const bytes = Uint8Array.from(atob(content), c => c.charCodeAt(0));
        let start = 0;
        if (bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) start = 3;
        return new TextDecoder('utf-8').decode(bytes.slice(start));
    }

    async function fetchContent(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Impossible de charger le contenu");
        return await res.json();
    }

    function renderFiles(files, parentPath = '') {
        const ul = document.createElement('ul');
        files.forEach(file => {
            const li = document.createElement('li');
            if (file.type === 'dir') {
                const span = document.createElement('span');
                span.textContent = `📁 ${file.name}`;
                span.onclick = async e => {
                    e.stopPropagation();
                    const subUl = li.querySelector('ul');
                    if (subUl) subUl.remove();
                    else {
                        const subFiles = await fetchContent(file.url);
                        li.appendChild(renderFiles(subFiles, parentPath ? `${parentPath}/${file.name}` : file.name));
                    }
                };
                li.appendChild(span);
                li.classList.add('folder');
            } else {
                const span = document.createElement('span');
                span.textContent = `📄 ${file.name}`;
                span.onclick = () => displayFile(file, parentPath);
                li.appendChild(span);
                li.classList.add('file');
            }
            ul.appendChild(li);
        });
        return ul;
    }

    async function displayFile(file, parentPath = '') {
        contentContainer.innerHTML = '';

        const backBtn = document.createElement('button');
        backBtn.className = 'btn btn-secondary mb-3';
        backBtn.textContent = '⬅ Retour';
        backBtn.onclick = () => {
            contentContainer.innerHTML = '';
            contentContainer.appendChild(renderFiles(currentFiles));
        };
        contentContainer.appendChild(backBtn);

        const fullPath = parentPath ? `${parentPath}/${file.name}` : file.name;
        const fileName = document.createElement('h5');
        fileName.textContent = fullPath;
        contentContainer.appendChild(fileName);

        const fileViewer = document.createElement('div');
        fileViewer.className = 'file-viewer';
        contentContainer.appendChild(fileViewer);

        const ext = file.name.split('.').pop().toLowerCase();
        if (['png','jpg','jpeg','gif','svg'].includes(ext)) {
            const img = document.createElement('img');
            img.src = file.download_url;
            img.style.maxWidth = '100%';
            fileViewer.appendChild(img);
        } else {
            try {
                const data = await fetchContent(file.url);
                if (data.content) {
                    const content = decodeBase64(data.content);
                    const pre = document.createElement('pre');
                    const code = document.createElement('code');

                    let langClass = 'language-none';
                    if (ext === 'py') langClass = 'language-python';
                    else if (ext === 'js') langClass = 'language-javascript';
                    else if (ext === 'html') langClass = 'language-markup';
                    else if (ext === 'css') langClass = 'language-css';
                    else if (ext === 'json') langClass = 'language-json';

                    code.className = langClass;
                    code.textContent = content;
                    pre.appendChild(code);
                    fileViewer.appendChild(pre);

                    Prism.highlightElement(code);
                } else {
                    const a = document.createElement('a');
                    a.href = file.download_url;
                    a.target = '_blank';
                    a.textContent = "Télécharger ce fichier pour le consulter";
                    fileViewer.appendChild(a);
                }
            } catch {
                const a = document.createElement('a');
                a.href = file.download_url;
                a.target = '_blank';
                a.textContent = "Télécharger ce fichier pour le consulter";
                fileViewer.appendChild(a);
            }
        }
    }

    window.lookInsideRepo = async function(repoUrl) {
        const repoPath = repoUrl.replace('https://github.com/', '');
        const apiUrl = `https://api.github.com/repos/${repoPath}/contents/`;
        currentFiles = await fetchContent(apiUrl);
        contentContainer.innerHTML = '';
        contentContainer.appendChild(renderFiles(currentFiles));
        const modalTitle = document.getElementById('lookInsideLabel');
        if (modalTitle) modalTitle.textContent = 'Look Inside Project';
        $('#lookInsideModal').modal('show');
    };
});
