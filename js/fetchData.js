const API_BASE = "https://api.sejm.gov.pl/sejm/term10";
const PROXY = "https://corsproxy.io/?"; // Proxy CORS

/**
 * Pobiera listę posłów z API Sejmu.
 */
async function fetchMPs() {
    try {
        const response = await fetch(PROXY + `${API_BASE}/MP`);
        if (!response.ok) {
            throw new Error(`Błąd HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Błąd pobierania listy posłów:", error);
        return [];
    }
}

/**
 * Pobiera listę wszystkich posiedzeń Sejmu.
 */
async function fetchProceedings() {
    try {
        const response = await fetch(PROXY + `${API_BASE}/proceedings`);
        if (!response.ok) throw new Error(`Błąd HTTP: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Błąd pobierania listy posiedzeń:", error);
        return [];
    }
}

/**
 * Pobiera listę głosowań dla konkretnego posiedzenia.
 */
async function fetchVotings(proceedingNumber) {
    try {
        const response = await fetch(PROXY + `${API_BASE}/votings/${proceedingNumber}`);
        if (!response.ok) throw new Error(`Błąd HTTP: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Błąd pobierania głosowań:", error);
        return [];
    }
}
