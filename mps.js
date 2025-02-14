const baseURL = "https://api.sejm.gov.pl/sejm/term10/MP";
const mpContainer = document.getElementById("mp-container");
const pagination = document.getElementById("pagination");

let allMPs = [];
let currentPage = 1;
const itemsPerPage = 20;

async function fetchMPs() {
    try {
        console.log("🔄 Pobieranie listy posłów...");
        const response = await fetch(baseURL);
        if (!response.ok) throw new Error(`Błąd pobierania: ${response.status}`);
        
        return await response.json();
    } catch (error) {
        console.error("❌ Błąd pobierania listy posłów:", error);
        return [];
    }
}

function renderMPs(page) {
    mpContainer.innerHTML = "";
    pagination.innerHTML = "";

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedMPs = allMPs.slice(startIndex, endIndex);

    paginatedMPs.forEach(mp => {
        const mpElement = document.createElement("div");
        mpElement.classList.add("mp-card");

        const img = document.createElement("img");
        img.src = `${baseURL}/${mp.id}/photo`;
        img.alt = `${mp.firstName} ${mp.lastName}`;

        const name = document.createElement("h3");
        name.textContent = `${mp.firstName} ${mp.lastName}`;

        const club = document.createElement("p");
        club.textContent = `Klub: ${mp.club || "Brak danych"}`;

        mpElement.appendChild(img);
        mpElement.appendChild(name);
        mpElement.appendChild(club);

        mpElement.addEventListener("click", () => {
            window.location.href = `mp.html?id=${mp.id}`;
        });

        mpContainer.appendChild(mpElement);
    });

    // Paginacja
    const totalPages = Math.ceil(allMPs.length / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.classList.add("page-button");
        if (i === page) button.classList.add("active");

        button.addEventListener("click", () => {
            currentPage = i;
            renderMPs(currentPage);
        });

        pagination.appendChild(button);
    }
}

async function fetchAllMPDetails() {
    allMPs = await fetchMPs();
    if (!allMPs.length) return;
    renderMPs(currentPage);
}
