document.addEventListener('DOMContentLoaded', () => {
  const openMenuBtn = document.getElementById('openMenuBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const viewProfileBtn = document.getElementById('viewProfileBtn');

  const openSidebar = () => {
      sidebar.classList.add('active');
      sidebarOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; 
  };

  const closeSidebar = () => {
      sidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
      document.body.style.overflow = '';
  };

  openMenuBtn.addEventListener('click', openSidebar);
  closeMenuBtn.addEventListener('click', closeSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);

  viewProfileBtn.addEventListener('click', () => {
      alert('Carregando os dados completos do seu perfil...');
  });
});