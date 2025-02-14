document.addEventListener("DOMContentLoaded", async () => {
    const votingTableBody = document.getElementById("voting-table-body");

    // Pobieramy listę głosowań dla ostatniego posiedzenia
    let lastProceeding = 1; // Można dynamicznie pobrać numer ostatniego posiedzenia, jeśli API na to pozwala
    let votings = await fetchVotings(lastProceeding);

    if (votings.length === 0) {
        votingTableBody.innerHTML = "<tr><td colspan='5'>Brak danych o głosowaniach</td></tr>";
        return;
    }

    votings.forEach(vote => {
        const row = `
            <tr>
                <td>${vote.date || "Brak danych"}</td>
                <td>${vote.title || "Brak tytułu"}</td>
                <td>${vote.yes || 0}</td>
                <td>${vote.no || 0}</td>
                <td>${vote.abstain || 0}</td>
            </tr>`;
        votingTableBody.innerHTML += row;
    });
});
