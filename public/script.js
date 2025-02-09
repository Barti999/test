document.addEventListener("DOMContentLoaded", () => {
    const listaPoslow = document.getElementById("poslowie");

    async function pobierzPoslow() {
        try {
            const response = await fetch("https://api.sejm.gov.pl/some-endpoint"); // Zamień na poprawny URL API Sejmu
            const data = await response.json();

            listaPoslow.innerHTML = "";
            data.forEach(posel => {
                const li = document.createElement("li");
                li.textContent = `${posel.imie} ${posel.nazwisko}`;
                li.addEventListener("click", () => pokazSzczegoly(posel));
                listaPoslow.appendChild(li);
            });
        } catch (error) {
            console.error("Błąd pobierania danych", error);
        }
    }

    function pokazSzczegoly(posel) {
        const szczegoly = document.getElementById("informacje-posel");
        szczegoly.innerHTML = `
            <h3>${posel.imie} ${posel.nazwisko}</h3>
            <p>Partia: ${posel.partia}</p>
            <p>Okręg: ${posel.okreg}</p>
        `;
    }

    pobierzPoslow();
});
document.addEventListener("DOMContentLoaded", async () => {
    const listaPoslow = document.getElementById("poslowie");

    async function loadPoslowie() {
        try {
            const response = await fetch("../data/poslowie.json"); // Lokalny plik JSON
            if (!response.ok) throw new Error("Nie udało się pobrać danych");

            const poslowie = await response.json();
            listaPoslow.innerHTML = "";

            poslowie.forEach(posel => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <img src="${posel.zdjecie}" alt="${posel.pelneNazwisko}" width="50">
                    <strong>${posel.pelneNazwisko}</strong> (${posel.partia})
                `;
                li.addEventListener("click", () => pokazSzczegoly(posel));
                listaPoslow.appendChild(li);
            });
        } catch (error) {
            console.error("Błąd ładowania posłów:", error.message);
        }
    }

    function pokazSzczegoly(posel) {
        const szczegoly = document.getElementById("informacje-posel");
        szczegoly.innerHTML = `
            <h3>${posel.pelneNazwisko}</h3>
            <p><strong>Partia:</strong> ${posel.partia}</p>
            <p><strong>Okręg:</strong> ${posel.okręg} (nr ${posel.nrOkręgu})</p>
            <p><strong>Województwo:</strong> ${posel.województwo}</p>
            <p><strong>Email:</strong> <a href="mailto:${posel.email}">${posel.email}</a></p>
            <p><strong>Wykształcenie:</strong> ${posel.wykształcenie}</p>
            <p><strong>Zawód:</strong> ${posel.zawód}</p>
            <p><strong>Liczba głosów:</strong> ${posel.liczbaGłosów}</p>
            <p><strong>Data urodzenia:</strong> ${posel.dataUrodzenia} (${posel.miejsceUrodzenia})</p>
            <img src="${posel.zdjecie}" alt="Zdjęcie posła" width="100">
        `;
    }

    loadPoslowie();
});
