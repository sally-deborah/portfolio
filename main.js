// Lista de seções e arquivos HTML
const sectionsToLoad = [
  { id: "inicio", file: "hero.html" },
  { id: "sobre", file: "about.html" },
  { id: "formacao", file: "education.html" },
  { id: "projetos", file: "projects.html" },
  { id: "pesquisa", file: "research.html" },
  { id: "contato", file: "contact.html" },
  { id: "footer", file: "footer.html" }
];

// Referência do botão voltar ao topo
let backToTopButton = null;

// Função: carregar as seções e iniciar o restante
function loadSectionsAndInit(callback) {
  const promises = sectionsToLoad.map(section =>
    fetch(section.file)
      .then(res => res.text())
      .then(html => {
        const container = document.getElementById(section.id);
        if (container) container.innerHTML = html;
      })
  );

  Promise.all(promises).then(() => {
    // Adiciona classe de seção para referência geral
    document.querySelectorAll('section').forEach(sec => {
      sec.classList.add('section');
    });

    backToTopButton = document.getElementById('back-to-top');

    // Aguarda próxima pintura do DOM para garantir que tudo foi carregado e renderizado
    requestAnimationFrame(() => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  });
}

// Inicialização pós-carregamento
loadSectionsAndInit(() => {
  // Garante que ScrollReveal funcione com elementos dinâmicos
  ScrollReveal().clean('.sr-item');
  ScrollReveal().reveal('.sr-item', {
    origin: 'bottom',
    distance: '50px',
    duration: 1000,
    delay: 100,
    interval: 100,
    reset: true
  });

  // Menu mobile toggle
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Fechar menu ao clicar em link
  document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });

        if (!mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }
      }
    });
  });

  // Highlight active nav-link
  const navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', function () {
    let current = '';
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Botão voltar ao topo
  if (backToTopButton) {
    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.remove('hidden');
        backToTopButton.classList.add('flex');
      } else {
        backToTopButton.classList.add('hidden');
        backToTopButton.classList.remove('flex');
      }
    });

    backToTopButton.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
