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

// Funkcja do pobrania listy głosowań na posiedzeniu
async function fetchVotings(proceeding) {
    const response = await fetch(`${API_BASE_URL}/term${currentTerm}/votings/${proceeding}`);
    handleError(response);
    const votings = await response.json();
    console.log('Fetched votings:', votings);
    return votings;
}

// Funkcja do pobrania szczegółów konkretnego głosowania
async function fetchVotingDetails(proceeding, votingNumber) {
    const response = await fetch(`${API_BASE_URL}/term${currentTerm}/votings/${proceeding}/${votingNumber}`);
    handleError(response);
    const votingDetails = await response.json();
    console.log('Fetched voting details:', votingDetails);
    return votingDetails;
}

// Funkcja do wyszukiwania głosowań
async function searchVotings({ proceeding, dateFrom, dateTo, title }) {
    const url = new URL(`${API_BASE_URL}/term${currentTerm}/votings/search`);
    const params = { proceeding, dateFrom, dateTo, title };
    Object.keys(params).forEach(key => params[key] && url.searchParams.append(key, params[key]));
    
    const response = await fetch(url);
    handleError(response);
    const searchResults = await response.json();
    console.log('Searched votings:', searchResults);
    return searchResults;
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
        
        // Przykład pobrania listy głosowań na posiedzeniu
        const votings = await fetchVotings(4); // 4 to numer posiedzenia
        console.log('Votings for proceeding 4:', votings);
        
        // Przykład pobrania szczegółów głosowania
        const votingDetails = await fetchVotingDetails(4, 1); // Posiedzenie 4, Głosowanie 1
        console.log('Voting details:', votingDetails);

        // Przykład wyszukiwania głosowań
        const searchResults = await searchVotings({ proceeding: 1, dateFrom: '2023-11-01', dateTo: '2023-11-30', title: 'marszałka' });
        console.log('Search results for voting in November 2023:', searchResults);

    } catch (error) {
        console.error('Error during API calls:', error);
    }
}

// Uruchomienie funkcji inicjalizacyjnej
initialize();
