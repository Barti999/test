// Funkcja do pobierania danych o posłach
async function fetchMPs() {
  const response = await fetch('https://api.sejm.gov.pl/sejm/term10/MP');
  const data = await response.json();
  return data.map(mp => ({
    club: mp.club,
    firstName: mp.firstName,
    lastName: mp.lastName,
    id: mp.id,
  }));
}

// Funkcja do pobierania danych o posiedzeniach
async function fetchProceedings() {
  const response = await fetch('https://api.sejm.gov.pl/sejm/term10/proceedings');
  const data = await response.json();
  return data.filter(item => item.number !== 0).map(proceeding => ({
    dates: proceeding.dates,
    number: proceeding.number,
    title: proceeding.title,
  }));
}

// Funkcja do pobierania danych o głosowaniach
async function fetchVotings(proceedingNumber) {
  const response = await fetch(`https://api.sejm.gov.pl/sejm/term10/votings/${proceedingNumber}`);
  const data = await response.json();
  return data.map(vote => ({
    description: vote.description,
    kind: vote.kind,
    titleG: vote.title,
    topic: vote.topic,
    votingNumber: vote.votingNumber,
  }));
}

// Funkcja do pobierania danych o głosowaniu posła
async function fetchMPVotes(id, proceedingNumber, date) {
  const response = await fetch(`https://api.sejm.gov.pl/sejm/term10/MP/${id}/votings/${proceedingNumber}/${date}`);
  const data = await response.json();
  return data.map(vote => ({
    description: vote.description,
    kind: vote.kind,
    titleG: vote.title,
    topic: vote.topic,
    vote: vote.kind === "ON_LIST" ? vote.listVotes : vote.vote,
  }));
}

// Funkcja do ładowania wszystkich danych i generowania tabeli
async function loadData() {
  const MPs = await fetchMPs();
  const proceedings = await fetchProceedings();

  const tableBody = document.querySelector('#votesTable tbody');

  for (let proceeding of proceedings) {
    const votings = await fetchVotings(proceeding.number);
    
    for (let vote of votings) {
      for (let mp of MPs) {
        const mpVotes = await fetchMPVotes(mp.id, proceeding.number, proceeding.dates[0]); // Zakładając, że korzystamy z pierwszej daty posiedzenia
        for (let mpVote of mpVotes) {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${vote.titleG}</td>
            <td>${proceeding.dates.join(", ")}</td>
            <td>${vote.description}</td>
            <td>${vote.kind}</td>
            <td>${vote.titleG}</td>
            <td>${vote.topic}</td>
            <td>${mp.club}</td>
            <td>${mp.firstName}</td>
            <td>${mp.lastName}</td>
            <td>${mp.id}</td>
            <td>${mpVote.vote || mpVote.listVotes}</td>
          `;
          tableBody.appendChild(row);
        }
      }
    }
  }
}

// Wywołanie funkcji po załadowaniu strony
window.onload = loadData;
