const API_BASE = 'https://api.sejm.gov.pl/sejm';
let currentTerm = '';
let mpsData = {};

// Inicjalizacja
document.addEventListener('DOMContentLoaded', async () => {
    await loadCurrentTerm();
    await loadProceedings();
    await loadMPs();
});

// Pobierz aktualną kadencję
async function loadCurrentTerm() {
    try {
        const response = await fetch(`${API_BASE}/terms`);
        if (!response.ok) throw new Error('Nie udało się pobrać danych o kadencji.');
        const terms = await response.json();
        if (!terms.length) throw new Error('Brak dostępnych kadencji.');
        currentTerm = terms.find(t => t.current)?.num;
        if (!currentTerm) throw new Error('Nie znaleziono aktualnej kadencji.');
    } catch (error) {
        showError('Błąd pobierania kadencji: ' + error.message);
    }
}

// Pobierz listę posiedzeń
async function loadProceedings() {
    showLoading(true);
    try {
        const response = await fetch(`${API_BASE}/term/${currentTerm}/proceedings`);
        if (!response.ok) throw new Error('Nie udało się pobrać posiedzeń.');
        const proceedings = await response.json();
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
        if (Object.keys(mpsData).length) return; // Optymalizacja: jeśli już załadowano, pomijamy
        const response = await fetch(`${API_BASE}/term/${currentTerm}/MP`);
        if (!response.ok) throw new Error('Nie udało się pobrać listy posłów.');
        const mps = await response.json();
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
        const response = await fetch(`${API_BASE}/term/${currentTerm}/votings/${proceedingNum}`);
        if (!response.ok) throw new Error('Nie udało się pobrać głosowań.');
        const votings = await response.json();
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
        const response = await fetch(`${API_BASE}/term/${currentTerm}/votings/${proceedingNum}/${votingNum}`);
        if (!response.ok) throw new Error('Nie udało się pobrać wyników głosowania.');
        const votingDetails = await response.json();
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
    setTimeout(() => errorContainer.classList.add('hidden'), 5000); // Ukrycie po 5 sekundach
}
