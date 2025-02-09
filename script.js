const contentDiv = document.getElementById("content");

document.getElementById("showMPs").addEventListener("click", async () => {
  contentDiv.innerHTML = "<p>Ładowanie listy posłów...</p>";
  try {
    const response = await fetch("https://api.sejm.gov.pl/sejm/term10/MP");
    const mps = await response.json();

    const activeTrue = mps.filter(mp => mp.active);
    const activeFalse = mps.filter(mp => !mp.active);

    let html = "<h2>Posłowie</h2>";

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
                    <img src="https://api.sejm.gov.pl/sejm/term10/MP/${mp.id}/photo" alt="Zdjęcie posła ${mp.firstLastName}" class="mp-photo">
                    <p><strong>Imię i nazwisko:</strong> ${mp.firstLastName}</p>
                    <p><strong>Numer legitymacji poselskiej:</strong> ${mp.id}</p>
                    <p><strong>Email:</strong> <a href="mailto:${mp.email}">${mp.email}</a></p>
                    <p><strong>Data urodzenia:</strong> ${mp.birthDate} (${mp.birthLocation})</p>
                    <p><strong>Klub:</strong> ${mp.club}</p>
                    <p><strong>Okręg:</strong> ${mp.districtName} (nr: ${mp.districtNum})</p>
                    <p><strong>Wykształcenie:</strong> ${mp.educationLevel}</p>
                    <p><strong>Profesja:</strong> ${mp.profession}</p>
                    <p><strong>Liczba głosów:</strong> ${mp.numberOfVotes}</p>
                    <p><strong>Województwo:</strong> ${mp.voivodeship}</p>
                 </div>`;
      });
    }

    html += "<h3>Nieaktywni</h3>";
    activeFalse.forEach(mp => {
      html += `<div class="card">
                  <img src="https://api.sejm.gov.pl/sejm/term10/MP/${mp.id}/photo" alt="Zdjęcie posła ${mp.firstLastName}" class="mp-photo">
                  <p><strong>Imię i nazwisko:</strong> ${mp.firstLastName}</p>
                  <p><strong>Numer legitymacji poselskiej:</strong> ${mp.id}</p>
                  <p><strong>Email:</strong> <a href="mailto:${mp.email}">${mp.email}</a></p>
                  <p><strong>Data urodzenia:</strong> ${mp.birthDate} (${mp.birthLocation})</p>
                  <p><strong>Klub:</strong> ${mp.club}</p>
                  <p><strong>Okręg:</strong> ${mp.districtName} (nr: ${mp.districtNum})</p>
                  <p><strong>Wykształcenie:</strong> ${mp.educationLevel}</p>
                  <p><strong>Profesja:</strong> ${mp.profession}</p>
                  <p><strong>Liczba głosów:</strong> ${mp.numberOfVotes}</p>
                  <p><strong>Województwo:</strong> ${mp.voivodeship}</p>
               </div>`;
    });

    contentDiv.innerHTML = html;
  } catch (error) {
    contentDiv.innerHTML = "<p>Błąd podczas ładowania danych.</p>";
  }
});

document.getElementById("showProceedings").addEventListener("click", async () => {
  contentDiv.innerHTML = "<p>Ładowanie listy posiedzeń...</p>";
  try {
    const response = await fetch("https://api.sejm.gov.pl/sejm/term10/proceedings");
    const proceedings = await response.json();

    let html = "<h2>Posiedzenia</h2>";
    proceedings.forEach(proceeding => {
      html += `<div class="card">
                  <p>${proceeding.title}</p>
               </div>`;
    });

    contentDiv.innerHTML = html;
  } catch (error) {
    contentDiv.innerHTML = "<p>Błąd podczas ładowania danych.</p>";
  }
});
