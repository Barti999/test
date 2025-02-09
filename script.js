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
    console.error("Błąd podczas pobierania danych:", error);
    return null;
  }
}

// Funkcja do pobierania głosowań posłów
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
    console.error("Błąd podczas pobierania danych:", error);
    return null;
  }
}

// Funkcja do pobierania danych z wielu posiedzeń
async function fetchAllProceedings(term) {
  const maxProceedings = 5; // Ustal limit dla posiedzeń
  let allVotes = [];

  for (let proceeding = 1; proceeding <= maxProceedings; proceeding++) {
    const data = await fetchVotingData(term, proceeding);
    if (!data) {
      console.log(`Brak danych dla posiedzenia ${proceeding}. Zatrzymano pobieranie.`);
      break;
    }
    allVotes.push(data);
  }
  
  return allVotes;
}

// Funkcja obliczająca procentową zgodność
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

// Funkcja wyświetlająca wyniki
function displayResults(compatibilityData) {
  const resultsDiv = document.getElementById('results');
  let resultsHTML = "<h3>Wyniki</h3><ul>";
  
  compatibilityData.forEach(item => {
    resultsHTML += `<li>${item.name}: ${item.compatibility}%</li>`;
  });

  resultsHTML += "</ul>";
  resultsDiv.innerHTML = resultsHTML;
}

// Obsługa formularza ankiety
document.getElementById('surveyForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const userAnswers = [
    document.getElementById('question1').value,
    // Dodaj więcej odpowiedzi w zależności od pytań
  ];

  // Pobierz dane o posłach
  const deputies = await fetchDeputies();
  
  if (!deputies) {
    alert("Nie udało się pobrać danych o posłach.");
    return;
  }

  // Pobierz dane o głosowaniach
  const allVotes = await fetchAllProceedings(10);

  // Oblicz zgodność z posłami
  const compatibilityData = deputies.map(deputy => {
    const deputyVotes = allVotes.map(vote => vote[deputy.id]); // Dopasowanie głosowań posła
    const compatibility = calculateCompatibility(userAnswers, deputyVotes);
    return {
      name: deputy.name,
      compatibility: compatibility.toFixed(2)
    };
  });

  // Wyświetl wyniki
  displayResults(compatibilityData);
});
