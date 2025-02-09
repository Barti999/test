const BASE_URL = "https://api.sejm.gov.pl/sejm/term10/";

// Funkcja do pobierania danych o posłach
async function fetchDeputies() {
  const url = `${BASE_URL}deputies`;
  try {
    const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!response.ok) throw new Error(`Błąd HTTP: ${response.status}`);
    const data = await response.json();
    console.log("Dane o posłach:", data);
    return data;
  } catch (error) {
    console.error("Błąd podczas pobierania danych o posłach:", error);
    return null;
  }
}

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

// Funkcja do pobierania danych z wielu posiedzeń
async function fetchAllProceedings(term) {
  const maxProceedings = 5; // Ustal limit posiedzeń do pobrania
  let allVotes = [];

  for (let proceeding = 1; proceeding <= maxProceedings; proceeding++) {
    console.log(`Pobieram dane dla posiedzenia ${proceeding}...`);
    const data = await fetchVotingData(term, proceeding);
    if (!data) {
      console.log(`Brak danych dla posiedzenia ${proceeding}. Zatrzymano pobieranie.`);
      break;
    }
    allVotes.push(data);
  }

  return allVotes;
}

// Funkcja do wyświetlania posiedzeń w dropdown
function populateProceedingDropdown(proceedings) {
  const proceedingSelect = document.getElementById("proceedingSelect");
  proceedings.forEach((proceeding, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `Posiedzenie ${index + 1} - ${proceeding.date}`;
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

// Obsługa wysłania formularza ankiety
document.getElementById("surveyForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const userAnswers = [document.getElementById("question1").value];
  const deputies = await fetchDeputies();
  if (!deputies) {
    alert("Nie udało się pobrać danych o posłach.");
    return;
  }

  const allVotes = await fetchAllProceedings(10);
  const compatibilityData = deputies.map(deputy => {
    const compatibility = Math.random() * 100;
    return { name: deputy.name, compatibility: compatibility.toFixed(2) };
  });

  displaySurveyResults(compatibilityData);
});

// Załaduj posiedzenia i wypełnij dropdown
document.addEventListener("DOMContentLoaded", async () => {
  const term = 10;
  const allVotes = await fetchAllProceedings(term);
  populateProceedingDropdown(allVotes); // Wypełniamy dropdown posiedzeniami
});
