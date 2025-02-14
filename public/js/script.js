import { fetchPoslowie, formatNumber } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
    const listaPoslow = document.getElementById("poslowie");

    const sekcjaPoslowie = document.getElementById("sekcja-poslowie");
    const btnPoslowie = document.getElementById("btn-poslowie");

    // Przełączanie zakładki na "Lista Posłów"
    btnPoslowie.addEventListener("click", () => {
        sekcjaPoslowie.style.display = "block";
    });

    // Wczytanie listy posłów (z obsługą kliknięcia)
    async function loadPoslowie() {
        const poslowie = await fetchPoslowie();
        if (!poslowie) {
            listaPoslow.innerHTML = "<p>Nie udało się załadować listy posłów.</p>";
            return;
        }

        listaPoslow.innerHTML = ""; // Czyścimy listę

        poslowie.forEach(posel => {
            const li = document.createElement("li");
            li.classList.add("posel-item");
            li.innerHTML = `
                <img src="https://api.sejm.gov.pl/sejm/term10/MP/${posel.id}/photo" 
                     alt="${posel.firstLastName}" class="posel-img">
                <strong>${posel.firstLastName}</strong> (${posel.club || "Brak informacji"})
            `;

            // Tworzymy kontener na szczegóły posła (ukryty domyślnie)
            const detailsDiv = document.createElement("div");
            detailsDiv.classList.add("szczegoly-posla");
            detailsDiv.style.display = "none";

            // Obsługa kliknięcia na posła
            li.addEventListener("click", () => {
                document.querySelectorAll(".szczegoly-posla").forEach(div => {
                    if (div !== detailsDiv) div.style.display = "none";
                });

                if (detailsDiv.style.display === "none") {
                    detailsDiv.innerHTML = `
                        <h3>${posel.firstLastName}</h3>
                        <img src="https://api.sejm.gov.pl/sejm/term10/MP/${posel.id}/photo" 
                             alt="Zdjęcie posła" class="szczegoly-img">
                        <p><strong>Imię:</strong> ${posel.firstName}</p>
                        <p><strong>Drugie imię:</strong> ${posel.secondName || "Brak informacji"}</p>
                        <p><strong>Nazwisko:</strong> ${posel.lastName}</p>
                        <p><strong>Data urodzenia:</strong> ${posel.birthDate || "Brak danych"} (${posel.birthLocation || "Brak informacji"})</p>
                        <p><strong>Partia:</strong> ${posel.club || "Brak informacji"}</p>
                        <p><strong>Okręg wyborczy:</strong> ${posel.districtName} (nr ${posel.districtNum})</p>
                        <p><strong>Status:</strong> ${posel.active ? "Poseł z ważnym mandatem" : "Mandat wygasł"}</p>
                        <p><strong>Liczba głosów:</strong> ${formatNumber(posel.numberOfVotes)}</p>
                    `;
                    detailsDiv.style.display = "block";
                } else {
                    detailsDiv.style.display = "none";
                }
            });

            li.appendChild(detailsDiv);
            listaPoslow.appendChild(li);
        });

        console.log("✅ Posłowie załadowani!");
    }

    // Załaduj dane przy starcie
    loadPoslowie();
});
