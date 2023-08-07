const toggleThemeBtn = document.querySelector('.header__theme-button');
const storiesContent = document.querySelector('.stories__content');
const storiesLeftButton = document.querySelector('.stories__left-button');
const storiesRightButton = document.querySelector('.stories__right-button');
const posts = document.querySelectorAll('.post');
const postsContent = document.querySelectorAll('.post__content');
const logo = document.querySelector('.logo')

function setInitialTheme(themeKey) {
  document.documentElement.classList.toggle('darkTheme', themeKey === 'dark');
  const logo = document.querySelector('.logo');
  logo.src = themeKey === 'dark' ? '/images/cat-1.png' : '/images/icons8-cachorro-48.png';
}

// Toggle theme button
toggleThemeBtn.addEventListener('click', () => {
  // Toggle root class
  document.documentElement.classList.toggle('darkTheme');

  // Saving current theme on LocalStorage
  if (document.documentElement.classList.contains('darkTheme')) {
    localStorage.setItem('theme', 'dark');
    logo.src = '/images/cat-1.png';
  } else {
    logo.src = '/images/icons8-cachorro-48.png';
    localStorage.setItem('theme', 'light');
  }
});

// ===================================
// STORIES SCROLL BUTTONS
// Scrolling stories content
// Navegação do conteúdo de histórias
if (storiesContent) {
  storiesLeftButton.addEventListener('click', () => {
    storiesContent.scrollLeft -= 320;
  });

  storiesRightButton.addEventListener('click', () => {
    storiesContent.scrollLeft += 320;
  });

  // Verificar se a tela possui largura mínima de 1024px
  if (window.matchMedia('(min-width: 1024px)').matches) {
    const storiesObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach((entry) => {
          if (entry.target.classList.contains('story:first-child')) {
            storiesLeftButton.style.display = entry.isIntersecting ? 'none' : 'unset';
          } else if (entry.target.classList.contains('story:last-child')) {
            storiesRightButton.style.display = entry.isIntersecting ? 'none' : 'unset';
          }
        });
      },
      { root: storiesContent, threshold: 1 }
    );

    // Chamar o observador com as primeiras e últimas histórias
    const firstStory = document.querySelector('.story:first-child');
    const lastStory = document.querySelector('.story:last-child');

    if (firstStory) {
      storiesObserver.observe(firstStory);
    }

    if (lastStory) {
      storiesObserver.observe(lastStory);
    }
  }
}


// ===================================
// POST MULTIPLE MEDIAS
// Creating scroll buttons and indicators when post has more than one media
posts.forEach((post) => {
  if (post.querySelectorAll('.post__media').length > 1) {
    const leftButtonElement = document.createElement('button');
    leftButtonElement.classList.add('post__left-button');
    leftButtonElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path fill="#fff" d="M256 504C119 504 8 393 8 256S119 8 256 8s248 111 248 248-111 248-248 248zM142.1 273l135.5 135.5c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L226.9 256l101.6-101.6c9.4-9.4 9.4-24.6 0-33.9l-17-17c-9.4-9.4-24.6-9.4-33.9 0L142.1 239c-9.4 9.4-9.4 24.6 0 34z"></path>
      </svg>
    `;

    const rightButtonElement = document.createElement('button');
    rightButtonElement.classList.add('post__right-button');
    rightButtonElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path fill="#fff" d="M256 8c137 0 248 111 248 248S393 504 256 504 8 393 8 256 119 8 256 8zm113.9 231L234.4 103.5c-9.4-9.4-24.6-9.4-33.9 0l-17 17c-9.4 9.4-9.4 24.6 0 33.9L285.1 256 183.5 357.6c-9.4 9.4-9.4 24.6 0 33.9l17 17c9.4 9.4 24.6 9.4 33.9 0L369.9 273c9.4-9.4 9.4-24.6 0-34z"></path>
      </svg>
    `;

    post.querySelector('.post__content').appendChild(leftButtonElement);
    post.querySelector('.post__content').appendChild(rightButtonElement);

    post.querySelectorAll('.post__media').forEach(function () {
      const postMediaIndicatorElement = document.createElement('div');
      postMediaIndicatorElement.classList.add('post__indicator');

      post
        .querySelector('.post__indicators')
        .appendChild(postMediaIndicatorElement);
    });

    // Observer to change the actual media indicator
    const postMediasContainer = post.querySelector('.post__medias');
    const postMediaIndicators = post.querySelectorAll('.post__indicator');
    const postIndicatorObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Removing all the indicators
            postMediaIndicators.forEach((indicator) =>
              indicator.classList.remove('post__indicator--active')
            );
            // Adding the indicator that matches the current post media
            postMediaIndicators[
              Array.from(postMedias).indexOf(entry.target)
            ].classList.add('post__indicator--active');
          }
        });
      },
      { root: postMediasContainer, threshold: 0.5 }
    );

    // Calling the observer for every post media
    const postMedias = post.querySelectorAll('.post__media');
    postMedias.forEach((media) => {
      postIndicatorObserver.observe(media);
    });
  }
});

