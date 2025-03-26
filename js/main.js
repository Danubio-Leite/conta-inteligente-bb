document.addEventListener("DOMContentLoaded", function () {
    // Carrega componentes externos (header e footer)
    loadComponent('components/header.html', 'header');
    loadComponent('components/footer.html', 'footer');

    // Lista de seções (se necessário, para carregamento dinâmico)
    const sections = [
        'pages/section1.html',
        'pages/section2.html',
        'pages/section3.html',
        'pages/section4.html'
    ];

    const mainContent = document.getElementById('main-content');

    // Função assíncrona para carregar seções em ordem
    async function loadSectionsSequentially() {
        for (const sectionUrl of sections) {
            try {
                const response = await fetch(sectionUrl);
                const html = await response.text();
                mainContent.innerHTML += html;
            } catch (error) {
                console.error('Erro ao carregar a seção:', error);
            }
        }
    }

    // Chama a função para carregar as seções em ordem
    loadSectionsSequentially();

    // Delegação de eventos para cliques nos cabeçalhos dos cards
    mainContent.addEventListener('click', function (event) {
        const header = event.target.closest('.card-header');
        if (header) {
            const card = header.parentElement;
            const body = card.querySelector('.card-body');
            const isActive = card.classList.contains('active');

            if (isActive) {
                // Colapsa o card: define a altura atual e anima para 0
                body.style.height = body.scrollHeight + 'px';
                requestAnimationFrame(() => {
                    body.style.height = '0';
                });
                header.setAttribute('aria-expanded', 'false');
                card.classList.remove('active');
            } else {
                // Expande o card: define a altura de acordo com o conteúdo
                body.style.height = body.scrollHeight + 'px';
                card.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
                // Após a transição, remove o estilo inline para manter a responsividade do conteúdo
                body.addEventListener('transitionend', function handler() {
                    body.style.height = 'auto';
                    body.removeEventListener('transitionend', handler);
                });
            }
        }
    });

    // Ativação via teclado (Enter ou Espaço)
    mainContent.addEventListener('keydown', function (event) {
        if (event.target.classList.contains('card-header') && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            event.target.click();
        }
    });
});

// Função para carregar componentes externos
function loadComponent(url, elementId) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById(elementId).innerHTML = html;
        })
        .catch(error => console.error('Erro ao carregar o componente:', error));
}
