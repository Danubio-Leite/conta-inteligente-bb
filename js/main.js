

document.addEventListener("DOMContentLoaded", function () {
    loadComponent('components/header.html', 'header');
    loadComponent('components/footer.html', 'footer');

    // Lista com os caminhos das seções
    const sections = [
        'pages/section1.html',
        'pages/section2.html',
        'pages/section3.html',
        'pages/section4.html'
    ];

    const mainContent = document.getElementById('main-content');

    sections.forEach(function (sectionUrl) {
        fetch(sectionUrl)
            .then(response => response.text())
            .then(html => {
                mainContent.innerHTML += html;
            })
            .catch(error => console.error('Erro ao carregar a seção:', error));
    });
});

function loadComponent(url, elementId) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById(elementId).innerHTML = html;
        })
        .catch(error => console.error('Erro ao carregar o componente:', error));
}