// Adding buttons features on every post with multiple medias
postsContent.forEach((post) => {
  if (post.querySelectorAll('.post__media').length > 1) {
    const leftButton = post.querySelector('.post__left-button');
    const rightButton = post.querySelector('.post__right-button');
    const postMediasContainer = post.querySelector('.post__medias');

    // Functions for left and right buttons
    leftButton.addEventListener('click', () => {
      postMediasContainer.scrollLeft -= 400;
    });
    rightButton.addEventListener('click', () => {
      postMediasContainer.scrollLeft += 400;
    });

    // Observer to hide button if necessary
    const postButtonObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach((entry) => {
          if (entry.target === post.querySelector('.post__media:first-child')) {
            leftButton.style.display = entry.isIntersecting ? 'none' : 'unset';
          } else if (
            entry.target === post.querySelector('.post__media:last-child')
          ) {
            rightButton.style.display = entry.isIntersecting ? 'none' : 'unset';
          }
        });
      },
      { root: postMediasContainer, threshold: 0.5 }
    );

    if (window.matchMedia('(min-width: 1024px)').matches) {
      postButtonObserver.observe(
        post.querySelector('.post__media:first-child')
      );
      postButtonObserver.observe(post.querySelector('.post__media:last-child'));
    }
  }
});

// JavaScript
const API_URL = 'https://adote-amor.onrender.com/upload';

const ADOPTED_ANIMAL_STATUS = 'S';

const fallbackImageUrl = '/images/cat-totoro.gif';


async function fetchAnimais() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Erro na solicitação: ' + response.status);
    }
    const data = await response.json();
    const responseDataSizeInBytes = new TextEncoder().encode(JSON.stringify(data)).length;
    console.log('Tamanho da resposta da API (em bytes):', responseDataSizeInBytes);

    console.log(data);
    return data;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

const buttonData = [
  {
    iconPath: "/images/coracao-2.png",
    fillColor: 'var(--text-dark)',
    strokeColor: 'var(--text-dark)',
    strokeWidth: '1.9rem',
  },
  {
    iconPath: "/images/comp.png",
    fillColor: 'var(--text-dark)',
    strokeColor: 'var(--text-dark)',
    strokeWidth: '1.7rem',
  },
  {
    iconPath: "/images/clique.png",
    fillColor: 'var(--text-dark)',
    strokeColor: 'var(--text-dark)',
    strokeWidth: '5.5rem',
  },
  {
    iconPath: "/images/money.png",
    fillColor: 'var(--text-dark)',
    strokeColor: 'var(--text-dark)',
    strokeWidth: '3rem',
  },
];

// Função para criar os botões dinamicamente
function createButton(iconPath, fillColor, strokeColor, strokeWidth) {
  const button = document.createElement('button');
  button.className = 'post__button';

  if (iconPath === "/images/money.png" || iconPath === "/images/clique.png") {
    button.classList.add('post__button--align-right');
  }

  if ( iconPath === "/images/clique.png") {
    button.classList.add('me-adote');
  }

  const img = document.createElement('img');
  img.src = iconPath;
  img.style.fill = fillColor;
  img.style.stroke = strokeColor;
  img.style.width = strokeWidth;
  img.alt = 'Button Image';

  button.appendChild(img);

  return button;
}
document.addEventListener('DOMContentLoaded', function () {
  buttonData.forEach((buttonInfo) => {
    const { iconPath, fillColor, strokeColor, strokeWidth } = buttonInfo;
    createButton(iconPath, fillColor, strokeColor, strokeWidth);
  });
});



