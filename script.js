const API_BASE = 'https://api.sejm.gov.pl/sejm';
let currentTerm = '';
let mpsData = {};

// Inicjalizacja
document.addEventListener('DOMContentLoaded', async () => {
    await loadCurrentTerm();
    if (currentTerm) {
        await loadProceedings();
        await loadMPs();
    }
});

// Pobierz aktualną kadencję
async function loadCurrentTerm() {
    try {
        const response = await fetch(`${API_BASE}/term`);
        console.log("Response status for term:", response.status);
        if (!response.ok) throw new Error('Nie udało się pobrać danych o kadencji.');
        const terms = await response.json();
        console.log("Fetched terms:", terms); // Debug
        if (!terms.length) throw new Error('Brak dostępnych kadencji.');
        
        // Wybieramy bieżącą kadencję, bazując na "current: true"
        const currentTermData = terms.find(term => term.current);
        if (currentTermData) {
            currentTerm = currentTermData.num; // Zmienna "num" zawiera numer kadencji
            console.log("Ustalono bieżącą kadencję:", currentTerm);
        } else {
            throw new Error('Nie znaleziono bieżącej kadencji.');
        }
    } catch (error) {
        showError('Błąd pobierania kadencji: ' + error.message);
    }
}

// Pobierz listę posiedzeń
async function loadProceedings() {
    showLoading(true);
    try {
        const response = await fetch(`${API_BASE}/term/${currentTerm}/proceedings`);
        console.log("Response status for proceedings:", response.status);
        if (!response.ok) throw new Error('Nie udało się pobrać posiedzeń.');
        const proceedings = await response.json();
        console.log("Fetched proceedings:", proceedings); // Debug
        populateProceedings(proceedings);
    } catch (error) {
        showError('Błąd pobierania posiedzeń: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Pobierz listę posłów
async function loadMPs() {
    showLoading(true);
    try {
        if (Object.keys(mpsData).length) return;
        const response = await fetch(`${API_BASE}/term/${currentTerm}/MP`);
        console.log("Response status for MPs:", response.status);
        if (!response.ok) throw new Error('Nie udało się pobrać listy posłów.');
        const mps = await response.json();
        console.log("Fetched MPs:", mps); // Debug
        mpsData = mps.reduce((acc, mp) => {
            acc[mp.id] = mp;
            return acc;
        }, {});
    } catch (error) {
        showError('Błąd pobierania posłów: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Obsługa wyboru posiedzenia
document.getElementById('proceedings').addEventListener('change', async function (e) {
    const proceedingNum = e.target.value;
    if (!proceedingNum) return;

    showLoading(true);
    try {
        const response = await fetch(`${API_BASE}/term/${currentTerm}/proceedings/${proceedingNum}/votings`);
        console.log("Response status for votings:", response.status);
        if (!response.ok) throw new Error('Nie udało się pobrać głosowań.');
        const votings = await response.json();
        console.log("Fetched votings:", votings); // Debug
        populateVotings(votings);
        document.getElementById('votings').disabled = false;
    } catch (error) {
        showError('Błąd pobierania głosowań: ' + error.message);
    } finally {
        showLoading(false);
    }
});

// Obsługa wyboru głosowania
document.getElementById('votings').addEventListener('change', async function (e) {
    const [proceedingNum, votingNum] = e.target.value.split('-');
    if (!proceedingNum || !votingNum) return;

    showLoading(true);
    try {
        const response = await fetch(`${API_BASE}/term/${currentTerm}/proceedings/${proceedingNum}/votings/${votingNum}`);
        console.log("Response status for voting results:", response.status);
        if (!response.ok) throw new Error('Nie udało się pobrać wyników głosowania.');
        const votingDetails = await response.json();
        console.log("Fetched voting details:", votingDetails); // Debug
        displayVotingResults(votingDetails);
    } catch (error) {
        showError('Błąd pobierania wyników głosowania: ' + error.message);
    } finally {
        showLoading(false);
    }
});

// Funkcje pomocnicze
function populateProceedings(proceedings) {
    const select = document.getElementById('proceedings');
    if (proceedings.length === 0) {
        select.innerHTML = '<option value="">Brak dostępnych posiedzeń</option>';
        return;
    }
    select.innerHTML = proceedings
        .map(p => `<option value="${p.number}">Posiedzenie nr ${p.number}</option>`)
        .join('');
}

function populateVotings(votings) {
    const select = document.getElementById('votings');
    if (votings.length === 0) {
        select.innerHTML = '<option value="">Brak dostępnych głosowań</option>';
        select.disabled = true;
        return;
    }
    select.innerHTML = votings
        .map(v => `<option value="${v.proceeding}-${v.votingNumber}">${v.title}</option>`)
        .join('');
}

function displayVotingResults(voting) {
    const tbody = document.querySelector('#votes-table tbody');
    tbody.innerHTML = '';

    voting.votes.forEach(vote => {
        const mp = mpsData[vote.MP] || { lastFirstName: 'Nieznany poseł', club: 'Brak danych' };
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${mp.lastFirstName}</td>
            <td>${mp.club}</td>
            <td class="vote-${vote.vote.toLowerCase()}">${translateVote(vote.vote)}</td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('results').classList.remove('hidden');
}

function translateVote(vote) {
    const translations = {
        'YES': 'Za',
        'NO': 'Przeciw',
        'ABSTAIN': 'Wstrzymał się',
        'ABSENT': 'Nieobecny'
    };
    return translations[vote] || vote;
}

function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

function showError(message) {
    const errorContainer = document.getElementById('error-message');
    errorContainer.textContent = message;
    errorContainer.classList.remove('hidden');
    setTimeout(() => errorContainer.classList.add('hidden'), 5000);
}
