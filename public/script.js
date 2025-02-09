document.addEventListener("DOMContentLoaded", async () => {
    const API_URL = "https://api.sejm.gov.pl/sejm/term10/MP"; // Adres API Sejmu
    const listaPoslow = document.getElementById("poslowie");
    const szczegolyPosla = document.getElementById("informacje-posel");

    // Funkcja pobierająca listę posłów bezpośrednio z API
    async function loadPoslowie() {
        try {
            console.log("🔄 Pobieranie listy posłów...");
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Nie udało się pobrać danych");

            const poslowie = await response.json();
            listaPoslow.innerHTML = "";

            poslowie.forEach(posel => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <img src="https://api.sejm.gov.pl/sejm/term10/MP/${posel.id}/photo" alt="${posel.firstLastName}" width="50">
                    <strong>${posel.firstLastName}</strong> (${posel.club})
                `;
                li.addEventListener("click", () => pokazSzczegoly(posel));
                listaPoslow.appendChild(li);
            });

            console.log("✅ Posłowie załadowani!");
        } catch (error) {
            console.error("❌ Błąd ładowania posłów:", error.message);
            listaPoslow.innerHTML = "<p>Nie udało się załadować listy posłów.</p>";
        }
    }

    // Funkcja wyświetlająca szczegóły posła po kliknięciu
    function pokazSzczegoly(posel) {
        szczegolyPosla.innerHTML = `
            <h3>${posel.firstLastName}</h3>
            <img src="https://api.sejm.gov.pl/sejm/term10/MP/${posel.id}/photo" alt="Zdjęcie posła" width="100">
            <p><strong>Partia:</strong> ${posel.club}</p>
            <p><strong>Okręg:</strong> ${posel.districtName} (nr ${posel.districtNum})</p>
            <p><strong>Województwo:</strong> ${posel.voivodeship}</p>
            <p><strong>Email:</strong> <a href="mailto:${posel.email}">${posel.email}</a></p>
            <p><strong>Wykształcenie:</strong> ${posel.educationLevel}</p>
            <p><strong>Zawód:</strong> ${posel.profession}</p>
            <p><strong>Liczba głosów:</strong> ${posel.numberOfVotes}</p>
            <p><strong>Data urodzenia:</strong> ${posel.birthDate} (${posel.birthLocation})</p>
        `;
    }

    // Załaduj posłów po uruchomieniu strony
    loadPoslowie();
});