function createPostFooter() {
  const postFooter = document.createElement('div');
  postFooter.classList.add('post__buttons');

  const randomNumber = Math.floor(Math.random() * 81) + 20;

  buttonData.forEach((button) => {
    const buttonElement = createButton(button.iconPath, button.fillColor, button.strokeColor, button.strokeWidth);
    postFooter.appendChild(buttonElement);
  });

  return postFooter;
}

async function createAvatarLink(avatarUrl) {
  const avatarLink = document.createElement('a');
  avatarLink.href = "#";
  avatarLink.classList.add('post__avatar');

  const avatarImg = document.createElement('img');
  avatarImg.src = avatarUrl;
  avatarImg.alt = 'User Picture';

  avatarLink.appendChild(avatarImg);

  return avatarLink;
}

async function createUserLink(username) {
  const userLink = document.createElement('a');
  userLink.href = '#';
  userLink.classList.add('post__user');
  userLink.textContent = username;

  return userLink;
}

async function createPostMediasElement() {
  const postMedias = document.createElement('div');
  postMedias.classList.add('post__medias');
  return postMedias;
}

async function createPostMediaElement(mediaUrl, animalData) {
  const divContainer = document.createElement('div');
  divContainer.classList.add('header_back', 'image-container');

  const spanElement = document.createElement('span');
  spanElement.classList.add('loading-text');
  spanElement.textContent = 'Carregando...';

  return new Promise((resolve, reject) => {
    const postMedia = new Image();
    postMedia.classList.add('post__media', 'image');
    postMedia.alt = 'Imagem da Postagem';
    postMedia.src = fallbackImageUrl;

    divContainer.appendChild(postMedia);
    divContainer.appendChild(spanElement);

    postMedia.onerror = () => {

      const fallbackImg = new Image();
      fallbackImg.src = fallbackImageUrl;
      fallbackImg.alt = 'Imagem de fallback';
      resolve(fallbackImg);
    };

    postMedia.onload = () => {
      resolve(postMedia);
    };

    postMedia.setAttribute('data-src', mediaUrl);

    postMedia.addEventListener('click', () => {
      redirectToAnimalProfile(animalData);
    });

    resolve(postMedia);
  });
}

function lazyLoadImages() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target;
        lazyImage.src = lazyImage.getAttribute('data-src');
        lazyImage.removeAttribute('data-src');
        imageObserver.unobserve(lazyImage);
      }
    });
  });

  lazyImages.forEach((lazyImage) => {
    imageObserver.observe(lazyImage);
  });
}

function redirectToAnimalProfile(animalData) {
  const profileUrl = `/pages/profile/profile.html#${animalData._id}`;
  window.location.href = profileUrl;
}

function getRandomNumber() {
  return Math.floor(Math.random() * 81) + 20;
}

async function createPostInfos(data, postElements) {
  postElements.forEach((postElement, index) => {
    const dataIndex = index;
    if (dataIndex >= data.length) {
      return;
    }

    function getRandomIndex(data) {
      return Math.floor(Math.random() * data.length);
    }

    const postFooter = postElement.querySelector('.post__footer'); // Encontra o rodapé do post
    const dataItem = data[index]; // Obtém o item de dados correspondente
    const dataItem2 = data[getRandomIndex(data)]; // Obtém um item de dados aleatório

    const postInfos = document.createElement('div');
    postInfos.className = 'post__infos';
    const postLikes = document.createElement('div');
    postLikes.className = 'post__likes';
    const likesAvatarLink = document.createElement('a');
    likesAvatarLink.href = '#';
    likesAvatarLink.className = 'post__likes-avatar';
    const likesAvatarImg = document.createElement('img');
    likesAvatarImg.src = dataItem2.foto; // Usa a URL da imagem do animal do item de dados
    likesAvatarImg.alt = 'User Picture';
    likesAvatarLink.appendChild(likesAvatarImg);
    const likedBySpan = document.createElement('span');
    likedBySpan.innerHTML = `Liked by <a class="post__name--underline" href="#">${dataItem2.name}</a> and <a href="#">${getRandomNumber()} others</a>`;
    postLikes.appendChild(likesAvatarLink);
    postLikes.appendChild(likedBySpan);
    const postDescription = document.createElement('div');
    postDescription.className = 'post__description';
    const descriptionSpan = document.createElement('span');
    descriptionSpan.innerHTML = `<a class="post__name--underline" href="#">${dataItem.name}</a> ${dataItem.descricao}`;
    postDescription.appendChild(descriptionSpan);
    const postDateTime = document.createElement('span');
    postDateTime.className = 'post__date-time';
    postDateTime.textContent = dataNumber[Math.floor(Math.random() * dataNumber.length)];
    postInfos.appendChild(postLikes);
    postInfos.appendChild(postDescription);
    postInfos.appendChild(postDateTime);
    postFooter.appendChild(postInfos);
  });
}


