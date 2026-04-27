// Modal Functions
function openModal(programName = '') {
    const modal = document.getElementById('modal');
    const programInput = document.getElementById('modal-program');
    
    if (programName) {
        programInput.value = programName;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Отправка формы в контакты
function handleSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: e.target.querySelector('input[type="text"]').value,
        phone: e.target.querySelector('input[type="tel"]').value,
        program: e.target.querySelector('select').value,
        comment: e.target.querySelector('textarea').value,
        date: ''
    };
    
    sendToTelegram(formData, e.target);
}

// Отправка формы в модальном окне
function handleModalSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: e.target.querySelector('input[type="text"]').value,
        phone: e.target.querySelector('input[type="tel"]').value,
        program: document.getElementById('modal-program').value,
        date: e.target.querySelector('input[type="date"]').value,
        comment: ''
    };
    
    sendToTelegram(formData, e.target, true);
}

// Универсальная функция отправки в Telegram
function sendToTelegram(data, form, isModal = false) {
    // Показываем индикатор загрузки
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '⏳ Отправка...';
    submitBtn.disabled = true;
    
    fetch('send-telegram.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert('✅ Заявка отправлена! Мы перезвоним вам в ближайшее время.');
            form.reset();
            if (isModal) {
                closeModal();
            }
        } else {
            throw new Error('Ошибка сервера');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('❌ Произошла ошибка. Пожалуйста, позвоните нам напрямую: +7 (906) 710-22-27');
    })
    .finally(() => {
        // Возвращаем кнопку в исходное состояние
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

// Mobile Menu
function toggleMenu() {
    const nav = document.getElementById('nav');
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
});

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.program-card, .review-card, .pricing-card, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s, transform 0.6s';
    observer.observe(el);
});