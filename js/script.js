const toggleThemeBtn = document.querySelector('.header__theme-button');
const storiesContent = document.querySelector('.stories__content');
const storiesLeftButton = document.querySelector('.stories__left-button');
const storiesRightButton = document.querySelector('.stories__right-button');
const posts = document.querySelectorAll('.post');
const postsContent = document.querySelectorAll('.post__content');
const logo = document.querySelector('.logo')

const API_URL = 'https://adote-amor.onrender.com/upload';
const fallbackImageUrl = '/images/cat-totoro.gif';
const ADOPTED_ANIMAL_STATUS = 'S';
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
    iconPath: "/images/money.png",
    fillColor: 'var(--text-dark)',
    strokeColor: 'var(--text-dark)',
    strokeWidth: '3rem',
  },
];

function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

async function lazyLoadImages() {
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

function loadAsyncImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}



async function fetchAnimais() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Erro na solicitação: ' + response.status);
    }
    const data = await response.json();

    console.log(data);
    return data;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

//Parte do codigo para criação do post

async function createPostHeader(data) {
  const headerElement = createElement("div", "post__header");
  const profileElement = createElement("div", "post__profile");
  headerElement.appendChild(profileElement);

  const avatarLinkElement = await createAvatarLink(data.foto);
  const userLinkElement = await createUserLink(data.name);

  profileElement.appendChild(avatarLinkElement);
  profileElement.appendChild(userLinkElement);

  return headerElement;
}

async function createPostContent(data) {
  const contentElement = createElement("div", "post__content");
  const postMediasElement = await createPostMediasElement();
  const img = await createPostMediaElement(data.foto, data);
  postMediasElement.appendChild(img);
  contentElement.appendChild(postMediasElement);

  return contentElement;
}

async function createPost(data) {
  const articleElement = createElement("article", "post");
  
  const headerElement = await createPostHeader(data);
  const contentElement = await createPostContent(data);
  
  const footerElement = createElement("div", "post__footer");
  const postFooter = createPostFooter();
  footerElement.appendChild(postFooter);
  
  articleElement.appendChild(headerElement);
  articleElement.appendChild(contentElement);
  articleElement.appendChild(footerElement);
  
  return articleElement;
}

async function init() {
  try {
    const apiData = await fetchAnimais();
    apiData.reverse()

    const postsContainer = document.querySelector('.posts');
    const postElements = []; 

    for (const item of apiData) {
      const img = await loadAsyncImage(item.foto);
      item.imgElement = img;
      const postElement = await createPost(item);
      postsContainer.appendChild(postElement);
      postElements.push(postElement);
    }

    await createPostInfos(apiData, postElements);
    lazyLoadImages();
    createDynamicStories();
  } catch (error) {
    console.error('Erro na inicialização:', error);
  }
}
///////////////



// Função para definir o tema inicial
function setTheme(themeKey) {
  document.documentElement.classList.toggle('darkTheme', themeKey === 'dark');
  logo.src = themeKey === 'dark' ? '/images/cat-1.png' : '/images/icons8-cachorro-48.png';
  if (logo) {
    if (themeKey === 'dark') {
      logo.classList.add('logo');
    } else {
      logo.classList.remove('logo');
    }
  }
}

function updateLocalStorageAndTheme(themeKey) {
  localStorage.setItem('theme', themeKey);
  setTheme(themeKey);
}

function handleThemeToggle() {
  const isDarkTheme = document.documentElement.classList.contains('darkTheme');
  const themeKey = isDarkTheme ? 'light' : 'dark';
  updateLocalStorageAndTheme(themeKey);
}

function setInitialTheme() {
  const savedTheme = localStorage.getItem('theme');
  setTheme(savedTheme);
}


function initial() {
  setInitialTheme();

  toggleThemeBtn.addEventListener('click', handleThemeToggle);

  if (storiesContent) {
    storiesLeftButton.addEventListener('click', () => {
      storiesContent.scrollLeft -= 320;
    });

    storiesRightButton.addEventListener('click', () => {
      storiesContent.scrollLeft += 320;
    });

    if (window.matchMedia('(min-width: 1024px)').matches) {
      const storiesObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach((entry) => {
            storiesLeftButton.style.display = entry.target.classList.contains('story:first-child') ? (entry.isIntersecting ? 'none' : 'unset') : storiesLeftButton.style.display;
            storiesRightButton.style.display = entry.target.classList.contains('story:last-child') ? (entry.isIntersecting ? 'none' : 'unset') : storiesRightButton.style.display;
          });
        },
        { root: storiesContent, threshold: 1 }
      );

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
}

// JavaScript

// Função para criar os botões dinamicamente
function createButton(iconPath, fillColor, strokeColor, strokeWidth) {
  const button = document.createElement('button');
  button.className = 'post__button';

  if (iconPath === "/images/money.png") {
    button.classList.add('post__button--align-right');
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
  return new Promise((resolve, reject) => {
    const divContainer = document.createElement('div');
    divContainer.classList.add('header_back', 'image-container');

    const imgElement = document.createElement('img');
    imgElement.classList.add('image-container');
    imgElement.src = fallbackImageUrl;
    divContainer.appendChild(imgElement);

    const postMedia = new Image();
    postMedia.classList.add('post__media', 'image');
    postMedia.alt = 'Imagem da Postagem';
    postMedia.src = mediaUrl;

    postMedia.addEventListener('load', () => {
      divContainer.removeChild(imgElement);
      divContainer.appendChild(postMedia);
      resolve(divContainer);
    });

    postMedia.addEventListener('error', () => {
      const fallbackImg = new Image();
      fallbackImg.src = fallbackImageUrl;
      fallbackImg.alt = 'Imagem de fallback';
      resolve(fallbackImg);
    });

    const textElement = document.createElement('p');
    textElement.classList.add('image-text');

    let isAdoptText = false;
    updateText();

    const redirectToProfile = () => {
      redirectToAnimalProfile(animalData);
    };

    const handleMediaClick = () => {
      redirectToProfile();
    };

    const handleTextClick = () => {
      redirectToProfile();
      isAdoptText = !isAdoptText;
      updateText();
    };

    textElement.addEventListener('click', handleTextClick);
    postMedia.addEventListener('click', handleMediaClick);

    divContainer.appendChild(textElement);

    setInterval(() => {
      isAdoptText = !isAdoptText;
      updateText();
    }, 5000);

    function updateText() {
      textElement.textContent = isAdoptText ? 'Clique Aqui!' : 'Me Adote!';
    }
  });
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


const dataNumber = ['1 day ago', '3 days ago', '30 minutes ago', '30 minutes ago', '3 hours ago'];

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

async function createButtons() {
  buttonData.forEach((buttonInfo) => {
    const { iconPath, fillColor, strokeColor, strokeWidth } = buttonInfo;
    createButton(iconPath, fillColor, strokeColor, strokeWidth);
  });
}


document.addEventListener('DOMContentLoaded', function () {
  createButtons()
  createDynamicStories();
  initial();
  init();
});