async function createPost(data) {
  const articleElement = document.createElement("article");
  articleElement.classList.add("post");

  const headerElement = document.createElement("div");
  headerElement.classList.add("post__header");

  const profileElement = document.createElement("div");
  profileElement.classList.add("post__profile");

  headerElement.appendChild(profileElement);

  const contentElement = document.createElement("div");
  contentElement.classList.add("post__content");

  const footerElement = document.createElement("div");
  footerElement.classList.add("post__footer");

  articleElement.appendChild(headerElement);
  articleElement.appendChild(contentElement);
  const foot = createPostFooter();
  articleElement.appendChild(foot);
  articleElement.appendChild(footerElement);

  const avatarLinkElement = await createAvatarLink(data.foto);
  const userLinkElement = await createUserLink(data.name);

  profileElement.appendChild(avatarLinkElement);
  profileElement.appendChild(userLinkElement);

  const postMediasElement = await createPostMediasElement();
  const img = await createPostMediaElement(data.foto, data);
  postMediasElement.appendChild(img);
  contentElement.appendChild(postMediasElement);

  return articleElement;
}


async function displayPosts(data) {
  const postsContainer = document.querySelector('.posts');
  const postElements = []; // Array para armazenar os elementos dos posts

  for (let index = 0; index < data.length; index += 1) {
    const postElement = await createPost(data[index]);
    postsContainer.appendChild(postElement);
    postElements.push(postElement); // Adicione o elemento do post ao array
  }

  await createPostInfos(data, postElements); // Chame createPostInfos com o array de elementos de post
  lazyLoadImages();
}


const dataNumber = ['1 day ago', '3 days ago', '30 minutes ago', '30 minutes ago', '3 hours ago'];

async function fetchAnimaisAndSaveToLocalStorage() {
  try {
    const cachedData = localStorage.getItem('animaisData');
    const lastUpdated = localStorage.getItem('lastUpdated');
    const intervaloEmMilissegundos = 3600000; // 1 hora

    if (cachedData && lastUpdated) {
      const data = JSON.parse(cachedData);
      const now = Date.now();
      const timeDifference = now - parseInt(lastUpdated);

      if (timeDifference < intervaloEmMilissegundos) {
        // Se o intervalo de tempo não excedeu o limite, retornar os dados do Local Storage
        return data;
      }
    }

    // Caso contrário, buscar os dados da API e atualizar o Local Storage
    const data = await fetchAnimais();
    data.reverse();
    const existingIds = new Set();

    let cachedDataArray = JSON.parse(cachedData) || []; // Inicializar com um array vazio se não houver dados no Local Storage
    if (cachedDataArray) {
      cachedDataArray.forEach((item) => existingIds.add(item.id));
    }

    // Atualizar o Local Storage apenas com os IDs ausentes
    data.forEach((item) => {
      if (!existingIds.has(item.id)) {
        cachedDataArray.push(item);
      }
    });

    localStorage.setItem('animaisData', JSON.stringify(cachedDataArray));
    return data;
  } catch (error) {
    console.error('Erro ao obter dados da API:', error);
    return [];
  }
}


// ...

