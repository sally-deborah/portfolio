// Lista de seções e arquivos HTML
const sectionsToLoad = [
  { id: "Inicio", file: "hero.html" },
  { id: "Projetos", file: "projects.html" },
  { id: "Publicações", file: "research.html" },
  { id: "Contato", file: "contact.html" },
  { id: "footer", file: "footer.html" }
];

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
    document.querySelectorAll('section').forEach(sec => {
      sec.classList.add('section');
    });

    requestAnimationFrame(() => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  });
}

// Inicialização pós-carregamento
loadSectionsAndInit(() => {
  // Sidebar toggle (mobile)
  const menuBtn = document.getElementById('menu-btn');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');

  function openSidebar() {
    sidebar.classList.remove('-translate-x-full');
    sidebarOverlay.classList.remove('hidden');
  }

  function closeSidebar() {
    sidebar.classList.add('-translate-x-full');
    sidebarOverlay.classList.add('hidden');
  }

  if (menuBtn && sidebar && sidebarOverlay) {
    menuBtn.addEventListener('click', () => {
      if (sidebar.classList.contains('-translate-x-full')) {
        openSidebar();
      } else {
        closeSidebar();
      }
    });

    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  // ===== Troca de idioma (PT / EN) =====
  const langButtons = document.querySelectorAll('.lang-btn');

  function applyLanguage(lang) {
    document.querySelectorAll('[data-pt]').forEach(el => {
      const text = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-pt');
      if (text !== null) el.textContent = text;
    });

    document.querySelectorAll('[data-pt-placeholder]').forEach(el => {
      const text = lang === 'en'
        ? el.getAttribute('data-en-placeholder')
        : el.getAttribute('data-pt-placeholder');
      if (text !== null) el.setAttribute('placeholder', text);
    });

    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'pt-BR');

    langButtons.forEach(btn => {
      btn.classList.toggle('active-lang', btn.dataset.lang === lang);
    });

    localStorage.setItem('portfolio-lang', lang);
  }

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });

  const savedLang = localStorage.getItem('portfolio-lang') || 'pt';
  applyLanguage(savedLang);

  // ===== Troca de seções (estilo abas) =====
  const allSections = document.querySelectorAll('#main-content > .page-section');
  const navLinks = document.querySelectorAll('.nav-link');

  function showSection(targetId) {
    allSections.forEach(sec => {
      sec.classList.toggle('hidden', sec.id !== targetId);
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${targetId}`);
    });

    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').replace('#', '');
      showSection(targetId);

      if (window.innerWidth < 768) {
        closeSidebar();
      }
    });
  });

  // Mostra a seção inicial ao carregar
  showSection('Inicio');
});

document.addEventListener('submit', function (e) {
  if (e.target && e.target.id === 'contact-form') {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        form.reset();
        showToast("Mensagem enviada com sucesso!");
      } else {
        response.json().then(data => {
          showToast(data.errors ? data.errors[0].message : "Erro ao enviar.");
        });
      }
    }).catch(() => {
      showToast("Erro de conexão. Tente novamente.");
    });
  }
});

function showToast(message) {
  const toast = document.getElementById('form-toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('opacity-0');

  setTimeout(() => toast.classList.remove('opacity-0'), 100);
  setTimeout(() => toast.classList.add('opacity-0'), 4000);
  setTimeout(() => toast.classList.add('hidden'), 4500);
}
