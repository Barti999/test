document.addEventListener('DOMContentLoaded', function() {
  // Funkcja do pobierania danych o posłach
  async function fetchMPs() {
      try {
          const response = await fetch('https://api.sejm.gov.pl/sejm/term10/mps', {
              method: 'GET',
              headers: {
                  'Accept': 'application/json'
              }
          });
          const data = await response.json();
          displayMPs(data);
      } catch (error) {
          console.error('Błąd podczas pobierania danych o posłach:', error);
      }
  }

  // Funkcja do wyświetlania danych o posłach
  function displayMPs(data) {
      const poslowieList = document.getElementById('poslowie');
      data.forEach(mp => {
          const li = document.createElement('li');
          li.textContent = `${mp.firstName} ${mp.lastName} - Klub: ${mp.club}`;
          poslowieList.appendChild(li);
      });
  }

  // Funkcja do pobierania danych o głosowaniach
  async function fetchVotings() {
      try {
          const response = await fetch('https://api.sejm.gov.pl/sejm/term10/votings/4', {
              method: 'GET',
              headers: {
                  'Accept': 'application/json'
              }
          });
          const data = await response.json();
          displayVotings(data);
      } catch (error) {
          console.error('Błąd podczas pobierania danych o głosowaniach:', error);
      }
  }

  // Funkcja do wyświetlania danych o głosowaniach
  function displayVotings(data) {
      const votingsList = document.getElementById('lista-glosowan');
      data.forEach(voting => {
          const li = document.createElement('li');
          li.textContent = `${voting.title} - Temat: ${voting.topic}, Liczba głosujących: ${voting.totalVoted}`;
          votingsList.appendChild(li);
      });
  }

  // Pobieranie danych po załadowaniu strony
  fetchMPs();
  fetchVotings();
});
