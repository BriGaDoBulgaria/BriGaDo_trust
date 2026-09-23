class ComponentLoader {
    static async load(selector, componentPath) {
        const element = document.querySelector(selector);
        
        // Ако елементът не съществува, пропусни
        if (!element) {
            console.info(`[ComponentLoader] ${selector} не е намерен - пропускам`);
            return;
        }
        
        try {
            const response = await fetch(componentPath);
            
            // Ако файлът не съществува (404 или друг статус), пропусни
            if (!response.ok) {
                console.error(`[ComponentLoader] ${componentPath} не съществува (${response.status}) - пропускам`);
                return;
            }
            
            const html = await response.text();
            element.innerHTML = html;
            console.log(`[ComponentLoader] Успешно зареден: ${selector} <- ${componentPath}`);
        } catch (error) {
            console.error(`[ComponentLoader] Грешка при ${componentPath}:`, error);
        }
    }
    
    static async loadAll(components) {
        // Филтрирай само тези, които имат съществуващ placeholder
        const validComponents = components.filter(c => document.querySelector(c.selector));
        
        if (validComponents.length === 0) {
            console.warn('[ComponentLoader] Няма валидни placeholder елементи.');
            return;
        }
        
        const promises = validComponents.map(c => this.load(c.selector, c.path));
        await Promise.all(promises);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await ComponentLoader.loadAll([
        { selector: '#navbar-placeholder', path: '/HTML/COMPONENTS/navbar.html' },
        { selector: '#mainPageText-placeholder', path: '/HTML/COMPONENTS/mainPageText.html' },
        { selector: '#mainPageTrustScore-placeholder', path: '/HTML/COMPONENTS/mainPageTrustScore.html' },
        { selector: '#mainPageFeatureRow-placeholder', path: '/HTML/COMPONENTS/mainPageFeatureRow.html' },
        { selector: '#mainPageStatRow-placeholder', path: '/HTML/COMPONENTS/mainPageStatRow.html' },

        // Navbar for signed in users
        { selector: '#navbar-employee-placeholder', path: '/HTML/COMPONENTS/navbar-registered.html' },
        { selector: '#sidebarEmployee-placeholder', path: '/HTML/COMPONENTS/sidebarEmployee.html' },
    ]);
});