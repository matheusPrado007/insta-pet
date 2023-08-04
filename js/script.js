const toggleThemeBtn = document.querySelector('.header__theme-button');
const storiesContent = document.querySelector('.stories__content');
const storiesLeftButton = document.querySelector('.stories__left-button');
const storiesRightButton = document.querySelector('.stories__right-button');
const posts = document.querySelectorAll('.post');
const postsContent = document.querySelectorAll('.post__content');
const logo = document.querySelector('.logo')

document.onload = setInitialTheme(localStorage.getItem('theme'));
function setInitialTheme(themeKey) {
  if (themeKey === 'dark') {
    document.documentElement.classList.add('darkTheme');
  } else {
    document.documentElement.classList.remove('darkTheme');
  }
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

async function fetchAnimais() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Erro na solicitação: ' + response.status);
    }
    const data = await response.json();
    const imageUrls = data.filter(animal => animal.adotado.toUpperCase() === ADOPTED_ANIMAL_STATUS).map(animal => animal.foto);
    localStorage.setItem('fotos', JSON.stringify(imageUrls));
    console.log(data);
    return data;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}


async function fetchAndCacheAnimalData() {
  let cachedImageUrls = JSON.parse(localStorage.getItem('cachedImageUrls'));

  if (!cachedImageUrls) {
    cachedImageUrls = [];
  }

  try {
    const animalsData = await fetchAnimais();

    if (!Array.isArray(animalsData)) {
      console.error('Os dados buscados não são uma matriz válida.');
      animalsData = []; // Retorna um array vazio em caso de dados inválidos
    }

    return { animalsData, cachedImageUrls };
  } catch (error) {
    console.error('Erro ao buscar dados dos animais:', error);
    return { animalsData: [], cachedImageUrls };
  }
}



// Função para criar os botões dinamicamente
function createButton(iconPath, fillColor, strokeColor, strokeWidth) {
  const button = document.createElement('button');
  button.className = 'post__button';
  if (iconPath === "M19.875 2H4.125C3.50625 2 3 2.44939 3 3.00481V22.4648C3 23.0202 3.36563 23.1616 3.82125 22.7728L11.5444 16.1986C11.7244 16.0471 12.0225 16.0471 12.2025 16.1936L20.1731 22.7879C20.6287 23.1666 21 23.0202 21 22.4648V3.00481C21 2.44939 20.4994 2 19.875 2ZM19.3125 20.0209L13.3444 15.0827C12.9281 14.7394 12.405 14.5677 11.8763 14.5677C11.3363 14.5677 10.8019 14.7444 10.3856 15.0979L4.6875 19.9502V3.51479H19.3125V20.0209Z") {
    button.classList.add('post__button--align-right');
  }

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', fillColor);
  svg.setAttribute('stroke', strokeColor);
  svg.setAttribute('stroke-width', strokeWidth);

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', iconPath);

  svg.appendChild(path);
  button.appendChild(svg);

  return button;
}

