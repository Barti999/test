document.addEventListener("DOMContentLoaded", async () => {
    const mpTableBody = document.getElementById("mp-table-body");
    const searchInput = document.getElementById("search");

    let mps = await fetchMPs();

    function renderMPs(filteredMPs) {
        mpTableBody.innerHTML = "";
        filteredMPs.forEach(mp => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${API_BASE}/MP/${mp.id}/photo-mini" alt="Zdjęcie posła"></td>
                <td>${mp.firstName} ${mp.secondName || ""} ${mp.lastName}</td>
                <td>${mp.club || "Brak przynależności"}</td>
                <td>${mp.districtName || "Brak danych"}</td>
                <td>${mp.active ? "Aktywny" : "Mandat wygasł"}</td>
            `;
            mpTableBody.appendChild(row);
        });
    }

    // Obsługa wyszukiwania
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const filtered = mps.filter(mp =>
            (`${mp.firstName} ${mp.secondName || ""} ${mp.lastName}`).toLowerCase().includes(query) ||
            (mp.club || "").toLowerCase().includes(query) ||
            (mp.districtName || "").toLowerCase().includes(query)
        );
        renderMPs(filtered);
    });

    renderMPs(mps);
});
