const params = new URLSearchParams(window.location.search);
const sessionNumber = params.get("number");

const votingsContainer = document.getElementById("votings-container");

async function fetchVotings() {
    try {
        console.log(`🔄 Pobieranie głosowań dla posiedzenia ${sessionNumber}...`);
        const response = await fetch(`https://api.sejm.gov.pl/sejm/term10/votings/${sessionNumber}`);
        if (!response.ok) throw new Error(`Błąd pobierania: ${response.status}`);

        const votings = await response.json();
        let output = "";

        votings.forEach(voting => {
            output += `
                <div class="voting">
                    <h3>Głosowanie nr ${voting.votingNumber}</h3>
                    <p><strong>Data:</strong> ${voting.date}</p>
                    <p><strong>Opis:</strong> ${voting.topic || "Brak opisu"}</p>
                </div>
            `;
        });

        votingsContainer.innerHTML = output || "<p>Brak głosowań dla tego posiedzenia.</p>";
        console.log("✅ Głosowania załadowane!");

    } catch (error) {
        console.error("❌ Wystąpił błąd:", error);
    }
}

function goBack() {
    window.history.back();
}

fetchVotings();
