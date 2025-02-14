document.addEventListener("DOMContentLoaded", async () => {
    const mpTableBody = document.getElementById("mp-table-body");
    const searchInput = document.getElementById("search");

    let mps = await fetchMPs();

    if (mps.length === 0) {
        mpTableBody.innerHTML = "<tr><td colspan='5'>Brak danych o posłach.</td></tr>";
        return;
    }

    function renderMPs(filteredMPs) {
        mpTableBody.innerHTML = "";
        const fragment = document.createDocumentFragment();

        filteredMPs.forEach(mp => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${API_BASE}/MP/${mp.id}/photo" alt="Zdjęcie posła" onerror="this.onerror=null;this.src='img/placeholder.jpg';"></td>
                <td>${mp.firstName} ${mp.secondName || ""} ${mp.lastName}</td>
                <td>${mp.club || "Brak przynależności"}</td>
                <td>${mp.districtName || "Brak danych"}</td>
                <td>${mp.active ? "Aktywny" : "Mandat wygasł"}</td>
            `;
            fragment.appendChild(row);
        });

        mpTableBody.appendChild(fragment);
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
