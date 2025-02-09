const fs = require("fs");
const fetch = require("node-fetch");

const API_URL = "https://api.sejm.gov.pl/sejm/term10/MP";
const DATA_FOLDER = "data";
const DATA_PATH = `${DATA_FOLDER}/poslowie.json`;

async function fetchPoslowie() {
    try {
        console.log("🔄 Pobieranie danych posłów z API Sejmu...");
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`❌ Błąd API: ${response.status} ${response.statusText}`);
        }

        const poslowie = await response.json();

        if (!Array.isArray(poslowie) || poslowie.length === 0) {
            throw new Error("❌ API zwróciło pustą listę posłów.");
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

        // Tworzenie folderu "data" jeśli nie istnieje
        if (!fs.existsSync(DATA_FOLDER)) {
            fs.mkdirSync(DATA_FOLDER);
        }

        // Konwersja do JSON i zapis do pliku
        const jsonData = JSON.stringify(formattedData, null, 2);
        fs.writeFileSync(DATA_PATH, jsonData, "utf-8");

        console.log("✅ Dane posłów zapisane do:", DATA_PATH);
    } catch (error) {
        console.error("❌ Błąd podczas pobierania danych posłów:", error.message);
    }
}

// Uruchomienie funkcji
fetchPoslowie();
