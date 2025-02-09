const contentDiv = document.getElementById("content");

// Funkcja do formatowania liczby z separatorem
const formatNumber = (num) => num.toLocaleString('pl-PL');

// Pobieranie i wyświetlanie listy posłów
document.getElementById("showMPs").addEventListener("click", async () => {
  contentDiv.innerHTML = "<p>Ładowanie listy posłów...</p>";
  try {
    const response = await fetch("https://api.sejm.gov.pl/sejm/term10/MP");
    const mps = await response.json();

    if (!Array.isArray(mps)) {
      contentDiv.innerHTML = "<p>Nieprawidłowa struktura danych posłów.</p>";
      return;
    }

    const activeTrue = mps.filter(mp => mp.active);
    const activeFalse = mps.filter(mp => !mp.active);

    let html = "<section><h2>Posłowie</h2>";

    const groupedByClub = activeTrue.reduce((acc, mp) => {
      acc[mp.club] = acc[mp.club] || [];
      acc[mp.club].push(mp);
      return acc;
    }, {});

    html += "<h3>Aktywni</h3>";
    for (const club in groupedByClub) {
      html += `<h4>Klub: ${club}</h4>`;
      groupedByClub[club].forEach(mp => {
        html += `<div class="card">
          <img class="mp-photo" src="https://api.sejm.gov.pl/sejm/term10/MP/${mp.id}/photo-mini" alt="Zdjęcie posła">
          <div class="card-content">
            <div><span>Imię i nazwisko:</span> ${mp.firstLastName}</div>
            <div><span>Klub:</span> ${mp.club}</div>
            <div><span>Okręg:</span> ${mp.districtName} (${mp.districtNum})</div>
            <div><span>Data urodzenia:</span> ${mp.birthDate}</div>
            <div><span>Wykształcenie:</span> ${mp.educationLevel}</div>
            <div><span>Zawód:</span> ${mp.profession}</div>
            <div><span>Liczba głosów:</span> ${formatNumber(mp.numberOfVotes)}</div>
            <div><span>Numer legitymacji:</span> ${mp.id}</div>
            <div><span>Email:</span> <a href="mailto:${mp.email}">${mp.email}</a></div>
          </div>
        </div>`;
      });
    }

    html += "<h3>Nieaktywni</h3>";
    activeFalse.forEach(mp => {
      html += `<div class="card">
        <img class="mp-photo" src="https://api.sejm.gov.pl/sejm/term10/MP/${mp.id}/photo-mini" alt="Zdjęcie posła ${mp.firstLastName}">
        <div class="card-content">
          <div><span>Imię i nazwisko:</span> ${mp.firstLastName}</div>
          <div><span>Klub:</span> ${mp.club}</div>
          <div><span>Okręg:</span> ${mp.districtName} (${mp.districtNum})</div>
          <div><span>Data urodzenia:</span> ${mp.birthDate}</div>
          <div><span>Wykształcenie:</span> ${mp.educationLevel}</div>
          <div><span>Zawód:</span> ${mp.profession}</div>
          <div><span>Liczba głosów:</span> ${formatNumber(mp.numberOfVotes)}</div>
          <div><span>Numer legitymacji:</span> ${mp.id}</div>
          <div><span>Email:</span> <a href="mailto:${mp.email}">${mp.email}</a></div>
        </div>
      </div>`;
    });

    html += "</section>";
    contentDiv.innerHTML = html;
  } catch (error) {
    console.error("Błąd podczas ładowania danych posłów:", error);
    contentDiv.innerHTML = "<p>Błąd podczas ładowania danych.</p>";
  }
});

// Pobieranie i wyświetlanie listy posiedzeń
document.getElementById("showProceedings").addEventListener("click", async () => {
  contentDiv.innerHTML = "<p>Ładowanie listy posiedzeń...</p>";
  try {
    const response = await fetch("https://api.sejm.gov.pl/sejm/term10/proceedings");
    const proceedings = await response.json();

    let html = "<section><h2>Posiedzenia</h2>";
    proceedings.forEach(proceeding => {
      html += `<div class="card">
        <p><strong>Posiedzenie:</strong> ${proceeding.title}</p>
      </div>`;
    });

    html += "</section>";
    contentDiv.innerHTML = html;
  } catch (error) {
    contentDiv.innerHTML = "<p>Błąd podczas ładowania danych.</p>";
  }
});

// Pobieranie i wyświetlanie głosowań na podstawie dat
document.getElementById("showVotes").addEventListener("click", async () => {
  contentDiv.innerHTML = "<p>Ładowanie głosowań...</p>";
  try {
    // Pobranie posiedzeń
    const response = await fetch("https://api.sejm.gov.pl/sejm/term10/proceedings");
    const proceedings = await response.json();

    let html = "<section><h2>Głosowania</h2>";

    // Dla każdego posiedzenia dodajemy linki do głosowań
    for (const proceeding of proceedings) {
      const { dates, title } = proceeding;

      html += `<h3>${title}</h3>`;
      html += `<ul>`;
      for (const date of dates) {
        html += `<li><button class="vote-date" data-date="${date}">${date}</button></li>`;
      }
      html += `</ul>`;
    }

    html += "</section>";
    contentDiv.innerHTML = html;

    // Obsługa kliknięć w przyciski z datami
    const voteButtons = document.querySelectorAll('.vote-date');
    voteButtons.forEach(button => {
      button.addEventListener("click", async (e) => {
        const date = e.target.dataset.date;
        contentDiv.innerHTML = `<p>Ładowanie głosowań dla dnia ${date}...</p>`;
        try {
          const voteResponse = await fetch(`https://api.sejm.gov.pl/sejm/term10/MP/1/votings/1/${date}`);
          const votes = await voteResponse.json();
          
          let voteHtml = `<h3>Głosowania w dniu: ${date}</h3>`;
          votes.forEach(vote => {
            voteHtml += `<div class="card">
              <p><strong>Tytuł:</strong> ${vote.title}</p>
              <p><strong>Typ głosowania:</strong> ${vote.type}</p>
            </div>`;
          });

          contentDiv.innerHTML = voteHtml;
        } catch (error) {
          contentDiv.innerHTML = "<p>Błąd podczas ładowania danych głosowań.</p>";
        }
      });
    });

  } catch (error) {
    contentDiv.innerHTML = "<p>Błąd podczas ładowania danych posiedzeń.</p>";
  }
});
