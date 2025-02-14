const baseUrl = "https://api.sejm.gov.pl/sejm/term10/proceedings";
const votingBaseUrl = "https://api.sejm.gov.pl/sejm/term10/votings";
const proceedingsContainer = document.getElementById("proceedings");

async function fetchSejmProceedings() {
    try {
        console.log("🔄 Pobieranie posiedzeń Sejmu...");
        const response = await fetch(baseUrl);
        if (!response.ok) throw new Error(`Błąd pobierania: ${response.status}`);
        
        const proceedings = await response.json();
        let output = "";

        for (const session of proceedings) {
            if (session.number === 0) continue;

            const detailsUrl = `${baseUrl}/${session.number}`;
            const detailsResponse = await fetch(detailsUrl);
            if (!detailsResponse.ok) throw new Error(`Błąd pobierania szczegółów: ${detailsResponse.status}`);
            
            const details = await detailsResponse.json();

            const votingUrl = `${votingBaseUrl}/${session.number}`;
            const votingResponse = await fetch(votingUrl);
            
            let maxVotingNumber = 0;
            if (votingResponse.ok) {
                const votings = await votingResponse.json();
                if (votings.length > 0) {
                    maxVotingNumber = Math.max(...votings.map(voting => voting.votingNumber));
                }
            } else {
                console.warn(`⚠️ Brak głosowań dla posiedzenia ${session.number}`);
            }

            output += `
                <div class="session">
                    <h3>Posiedzenie ${session.number}</h3>
                    <p><strong>Tytuł:</strong> ${details.title}</p>
                    <p><strong>Liczba głosowań:</strong> ${maxVotingNumber}</p>
                </div>
            `;
        }

        proceedingsContainer.innerHTML = output;
        console.log("✅ Posiedzenia załadowane!");

    } catch (error) {
        console.error("❌ Wystąpił błąd:", error);
    }
}