async function displayPostsFromLocalStorage() {
  try {
    const data = await fetchAnimaisAndSaveToLocalStorage();
    const postsContainer = document.querySelector('.posts');
    const postElements = [];

    for (let index = 0; index < data.length; index += 1) {
      const postElement = await createPost(data[index]);
      postsContainer.appendChild(postElement);
      postElements.push(postElement);
    }

    await createPostInfos(data, postElements);

    lazyLoadImages();
  } catch (error) {
    console.error('Erro ao exibir dados na tela:', error);
  }
}



async function init() {
  try {
    await fetchAnimaisAndSaveToLocalStorage();
    await displayPostsFromLocalStorage();
    createDynamicStories();
  } catch (error) {
    console.error('Erro na inicialização:', error);
  }
}

init();

async function updateLocalStoragePeriodically() {
  try {
    const updateLocalStorage = async () => {
      const data = await fetchAnimais();
      data.reverse();
    
      const cachedData = localStorage.getItem('animaisData');
      const cachedDataArray = JSON.parse(cachedData) || [];
    
      const existingIds = new Set();
      cachedDataArray.forEach((item) => existingIds.add(item.id));
    
      data.forEach((item) => {
        if (!existingIds.has(item.id)) {
          cachedDataArray.push(item);
        }
      });
    
      localStorage.setItem('animaisData', JSON.stringify(cachedDataArray));
      localStorage.setItem('lastUpdated', Date.now()); // Adiciona um timestamp único
    };

    const intervaloEmMilissegundos = 300000;

    await updateLocalStorage();

    setInterval(updateLocalStorage, intervaloEmMilissegundos);
  } catch (error) {
    console.error('Erro ao atualizar o Local Storage:', error);
  }
}

updateLocalStoragePeriodically();



function createStoryButton({ foto, name }) {
  const storyButton = document.createElement('button');
  storyButton.classList.add('story', 'story--has-story');

  const storyAvatar = document.createElement('div');
  storyAvatar.classList.add('story__avatar');

  const storyBorder = document.createElement('div');
  storyBorder.classList.add('story__border');

  const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgElement.setAttribute('width', '64');
  svgElement.setAttribute('height', '64');

  const circleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circleElement.setAttribute('r', '31');
  circleElement.setAttribute('cx', '32');
  circleElement.setAttribute('cy', '32');
  circleElement.style.fill = `url(#--story-gradient)`;

  const linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  linearGradient.setAttribute('id', '--story-gradient');
  linearGradient.setAttribute('x1', '0');
  linearGradient.setAttribute('y1', '1');
  linearGradient.setAttribute('x2', '1');
  linearGradient.setAttribute('y2', '0');

  const stopElements = [
    { offset: '0', color: '#f09433' },
    { offset: '0.25', color: '#e6683c' },
    { offset: '0.5', color: '#dc2743' },
    { offset: '0.75', color: '#cc2366' },
    { offset: '1', color: '#bc1888' }
  ];

  stopElements.forEach(stop => {
    const stopElement = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stopElement.setAttribute('offset', stop.offset);
    stopElement.setAttribute('stop-color', stop.color);
    linearGradient.appendChild(stopElement);
  });

  svgElement.appendChild(linearGradient);
  svgElement.appendChild(circleElement);
  storyBorder.appendChild(svgElement);

  const storyPicture = document.createElement('div');
  storyPicture.classList.add('story__picture');

  const imgElement = document.createElement('img');
  imgElement.src = foto;
  imgElement.alt = 'User Picture';
  imgElement.style.objectFit = 'cover';

  imgElement.onerror = function () {
    handlePostImageError(this);
  };

  storyPicture.appendChild(imgElement);

  const userNameElement = document.createElement('span');
  userNameElement.classList.add('story__user');
  userNameElement.textContent = name;

  storyAvatar.appendChild(storyBorder);
  storyAvatar.appendChild(storyPicture);
  storyButton.appendChild(storyAvatar);
  storyButton.appendChild(userNameElement);

  return storyButton;
}

async function createDynamicStories() {
  try {
    const data = await fetchAnimais();
    const storiesContent = document.getElementById('storiesContent');

    data.forEach((animal) => {
      const storyButton = createStoryButton(animal);
      storiesContent.appendChild(storyButton);
    });
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
  }
}

createDynamicStories();



