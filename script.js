// Dane testowe (zamiast API Sejmu)
const sessionsData = [
    { id: 1, number: 1, date: '2023-01-01' },
    { id: 2, number: 2, date: '2023-01-15' },
    { id: 3, number: 3, date: '2023-02-01' }
];

const votesData = {
    1: [
        { name: "Jan Kowalski", vote: "Za" },
        { name: "Anna Nowak", vote: "Przeciw" },
        { name: "Tomasz Wiśniewski", vote: "Wstrzymał się" }
    ],
    2: [
        { name: "Paweł Malinowski", vote: "Za" },
        { name: "Marek Kaczmarek", vote: "Przeciw" }
    ],
    3: [
        { name: "Katarzyna Zawisza", vote: "Za" },
        { name: "Piotr Nowak", vote: "Wstrzymał się" }
    ]
};

document.addEventListener("DOMContentLoaded", function() {
    const sessionSelect = document.getElementById("sessionSelect");
    const voteSelect = document.getElementById("voteSelect");
    const resultsTable = document.getElementById("resultsTable").getElementsByTagName('tbody')[0];

    // Funkcja ładowania posiedzeń do selecta
    function loadSessions() {
        sessionsData.forEach(session => {
            const option = document.createElement('option');
            option.value = session.id;
            option.textContent = `Posiedzenie ${session.number} - ${session.date}`;
            sessionSelect.appendChild(option);
        });
    }

    // Funkcja ładowania głosowań
    function loadVotes(sessionId) {
        voteSelect.innerHTML = `<option value="">Wybierz głosowanie</option>`;
        if (!votesData[sessionId]) return;

        votesData[sessionId].forEach((vote, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `Głosowanie ${index + 1}`;
            voteSelect.appendChild(option);
        });

        voteSelect.disabled = false;
    }

    // Funkcja wyświetlania wyników głosowania
    function displayVoteResults(sessionId, voteIndex) {
        resultsTable.innerHTML = '';

        if (!votesData[sessionId] || !votesData[sessionId][voteIndex]) return;

        votesData[sessionId][voteIndex].forEach(result => {
            const row = resultsTable.insertRow();
            const nameCell = row.insertCell(0);
            const voteCell = row.insertCell(1);
            nameCell.textContent = result.name;
            voteCell.textContent = result.vote;
        });
    }

    // Ładowanie posiedzeń
    loadSessions();

    // Obsługa zmiany posiedzenia
    sessionSelect.addEventListener('change', function() {
        const sessionId = parseInt(sessionSelect.value);
        if (sessionId) {
            loadVotes(sessionId);
        } else {
            voteSelect.disabled = true;
            resultsTable.innerHTML = '';
        }
    });

    // Obsługa zmiany głosowania
    voteSelect.addEventListener('change', function() {
        const sessionId = parseInt(sessionSelect.value);
        const voteIndex = parseInt(voteSelect.value);
        displayVoteResults(sessionId, voteIndex);
    });
});
