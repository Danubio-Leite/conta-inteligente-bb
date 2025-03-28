document.addEventListener("DOMContentLoaded", function () {
    // Verifica se é a página Experimente (pode ser adaptado conforme sua lógica, aqui usamos o título)
    const isExperimentePage = document.title.includes("Experimente");

    // Carrega os componentes externos (header e footer)
    // Se for Experimente, carrega um header específico; caso contrário, o header padrão.
    if (isExperimentePage) {
        loadComponent('components/header-experimente.html', 'header');
    } else {
        loadComponent('components/header.html', 'header');
    }
    loadComponent('components/footer.html', 'footer');

    // Se não for a página Experimente, carrega as seções dinâmicas (apenas na tela principal)
    const mainContent = document.getElementById('main-content');
    if (mainContent && !isExperimentePage) {
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
            // Adiciona os event listeners para os inputs (máscaras)
            const agencia = document.getElementById('agencia');
            const conta = document.getElementById('conta');
            if (agencia) {
                agencia.addEventListener('input', function (e) {
                    e.target.value = maskAgencia(e.target.value);
                });
            }
            if (conta) {
                conta.addEventListener('input', function (e) {
                    e.target.value = maskConta(e.target.value);
                });
            }
            // Após carregar as seções, anexa os eventos do formulário de upgrade
            attachUpgradeEvents();
        }
        loadSectionsSequentially();
    }

    // Ajusta o comportamento dos cards para desktop e mobile
    if (window.innerWidth > 768) {
        document.querySelectorAll('.card').forEach(card => {
            const header = card.querySelector('.card-header');
            const body = card.querySelector('.card-body');
            card.classList.add('active');
            if (header) {
                header.setAttribute('aria-expanded', 'true');
                // Desabilita cliques no cabeçalho
                header.style.pointerEvents = 'none';
            }
            if (body) {
                body.style.height = 'auto';
            }
        });
    } else {
        if (mainContent) {
            mainContent.addEventListener('click', function (event) {
                const header = event.target.closest('.card-header');
                if (header) {
                    const card = header.parentElement;
                    const body = card.querySelector('.card-body');
                    const isActive = card.classList.contains('active');

                    if (isActive) {
                        body.style.height = body.scrollHeight + 'px';
                        requestAnimationFrame(() => {
                            body.style.height = '0';
                        });
                        header.setAttribute('aria-expanded', 'false');
                        card.classList.remove('active');
                    } else {
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
    }
});

// Função que anexa os eventos do formulário de upgrade
function attachUpgradeEvents() {
    // Remove o atributo "action" do formulário para evitar navegação indesejada
    const upgradeForm = document.getElementById('upgrade-form');
    if (upgradeForm) {
        upgradeForm.removeAttribute('action');
    } else {
        console.error('Elemento #upgrade-form não encontrado.');
    }

    // Seleciona o botão e associa o evento de clique
    const btnUpgrade = document.querySelector('.btn-cadastrar');
    if (btnUpgrade) {
        btnUpgrade.addEventListener('click', function (event) {
            event.preventDefault();
            console.log("Botão clicado!"); // para ajudar na depuração

            // Localiza o card (container) mais próximo do botão
            const card = btnUpgrade.closest('.card');
            if (!card) {
                console.error('Elemento .card não encontrado.');
                return;
            }

            // Cria e exibe o spinner de progresso
            const spinnerOverlay = document.createElement('div');
            spinnerOverlay.className = 'spinner-overlay';
            spinnerOverlay.innerHTML = '<div class="spinner"></div>';
            card.appendChild(spinnerOverlay);

            // Após 1 segundo, remove o spinner, atualiza os textos e oculta o formulário
            setTimeout(function () {
                spinnerOverlay.remove();
                const title = document.getElementById('section4-title');
                const subtitle = document.querySelector('.subtitle');
                if (title) title.textContent = 'Parabéns!';
                if (subtitle) {
                    subtitle.innerHTML = 'Você está a um passo de fazer parte da revolução digital do BB. Confirme seu upgrade no app do Banco do Brasil em <strong>Notificações > Pendências de Confirmação</strong>.';
                }

                if (upgradeForm) upgradeForm.style.display = 'none';
            }, 1000);
        });
    } else {
        console.error('Botão com a classe .btn-cadastrar não encontrado.');
    }
}

// Função para carregar componentes externos (header, footer, etc.)
function loadComponent(url, elementId) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = html;
            }
        })
        .catch(error => console.error('Erro ao carregar o componente:', error));
}

// Função para aplicar máscara à Agência
function maskAgencia(value) {
    let digits = value.replace(/\D/g, '');
    if (digits.length > 5) {
        digits = digits.substring(0, 5);
    }
    if (digits.length > 1) {
        return digits.slice(0, digits.length - 1) + '-' + digits.slice(-1);
    }
    return digits;
}

// Função para aplicar máscara à Conta
function maskConta(value) {
    let digits = value.replace(/\D/g, '');
    if (digits.length > 8) {
        digits = digits.substring(0, 8);
    }
    if (digits.length > 1) {
        return digits.slice(0, digits.length - 1) + '-' + digits.slice(-1);
    }
    return digits;
}
