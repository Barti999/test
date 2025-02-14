async function fetchSejmProceedings() {
    const baseUrl = "https://api.sejm.gov.pl/sejm/term10/proceedings";
    const votingBaseUrl = "https://api.sejm.gov.pl/sejm/term10/votings";

    try {
        // Pobranie listy posiedzeń sejmu
        const response = await fetch(baseUrl);
        if (!response.ok) throw new Error(`Błąd pobierania danych: ${response.status}`);
        
        const proceedings = await response.json();

        for (const session of proceedings) {
            const number = session.number;
            
            // Pomijamy jeśli number == 0
            if (number === 0) continue;
            
            const detailsUrl = `${baseUrl}/${number}`;
            const detailsResponse = await fetch(detailsUrl);
            if (!detailsResponse.ok) throw new Error(`Błąd pobierania szczegółów: ${detailsResponse.status}`);
            
            const details = await detailsResponse.json();

            // Pobranie głosowań dla danego posiedzenia
            const votingUrl = `${votingBaseUrl}/${number}`;
            const votingResponse = await fetch(votingUrl);
            
            let maxVotingNumber = 0;
            if (votingResponse.ok) {
                const votings = await votingResponse.json();
                
                // Znalezienie maksymalnej wartości "votingNumber"
                if (votings.length > 0) {
                    maxVotingNumber = Math.max(...votings.map(voting => voting.votingNumber));
                }
            } else {
                console.warn(`Brak głosowań dla posiedzenia ${number}`);
            }

            // Wyświetlenie danych w sposób uporządkowany
            console.log("----------------------------------------");
            console.log(`Tytuł: ${details.title}`);
            console.log(`Liczba głosowań: ${maxVotingNumber}`);
            console.log("----------------------------------------");
        }

    } catch (error) {
        console.error("Wystąpił błąd:", error);
    }
}

// Wywołanie funkcji
fetchSejmProceedings();
