const API_BASE = "https://api.sejm.gov.pl/sejm/term10";

/**
 * Pobiera listę posłów z API Sejmu.
 */
async function fetchMPs() {
    try {
        const response = await fetch(`${API_BASE}/MP`);
        if (!response.ok) {
            throw new Error(`Błąd HTTP: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Błąd pobierania listy posłów:", error);
        return [];
    }
}

/**
 * Pobiera listę głosowań dla najnowszego posiedzenia.
 */
async function fetchVotings(proceedingNumber) {
    try {
        const response = await fetch(`${API_BASE}/votings/${proceedingNumber}`);
        if (!response.ok) {
            throw new Error(`Błąd HTTP: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Błąd pobierania listy głosowań:", error);
        return [];
    }
}
