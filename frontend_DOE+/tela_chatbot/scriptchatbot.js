const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');

function openMenu() {
  sideMenu.classList.add('open');
  overlay.classList.add('active');
  sideMenu.setAttribute('aria-hidden', 'false');
  hamburgerBtn.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
  sideMenu.classList.remove('open');
  overlay.classList.remove('active');
  sideMenu.setAttribute('aria-hidden', 'true');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
}

hamburgerBtn.addEventListener('click', openMenu);
closeMenuBtn.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeMenu();
});

document.querySelectorAll('.menu-btn').forEach(function (btn, index) {
  btn.addEventListener('click', function () {
    console.log('Botão ' + (index + 1) + ' clicado — defina a ação aqui.');
  });
});

function sendSuggested(text) {
  if (chatInput) {
    chatInput.value = text;
    handleSend(new Event('submit'));
  }
}

function handleSend(e) {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  appendUserMessage(text);
  chatInput.value = '';

  const suggestions = document.getElementById('suggestions');
  if (suggestions) {
    suggestions.style.display = 'none';
  }

  
  const typingIndicator = createTypingIndicator();
  chatMessages.appendChild(typingIndicator);
  scrollToBottom();

  setTimeout(() => {
    
    typingIndicator.remove();
    generateLiaResponse(text);
  }, 1200); 
}

function appendUserMessage(text) {
  const userDiv = document.createElement('div');
  userDiv.className = 'message user-message';
  userDiv.innerHTML = `
    <div class="message-content">
      <p>${escapeHTML(text)}</p>
    </div>
  `;
  chatMessages.appendChild(userDiv);
  scrollToBottom();
}

function generateLiaResponse(userText) {
  
  let responseText = "Entendi sua dúvida! Como estou em fase de testes, você pode consultar o hemocentro mais próximo ou agendar diretamente no seu Dashboard Pessoal.";
  
  const lower = userText.toLowerCase();
  
  if (lower.includes('meia-entrada') || lower.includes('benefício')) {
    responseText = "No seu nível **Avançado**, você tem direito à meia-entrada em cinemas e teatros parceiros! Basta apresentar seu comprovante digital no app.";
  } else if (lower.includes('intervalo') || lower.includes('tempo')) {
    responseText = "Para homens, o intervalo é de **60 dias** (máx. 4 doações/ano). Para mulheres, o intervalo é de **90 dias** (máx. 3 doações/ano).";
  } else if (lower.includes('requisito') || lower.includes('requisitos')) {
    responseText = "Os requisitos básicos são: ter entre **16 e 69 anos**, pesar mais de **50kg**, estar descansado, bem alimentado e portar documento oficial com foto.";
  } else if (lower.includes('nível') || lower.includes('nivel')) {
    responseText = "Você precisa de mais **2 doações** mantendo a regularidade para atingir o nível máximo do programa!";
  }

  const liaDiv = document.createElement('div');
  liaDiv.className = 'message lia-message';
  liaDiv.innerHTML = `
    <div class="message-avatar">
      <svg viewBox="0 0 100 100" width="32" height="32">
        <path d="M50 8 C50 8, 18 45, 18 68 A32 32 0 0 0 82 68 C82 45, 50 8, 50 8 Z" fill="url(#dropGradient)" />
        <circle cx="42" cy="65" r="3.5" fill="#1E293B" />
        <circle cx="58" cy="65" r="3.5" fill="#1E293B" />
        <path d="M45 73 Q50 78 55 73" stroke="#1E293B" stroke-width="3" stroke-linecap="round" fill="none" />
      </svg>
    </div>
    <div class="message-content">
      <p>${responseText}</p>
    </div>
  `;
  
  chatMessages.appendChild(liaDiv);
  scrollToBottom();
}

function createTypingIndicator() {
  const indicatorDiv = document.createElement('div');
  indicatorDiv.className = 'message lia-message typing-indicator-container';
  indicatorDiv.innerHTML = `
    <div class="message-avatar">
      <svg viewBox="0 0 100 100" width="32" height="32">
        <path d="M50 8 C50 8, 18 45, 18 68 A32 32 0 0 0 82 68 C82 45, 50 8, 50 8 Z" fill="url(#dropGradient)" />
        <circle cx="42" cy="65" r="3.5" fill="#1E293B" />
        <circle cx="58" cy="65" r="3.5" fill="#1E293B" />
        <path d="M45 73 Q50 78 55 73" stroke="#1E293B" stroke-width="3" stroke-linecap="round" fill="none" />
      </svg>
    </div>
    <div class="message-content">
      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  return indicatorDiv;
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
