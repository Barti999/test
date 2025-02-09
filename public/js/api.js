const API_URL = "https://api.sejm.gov.pl/sejm/term10/MP";

// Funkcja pobierająca listę posłów
export async function fetchPoslowie() {
    try {
        console.log("🔄 Pobieranie listy posłów...");
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Nie udało się pobrać danych");
        return await response.json();
    } catch (error) {
        console.error("❌ Błąd ładowania posłów:", error.message);
        return null;
    }
}

// Funkcja formatująca liczbę głosów z separatorem tysięcy
export function formatNumber(number) {
    return number ? number.toLocaleString("pl-PL").replace(/\u00A0/g, " ") : "Brak danych";
}
