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
                li.classList.add("posel-item"); // Dodajemy klasę dla stylów
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
                            <h4>Informacje podstawowe:</h4>
                            <p><strong>Imię:</strong> ${posel.firstName}</p>
                            <p><strong>Drugie imię:</strong> ${posel.secondName || "Brak informacji"}</p>
                            <p><strong>Nazwisko:</strong> ${posel.lastName}</p>
                            <p><strong>Data urodzenia:</strong> ${posel.birthDate || "Brak danych"} (${posel.birthLocation || "Brak informacji"})</p>

                            <h4>Dane polityczne:</h4>
                            <p><strong>Partia:</strong> ${posel.club || "Brak informacji"}</p>
                            <p><strong>Okręg wyborczy:</strong> ${posel.districtName} (nr ${posel.districtNum})</p>
                            <p><strong>Numer legitymacji poselskiej:</strong> ${posel.id}</p>
                            <p><strong>Status:</strong> ${posel.active ? "Poseł z ważnym mandatem" : "Mandat wygasł"}</p>

                            <h4>Dane kontaktowe:</h4>
                            <p><strong>Email:</strong> <a href="mailto:${posel.email}">${posel.email || "Brak adresu"}</a></p>

                            <h4>Wykształcenie i kariera:</h4>
                            <p><strong>Wykształcenie:</strong> ${posel.educationLevel || "Brak informacji"}</p>
                            <p><strong>Zawód:</strong> ${posel.profession || "Brak informacji"}</p>

                            <h4>Wyniki wyborcze:</h4>
                            <p><strong>Liczba głosów:</strong> ${posel.numberOfVotes || "Brak danych"}</p>
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
