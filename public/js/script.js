import { fetchPoslowie, fetchPosiedzenia, formatNumber } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
    const listaPoslow = document.getElementById("poslowie");
    const listaPosiedzen = document.getElementById("posiedzenia");

    const sekcjaPoslowie = document.getElementById("sekcja-poslowie");
    const sekcjaPosiedzenia = document.getElementById("sekcja-posiedzenia");

    const btnPoslowie = document.getElementById("btn-poslowie");
    const btnPosiedzenia = document.getElementById("btn-posiedzenia");

    // Przełączanie zakładek (posłowie / posiedzenia)
    btnPoslowie.addEventListener("click", () => {
        sekcjaPoslowie.style.display = "block";
        sekcjaPosiedzenia.style.display = "none";
    });

    btnPosiedzenia.addEventListener("click", () => {
        sekcjaPoslowie.style.display = "none";
        sekcjaPosiedzenia.style.display = "block";
    });

    // Wczytanie listy posłów
    async function loadPoslowie() {
        const poslowie = await fetchPoslowie();
        if (!poslowie) {
            listaPoslow.innerHTML = "<p>Nie udało się załadować listy posłów.</p>";
            return;
        }

        listaPoslow.innerHTML = "";
        poslowie.forEach(posel => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${posel.firstLastName}</strong> (${posel.club || "Brak informacji"})
            `;
            listaPoslow.appendChild(li);
        });

        console.log("✅ Posłowie załadowani!");
    }

    // Wczytanie listy posiedzeń
    async function loadPosiedzenia() {
        const posiedzenia = await fetchPosiedzenia();
        if (!posiedzenia) {
            listaPosiedzen.innerHTML = "<p>Nie udało się załadować listy posiedzeń.</p>";
            return;
        }

        listaPosiedzen.innerHTML = "";
        posiedzenia.forEach(posiedzenie => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${posiedzenie.title}</strong> (Nr: ${posiedzenie.number})
                <ul>
                    ${posiedzenie.dates.map(date => `<li>${date}</li>`).join("")}
                </ul>
            `;
            listaPosiedzen.appendChild(li);
        });

        console.log("✅ Posiedzenia załadowane!");
    }

    // Załaduj dane przy starcie
    loadPoslowie();
    loadPosiedzenia();
});
