document.addEventListener('DOMContentLoaded', () => {
    const allWordsBtn = document.getElementById('all-words-btn');
    const favoriteWordsBtn = document.getElementById('favorite-words-btn');
    const allWordsList = document.getElementById('all-words-list');
    const searchInput = document.querySelector('.search-word-input');
    const datePicker = document.querySelector('.date-picker');

    if (allWordsList && allWordsBtn && favoriteWordsBtn) {
        const words = Array.from(allWordsList.querySelectorAll('.words'));

        function filterByButtons(filterType = 'all', searchText = '') {
            words.forEach(wordElement => {
                const isFavorite = wordElement.getAttribute('data-is-favorite') === 'true';
                const wordText = wordElement.querySelector('.word-info p').innerText.toLowerCase();

                const matchesSearch = searchText === '' || wordText.includes(searchText.toLowerCase());
                const matchesFavorite = filterType === 'favorites' ? isFavorite : true;

                if (matchesSearch && matchesFavorite) {
                    wordElement.style.display = 'block';
                } else {
                    wordElement.style.display = 'none';
                }
            });
        }

        function filterByDate(selectedDate) {
            words.forEach(wordElement => {
                const dateAttr = wordElement.getAttribute('data-created-date');
                if (selectedDate && dateAttr === selectedDate) {
                    wordElement.style.display = 'block';
                } else if (!selectedDate) {
                    wordElement.style.display = 'block'; 
                } else {
                    wordElement.style.display = 'none';
                }
            });
        }

        // Buton olayları
        allWordsBtn.addEventListener('click', () => {
            allWordsBtn.classList.add('active');
            favoriteWordsBtn.classList.remove('active');
            filterByButtons('all', searchInput.value);
        });

        favoriteWordsBtn.addEventListener('click', () => {
            allWordsBtn.classList.remove('active');
            favoriteWordsBtn.classList.add('active');
            filterByButtons('favorites', searchInput.value);
        });

        // Arama inputu
        searchInput.addEventListener('input', () => {
            const filterType = favoriteWordsBtn.classList.contains('active') ? 'favorites' : 'all';
            filterByButtons(filterType, searchInput.value);
        });

        datePicker.addEventListener('change', () => {
            filterByDate(datePicker.value);
        });

        filterByButtons('all');
    }

    document.querySelectorAll('.favorite-form').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const actionUrl = form.action;
            const button = form.querySelector('.favorite-btn i');

            try {
                const response = await fetch(actionUrl, { method: 'POST' });
                if (response.ok) {
                    const isFavorite = button.classList.contains('fas');
                    if (isFavorite) {
                        button.classList.remove('fas', 'fa-star');
                        button.classList.add('far', 'fa-star');
                    } else {
                        button.classList.remove('far', 'fa-star');
                        button.classList.add('fas', 'fa-star');
                    }

                    const listItem = form.closest('.words');
                    if (listItem) listItem.setAttribute('data-is-favorite', (!isFavorite).toString());

                    const filterType = favoriteWordsBtn.classList.contains('active') ? 'favorites' : 'all';
                    filterByButtons(filterType, searchInput.value);
                } else {
                    console.error('Favori işlemi başarısız oldu.');
                }
            } catch (error) {
                console.error('Bir hata oluştu:', error);
            }
        });
    });

    document.querySelectorAll('.delete-form').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const actionUrl = form.action;
            const listItem = form.closest('.words');

            try {
                const response = await fetch(actionUrl, { method: 'POST' });
                if (response.ok && listItem) {
                    listItem.remove();
                } else {
                    console.error('Silme işlemi başarısız oldu.');
                }
            } catch (error) {
                console.error('Bir hata oluştu:', error);
            }
        });
    });
});
