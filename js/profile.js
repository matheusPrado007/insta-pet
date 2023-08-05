const API_URL = 'https://adote-amor.onrender.com/upload';

function getUserIdFromUrl() {
  const url = window.location.href;
  const hashIndex = url.indexOf('#');
  if (hashIndex !== -1) {
    const id = url.slice(hashIndex + 1);
    return id;
  }
  return null;
}

async function fetchAnimais() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Erro na solicitação: ' + response.status);
    }
    const data = await response.json();
    const animal = data.find(animal => animal._id === getUserIdFromUrl());
    return animal;
  } catch (error) {
    console.error('Erro ao buscar animal:', error);
    throw error;
  }
}

async function renderAnimal() {
  try {
    const animalData = await fetchAnimais();

    if (!animalData) {
      console.error('Animal não encontrado.');
      return;
    }

    const animalNameElement = document.getElementById('animal-name');
    const animalAgeElement = document.getElementById('animal-age');
    const animalDescriptionElement = document.getElementById('animal-description');
    const animalAdoptedElement = document.getElementById('animal-adopted');
    const animalImageElements = document.querySelectorAll('.image');

    animalNameElement.textContent = animalData.name;
    animalAgeElement.textContent = `Idade: ${animalData.idade} anos`;
    animalDescriptionElement.textContent = animalData.descricao;
    animalAdoptedElement.textContent = `Adotado: ${animalData.adotado.toUpperCase() === 'S' ? 'sim' : 'não'}`;

    const loadImage = (imageElement, loadingTextElement) => {
      return new Promise((resolve) => {
        const image = new Image();
        image.onload = function () {
          imageElement.src = animalData.foto;
          loadingTextElement.style.display = 'none';
          resolve();
        };
        image.src = animalData.foto;
      });
    };

    const imageContainers = document.querySelectorAll('.image-container');
    imageContainers.forEach((container) => {
      const imageElement = container.querySelector('.image');
      const loadingTextElement = container.querySelector('.loading-text');
      loadImage(imageElement, loadingTextElement);
    });
  } catch (error) {
    console.error('Erro ao renderizar o animal:', error);
  }
}

renderAnimal();


