const params = new URLSearchParams(window.location.search);
const mpId = params.get("id");

const detailsContainer = document.getElementById("mp-details");

async function fetchMPDetails() {
    try {
        const response = await fetch(`https://api.sejm.gov.pl/sejm/term10/MP/${mpId}`);
        if (!response.ok) throw new Error(`Błąd pobierania danych posła: ${response.status}`);

        const data = await response.json();

        detailsContainer.innerHTML = `
            <img src="https://api.sejm.gov.pl/sejm/term10/MP/${data.id}/photo-mini" alt="${data.firstLastName}">
            <h2>${data.firstLastName}</h2>
            <p><strong>Data urodzenia:</strong> ${data.birthDate}</p>
            <p><strong>Miejsce urodzenia:</strong> ${data.birthLocation}</p>
            <p><strong>Klub:</strong> ${data.club || "Brak danych"}</p>
            <p><strong>Okręg:</strong> ${data.districtName} (Numer ${data.districtNum})</p>
            <p><strong>Wykształcenie:</strong> ${data.educationLevel}</p>
            <p><strong>Głosów:</strong> ${data.numberOfVotes}</p>
            <p><strong>Zawód:</strong> ${data.profession}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        `;
    } catch (error) {
        console.error("❌ Błąd pobierania danych posła:", error);
    }
}

function goBack() {
    window.history.back();
}

fetchMPDetails();
