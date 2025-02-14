let mpsLoaded = false;
let votesLoaded = false;

function showTab(tabId) {
    // Ukryj wszystkie zakładki
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.style.display = "none";
    });

    // Pokaż wybraną zakładkę
    document.getElementById(tabId).style.display = "block";

    // Załaduj listę posłów tylko raz
    if (tabId === "mps-tab" && !mpsLoaded) {
        fetchAllMPDetails();
        mpsLoaded = true;
    }

    // Załaduj dane głosowań tylko raz
    if (tabId === "votes-tab" && !votesLoaded) {
        fetchSejmProceedings();
        votesLoaded = true;
    }
}
