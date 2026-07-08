
function switchTab(tabName) {
  
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(content => content.classList.add('hidden'));
  
  if (tabName === 'exclusivos') {
    buttons[0].classList.add('active');
    document.getElementById('tab-exclusivos').classList.remove('hidden');
  } else {
    buttons[1].classList.add('active');
    document.getElementById('tab-lei').classList.remove('hidden');
  }
}
function checkEnter(event) {
  if (event.key === "Enter") { enviarMensagem(); }
}
function enviarMensagem() {
  const input = document.getElementById("chat-input");
  const texto = input.value.trim();
  if (!texto) return;

  const areaMensagens = document.getElementById("chat-messages");

  const userMsg = document.createElement("p");
  userMsg.className = "user-msg";
  userMsg.textContent = texto;
  areaMensagens.appendChild(userMsg);

  input.value = ""; 

  setTimeout(() => {
    const botMsg = document.createElement("p");
    botMsg.className = "bot-msg";
    const txtMinusculo = texto.toLowerCase();
    if(txtMinusculo.includes("local") || txtMinusculo.includes("maringá") || txtMinusculo.includes("onde")) {
      botMsg.textContent = "O principal local em Maringá é o Hemocentro Regional, que fica na Av. Mandacaru, 1590. Lembre-se de agendar para evitar filas!";
    } else if(txtMinusculo.includes("benefício") || txtMinusculo.includes("ganhar") || txtMinusculo.includes("nível")) {
      botMsg.textContent = "Seu sistema está no nível Bronze! Doando mais uma vez, você vai para o nível Prata e libera as cortesias de jogos de futebol e mais descontos comerciais em Maringá.";
    } else {
      botMsg.textContent = "Excelente pergunta! Para doar hoje, lembre-se de estar bem alimentada, pesar mais de 50kg e dormir pelo menos 6 horas na noite anterior. O Doe+ agradece seu apoio!";
    }
    areaMensagens.appendChild(botMsg);
    areaMensagens.scrollTop = areaMensagens.scrollHeight; 
  }, 1000);
}