document.addEventListener("DOMContentLoaded", async () => {
    const votingContainer = document.getElementById("voting-container");

    /**
     * Renderuje listę posiedzeń Sejmu.
     */
    async function renderProceedings() {
        const proceedings = await fetchProceedings();
        if (proceedings.length === 0) {
            votingContainer.innerHTML = "<p>Brak dostępnych posiedzeń.</p>";
            return;
        }

        proceedings.forEach(proceeding => {
            if (!proceeding.id) return; // Zapobiega błędom z undefined

            const proceedingElement = document.createElement("div");
            proceedingElement.classList.add("proceeding");
            proceedingElement.innerHTML = `
                <h3 class="proceeding-title" data-id="${proceeding.id}">
                    ${proceeding.id}. Posiedzenie Sejmu RP w dniach ${proceeding.dates.join(", ")}
                </h3>
                <div class="proceeding-details" id="proceeding-${proceeding.id}" style="display: none;"></div>
            `;
            votingContainer.appendChild(proceedingElement);
        });

        document.querySelectorAll(".proceeding-title").forEach(title => {
            title.addEventListener("click", async (e) => {
                const proceedingId = e.target.dataset.id;
                if (!proceedingId) return;

                const detailsContainer = document.getElementById(`proceeding-${proceedingId}`);

                if (detailsContainer.style.display === "none") {
                    detailsContainer.style.display = "block";
                    await renderVotingsForProceeding(proceedingId, detailsContainer);
                } else {
                    detailsContainer.style.display = "none";
                }
            });
        });
    }

    /**
     * Renderuje głosowania dla danego posiedzenia.
     */
    async function renderVotingsForProceeding(proceedingId, container) {
        const votings = await fetchVotings(proceedingId);
        if (!votings || votings.length === 0) {
            container.innerHTML = "<p>Brak głosowań dla tego posiedzenia.</p>";
            return;
        }

        const votingsByDate = {};

        votings.forEach(vote => {
            if (!votingsByDate[vote.date]) {
                votingsByDate[vote.date] = [];
            }
            votingsByDate[vote.date].push(vote);
        });

        container.innerHTML = "";

        Object.keys(votingsByDate).forEach(date => {
            const dayElement = document.createElement("div");
            dayElement.classList.add("voting-day");
            dayElement.innerHTML = `
                <h4 class="voting-day-title" data-date="${date}">
                    Głosowania w dniu ${date} na ${proceedingId}. posiedzeniu Sejmu
                </h4>
                <div class="voting-list" id="voting-${proceedingId}-${date}" style="display: none;"></div>
            `;
            container.appendChild(dayElement);
        });

        document.querySelectorAll(".voting-day-title").forEach(title => {
            title.addEventListener("click", (e) => {
                const date = e.target.dataset.date;
                const votingList = document.getElementById(`voting-${proceedingId}-${date}`);

                if (votingList.style.display === "none") {
                    votingList.style.display = "block";
                    renderVotingsList(votingsByDate[date], votingList);
                } else {
                    votingList.style.display = "none";
                }
            });
        });
    }

    /**
     * Renderuje listę głosowań dla danego dnia.
     */
    function renderVotingsList(votings, container) {
        container.innerHTML = "<ul>";

        votings.forEach(vote => {
            container.innerHTML += `
                <li>
                    ${vote.number}. ${vote.time || "Nieznana godzina"} - ${vote.title}
                </li>
            `;
        });

        container.innerHTML += "</ul>";
    }

    renderProceedings();
});
