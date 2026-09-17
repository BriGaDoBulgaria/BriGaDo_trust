class MultiStepForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;
        
        // Определи типа на формата (по ID или data атрибут)
        this.formType = this.form.dataset.formType || 'agent'; // по подразбиране agent
        this.sections = this.form.querySelectorAll('.form-section');
        this.btnPrev = this.form.querySelector('.btn-prev');
        this.btnNext = this.form.querySelector('.btn-next');
        this.currentSection = 0;
        
        if (this.sections.length === 0) return;
        
        this.init();
    }
    
    init() {
        this.showSection(0);
        
        this.btnPrev.addEventListener('click', () => this.prev());
        this.btnNext.addEventListener('click', () => this.next());
    }
    
    showSection(index) {
        this.sections.forEach(section => section.classList.remove('active'));
        this.sections[index].classList.add('active');
        
        this.btnPrev.disabled = index === 0;
        this.btnNext.textContent = index === this.sections.length - 1 ? 'Потвърди' : 'Продължи →';
        
        this.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Функция за получаване на етикет на поле
    getFieldLabel(field) {
        const label = field.closest('.form-group')?.querySelector('label');
        if (label) {
            return label.textContent.replace('*', '').trim();
        }
        if (field.placeholder) {
            return field.placeholder;
        }
        return field.name || 'Поле';
    }
    
    // Помощна функция за добавяне на грешка
    addError(field, errors, message) {
        field.classList.add('error');
        errors.push(message || this.getFieldLabel(field));
    }
    
    // ========== ДИФЕРЕНЦИАЛНА ВАЛИДАЦИЯ ==========
    validateSection(index) {
        const section = this.sections[index];
        const fields = section.querySelectorAll('input, select, textarea');
        const errors = [];
        
        fields.forEach(field => {
            if (field.type === 'hidden') return;
            
            // 1. Проверка за задължителни полета (required)
            if (field.hasAttribute('required')) {
                if (field.type === 'file') {
                    if (field.files.length === 0) {
                        this.addError(field, errors);
                    } else {
                        field.classList.remove('error');
                    }
                } else if (field.value.trim() === '') {
                    this.addError(field, errors);
                } else {
                    field.classList.remove('error');
                }
            }
            
            // 2. Проверка за парола (ако има такова поле)
            if (field.type === 'password' && field.value) {
                const passwordRegex = /^(?=.*[0-9].*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\/-]).{8,}$/;
                if (!passwordRegex.test(field.value)) {
                    this.addError(field, errors, 'Парола (мин. 8 символа, 2 цифри, 1 специален символ)');
                } else {
                    field.classList.remove('error');
                }
            }
            
            // 3. Проверка за pattern (regex)
            if (field.pattern && field.value) {
                const regex = new RegExp(field.pattern);
                if (!regex.test(field.value)) {
                    this.addError(field, errors, this.getFieldLabel(field) + ' (невалиден формат)');
                } else {
                    field.classList.remove('error');
                }
            }
            
            // 4. Проверка за тип email
            if (field.type === 'email' && field.value) {
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(field.value)) {
                    this.addError(field, errors, this.getFieldLabel(field) + ' (невалиден имейл)');
                } else {
                    field.classList.remove('error');
                }
            }
            
            // 5. Проверка за тип url
            if (field.type === 'url' && field.value) {
                const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
                if (!urlRegex.test(field.value)) {
                    this.addError(field, errors, this.getFieldLabel(field) + ' (невалиден URL)');
                } else {
                    field.classList.remove('error');
                }
            }
            
            // 6. Проверка за тип date
            if (field.type === 'date' && field.value) {
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                if (!dateRegex.test(field.value)) {
                    this.addError(field, errors, this.getFieldLabel(field) + ' (невалидна дата)');
                } else {
                    field.classList.remove('error');
                }
            }
            
            // 7. Проверка за тип tel
            if (field.type === 'tel' && field.value) {
                const telRegex = /^(\+359|0)?\s?[0-9]{9}$/;
                if (!telRegex.test(field.value)) {
                    this.addError(field, errors, this.getFieldLabel(field) + ' (невалиден телефон)');
                } else {
                    field.classList.remove('error');
                }
            }
            
            // 8. Проверка за тип number
            if (field.type === 'number' && field.value) {
                if (isNaN(field.value)) {
                    this.addError(field, errors, this.getFieldLabel(field) + ' (невалидно число)');
                } else {
                    field.classList.remove('error');
                }
            }
            
            // 9. Проверка за тип text (задължителни полета с дължина < 2)
            if (field.type === 'text' && field.value.trim().length < 2) {
                this.addError(field, errors, this.getFieldLabel(field) + ' (твърде кратко)');
            } else {
                field.classList.remove('error');
            }
        });
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    prev() {
        if (this.currentSection > 0) {
            this.currentSection--;
            this.showSection(this.currentSection);
        }
    }
    
    next() {
        const validation = this.validateSection(this.currentSection);
        
        if (!validation.isValid) {
            const errorMessage = 'Моля, попълнете правилно следните полета:\n\n' + 
                                 validation.errors.map((error, index) => `${index + 1}. ${error}`).join('\n');
            alert(errorMessage);
            return;
        }
        
        if (this.currentSection === this.sections.length - 1) {
            this.submitForm();
        } else {
            this.currentSection++;
            this.showSection(this.currentSection);
        }
    }
    
    submitForm() {
        console.log('Формата е попълнена успешно!');
        alert('Регистрацията е завършена!');
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    new MultiStepForm('agent-registration-form');
    new MultiStepForm('employer-registration-form');
    new MultiStepForm('employee-registration-form');
});