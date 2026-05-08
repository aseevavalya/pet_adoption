// Элементы главной скролл-сцены.
const storySpacer = document.getElementById("storySpacer");
const imageTrack = document.getElementById("imageTrack");
const storyImage = document.getElementById("storyImage");
const textBox = document.getElementById("textBox");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const storyBadge = document.getElementById("storyBadge");
const storyButtons = document.getElementById("storyButtons");

// Шаги истории, которые меняются при скролле.
const steps = [
  {
    from: 0.0,
    to: 0.15,
    badge: "В городе N",
    title: "Обычный день",
    subtitle: "Вы спешите домой с работы? Или идёте в магазин за хлебом?",
    showButtons: false
  },
  {
    from: 0.15,
    to: 0.5,
    badge: "Посмотри вниз",
    title: "У вас, как и у всех, свои заботы и цели",
    subtitle: "А если немного приглядеться?",
    showButtons: false
  },
  {
    from: 0.65,
    to: 0.85,
    badge: "Вы заметили",
    title: "Вы заметили",
    subtitle: "Это уже больше, чем делает большинство.",
    showButtons: false
  },
  {
    from: 0.85,
    to: 1.01,
    badge: "История замечена",
    title: "Теперь у вас есть выбор",
    subtitle: "Можно пройти мимо. А можно спасти жизнь.",
    showButtons: true
  }
];

let currentStepIndex = -1;
let ticking = false;
let textAnimating = false;
let renderedHeight = 0;
let maxShiftY = 0;
let storyHeight = 0;
let pendingStepIndex = null;

function setupImageCover() {
  if (!storyImage || !imageTrack || !storySpacer) return;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const naturalWidth = storyImage.naturalWidth;
  const naturalHeight = storyImage.naturalHeight;

  if (!naturalWidth || !naturalHeight) return;

  const scale = Math.max(viewportWidth / naturalWidth, viewportHeight / naturalHeight);
  const renderedWidth = naturalWidth * scale;
  renderedHeight = naturalHeight * scale;

  imageTrack.style.width = `${renderedWidth}px`;
  imageTrack.style.height = `${renderedHeight}px`;

  maxShiftY = Math.max(0, renderedHeight - viewportHeight);
  storyHeight = Math.max(storySpacer.offsetHeight - viewportHeight, 1);
}

function getStepIndex(progress) {
  return steps.findIndex((step) => progress >= step.from && progress < step.to);
}

function changeText(stepIndex) {
  if (stepIndex === -1 || !textBox || !storyBadge || !title || !subtitle || !storyButtons) return;
  if (stepIndex === currentStepIndex) return;

  if (textAnimating) {
    pendingStepIndex = stepIndex;
    return;
  }

  textAnimating = true;
  pendingStepIndex = null;
  textBox.classList.add("fade-out");

  window.setTimeout(() => {
    currentStepIndex = stepIndex;
    const step = steps[stepIndex];

    storyBadge.textContent = step.badge;
    title.textContent = step.title;
    subtitle.textContent = step.subtitle;
    storyButtons.classList.toggle("show", step.showButtons);

    textBox.classList.remove("fade-out");

    window.setTimeout(() => {
      textAnimating = false;

      if (pendingStepIndex !== null && pendingStepIndex !== currentStepIndex) {
        const nextStepIndex = pendingStepIndex;
        pendingStepIndex = null;
        changeText(nextStepIndex);
      }
    }, 450);
  }, 220);
}

function updateStoryScene() {
  if (!storySpacer || !imageTrack) {
    ticking = false;
    return;
  }

  const scrollY = window.scrollY;
  const spacerTop = storySpacer.offsetTop;
  const localScroll = Math.min(Math.max(scrollY - spacerTop, 0), storyHeight);
  const progress = storyHeight > 0 ? localScroll / storyHeight : 0;
  const shiftY = maxShiftY * progress;

  imageTrack.style.transform = `translateX(-50%) translateY(-${shiftY}px)`;
  changeText(getStepIndex(progress));
  ticking = false;
}

function requestStoryUpdate() {
  if (!ticking) {
    window.requestAnimationFrame(updateStoryScene);
    ticking = true;
  }
}

function initStoryScene() {
  if (!storyImage || !storySpacer) return;
  setupImageCover();
  updateStoryScene();
}

if (storyImage?.complete) {
  initStoryScene();
} else if (storyImage) {
  storyImage.addEventListener("load", initStoryScene);
}

window.addEventListener("load", initStoryScene);
window.addEventListener("resize", initStoryScene);
window.addEventListener("scroll", requestStoryUpdate, { passive: true });
