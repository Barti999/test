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
          console.log("Dane o posłach:", data); // Debugowanie - logowanie danych
          displayMPs(data);
      } catch (error) {
          console.error('Błąd podczas pobierania danych o posłach:', error);
      }
  }

  // Funkcja do wyświetlania danych o posłach
  function displayMPs(data) {
      const poslowieList = document.getElementById('poslowie');
      poslowieList.innerHTML = ''; // Czyścimy listę przed dodaniem nowych elementów
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
          console.log("Dane o głosowaniach:", data); // Debugowanie - logowanie danych
          displayVotings(data);
      } catch (error) {
          console.error('Błąd podczas pobierania danych o głosowaniach:', error);
      }
  }

  // Funkcja do wyświetlania danych o głosowaniach
  function displayVotings(data) {
      const votingsList = document.getElementById('lista-glosowan');
      votingsList.innerHTML = ''; // Czyścimy listę przed dodaniem nowych elementów
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
