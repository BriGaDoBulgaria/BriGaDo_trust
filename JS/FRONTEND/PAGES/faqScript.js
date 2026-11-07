document.addEventListener('DOMContentLoaded', function() {
    // Наблюдаваме DOM-а за промени
    const observer = new MutationObserver(function(mutations, obs) {
        const accordionContainer = document.getElementById('faqAccordion');

        // Ако контейнерът вече съществува, стартираме
        if (accordionContainer) {
            loadFAQ(accordionContainer);
            obs.disconnect(); // Спираме да наблюдаваме
        }
    });

    // Започваме да наблюдаваме
    observer.observe(document.body, { childList: true, subtree: true });
});

async function loadFAQ(accordionContainer) {
    try {
        const response = await fetch('/data/faq.json');

        if (!response.ok) {
            throw new Error(`Грешка при зареждане: ${response.status}`);
        }

        const data = await response.json();
        const questions = data.questions;

        // Изчистване на лоудъра
        accordionContainer.innerHTML = '';

        if (!questions || questions.length === 0) {
            accordionContainer.innerHTML = '<p class="text-center text-muted">Все още няма добавени въпроси.</p>';
            return;
        }

        let accordionHTML = '';

        questions.forEach((item, index) => {
            const itemId = `faq-item-${index}`;
            const isFirst = index === 0;

            accordionHTML += `
                <div class="accordion-item faq-item">
                    <h2 class="accordion-header" id="heading-${itemId}">
                        <button class="accordion-button ${isFirst ? '' : 'collapsed'}"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapse-${itemId}"
                                aria-expanded="${isFirst ? 'true' : 'false'}"
                                aria-controls="collapse-${itemId}">
                            ${item.question}
                        </button>
                    </h2>
                    <div id="collapse-${itemId}"
                         class="accordion-collapse collapse ${isFirst ? 'show' : ''}"
                         aria-labelledby="heading-${itemId}"
                         data-bs-parent="#faqAccordion">
                        <div class="accordion-body">
                            ${item.answer}
                        </div>
                    </div>
                </div>
            `;
        });

        accordionContainer.innerHTML = accordionHTML;

    } catch (error) {
        console.error('Грешка при зареждане на FAQ:', error);
        accordionContainer.innerHTML = `
            <div class="alert alert-danger text-center" role="alert">
                Възникна грешка при зареждането на въпросите. Моля, опитайте по-късно.
            </div>
        `;
    }
}
