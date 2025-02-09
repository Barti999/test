const apiBase = "https://api.sejm.gov.pl/sejm/term10";

// Pobieranie listy posiedzeń
async function getSessions() {
  try {
    const response = await fetch(`${apiBase}/sittings`);
    if (!response.ok) throw new Error("Błąd podczas pobierania danych posiedzeń.");
    
    const sessions = await response.json();
    populateSessions(sessions);
  } catch (error) {
    console.error("Błąd podczas pobierania posiedzeń:", error);
  }
}

// Wypełnienie listy posiedzeń w menu
function populateSessions(sessions) {
  const sessionSelect = document.getElementById("sessions");
  sessionSelect.innerHTML = '<option value="">Wybierz posiedzenie</option>';
  
  sessions.forEach(session => {
    const option = document.createElement("option");
    option.value = session.number;
    option.textContent = `Posiedzenie nr ${session.number} (${session.startDate})`;
    sessionSelect.appendChild(option);
  });
}

// Pobieranie głosowań dla danego posiedzenia
async function getVotes(sessionNumber) {
  try {
    const response = await fetch(`${apiBase}/sittings/${sessionNumber}/votes`);
    if (!response.ok) throw new Error("Błąd podczas pobierania głosowań.");
    
    const votes = await response.json();
    populateVotes(votes);
  } catch (error) {
    console.error("Błąd podczas pobierania głosowań:", error);
  }
}

// Wypełnienie listy głosowań
function populateVotes(votes) {
  const votesList = document.getElementById("votes");
  votesList.innerHTML = "";

  if (votes.length === 0) {
    votesList.innerHTML = "<li>Brak głosowań dla tego posiedzenia.</li>";
    return;
  }

  votes.forEach(vote => {
    const li = document.createElement("li");
    li.textContent = `Głosowanie nr ${vote.number} (${vote.title})`;
    li.addEventListener("click", () => getVoteDetails(vote.number));
    votesList.appendChild(li);
  });
}

// Pobieranie szczegółów głosowania
async function getVoteDetails(voteNumber) {
  try {
    const response = await fetch(`${apiBase}/votes/${voteNumber}`);
    if (!response.ok) throw new Error("Błąd podczas pobierania szczegółów głosowania.");
    
    const voteDetails = await response.json();
    displayVoteDetails(voteDetails);
  } catch (error) {
    console.error("Błąd podczas pobierania szczegółów głosowania:", error);
  }
}

// Wyświetlanie szczegółów głosowania
function displayVoteDetails(voteDetails) {
  const voteDetailsDiv = document.getElementById("vote-details");
  voteDetailsDiv.innerHTML = `
    <h3>Szczegóły głosowania nr ${voteDetails.number}</h3>
    <p><strong>Tytuł:</strong> ${voteDetails.title}</p>
    <p><strong>Data:</strong> ${voteDetails.date}</p>
    <h4>Wyniki:</h4>
    <ul>
      ${voteDetails.results.map(result => `<li>${result.name}: ${result.vote}</li>`).join("")}
    </ul>
  `;
}

document.getElementById("sessions").addEventListener("change", event => {
  const sessionNumber = event.target.value;
  if (sessionNumber) {
    getVotes(sessionNumber);
  } else {
    document.getElementById("votes").innerHTML = "";
  }
});

getSessions();
