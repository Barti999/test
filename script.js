const BASE_URL = "https://api.sejm.gov.pl/sejm/term10/";

// Funkcja do pobierania głosowań dla konkretnego posiedzenia
async function fetchVotingData(term, proceeding) {
  const url = `${BASE_URL}votings/${proceeding}`;
  try {
    const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!response.ok) throw new Error(`Błąd HTTP: ${response.status}`);
    const data = await response.json();
    console.log(`Dane głosowań dla kadencji ${term}, posiedzenia ${proceeding}:`, data);
    return data;
  } catch (error) {
    console.error("Błąd podczas pobierania danych głosowań:", error);
    return null;
  }
}

// Funkcja do pobierania wszystkich dostępnych posiedzeń (nie ograniczamy do 5)
async function fetchAllProceedings(term) {
  let allVotes = [];
  let proceeding = 1;

  while (true) {
    console.log(`Pobieram dane dla posiedzenia ${proceeding}...`);
    const data = await fetchVotingData(term, proceeding);
    if (!data || data.length === 0) {
      console.log(`Brak danych dla posiedzenia ${proceeding}. Zatrzymano pobieranie.`);
      break; // Przerywamy, jeśli nie udało się pobrać danych dla danego posiedzenia
    }
    allVotes.push(data);
    proceeding++; // Przechodzimy do kolejnego posiedzenia
  }

  return allVotes;
}

// Funkcja do wyświetlania posiedzeń w dropdown
function populateProceedingDropdown(proceedings) {
  const proceedingSelect = document.getElementById("proceedingSelect");
  proceedings.forEach((proceedingData, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `Posiedzenie ${index + 1} - ${proceedingData[0].date}`;
    proceedingSelect.appendChild(option);
  });
}

// Funkcja wyświetlająca wyniki głosowań
function displayVotingResults(votingData) {
  const votingResultsDiv = document.getElementById("votingResults");
  let html = "<h3>Wyniki głosowań</h3>";

  votingData.forEach((proceedingData, index) => {
    html += `<h4>Posiedzenie ${index + 1}</h4>`;
    proceedingData.forEach(vote => {
      html += `<div class="vote">`;
      html += `<h5>${vote.title} (${vote.date})</h5>`;
      html += `<p>${vote.description}</p>`;
      html += `<p>Liczba głosów: ${vote.totalVoted}</p>`;
      if (vote.votingOptions && Array.isArray(vote.votingOptions)) {
        html += "<ul>";
        vote.votingOptions.forEach(option => {
          html += `<li>${option.option}: ${option.votes}</li>`;
        });
        html += "</ul>";
      }
      html += `</div>`;
    });
  });
  votingResultsDiv.innerHTML = html;
}

// Obsługa wyboru posiedzenia
document.getElementById("proceedingSelect").addEventListener("change", async (event) => {
  const selectedIndex = event.target.value;
  if (selectedIndex === "") {
    return; // Jeśli nic nie wybrano, nie wyświetlamy żadnych danych
  }

  const term = 10;
  const allVotes = await fetchAllProceedings(term);
  const selectedVotes = allVotes[selectedIndex];

  if (selectedVotes) {
    displayVotingResults([selectedVotes]); // Wyświetlamy tylko głosowania dla wybranego posiedzenia
  } else {
    document.getElementById("votingResults").innerHTML = "<p>Brak danych do wyświetlenia.</p>";
  }
});

// Załaduj posiedzenia i wypełnij dropdown
document.addEventListener("DOMContentLoaded", async () => {
  const term = 10;
  const allVotes = await fetchAllProceedings(term);
  populateProceedingDropdown(allVotes); // Wypełniamy dropdown posiedzeniami
});
