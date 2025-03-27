document.addEventListener("DOMContentLoaded", function () {
    // Carrega componentes externos (header e footer)
    loadComponent('components/header.html', 'header');
    loadComponent('components/footer.html', 'footer');

    // Carrega as seções
    const mainContent = document.getElementById('main-content');
    async function loadSectionsSequentially() {
        const sections = [
            'pages/section1.html',
            'pages/section2.html',
            'pages/section3.html',
            'pages/section4.html'
        ];
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
    loadSectionsSequentially();

    // Se for desktop, abre todos os cards e desabilita cliques
    if (window.innerWidth > 768) {
        document.querySelectorAll('.card').forEach(card => {
            const header = card.querySelector('.card-header');
            const body = card.querySelector('.card-body');
            card.classList.add('active');
            header.setAttribute('aria-expanded', 'true');
            body.style.height = 'auto';
            // Desabilita cliques no cabeçalho
            header.style.pointerEvents = 'none';
        });
    } else {
        // Para mobile, mantém o comportamento atual de clique
        mainContent.addEventListener('click', function (event) {
            const header = event.target.closest('.card-header');
            if (header) {
                const card = header.parentElement;
                const body = card.querySelector('.card-body');
                const isActive = card.classList.contains('active');

                if (isActive) {
                    // Colapsa o card
                    body.style.height = body.scrollHeight + 'px';
                    requestAnimationFrame(() => {
                        body.style.height = '0';
                    });
                    header.setAttribute('aria-expanded', 'false');
                    card.classList.remove('active');
                } else {
                    // Expande o card
                    body.style.height = body.scrollHeight + 'px';
                    card.classList.add('active');
                    header.setAttribute('aria-expanded', 'true');
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
    }
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
