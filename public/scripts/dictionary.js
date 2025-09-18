const typeTranslations = {
    "Noun": "İsim",
    "Verb": "Fiil",
    "Adjective": "Sıfat",
    "Adverb": "Zarf",
    "Pronoun": "Zamir",
    "Preposition": "Edat",
    "Conjunction": "Bağlaç",
    "Interjection": "Ünlem"
};


document.querySelector(".dictionary-search-box").addEventListener("submit", async (e) => {
    e.preventDefault(); 

    const word = document.getElementById("wordInput").value.trim();
    if (!word) return;

    const placeholder = document.querySelector(".dictionary-result-placeholder");

    placeholder.classList.add("centered");
    placeholder.innerHTML = "Aranıyor...";

    try {
        const res = await fetch("/dictionary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: word })
        });

        const data = await res.json();

        if (!data || Object.keys(data).length === 0) {
            placeholder.innerHTML = `<p>Kelime bulunamadı.</p>`;
            return;
        }
        
        placeholder.classList.remove("centered");

        let html = `
  <div class="dictionary-entry">
    <div class="word-title">
      ${data.word} - ${data.translation.word}
    </div>
`;


        const usedTypes = new Set();
        data.meanings.forEach(m => {
            const typeTr = typeTranslations[m.type] || m.type;
            if (!usedTypes.has(typeTr)) {
                html += `<div class="word-type">
  <span class="type-red">${m.type}</span> - ${typeTranslations[m.type]}
</div>`;
                usedTypes.add(typeTr);
            }

            html += `
        <div class="meaning-block">
        <div><span class="translation-label">meaning:</span> ${m.meaning}</div>
        <div><span class="translation-label">anlam:</span> ${m.translation}</div>
        </div>
      `;
        });

        if (data.synonyms.length) {
            html += `
        <div class="synonyms-block">
          <div><span class="translation-label">synonyms:</span> ${data.synonyms.map(s => s.word).join(", ")}</div>
          <div><span class="translation-label">eş anlamlılar:</span> ${data.synonyms.map(s => s.translation).join(", ")}</div>
        </div>
      `;
        }

        if (data.antonyms.length) {
            html += `
        <div class="antonyms-block">
          <div><span class="translation-label">antonyms:</span> ${data.antonyms.map(a => a.word).join(", ")}</div>
          <div><span class="translation-label">türkçe zıt anlamlar:</span> ${data.antonyms.map(a => a.translation).join(", ")}</div>
        </div>
      `;
        }

        html += `</div>`;
        placeholder.innerHTML = html;

    } catch (err) {
        console.error(err);
        placeholder.classList.remove("centered");
        placeholder.innerHTML = "<p>Bir hata oluştu.</p>";
    }
});