const buttonData = [
  {
    iconPath: "M11.4995 21.2609C11.1062 21.2609 10.7307 21.1362 10.4133 20.9001C8.2588 19.3012 3.10938 15.3239 1.81755 12.9143C0.127895 9.76543 1.14258 5.72131 4.07489 3.89968C5.02253 3.31177 6.09533 3 7.18601 3C8.81755 3 10.3508 3.66808 11.4995 4.85726C12.6483 3.66808 14.1815 3 15.8131 3C16.9038 3 17.9766 3.31177 18.9242 3.89968C21.8565 5.72131 22.8712 9.76543 21.186 12.9143C19.8942 15.3239 14.7448 19.3012 12.5902 20.9001C12.2684 21.1362 11.8929 21.2609 11.4995 21.2609ZM7.18601 4.33616C6.34565 4.33616 5.5187 4.57667 4.78562 5.03096C2.43888 6.49183 1.63428 9.74316 2.99763 12.2819C4.19558 14.5177 9.58639 18.6242 11.209 19.8267C11.3789 19.9514 11.6158 19.9514 11.7856 19.8267C13.4082 18.6197 18.799 14.5133 19.997 12.2819C21.3603 9.74316 20.5557 6.48738 18.209 5.03096C17.4804 4.57667 16.6534 4.33616 15.8131 4.33616C14.3425 4.33616 12.9657 5.04878 12.0359 6.28696L11.4995 7.00848L10.9631 6.28696C10.0334 5.04878 8.6611 4.33616 7.18601 4.33616Z",
    fillColor: 'var(--text-dark)',
    strokeColor: 'var(--text-dark)',
    strokeWidth: '0.6',
  },
  {
    iconPath: "M21.2959 20.8165L20.2351 16.8602C20.1743 16.6385 20.2047 16.3994 20.309 16.1907C21.2351 14.3342 21.5438 12.117 20.9742 9.80402C20.2003 6.67374 17.757 4.16081 14.6354 3.33042C13.7833 3.10869 12.9442 3 12.1312 3C6.29665 3 1.74035 8.47365 3.31418 14.5647C4.04458 17.3819 7.05314 20.2992 9.88344 20.9861C10.6486 21.173 11.4008 21.26 12.1312 21.26C13.7006 21.26 15.1701 20.8557 16.4614 20.1601C16.6049 20.0818 16.7657 20.0383 16.9222 20.0383C17.0005 20.0383 17.0787 20.047 17.157 20.0688L21.009 21.0991C21.0307 21.1035 21.0525 21.1078 21.0699 21.1078C21.2177 21.1078 21.3351 20.9687 21.2959 20.8165ZM19.0178 17.1863L19.6178 19.4253L17.4831 18.8558C17.3005 18.8079 17.1135 18.7819 16.9222 18.7819C16.557 18.7819 16.1875 18.8775 15.8571 19.0558C14.6963 19.6818 13.4441 19.9992 12.1312 19.9992C11.4834 19.9992 10.8269 19.9166 10.1791 19.7601C7.78354 19.1775 5.14453 16.6037 4.53586 14.2473C3.90111 11.7865 4.40109 9.26057 5.90536 7.31719C7.40964 5.3738 9.6791 4.26081 12.1312 4.26081C12.8529 4.26081 13.5876 4.35646 14.3137 4.5521C16.9961 5.26511 19.0786 7.39544 19.7525 10.1084C20.2264 12.0213 20.0308 13.9299 19.183 15.6298C18.9395 16.1168 18.8787 16.6689 19.0178 17.1863Z",
    fillColor: 'var(--text-dark)',
    strokeColor: 'var(--text-dark)',
    strokeWidth: '0.7',
  },
  {
    iconPath: "M22.8555 3.44542C22.6978 3.16703 22.3962 3 22.0714 3L2.91369 3.01392C2.52859 3.01392 2.19453 3.25055 2.05997 3.60781C1.96254 3.86764 1.98574 4.14603 2.11565 4.37338C2.16669 4.45689 2.23165 4.53577 2.31052 4.60537L9.69243 10.9712L11.4927 20.5338C11.5623 20.9096 11.8499 21.188 12.2304 21.2483C12.6062 21.3086 12.9774 21.1323 13.1723 20.8029L22.8509 4.35018C23.0179 4.06715 23.0179 3.72381 22.8555 3.44542ZM4.21748 4.39194H19.8164L10.4255 9.75089L4.21748 4.39194ZM12.6248 18.9841L11.1122 10.948L20.5171 5.58436L12.6248 18.9841Z",
    fillColor: 'var(--text-dark)',
    strokeColor: 'var(--text-dark)',
    strokeWidth: '0.3',
  },
  {
    iconPath: "M19.875 2H4.125C3.50625 2 3 2.44939 3 3.00481V22.4648C3 23.0202 3.36563 23.1616 3.82125 22.7728L11.5444 16.1986C11.7244 16.0471 12.0225 16.0471 12.2025 16.1936L20.1731 22.7879C20.6287 23.1666 21 23.0202 21 22.4648V3.00481C21 2.44939 20.4994 2 19.875 2ZM19.3125 20.0209L13.3444 15.0827C12.9281 14.7394 12.405 14.5677 11.8763 14.5677C11.3363 14.5677 10.8019 14.7444 10.3856 15.0979L4.6875 19.9502V3.51479H19.3125V20.0209Z",
    fillColor: 'var(--text-dark)',
    strokeColor: 'var(--text-dark)',
    strokeWidth: '0.7',
  },
];

