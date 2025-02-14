function showTab(tabId) {
    // Ukryj wszystkie zakładki
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.style.display = "none";
    });

    // Pokaż wybraną zakładkę
    document.getElementById(tabId).style.display = "block";
}
