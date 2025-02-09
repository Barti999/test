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
      html += `</div>`;
    });
  });
  votingResultsDiv.innerHTML = html;
}

// Funkcja obliczająca zgodność odpowiedzi użytkownika z głosowaniami
function calculateMatch(userAnswers, mpVotes) {
  let match = 0;

  mpVotes.forEach(vote => {
    if (userAnswers[vote.topic] === vote.vote) {
      match += 1;
    }
  });

  return (match / mpVotes.length) * 100; // Procentowa zgodność
}

// Funkcja do obsługi formularza ankiety
document.getElementById("surveyForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  // Pobieramy odpowiedzi użytkownika z ankiety
  const formData = new FormData(event.target);
  const userAnswers = {};
  formData.forEach((value, key) => {
    userAnswers[key] = value;
  });

  // Pobieramy dane o głosowaniach
  const term = 10;
  const allVotes = await fetchAllProceedings(term);

  // Obliczamy zgodność odpowiedzi użytkownika z głosowaniami
  let results = [];
  allVotes.forEach((proceedingData, index) => {
    proceedingData.forEach(vote => {
      const match = calculateMatch(userAnswers, vote.votes);
      results.push({
        name: `${vote.firstName} ${vote.lastName}`,
        match
      });
    });
  });

  // Sortujemy wyniki po zgodności
  results.sort((a, b) => b.match - a.match);

  // Wyświetlamy wyniki zgodności
  const surveyResultsDiv = document.getElementById("surveyResults");
  surveyResultsDiv.innerHTML = "<h3>Wyniki ankiety</h3>";

  results.forEach(result => {
    const resultElement = document.createElement("div");
    resultElement.textContent = `${result.name} - Zgodność: ${result.match.toFixed(2)}%`;
    surveyResultsDiv.appendChild(resultElement);
  });
});

// Załaduj posiedzenia i wypełnij dropdown
document.addEventListener("DOMContentLoaded", async () => {
  const term = 10;
  const allVotes = await fetchAllProceedings(term);
  populateProceedingDropdown(allVotes); // Wypełniamy dropdown posiedzeniami
});