function createPostFooter() {
  const postFooter = document.createElement('div');
  postFooter.classList.add('post__buttons');
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
  const postMedia = document.createElement('img');
  postMedia.classList.add('post__media');
  postMedia.src = mediaUrl;
  postMedia.alt = 'Conteúdo da Postagem';

  postMedia.addEventListener('click', () => {
    redirectToAnimalProfile(animalData);
  });
  return postMedia;
}

function redirectToAnimalProfile(animalData) {
  const profileUrl = `/pages/profile/profile.html#${animalData._id}`;
  window.location.href = profileUrl;
}

function getRandomNumber() {
  return Math.floor(Math.random() * 81) + 20;
}


async function createPostInfos(data, postElements, fotos) {
  postElements.forEach((postElement, index) => {
    const dataIndex = index;
    if (dataIndex >= data.length) {
      return;
    }
    
    function getRandom(data) {
      return Math.floor(Math.random() * data.length);
    }
    const postFooter = postElement.querySelector('.post__footer'); 
    const dataItem = data[index]; 
    const number = getRandom(data)
    const dataItem2 = data[number]

    const postInfos = document.createElement('div');
    postInfos.className = 'post__infos';
    const postLikes = document.createElement('div');
    postLikes.className = 'post__likes';
    const likesAvatarLink = document.createElement('a');
    likesAvatarLink.href = '#';
    likesAvatarLink.className = 'post__likes-avatar';
    const likesAvatarImg = document.createElement('img');
    likesAvatarImg.src = fotos[number]; 
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

async function createPost(data, foto) {
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

  const avatarLinkElement = await createAvatarLink(foto);
  const userLinkElement = await createUserLink(data.name);

  profileElement.appendChild(avatarLinkElement);
  profileElement.appendChild(userLinkElement);

  const postMediasElement = await createPostMediasElement();
  const img = await createPostMediaElement(foto, data);
  postMediasElement.appendChild(img);
  contentElement.appendChild(postMediasElement);

  return articleElement;
}

async function displayPosts(data, cachedImageUrls) {
  const postsContainer = document.querySelector('.posts');
  const postElements = [];

  for (let index = 0; index < data.length; index += 1) {
    const postElement = await createPost(data[index], cachedImageUrls[index]);
    postsContainer.appendChild(postElement);
    postElements.push(postElement);
  }

  await createPostInfos(data, postElements, cachedImageUrls); 
}


const dataNumber = ['1 day ago', '3 days ago', '30 minutes ago', '30 minutes ago', '3 hours ago'];


async function fetchAnimaisAndDisplayPosts() {
  let { animalsData, cachedImageUrls } = await fetchAndCacheAnimalData();
  
  animalsData = animalsData.reverse();
  cachedImageUrls = cachedImageUrls.reverse();
  
  await displayPosts(animalsData, cachedImageUrls);
}

async function init() {
  await fetchAnimaisAndDisplayPosts();
}

init();



function createStoryButton(animal, foto) {
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
  imgElement.src = foto; // Pega a URL da imagem do animal na API
  imgElement.alt = 'User Picture';
  imgElement.style.objectFit = 'cover';
  imgElement.onerror = function () {
    // Caso ocorra um erro ao carregar a imagem, definimos uma imagem de fallback
    imgElement.src = 'fallback-image.jpg';
    imgElement.alt = 'Fallback Picture';
  };

  storyPicture.appendChild(imgElement);

  const userNameElement = document.createElement('span');
  userNameElement.classList.add('story__user');
  userNameElement.textContent = animal.name; // Assume que o nome do animal está disponível na API

  storyAvatar.appendChild(storyBorder);
  storyAvatar.appendChild(storyPicture);
  storyButton.appendChild(storyAvatar);
  storyButton.appendChild(userNameElement);

  return storyButton;
}

async function createDynamicStories() {
  const { animalsData, cachedImageUrls } = await fetchAndCacheAnimalData();

  try {
    const storiesContent = document.getElementById('storiesContent');

    // Verificar se animalsData é uma matriz antes de usar o forEach
    if (Array.isArray(animalsData)) {
      animalsData.forEach((animal, index) => {
        const storyButton = createStoryButton(animal, cachedImageUrls[index]);
        storiesContent.appendChild(storyButton);
      });
    } else {
      console.error('Erro: Os dados buscados não são uma matriz válida.');
      console.error(animalsData); // Exibir os dados para debug
    }
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
  }
}




createDynamicStories();



