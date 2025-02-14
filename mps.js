document.addEventListener("DOMContentLoaded", async function () {
    const baseURL = "https://api.sejm.gov.pl/sejm/term10/MP";
    const mpListElement = document.getElementById("mp-list");

    async function fetchMPs() {
        try {
            console.log("🔄 Pobieranie listy posłów...");
            const response = await fetch(baseURL);
            if (!response.ok) throw new Error(`Błąd pobierania: ${response.status}`);
            
            const MPs = await response.json();
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
            
            return await response.json();
        } catch (error) {
            console.error(`❌ Błąd pobierania posła ID ${mpId}:`, error);
            return null;
        }
    }

    async function fetchAllMPDetails() {
        const MPs = await fetchMPs();
        if (!MPs.length) return;

        const detailsPromises = MPs.map(mp => fetchMPDetails(mp.id));
        const detailsList = await Promise.all(detailsPromises);

        detailsList.forEach(details => {
            if (details) {
                const li = document.createElement("li");
                li.textContent = `${details.name} ${details.lastName} (ID: ${details.id})`;
                mpListElement.appendChild(li);
            }
        });

        console.log("✅ Lista posłów załadowana!");
    }

    fetchAllMPDetails();
});
