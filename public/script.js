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
