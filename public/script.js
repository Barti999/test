document.addEventListener("DOMContentLoaded", async () => {
    const API_URL = "https://api.sejm.gov.pl/sejm/term10/MP";
    const listaPoslow = document.getElementById("poslowie");

    // Pobieranie listy posłów
    async function loadPoslowie() {
        try {
            console.log("🔄 Pobieranie listy posłów...");
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Nie udało się pobrać danych");

            const poslowie = await response.json();
            listaPoslow.innerHTML = ""; // Czyścimy listę przed dodaniem nowych danych

            poslowie.forEach(posel => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <img src="https://api.sejm.gov.pl/sejm/term10/MP/${posel.id}/photo" 
                         alt="${posel.firstLastName}" class="posel-img">
                    <strong>${posel.firstLastName}</strong> (${posel.club || "Brak informacji"})
                `;

                // Dodanie kontenera na szczegóły posła (będzie ukryty domyślnie)
                const detailsDiv = document.createElement("div");
                detailsDiv.classList.add("szczegoly-posla");
                detailsDiv.style.display = "none"; // Ukrywamy domyślnie

                li.addEventListener("click", () => {
                    // Zamykamy inne otwarte szczegóły
                    document.querySelectorAll(".szczegoly-posla").forEach(div => {
                        if (div !== detailsDiv) div.style.display = "none";
                    });

                    // Jeśli szczegóły są ukryte, to je pokaż
                    if (detailsDiv.style.display === "none") {
                        detailsDiv.innerHTML = `
                            <h3>${posel.firstLastName}</h3>
                            <img src="https://api.sejm.gov.pl/sejm/term10/MP/${posel.id}/photo" 
                                 alt="Zdjęcie posła" class="szczegoly-img">
                            <p><strong>Partia:</strong> ${posel.club || "Brak informacji"}</p>
                            <p><strong>Okręg:</strong> ${posel.districtName || "Brak informacji"} (nr ${posel.districtNum || "?"})</p>
                            <p><strong>Województwo:</strong> ${posel.voivodeship || "Brak informacji"}</p>
                            <p><strong>Email:</strong> <a href="mailto:${posel.email}">${posel.email || "Brak adresu"}</a></p>
                            <p><strong>Wykształcenie:</strong> ${posel.educationLevel || "Brak informacji"}</p>
                            <p><strong>Zawód:</strong> ${posel.profession || "Brak informacji"}</p>
                            <p><strong>Liczba głosów:</strong> ${posel.numberOfVotes || "Brak danych"}</p>
                            <p><strong>Data urodzenia:</strong> ${posel.birthDate || "Brak danych"} (${posel.birthLocation || "Brak informacji"})</p>
                        `;
                        detailsDiv.style.display = "block";
                    } else {
                        detailsDiv.style.display = "none"; // Jeśli klikniesz ponownie, schowaj
                    }
                });

                li.appendChild(detailsDiv);
                listaPoslow.appendChild(li);
            });

            console.log("✅ Posłowie załadowani!");
        } catch (error) {
            console.error("❌ Błąd ładowania posłów:", error.message);
            listaPoslow.innerHTML = "<p>Nie udało się załadować listy posłów.</p>";
        }
    }

    // Załaduj posłów po uruchomieniu strony
    loadPoslowie();
});
