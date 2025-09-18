document.addEventListener('DOMContentLoaded', () => {
    const allWordsBtn = document.querySelector('.allwords-btn');
    const favoriteWordsBtn = document.querySelector('.favoritewords-btn');
    const wordList = document.getElementById('word-list');

    if (!wordList) return; 

    const words = document.querySelectorAll('.words');

    function filterWords(filterType) {
        words.forEach(wordElement => {
            const isFavorite = wordElement.getAttribute('data-is-favorite') === 'true';

            if (filterType === 'all') {
                wordElement.style.display = 'block';
            } else if (filterType === 'favorites') {
                if (isFavorite) {
                    wordElement.style.display = 'block';
                } else {
                    wordElement.style.display = 'none';
                }
            }
        });
    }

    allWordsBtn.addEventListener('click', () => {
        allWordsBtn.classList.add('active');
        favoriteWordsBtn.classList.remove('active');
        filterWords('all');
    });

    favoriteWordsBtn.addEventListener('click', () => {
        allWordsBtn.classList.remove('active');
        favoriteWordsBtn.classList.add('active');
        filterWords('favorites');
    });

    filterWords('all');
});
