// Made by: @mkl.08 (Discord) | @pomcodes | 2024 
document.addEventListener('DOMContentLoaded', function() {
    AOS.init();

    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    function filterItems(category) {
        menuItems.forEach(item => {
            item.classList.remove('show');
            
            if (category === 'all' || item.dataset.category === category) {
                setTimeout(() => {
                    item.style.display = 'flex';
                    item.offsetHeight;
                    item.classList.add('show');
                }, 100);
            } else {
                item.style.display = 'none';
            }
        });
    }

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.category;
            filterItems(category);
        });
    });

    filterItems('all');
});

document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('show');
        }, index * 100); 
    });
});
