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
        if (!data || data.length === 0) {
            console.warn("Brak danych o posłach.");
            return [];
        }
        return data;
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
        const response = await fetch(`${API_BASE}/proceedings`);
        if (!response.ok) throw new Error(`Błąd HTTP: ${response.status}`);
        const data = await response.json();
        if (!data || data.length === 0) {
            console.warn("Brak danych o posiedzeniach.");
            return [];
        }
        return data;
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
        if (!proceedingNumber) throw new Error("Nie podano numeru posiedzenia.");
        const response = await fetch(`${API_BASE}/votings/${proceedingNumber}`);
        if (!response.ok) throw new Error(`Błąd HTTP: ${response.status}`);
        const data = await response.json();
        if (!data || data.length === 0) {
            console.warn(`Brak głosowań dla posiedzenia ${proceedingNumber}.`);
            return [];
        }
        return data;
    } catch (error) {
        console.error("Błąd pobierania głosowań:", error);
        return [];
    }
}
