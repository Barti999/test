// Podstawowy URL API Sejmu
const BASE_URL = "https://api.sejm.gov.pl/sejm/term10/votings";

// Pobieranie danych z API Sejmu
async function fetchVotingData(term, proceeding) {
    const url = `${BASE_URL}/${proceeding}`;
    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Błąd HTTP: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Dane dla kadencji ${term}, posiedzenia ${proceeding}:`, data);
        return data;
    } catch (error) {
        console.error("Błąd podczas pobierania danych:", error);
        return null;
    }
}

// Główna funkcja inicjalizująca pobieranie danych
async function fetchAllProceedings(term) {
    const maxProceedings = 100; // Ustal limit dla posiedzeń

    for (let proceeding = 1; proceeding <= maxProceedings; proceeding++) {
        console.log(`Pobieram dane dla posiedzenia ${proceeding}...`);
        const data = await fetchVotingData(term, proceeding);
        if (!data) {
            console.log(`Brak danych dla posiedzenia ${proceeding}. Zatrzymano pobieranie.`);
            break;
        }
        // Tutaj możesz dodać funkcję zapisu lub przetwarzania danych
    }
}

// Inicjalizacja po załadowaniu strony
document.addEventListener("DOMContentLoaded", () => {
    const term = 10; // Aktualna kadencja
    fetchAllProceedings(term);
});