const fs = require("fs");
const fetch = require("node-fetch");

const API_URL = "https://api.sejm.gov.pl/sejm/term10/MP";

async function fetchPoslowie() {
    try {
        console.log("Pobieranie danych z API Sejmu...");
        const response = await fetch(API_URL);

        // Sprawdzenie czy odpowiedź jest poprawna
        if (!response.ok) {
            throw new Error(`Błąd API: ${response.status} ${response.statusText}`);
        }

        const poslowie = await response.json();

        if (!Array.isArray(poslowie) || poslowie.length === 0) {
            throw new Error("Błąd: API zwróciło pustą listę posłów.");
        }

        const formattedData = poslowie.map(posel => ({
            id: posel.id,
            imie: posel.firstName,
            drugieImie: posel.secondName || null,
            nazwisko: posel.lastName,
            pelneNazwisko: posel.firstLastName,
            partia: posel.club,
            okręg: posel.districtName,
            nrOkręgu: posel.districtNum,
            województwo: posel.voivodeship,
            email: posel.email,
            liczbaGłosów: posel.numberOfVotes,
            wykształcenie: posel.educationLevel,
            zawód: posel.profession,
            aktywny: posel.active,
            dataUrodzenia: posel.birthDate,
            miejsceUrodzenia: posel.birthLocation,
            zdjecie: `https://api.sejm.gov.pl/sejm/term10/MP/${posel.id}/photo`
        }));

        // Konwersja do JSON i zapis do pliku
        const jsonData = JSON.stringify(formattedData, null, 2);

        fs.writeFileSync("poslowie.json", jsonData, "utf-8");
        console.log("Dane posłów zapisane do pliku poslowie.json!");

    } catch (error) {
        console.error("Błąd:", error.message);
    }
}

// Uruchomienie funkcji
fetchPoslowie();
