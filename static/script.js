document.getElementById('noteForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const loading = document.getElementById('loading');
    // Changed container ID to 'flashcards-container'
    const container = document.getElementById('flashcards-container'); 
    const progress = document.getElementById('progress');
    const downloadBtn = document.getElementById('downloadBtn');

    container.innerHTML = '';
    progress.innerHTML = 'Generating flashcards...';
    loading.style.display = 'block';

    try {
        const response = await fetch('/generate', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        loading.style.display = 'none';

        if (!Array.isArray(data)) throw new Error("Invalid flashcard format");

        container.innerHTML = ''; // clear again

        data.forEach((card, index) => {
            if (!card.question || !card.answer) return;

            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            cardDiv.innerHTML = `
                <div class="inner">
                    <div class="front">${card.question}</div>
                    <div class="back">${card.answer}</div>
                </div>
                <button class="speak" data-text="${card.question}">🔊</button>
            `;

            // Flip on inner click
            cardDiv.querySelector('.inner').addEventListener('click', () => {
                cardDiv.classList.toggle('flipped');
            });

            container.appendChild(cardDiv);
        });

        progress.innerText = `You have ${data.length} flashcards`;

        downloadBtn.style.display = 'inline-block';
        downloadBtn.onclick = () => {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'flashcards.json';
            a.click();
        };

        // Speech buttons
        document.querySelectorAll('.speak').forEach(button => {
            button.addEventListener('click', e => {
                e.stopPropagation(); // prevent card flip
                const text = button.getAttribute('data-text');
                const utterance = new SpeechSynthesisUtterance(text);
                speechSynthesis.cancel(); // cancel any current speech
                speechSynthesis.speak(utterance);
            });
        });

    } catch (error) {
        loading.style.display = 'none';
        container.innerHTML = `<p style="color:red;">Error generating flashcards. Please try again.</p>`;
        console.error(error);
    }
});

// Dark mode toggle
document.getElementById('toggleTheme').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
