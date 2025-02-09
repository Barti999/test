import { fetchPoslowie, fetchPosiedzenia, fetchGlosowania, formatNumber } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
    const listaPoslow = document.getElementById("poslowie");
    const listaPosiedzen = document.getElementById("posiedzenia");
    const listaGlosowan = document.createElement("ul"); // Lista głosowań

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
            li.innerHTML = `<strong>${posel.firstLastName}</strong> (${posel.club || "Brak informacji"})`;
            listaPoslow.appendChild(li);
        });

        console.log("✅ Posłowie załadowani!");
    }

    // Wczytanie listy posiedzeń i dodanie obsługi kliknięcia
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

            // Kliknięcie w posiedzenie → pobranie głosowań
            li.addEventListener("click", async () => {
                console.log(`🔄 Pobieranie głosowań dla posiedzenia nr ${posiedzenie.number}...`);
                const glosowania = await fetchGlosowania(posiedzenie.number);
                listaGlosowan.innerHTML = ""; // Czyścimy starą listę

                if (!glosowania || glosowania.length === 0) {
                    listaGlosowan.innerHTML = "<p>Brak głosowań dla tego posiedzenia.</p>";
                    return;
                }

                glosowania.forEach(glosowanie => {
                    const glosLi = document.createElement("li");
                    glosLi.innerHTML = `
                        <h4>${glosowanie.title}</h4>
                        <p><strong>Data:</strong> ${glosowanie.date}</p>
                        <p><strong>Opis:</strong> ${glosowanie.description}</p>
                        <p><strong>Łączna liczba głosujących:</strong> ${formatNumber(glosowanie.totalVoted)}</p>
                        <ul>
                            ${
                                glosowanie.votingOptions 
                                ? glosowanie.votingOptions.map(option => `
                                    <li>${option.option}: <strong>${formatNumber(option.votes)}</strong> głosów</li>
                                `).join("")
                                : "<li>Brak danych o wynikach głosowania</li>"
                            }
                        </ul>
                    `;
                    listaGlosowan.appendChild(glosLi);
                });

                li.appendChild(listaGlosowan);
            });

            listaPosiedzen.appendChild(li);
        });

        console.log("✅ Posiedzenia załadowane!");
    }

    // Załaduj dane przy starcie
    loadPoslowie();
    loadPosiedzenia();
});
