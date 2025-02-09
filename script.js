document.addEventListener("DOMContentLoaded", function () {
    const sessionSelect = document.getElementById('sessionSelect');
    const voteSelect = document.getElementById('voteSelect');
    const voteResults = document.getElementById('voteResults');

    // Funkcja do pobrania listy posiedzeń Sejmu
    async function getSessions() {
        try {
            const response = await fetch('https://api.sejm.gov.pl/sejm/term10/sittings');
            const data = await response.json();
            
            // Wypełnianie selecta z posiedzeniami
            data.forEach(session => {
                const option = document.createElement('option');
                option.value = session.id;
                option.textContent = `Posiedzenie ${session.number} - ${session.date}`;
                sessionSelect.appendChild(option);
            });

        } catch (error) {
            console.error('Błąd podczas pobierania posiedzeń:', error);
        }
    }

    // Funkcja do pobrania głosowań dla wybranego posiedzenia
    async function getVotes(sessionId) {
        try {
            const response = await fetch(`https://api.sejm.gov.pl/sejm/term10/sittings/${sessionId}/votes`);
            const data = await response.json();
            
            // Wypełnianie selecta z głosowaniami
            voteSelect.innerHTML = ''; // Czyścimy poprzednie opcje
            data.forEach(vote => {
                const option = document.createElement('option');
                option.value = vote.id;
                option.textContent = `Głosowanie ${vote.number} - ${vote.title}`;
                voteSelect.appendChild(option);
            });

        } catch (error) {
            console.error('Błąd podczas pobierania głosowań:', error);
        }
    }

    // Funkcja do pobrania wyników głosowania
    async function getVoteResults(voteId) {
        try {
            const response = await fetch(`https://api.sejm.gov.pl/sejm/term10/votes/${voteId}`);
            const data = await response.json();

            // Wyświetlanie wyników głosowania
            voteResults.innerHTML = '';
            data.votes.forEach(vote => {
                const voteItem = document.createElement('div');
                voteItem.classList.add('vote-item');
                voteItem.innerHTML = `
                    <strong>${vote.name}</strong>: ${vote.vote === 'yes' ? 'Za' : vote.vote === 'no' ? 'Przeciw' : 'Wstrzymał się'}
                `;
                voteResults.appendChild(voteItem);
            });

        } catch (error) {
            console.error('Błąd podczas pobierania wyników głosowania:', error);
        }
    }

    // Obsługa zmiany posiedzenia
    sessionSelect.addEventListener('change', function () {
        const sessionId = sessionSelect.value;
        if (sessionId) {
            getVotes(sessionId);
        }
    });

    // Obsługa zmiany głosowania
    voteSelect.addEventListener('change', function () {
        const voteId = voteSelect.value;
        if (voteId) {
            getVoteResults(voteId);
        }
    });

    // Inicjalizacja: pobranie listy posiedzeń
    getSessions();
});
