const API_BASE_URL = "https://api.sejm.gov.pl/sejm"; // Adres bazowy API Sejm

let currentTerm = 10; // Przykład, można dostosować do aktualnej kadencji
let currentMPId = 1; // Przykład, można dostosować do ID posła

// Funkcja do obsługi błędów
function handleError(response) {
    if (!response.ok) {
        console.error(`Error ${response.status}: ${response.statusText}`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
}

// Funkcja do pobrania kadencji Sejmu
async function fetchTerms() {
    const response = await fetch(`${API_BASE_URL}/term`);
    handleError(response);
    const terms = await response.json();
    console.log('Fetched terms:', terms);
    const currentTerm = terms.find(term => term.current);
    console.log('Current term set to:', currentTerm.num);
    return currentTerm.num;
}

// Funkcja do pobrania listy posłów
async function fetchMPs(term) {
    const response = await fetch(`${API_BASE_URL}/term${term}/MP`);
    handleError(response);
    const MPs = await response.json();
    console.log(`Fetched MPs for term ${term}:`, MPs);
    renderMPs(MPs); // Renderowanie posłów w tabeli
    return MPs;
}

// Funkcja do pobrania szczegółowych danych posła
async function fetchMPDetails(term, MPId) {
    const response = await fetch(`${API_BASE_URL}/term${term}/MP/${MPId}`);
    handleError(response);
    const MPDetails = await response.json();
    console.log('Fetched MP details:', MPDetails);
    return MPDetails;
}

// Funkcja do pobrania głosowań posła
async function fetchMPVotings(term, MPId, proceeding, date) {
    const response = await fetch(`${API_BASE_URL}/term${term}/MP/${MPId}/votings/${proceeding}/${date}`);
    handleError(response);
    const votings = await response.json();
    console.log('Fetched MP votings:', votings);
    return votings;
}

// Funkcja do pobrania zdjęcia posła
async function fetchMPPhoto(term, MPId) {
    const response = await fetch(`${API_BASE_URL}/term${term}/MP/${MPId}/photo`);
    handleError(response);
    const photoBlob = await response.blob();
    console.log('Fetched MP photo:', photoBlob);
    return URL.createObjectURL(photoBlob);
}

// Funkcja do pobrania zdjęcia mini posła
async function fetchMPMiniPhoto(term, MPId) {
    const response = await fetch(`${API_BASE_URL}/term${term}/MP/${MPId}/photo-mini`);
    handleError(response);
    const miniPhotoBlob = await response.blob();
    console.log('Fetched MP mini photo:', miniPhotoBlob);
    return URL.createObjectURL(miniPhotoBlob);
}

// Funkcja do pobrania transmisji wideo z Sejmu
async function fetchVideos(term, offset = 0, limit = 50) {
    const response = await fetch(`${API_BASE_URL}/term${term}/videos?offset=${offset}&limit=${limit}`);
    handleError(response);
    const videos = await response.json();
    console.log('Fetched videos:', videos);
    return videos;
}

// Funkcja do renderowania posłów w tabeli
function renderMPs(mps) {
    const tableBody = document.getElementById('mp-table-body');
    tableBody.innerHTML = ''; // Czyścimy tabelę przed dodaniem nowych danych

    mps.forEach(mp => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = `${mp.firstName} ${mp.lastName}`;
        row.appendChild(nameCell);

        const clubCell = document.createElement('td');
        clubCell.textContent = mp.club;
        row.appendChild(clubCell);

        const voteCell = document.createElement('td');
        voteCell.textContent = mp.vote || 'Brak danych'; // Dodajemy domyślny tekst
        row.appendChild(voteCell);

        // Dodanie klasy w zależności od głosu
        if (mp.vote === 'YES') {
            voteCell.classList.add('vote-yes');
        } else if (mp.vote === 'NO') {
            voteCell.classList.add('vote-no');
        } else if (mp.vote === 'ABSTAIN') {
            voteCell.classList.add('vote-abstain');
        } else {
            voteCell.classList.add('vote-absent');
        }

        tableBody.appendChild(row);
    });
}

// Funkcja do ustawienia kadencji i pobrania danych
async function initialize() {
    try {
        const term = await fetchTerms(); // Ustawienie bieżącej kadencji
        const MPs = await fetchMPs(term); // Pobranie listy posłów
        const MPDetails = await fetchMPDetails(term, currentMPId); // Pobranie szczegółów posła
        const MPPhoto = await fetchMPPhoto(term, currentMPId); // Pobranie zdjęcia posła
        const MPMiniPhoto = await fetchMPMiniPhoto(term, currentMPId); // Pobranie mini zdjęcia posła

        // Możesz dostosować te funkcje według potrzeb
        const videos = await fetchVideos(term, 0, 50); // Pobranie wideo (offset=0, limit=50)
    } catch (error) {
        console.error('Error during API calls:', error);
    }
}

// Uruchomienie funkcji inicjalizacyjnej
initialize();
