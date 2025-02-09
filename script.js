const BASE_URL = "https://api.sejm.gov.pl/sejm/term10/";

// Funkcja do pobierania danych o posłach
async function fetchDeputies() {
  const url = `${BASE_URL}deputies`; // Endpoint API do posłów
  try {
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`Błąd HTTP: ${response.status}`);
    }
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
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`Błąd HTTP: ${response.status}`);
    }
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

// Funkcja wyświetlająca wyniki głosowań w elemencie #votingResults
function displayVotingResults(votingData) {
  const votingResultsDiv = document.getElementById("votingResults");
  let html = "<h3>Wyniki głosowań</h3>";
  
  // votingData to tablica, gdzie każdy element to dane z jednego posiedzenia (tablica obiektów)
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

// Funkcja obliczająca procentową zgodność (przykładowa logika – należy ją dostosować do właściwego mapowania danych)
function calculateCompatibility(userAnswers, deputyVotes) {
  let matchingAnswers = 0;
  let totalQuestions = userAnswers.length;

  userAnswers.forEach((answer, index) => {
    if (answer === deputyVotes[index]) {
      matchingAnswers++;
    }
  });

  return (matchingAnswers / totalQuestions) * 100;
}

// Funkcja wyświetlająca wyniki ankiety (np. ranking posłów)
function displaySurveyResults(compatibilityData) {
  const resultsDiv = document.getElementById("results");
  let html = "<h3>Wyniki ankiety</h3><ul>";
  
  compatibilityData.forEach(item => {
    html += `<li>${item.name}: ${item.compatibility}%</li>`;
  });
  
  html += "</ul>";
  resultsDiv.innerHTML = html;
}

// Obsługa wysłania formularza ankiety
document.getElementById("surveyForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  // Pobranie odpowiedzi użytkownika – rozbuduj tę część w zależności od liczby pytań
  const userAnswers = [
    document.getElementById("question1").value
    // Dodaj więcej odpowiedzi, jeśli ankieta ma więcej pytań
  ];

  // Pobierz dane o posłach
  const deputies = await fetchDeputies();
  if (!deputies) {
    alert("Nie udało się pobrać danych o posłach.");
    return;
  }

  // Pobierz dane o głosowaniach
  const allVotes = await fetchAllProceedings(10);

  // Obliczenie zgodności – obecnie logika jest przykładowa.
  // Aby obliczenia miały sens, trzeba odwzorować głosowania posłów na konkretne pytania ankiety.
  const compatibilityData = deputies.map(deputy => {
    // Jako przykład – losowa wartość zgodności
    const compatibility = Math.random() * 100;
    return {
      name: deputy.name,
      compatibility: compatibility.toFixed(2)
    };
  });

  // Wyświetlenie wyników ankiety
  displaySurveyResults(compatibilityData);
});

// Po załadowaniu strony pobieramy i wyświetlamy dane głosowań
document.addEventListener("DOMContentLoaded", async () => {
  const term = 10;
  const votingData = await fetchAllProceedings(term);
  displayVotingResults(votingData);
});
