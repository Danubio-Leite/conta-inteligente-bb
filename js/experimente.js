document.addEventListener("DOMContentLoaded", function () {
    const setupForm = document.getElementById("setup-form");
    const spinner = document.getElementById("spinner");
    const chatContainer = document.getElementById("chat-container");
    const greetingElement = document.getElementById("greeting");
    const sendButton = document.getElementById("sendButton");
    const userMessageInput = document.getElementById("userMessage");
    const chatWindow = document.getElementById("chat-window");
    const balanceInput = document.getElementById("balance");

    // Função para aplicar máscara de moeda em Real
    function formatarMoedaBR(value) {
        // Remove todos os caracteres que não são dígitos
        const numericValue = value.replace(/\D/g, '');
        if (numericValue === "") return "";
        // Converte para número e formata dividindo por 100 (centavos)
        const valorEmReal = parseFloat(numericValue) / 100;
        return valorEmReal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // Aplica a máscara enquanto o usuário digita
    balanceInput.addEventListener("input", function (e) {
        const cursorPosition = balanceInput.selectionStart;
        const valorFormatado = formatarMoedaBR(e.target.value);
        e.target.value = valorFormatado;
        // Nota: ajustes finos de posição do cursor podem ser feitos se necessário
    });

    // Variável global para armazenar o prompt inicial e o histórico de mensagens
    let initialPrompt = "";
    let conversationHistory = [];

    // Configuração inicial: coleta dos dados do usuário e exibição do chat
    setupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Coleta dos dados informados pelo usuário
        const name = document.getElementById("name").value.trim();
        const age = document.getElementById("age").value.trim();
        const balance = document.getElementById("balance").value.trim();
        const investmentProfile = document.getElementById("investmentProfile").value;

        if (!name || !age || !balance || !investmentProfile) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        // Oculta o formulário de entrada
        document.getElementById("setup-container").style.display = "none";

        // Exibe o spinner de carregamento
        spinner.style.display = "block";

        // Simula um tempo de processamento de 1 segundo
        setTimeout(function () {
            spinner.style.display = "none";
            chatContainer.style.display = "block";

            // Exibe a saudação personalizada
            greetingElement.textContent = `Olá ${name}, tudo bem? Como posso lhe ajudar hoje?`;

            // Monta o prompt inicial para a API e armazena na variável global
            initialPrompt = `Você é um assistente financeiro do Banco do Brasil e deve fingir realizar movimentações financeiras, dar sugestões de investimentos, realizar oferta e contratação de produtos financeiros comercializados pelo Banco do Brasil. Você está atendendo o cliente ${name}, que possui saldo em conta corrente de ${balance}, sua idade é de ${age} anos e possui um perfil de investimentos ${investmentProfile}. Sempre que possível, limite suas respostas a 400 caracteres.`;

            // Inicializa o histórico de mensagens com o prompt do sistema
            conversationHistory = [
                { role: "system", content: initialPrompt }
            ];

            console.log("Prompt inicial:", initialPrompt);
        }, 1000);
    });

    // Função para enviar o histórico de mensagens à API da OpenAI e retornar a resposta
    async function enviarParaAPI(messages) {
        const chave = ''; // Insira uma chave válida da API da OpenAI
        const url = 'https://api.openai.com/v1/chat/completions';

        // Monta o payload da requisição utilizando o histórico completo
        const data = {
            model: "gpt-4o",
            messages: messages,
            max_tokens: 150,
            temperature: 0.7
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${chave}`
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            return result.choices[0].message.content;
        } catch (error) {
            console.error("Erro na comunicação com a API:", error);
            return "Desculpe, ocorreu um erro ao processar sua solicitação.";
        }
    }

    // Função para exibir a resposta da API no chat
    function exibirResposta(resposta) {
        const respostaDiv = document.createElement("div");
        respostaDiv.classList.add("message", "bot-message");
        respostaDiv.innerHTML = `<p>${resposta}</p>`;
        chatWindow.appendChild(respostaDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    // Integração do envio da mensagem com a API da OpenAI
    sendButton.addEventListener("click", async function () {
        const message = userMessageInput.value.trim();
        if (message !== "") {
            // Exibe a mensagem do usuário no chat
            const userMessageDiv = document.createElement("div");
            userMessageDiv.classList.add("message", "user-message");
            userMessageDiv.innerHTML = `<p>${message}</p>`;
            chatWindow.appendChild(userMessageDiv);

            userMessageInput.value = "";
            chatWindow.scrollTop = chatWindow.scrollHeight;

            // Adiciona a mensagem do usuário ao histórico de conversas
            conversationHistory.push({ role: "user", content: message });

            // Envia o histórico completo para a API e exibe a resposta
            const resposta = await enviarParaAPI(conversationHistory);

            // Adiciona a resposta da API ao histórico de conversas
            conversationHistory.push({ role: "assistant", content: resposta });

            exibirResposta(resposta);
        }
    });

    // Permite enviar a mensagem ao pressionar a tecla Enter
    userMessageInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            sendButton.click();
        }
    });

    // Carregamento dinâmico do header e footer
    fetch('components/header-experimente.html')
        .then(response => response.text())
        .then(data => document.getElementById('header').innerHTML = data)
        .catch(error => console.error('Erro ao carregar o header:', error));

    fetch('components/footer.html')
        .then(response => response.text())
        .then(data => document.getElementById('footer').innerHTML = data)
        .catch(error => console.error('Erro ao carregar o footer:', error));
});
