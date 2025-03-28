document.addEventListener("DOMContentLoaded", function () {
    const setupForm = document.getElementById("setup-form");
    const spinner = document.getElementById("spinner");
    const chatContainer = document.getElementById("chat-container");
    const greetingElement = document.getElementById("greeting");

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

        // Exibe o spinner
        spinner.style.display = "block";

        // Simula um tempo de processamento de 1 segundo
        setTimeout(function () {
            spinner.style.display = "none";
            chatContainer.style.display = "block";

            // Exibe a saudação inicial personalizada
            greetingElement.textContent = `Olá ${name}, tudo bem? Como posso lhe ajudar hoje?`;

            // Monta o prompt inicial para a API do OpenAI
            const initialPrompt = `Você é um assistente financeiro do Banco do Brasil e deve fingir realizar movimentações financeiras, dar sugestões de investimentos, realizar oferta e contratação de produtos financeiros comercializados pelos Banco do Brasil. Você está atendendo o cliente ${name}, que possui saldo em conta corrente de ${balance}, sua idade é de ${age} anos e possui um perfil de investimentos ${investmentProfile}. Segue a mensagem do ${name} para que realize o atendimento:`;

            console.log("Prompt inicial:", initialPrompt);

            // Aqui pode ser iniciada a comunicação com a API da OpenAI
            // Exemplo: iniciarChat(initialPrompt);
        }, 1000);
    });

    // Funcionalidade básica do chat
    const sendButton = document.getElementById("sendButton");
    const userMessageInput = document.getElementById("userMessage");
    const chatWindow = document.getElementById("chat-window");

    sendButton.addEventListener("click", function () {
        const message = userMessageInput.value.trim();
        if (message !== "") {
            // Exibe a mensagem do usuário
            const userMessageDiv = document.createElement("div");
            userMessageDiv.classList.add("message", "user-message");
            userMessageDiv.innerHTML = `<p>${message}</p>`;
            chatWindow.appendChild(userMessageDiv);

            userMessageInput.value = "";
            chatWindow.scrollTop = chatWindow.scrollHeight;

            // Aqui você integraria a chamada para a API com o prompt concatenado com a mensagem do usuário
            // Exemplo:
            // enviarParaAPI(initialPrompt + message).then(resposta => { exibirResposta(resposta); });
        }
    });

    // Permite enviar a mensagem ao pressionar Enter
    userMessageInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            sendButton.click();
        }
    });


        fetch('components/header-experimente.html')
      .then(response => response.text())
      .then(data => document.getElementById('header').innerHTML = data)
      .catch(error => console.error('Erro ao carregar o header:', error));

        fetch('components/footer.html')
      .then(response => response.text())
      .then(data => document.getElementById('footer').innerHTML = data)
      .catch(error => console.error('Erro ao carregar o footer:', error));


});
