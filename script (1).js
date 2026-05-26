/* ─── LOGO UPLOAD ─── */
const logoInput = document.getElementById('logoInput');
const logoPlaceholder = document.getElementById('logoPlaceholder');
const logoRing = document.getElementById('logoRing');

logoInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  logoPlaceholder.style.display = 'none';
  let img = logoRing.querySelector('img.logo-img');
  if (!img) {
    img = document.createElement('img');
    img.className = 'logo-img';
    logoRing.insertBefore(img, logoRing.querySelector('.upload-hint'));
  }
  img.src = url;
});

/* ─── PHOTO DROP ZONE ─── */
const dropZone   = document.getElementById('dropZone');
const photoInput = document.getElementById('photoInput');
const changeBtn  = document.getElementById('changeBtn');
let currentPhoto = null;

dropZone.addEventListener('click', e => {
  if (e.target !== changeBtn) photoInput.click();
});
changeBtn.addEventListener('click', e => { e.stopPropagation(); photoInput.click(); });

photoInput.addEventListener('change', e => loadPhoto(e.target.files[0]));

dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', e => {
  e.preventDefault(); dropZone.classList.remove('drag-over');
  loadPhoto(e.dataTransfer.files[0]);
});

function loadPhoto(file) {
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    currentPhoto = e.target.result;

    let img = dropZone.querySelector('.preview-img');
    if (!img) {
      img = document.createElement('img');
      img.className = 'preview-img';
      dropZone.appendChild(img);
    }
    img.src = currentPhoto;
    img.style.display = 'block';

    dropZone.querySelector('.dz-icon').style.display = 'none';
    dropZone.querySelector('.dz-text').style.display = 'none';
    dropZone.querySelector('.dz-sub').style.display = 'none';
    changeBtn.style.opacity = '1';
  };
  reader.readAsDataURL(file);
}

/* ─── POST ─── */
const postBtn      = document.getElementById('postBtn');
const postsGrid    = document.getElementById('postsGrid');
const emptyState   = document.getElementById('emptyState');
const captionInput = document.getElementById('captionInput');
const nameInput    = document.getElementById('nameInput');

postBtn.addEventListener('click', () => {
  const caption = captionInput.value.trim();
  const name    = nameInput.value.trim();

  if (!caption && !currentPhoto) {
    pulse(postBtn, '#ff2244');
    return;
  }

  if (emptyState) emptyState.remove();

  const card = document.createElement('div');
  card.className = 'post-card';

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                + ' · ' + now.toLocaleDateString('en-GB', { day:'2-digit', month:'short' });

  card.innerHTML = `
    ${currentPhoto
      ? `<img src="${currentPhoto}" alt="post"/>`
      : `<div class="no-img">◈</div>`}
    <div class="card-body">
      ${name ? `<div class="card-name">${escapeHtml(name)}</div>` : ''}
      ${caption ? `<div class="card-caption">${escapeHtml(caption).replace(/\n/g,'<br>')}</div>` : ''}
    </div>
    <div class="card-footer">
      <span class="card-time">${timeStr}</span>
      <button class="delete-btn" title="Delete">✕</button>
    </div>
  `;
  card.querySelector('.delete-btn').addEventListener('click', () => {
    card.style.animation = 'none';
    card.style.transition = 'opacity .3s, transform .3s';
    card.style.opacity = '0';
    card.style.transform = 'scale(.9)';
    setTimeout(() => {
      card.remove();
      if (postsGrid.querySelectorAll('.post-card').length === 0) {
        postsGrid.innerHTML = '<div class="empty-state" id="emptyState">NO POSTS YET · BE THE FIRST TO DROP SOMETHING</div>';
      }
    }, 300);
  });

  postsGrid.prepend(card);

  // Reset
  captionInput.value = '';
  nameInput.value = '';
  currentPhoto = null;
  const pImg = dropZone.querySelector('.preview-img');
  if (pImg) pImg.remove();
  dropZone.querySelector('.dz-icon').style.display = '';
  dropZone.querySelector('.dz-text').style.display = '';
  dropZone.querySelector('.dz-sub').style.display = '';
  changeBtn.style.opacity = '';
  photoInput.value = '';

  pulse(postBtn, '#00ff88');
});

function pulse(el, color) {
  el.style.boxShadow = `0 0 30px ${color}`;
  setTimeout(() => el.style.boxShadow = '', 600);
}

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ─── BACKGROUND MUSIC ─── */
const bgMusic     = document.getElementById('bgMusic');
const bgMusicBtn  = document.getElementById('bgMusicBtn');
const bgMusicIcon = document.getElementById('bgMusicIcon');

bgMusic.volume = 0.3;
let bgStarted = false;

function startBgMusic() {
  if (bgStarted) return;
  bgMusic.play().then(() => {
    bgStarted = true;
    bgMusicBtn.classList.add('playing');
    bgMusicIcon.textContent = '♬';
  }).catch(() => {});
}

// Trigger on ANY user interaction — click, scroll, keydown, touchstart
['click','scroll','keydown','touchstart','mousemove'].forEach(evt => {
  document.addEventListener(evt, startBgMusic, { once: true, passive: true });
});

bgMusicBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (bgMusic.paused) {
    bgMusic.play();
    bgStarted = true;
    bgMusicBtn.classList.add('playing');
    bgMusicIcon.textContent = '♬';
  } else {
    bgMusic.pause();
    bgMusicBtn.classList.remove('playing');
    bgMusicIcon.textContent = '♬';
  }
});

/* ─── SONG PLAYER ─── */
const songPlayer = document.getElementById('songPlayer');
const songBtn    = document.getElementById('songBtn');
const songIcon   = document.getElementById('songIcon');
const songLabel  = document.getElementById('songLabel');

songPlayer.volume = 0.85;

songBtn.addEventListener('click', () => {
  if (songPlayer.paused) {
    songPlayer.play();
    songBtn.classList.add('playing');
    songIcon.textContent = '♫';
    songLabel.textContent = 'STOP';
  } else {
    songPlayer.pause();
    songPlayer.currentTime = 0;
    songBtn.classList.remove('playing');
    songIcon.textContent = '♪';
    songLabel.textContent = 'PLAY';
  }
});

songPlayer.addEventListener('ended', () => {
  songBtn.classList.remove('playing');
  songIcon.textContent = '♪';
  songLabel.textContent = 'PLAY';
});
