// Import stylesheets
import './style.css';

const form: HTMLFormElement = document.querySelector('#defineform');

// Define types for the API response
interface Definition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

interface DictionaryResponse {
  word: string;
  meanings: Meaning[];
  title?: string;
}

// Function to handle form submission
function handleFormSubmit(event: Event): void {
  event.preventDefault(); // Prevent form from submitting the default way

  // Get the word to define
  const inputElement = document.querySelector<HTMLInputElement>('input[name="defineword"]');
  const word = inputElement?.value.trim();

  if (word) {
    // Call the API to get the definition
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then(response => response.json())
      .then((data: DictionaryResponse[]) => {
        // Clear previous results
        const resultContainer = document.querySelector('.bg-light .list-unstyled');
        if (resultContainer) {
          resultContainer.innerHTML = '';

          // Check if the API returned a valid result
          if (data[0].title && data[0].title === 'No Definitions Found') {
            resultContainer.innerHTML = `<li>No definitions found for "${word}".</li>`;
          } else {
            // Loop through each meaning and definition
            data[0].meanings.forEach(meaning => {
              // Add the part of speech
              const partOfSpeech = document.createElement('li');
              partOfSpeech.innerHTML = `<strong>${meaning.partOfSpeech}</strong>`;
              resultContainer.appendChild(partOfSpeech);

              meaning.definitions.forEach(definition => {
                const defItem = document.createElement('li');
                defItem.textContent = definition.definition;
                resultContainer.appendChild(defItem);

                // Add example if it exists
                if (definition.example) {
                  const exampleItem = document.createElement('li');
                  exampleItem.innerHTML = `<em>Example:</em> ${definition.example}`;
                  resultContainer.appendChild(exampleItem);
                }

                // Add synonyms if they exist
                if (definition.synonyms && definition.synonyms.length > 0) {
                  const synonymList = document.createElement('ul');
                  synonymList.innerHTML = '<li><strong>Synonyms:</strong></li>';
                  definition.synonyms.forEach(synonym => {
                    const synonymItem = document.createElement('li');
                    synonymItem.textContent = synonym;
                    synonymList.appendChild(synonymItem);
                  });
                  resultContainer.appendChild(synonymList);
                }

                // Add antonyms if they exist
                if (definition.antonyms && definition.antonyms.length > 0) {
                  const antonymList = document.createElement('ul');
                  antonymList.innerHTML = '<li><strong>Antonyms:</strong></li>';
                  definition.antonyms.forEach(antonym => {
                    const antonymItem = document.createElement('li');
                    antonymItem.textContent = antonym;
                    antonymList.appendChild(antonymItem);
                  });
                  resultContainer.appendChild(antonymList);
                }
              });
            });
          }
        }
      })
      .catch(error => {
        // Handle any errors
        const resultContainer = document.querySelector('.bg-light .list-unstyled');
        if (resultContainer) {
          resultContainer.innerHTML = `<li>Error fetching definition. Please try again later.</li>`;
        }
      });
  } else {
    alert('Please enter a word to define.');
  }
}

// Add event listener for the form submission
const form = document.getElementById('defineform');
form?.addEventListener('submit', handleFormSubmit);

form.onsubmit = () => {
  const formData = new FormData(form);

  console.log(formData);
  const text = formData.get('defineword') as string;
  console.log(text);
  return false; // prevent reload
};