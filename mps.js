document.addEventListener("DOMContentLoaded", async function () {
    const baseURL = "https://api.sejm.gov.pl/sejm/term10/MP";
    const mpListElement = document.getElementById("mp-list");

    async function fetchMPs() {
        try {
            console.log("🔄 Pobieranie listy posłów...");
            const response = await fetch(baseURL);
            if (!response.ok) throw new Error(`Błąd pobierania: ${response.status}`);
            
            const MPs = await response.json();
            console.log("✅ Lista posłów:", MPs);
            return MPs;
        } catch (error) {
            console.error("❌ Błąd pobierania listy posłów:", error);
            return [];
        }
    }

    async function fetchMPDetails(mpId) {
        try {
            console.log(`🔄 Pobieranie danych posła ID ${mpId}...`);
            const response = await fetch(`${baseURL}/${mpId}`);
            if (!response.ok) throw new Error(`Błąd pobierania ID ${mpId}: ${response.status}`);
            
            const details = await response.json();
            console.log(`✅ Dane posła ID ${mpId}:`, details);
            return details;
        } catch (error) {
            console.error(`❌ Błąd pobierania posła ID ${mpId}:`, error);
            return null;
        }
    }

    async function fetchAllMPDetails() {
        const MPs = await fetchMPs();
        if (!MPs.length) return;

        // Pobieranie szczegółowych danych posłów równocześnie
        const detailsPromises = MPs.map(mp => fetchMPDetails(mp.id));
        const detailsList = await Promise.all(detailsPromises);

        // Wyświetlanie posłów na stronie
        detailsList.forEach(details => {
            if (details) {
                const li = document.createElement("li");
                li.textContent = `${details.name} ${details.lastName} (ID: ${details.id})`;
                mpListElement.appendChild(li);
            }
        });

        console.log("✅ Wszystkie dane posłów zostały pobrane!");
    }

    fetchAllMPDetails();
});
