(function () {
  "use strict";

  // =============================================
  // THEME SWITCHER LOGIC
  // =============================================
  const themeDropdownToggle = document.getElementById('themeDropdownToggle');
  const themeDropdownMenu = document.getElementById('themeDropdownMenu');
  const themeOptions = document.querySelectorAll('.theme-option');
  const currentThemeLabel = document.getElementById('currentThemeLabel');
  const customThemePanel = document.getElementById('customThemePanel');
  const applyCustomBtn = document.getElementById('applyCustomTheme');
  const customBg = document.getElementById('customBgColor');
  const customText = document.getElementById('customTextColor');
  const customAccent = document.getElementById('customAccentColor');
  const musicOverlay = document.getElementById('musicOverlay');

  const root = document.documentElement;
  const THEME_STORAGE_KEY = 'realFaceTheme';

  // Default colors untuk setiap tema
  const defaultColors = {
    light: {
      bg: '#edf5f2',
      text: '#2e3d37',
      heading: '#2f584d',
      accent: '#8fe7c5',
      accentRgb: '143, 231, 197',
      surface: '#ffffff',
      contrast: '#0d1b17',
      goldAccent: '#f7c6d3',
      goldRgb: '247, 198, 211',
      navColor: '#3d4d43',
      navHoverColor: '#f7a6c4',
      navMobileBg: '#f4fbf8',
      navDropdownBg: '#ffffff',
      navDropdownColor: '#3d4d43',
      navDropdownHoverColor: '#f7a6c4',
      headerBorder: 'rgba(143, 231, 197, 0.22)',
      headerBorderScrolled: 'rgba(143, 231, 197, 0.35)',
      headerBg: 'rgba(244, 251, 248, 0.82)',
      headerBgScrolled: 'rgba(244, 251, 248, 0.96)'
    },
    dark: {
      bg: '#081018',
      text: '#eff3f5',
      heading: '#fff4e6',
      accent: '#8fe7c5',
      accentRgb: '143, 231, 197',
      surface: '#121a24',
      contrast: '#07111b',
      goldAccent: '#f7c6d3',
      goldRgb: '247, 198, 211',
      navColor: '#d4cfc5',
      navHoverColor: '#f7c6d3',
      navMobileBg: '#0f131c',
      navDropdownBg: '#121a24',
      navDropdownColor: '#d4cfc5',
      navDropdownHoverColor: '#f7c6d3',
      headerBorder: 'rgba(143, 231, 197, 0.18)',
      headerBorderScrolled: 'rgba(143, 231, 197, 0.35)',
      headerBg: 'rgba(8, 16, 24, 0.78)',
      headerBgScrolled: 'rgba(8, 16, 24, 0.96)'
    }
  };

  // Fungsi untuk mengatur SEMUA CSS variables termasuk navbar
  function setColors(colors) {
    // Global colors
    root.style.setProperty('--background-color', colors.bg);
    root.style.setProperty('--default-color', colors.text);
    root.style.setProperty('--heading-color', colors.heading);
    root.style.setProperty('--accent-color', colors.accent);
    root.style.setProperty('--accent-rgb', colors.accentRgb || hexToRgb(colors.accent));
    root.style.setProperty('--surface-color', colors.surface);
    root.style.setProperty('--contrast-color', colors.contrast);
    root.style.setProperty('--gold-accent', colors.goldAccent || '#f7c6d3');
    root.style.setProperty('--gold-rgb', colors.goldRgb || hexToRgb(colors.goldAccent || '#f7c6d3'));
    root.style.setProperty('--muted-accent', colors.mutedAccent || '#6ea889');

    // Navbar colors
    root.style.setProperty('--nav-color', colors.navColor);
    root.style.setProperty('--nav-hover-color', colors.navHoverColor);
    root.style.setProperty('--nav-mobile-background-color', colors.navMobileBg);
    root.style.setProperty('--nav-dropdown-background-color', colors.navDropdownBg);
    root.style.setProperty('--nav-dropdown-color', colors.navDropdownColor);
    root.style.setProperty('--nav-dropdown-hover-color', colors.navDropdownHoverColor);

    // Header colors
    root.style.setProperty('--header-bg', colors.headerBg);
    root.style.setProperty('--header-bg-scrolled', colors.headerBgScrolled);
    root.style.setProperty('--header-border', colors.headerBorder);
    root.style.setProperty('--header-border-scrolled', colors.headerBorderScrolled);

    // Update header langsung
    updateHeaderColors(colors);
  }

  // Fungsi khusus update header
  function updateHeaderColors(colors) {
    const header = document.querySelector('#header');
    if (header) {
      header.style.setProperty('--background-color', colors.headerBg);
      header.style.backgroundColor = colors.headerBg;
      header.style.borderBottomColor = colors.headerBorder;
    }

    // Update scrolled header
    const scrolledHeader = document.querySelector('.scrolled #header');
    if (scrolledHeader) {
      scrolledHeader.style.setProperty('--background-color', colors.headerBgScrolled);
      scrolledHeader.style.backgroundColor = colors.headerBgScrolled;
    }
  }

  // Deteksi tema sistem (light/dark)
  function getSystemColors() {
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return defaultColors.light;
    } else {
      return defaultColors.dark;
    }
  }

  function hexToRgb(hex) {
    let value = String(hex).trim().replace('#', '');
    if (value.length === 3) {
      value = value.split('').map((ch) => ch + ch).join('');
    }
    const number = parseInt(value, 16);
    const r = (number >> 16) & 255;
    const g = (number >> 8) & 255;
    const b = number & 255;
    return `${r}, ${g}, ${b}`;
  }

  function hexToRgba(hex, alpha) {
    return `rgba(${hexToRgb(hex)}, ${alpha})`;
  }

  // Fungsi utama untuk apply tema
  function applyTheme(themeName, showCustomPanel = true) {
    let colors;

    if (themeName === 'custom') {
      const savedCustom = JSON.parse(localStorage.getItem('realFaceCustomTheme'));
      if (savedCustom) {
        colors = {
          ...defaultColors.dark,
          bg: savedCustom.bg,
          text: savedCustom.text,
          heading: savedCustom.text,
          accent: savedCustom.accent,
          accentRgb: hexToRgb(savedCustom.accent),
          surface: savedCustom.bg,
          contrast: '#ffffff',
          goldAccent: '#f7c6d3',
          goldRgb: '247, 198, 211',
          navColor: savedCustom.text,
          navHoverColor: savedCustom.accent,
          navMobileBg: savedCustom.bg,
          navDropdownBg: savedCustom.bg,
          navDropdownColor: savedCustom.text,
          navDropdownHoverColor: savedCustom.accent,
          headerBg: hexToRgba(savedCustom.bg, 0.75),
          headerBgScrolled: hexToRgba(savedCustom.bg, 0.95),
          headerBorder: hexToRgba(savedCustom.accent, 0.2),
          headerBorderScrolled: hexToRgba(savedCustom.accent, 0.4)
        };
      } else {
        colors = defaultColors.dark;
      }
    } else if (themeName === 'system') {
      colors = getSystemColors();
    } else {
      colors = defaultColors[themeName] || defaultColors.dark;
    }

    // Terapkan warna
    setColors(colors);

    // Simpan tema aktif ke localStorage
    localStorage.setItem(THEME_STORAGE_KEY, themeName);

    // Update label dan tombol aktif
    updateActiveButton(themeName);

    // Update teks label
    const themeLabels = {
      'light': 'Light',
      'dark': 'Dark',
      'system': 'System',
      'custom': 'Custom'
    };
    if (currentThemeLabel) {
      currentThemeLabel.textContent = themeLabels[themeName] || 'Tema';
    }

    // Tampilkan/sembunyikan panel custom
    if (themeName === 'custom') {
      if (customThemePanel) {
        customThemePanel.style.display = showCustomPanel ? 'flex' : 'none';
      }
      if (colors && customBg && customText && customAccent) {
        customBg.value = colors.bg;
        customText.value = colors.text;
        customAccent.value = colors.accent;
      }
    } else {
      if (customThemePanel) {
        customThemePanel.style.display = 'none';
      }
    }

    console.log('🎨 Tema diubah ke:', themeName, colors);
  }

  // Update tombol yang aktif (centang)
  function updateActiveButton(activeTheme) {
    themeOptions.forEach(btn => {
      const theme = btn.getAttribute('data-theme');
      if (theme === activeTheme) {
        btn.classList.add('active-theme');
      } else {
        btn.classList.remove('active-theme');
      }
    });
  }

  // === EVENT LISTENERS UNTUK THEME SWITCHER ===

  // Toggle dropdown saat tombol diklik
  if (themeDropdownToggle) {
    themeDropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (customThemePanel) {
        customThemePanel.style.display = 'none';
      }
      if (themeDropdownMenu) {
        const opened = themeDropdownMenu.classList.toggle('active');
        // If opening theme menu, hide music overlay
        if (opened && musicOverlay) {
          musicOverlay.style.display = 'none';
        }
      }
    });
  }

  // Tutup dropdown saat klik di luar
  document.addEventListener('click', (e) => {
    const clickedInsideTheme = e.target.closest('.theme-switcher-wrapper');
    const clickedInsideMusic = e.target.closest('.music-player, .music-overlay');

    if (!clickedInsideTheme && !clickedInsideMusic) {
      if (themeDropdownMenu) {
        themeDropdownMenu.classList.remove('active');
      }
    }
  });

  // Pilih tema dari dropdown
  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      const theme = option.getAttribute('data-theme');
      if (theme) {
        applyTheme(theme, theme === 'custom');
        // Tutup dropdown setelah memilih
        if (themeDropdownMenu) {
          themeDropdownMenu.classList.remove('active');
        }
        // Hide music overlay when switching theme
        if (musicOverlay) {
          musicOverlay.style.display = 'none';
        }
      }
    });
  });

  // Apply custom theme
  if (applyCustomBtn) {
    applyCustomBtn.addEventListener('click', () => {
      if (customBg && customText && customAccent) {
        const customTheme = {
          bg: customBg.value,
          text: customText.value,
          accent: customAccent.value
        };
        // Simpan custom theme
        localStorage.setItem('realFaceCustomTheme', JSON.stringify(customTheme));
        // Terapkan tanpa menampilkan panel lagi
        applyTheme('custom', false);
        // Hide music overlay when applying custom theme
        if (musicOverlay) {
          musicOverlay.style.display = 'none';
        }
      }
    });
  }

  // Deteksi perubahan system theme (saat user ganti mode di OS)
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
    const currentTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (currentTheme === 'system') {
      applyTheme('system');
    }
  });

  // Update header saat scroll
  document.addEventListener('scroll', () => {
    const currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
    const colors = currentTheme === 'custom'
      ? JSON.parse(localStorage.getItem('realFaceCustomTheme'))
      : defaultColors[currentTheme] || defaultColors.dark;

    const header = document.querySelector('#header');
    if (header) {
      if (window.scrollY > 100) {
        header.style.backgroundColor = colors.headerBgScrolled || defaultColors.dark.headerBgScrolled;
        header.style.borderBottomColor = colors.headerBorderScrolled || defaultColors.dark.headerBorderScrolled;
      } else {
        header.style.backgroundColor = colors.headerBg || defaultColors.dark.headerBg;
        header.style.borderBottomColor = colors.headerBorder || defaultColors.dark.headerBorder;
      }
    }
  });

  // Inisialisasi tema saat halaman pertama kali load
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
  applyTheme(savedTheme, false);

  console.log('🎨 Theme Switcher siap! Tema aktif:', savedTheme);

  // =============================================
  // SCROLL HEADER EFFECT
  // =============================================
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader) return;
    if (!selectHeader.classList.contains('scroll-up-sticky') &&
      !selectHeader.classList.contains('sticky-top') &&
      !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  // =============================================
  // MOBILE NAVIGATION TOGGLE
  // =============================================
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    const body = document.querySelector('body');
    body.classList.toggle('mobile-nav-active');

    if (mobileNavToggleBtn) {
      if (body.classList.contains('mobile-nav-active')) {
        mobileNavToggleBtn.classList.remove('bi-list');
        mobileNavToggleBtn.classList.add('bi-x');
      } else {
        mobileNavToggleBtn.classList.remove('bi-x');
        mobileNavToggleBtn.classList.add('bi-list');
      }
    }
  }

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  // Tutup menu mobile saat link diklik
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      const body = document.querySelector('body');
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active');
        if (mobileNavToggleBtn) {
          mobileNavToggleBtn.classList.remove('bi-x');
          mobileNavToggleBtn.classList.add('bi-list');
        }
      }
    });
  });

  // =============================================
  // PRELOADER
  // =============================================
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  // =============================================
  // SCROLL TO TOP BUTTON
  // =============================================
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }

  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  // =============================================
  // AOS (ANIMATION ON SCROLL) INIT
  // =============================================
  function aosInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }
  window.addEventListener('load', aosInit);

  // =============================================
  // TYPED.JS INIT
  // =============================================
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    if (typed_strings) {
      typed_strings = typed_strings.split(',');
      if (typeof Typed !== 'undefined') {
        new Typed('.typed', {
          strings: typed_strings,
          loop: true,
          typeSpeed: 100,
          backSpeed: 50,
          backDelay: 2000
        });
      }
    }
  }

  // =============================================
  // PURE COUNTER INIT
  // =============================================
  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }

  // =============================================
  // SKILLS ANIMATION
  // =============================================
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  if (typeof Waypoint !== 'undefined') {
    skillsAnimation.forEach((item) => {
      new Waypoint({
        element: item,
        offset: '80%',
        handler: function (direction) {
          let progress = item.querySelectorAll('.progress .progress-bar');
          progress.forEach(el => {
            el.style.width = el.getAttribute('aria-valuenow') + '%';
          });
        }
      });
    });
  }

  // =============================================
  // SWIPER SLIDERS INIT
  // =============================================
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let configElement = swiperElement.querySelector(".swiper-config");
      if (!configElement) return;
      let config = JSON.parse(configElement.innerHTML.trim());

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  // =============================================
  // GLIGHTBOX INIT
  // =============================================
  if (typeof GLightbox !== 'undefined') {
    const glightbox = GLightbox({
      selector: '.glightbox'
    });
  }

  // =============================================
  // ISOTOPE LAYOUT & FILTERS
  // =============================================
  if (typeof Isotope !== 'undefined' && typeof imagesLoaded !== 'undefined') {
    document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
      let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
      let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
      let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

      let initIsotope;
      let container = isotopeItem.querySelector('.isotope-container');
      if (!container) return;

      imagesLoaded(container, function () {
        initIsotope = new Isotope(container, {
          itemSelector: '.isotope-item',
          layoutMode: layout,
          filter: filter,
          sortBy: sort
        });
      });

      let filters = isotopeItem.querySelectorAll('.isotope-filters li');
      filters.forEach(function (filterItem) {
        filterItem.addEventListener('click', function () {
          let activeFilter = isotopeItem.querySelector('.isotope-filters .filter-active');
          if (activeFilter) activeFilter.classList.remove('filter-active');
          this.classList.add('filter-active');
          if (initIsotope) {
            initIsotope.arrange({
              filter: this.getAttribute('data-filter')
            });
          }
          if (typeof aosInit === 'function') {
            aosInit();
          }
        }, false);
      });
    });
  }

  // =============================================
  // MUSIC PLAYER - NADHIF BASALAMAH PLAYLIST
  // =============================================

  const playlist = [
    {title: "Backstreet Boys - Shape Of My Heart", src: "assets/music/backstreet-boys-shape-of-my-heart.mp3"},
    {title: "Joey Mclntyre - Stay The Same", src: "assets/music/joey-mclntyre-stay-the-same.mp3"},
    {title: "Samuel Cipta - Senja Sudut kota", src: "assets/music/samuel-cipta-senja-sudut-kota.mp3"},
    {title: "Taylor Swift - Eldest Daughter", src: "assets/music/taylor-swift-eldest-daughter.mp3"},
    {title: "Glen Fredly - Kasih Putih", src: "assets/music/glen-fredly-kasih-putih.mp3"}
  ];

  const MUSIC_STATE_KEY = 'musicPlayerState';

  function loadMusicState() {
    try {
      const state = JSON.parse(localStorage.getItem(MUSIC_STATE_KEY));
      return state || null;
    } catch (e) { return null; }
  }

  function saveMusicState(state) {
    try {
      localStorage.setItem(MUSIC_STATE_KEY, JSON.stringify(state));
    } catch (e) { }
  }

  const initialState = loadMusicState();
  const audio = new Audio();
  let currentTrackIndex = initialState?.track ?? 0;
  let isPlaying = false;
  let autoplayAttempted = false;
  let autoPausedByVisibility = false;

  const toggleBtn = document.getElementById('musicToggle');
  const volumeSlider = document.getElementById('volumeSlider');
  const musicOverlayClose = document.getElementById('musicOverlayClose');
  const musicOverlayTitle = document.getElementById('musicOverlayTitle');
  const musicOverlayCover = document.getElementById('musicOverlayCover');
  const musicOverlayPlay = document.getElementById('musicOverlayPlay');
  const musicPrev = document.getElementById('musicPrev');
  const musicNext = document.getElementById('musicNext');
  const musicProgress = document.getElementById('musicProgress');
  const musicCurrentTime = document.getElementById('musicCurrentTime');
  const musicDuration = document.getElementById('musicDuration');

  if (toggleBtn && volumeSlider) {
    audio.volume = initialState?.volume ?? 0.3;
    volumeSlider.value = audio.volume;

    function loadTrack(index, seekTime) {
      if (index >= 0 && index < playlist.length) {
        audio.src = playlist[index].src;
        audio.load();
        document.title = `♫ ${playlist[index].title}`;
        if (musicOverlayTitle) musicOverlayTitle.textContent = playlist[index].title;
        if (musicOverlayCover) musicOverlayCover.src = 'assets/img/favicon.png';
        if (typeof seekTime === 'number' && seekTime > 0) {
          audio.currentTime = seekTime;
        }
      }
    }

    function togglePlayPause() {
      if (isPlaying) {
        audio.pause();
      } else {
        if (!audio.src) loadTrack(currentTrackIndex);
        audio.play().catch(() => { });
      }
    }

    function attemptAutoplay() {
      if (autoplayAttempted) return;
      autoplayAttempted = true;
      if (!audio.src) loadTrack(currentTrackIndex);
      audio.play().catch(() => { });
    }

    function updatePlayButton(state) {
      if (!toggleBtn) return;
      const icon = toggleBtn.querySelector('i');
      if (!icon) return;
      if (state === 'playing') {
        toggleBtn.classList.add('playing');
        toggleBtn.classList.remove('paused');
        icon.classList.remove('bi-play-circle-fill');
        icon.classList.add('bi-pause-circle-fill');
      } else {
        toggleBtn.classList.remove('playing');
        toggleBtn.classList.add('paused');
        icon.classList.remove('bi-pause-circle-fill');
        icon.classList.add('bi-play-circle-fill');
      }
    }

    function updateOverlayInfo() {
      if (!musicOverlay || !musicOverlayTitle) return;
      musicOverlayTitle.textContent = playlist[currentTrackIndex]?.title || '';
      updateOverlayPlayButton();
      updateOverlayProgress();
    }

    function updateOverlayPlayButton() {
      if (!musicOverlayPlay) return;
      const icon = musicOverlayPlay.querySelector('i');
      if (!icon) return;
      if (isPlaying) {
        icon.classList.remove('bi-play-fill');
        icon.classList.add('bi-pause-fill');
      } else {
        icon.classList.remove('bi-pause-fill');
        icon.classList.add('bi-play-fill');
      }
    }

    function updateOverlayProgress() {
      if (!musicProgress || !audio.duration) return;
      musicProgress.value = (audio.currentTime / audio.duration) * 100;
      if (musicCurrentTime) musicCurrentTime.textContent = formatTime(audio.currentTime);
      if (musicDuration) musicDuration.textContent = formatTime(audio.duration);
    }

    function formatTime(sec) {
      if (!sec || isNaN(sec)) return '0:00';
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    // Event listeners untuk music player
    toggleBtn.addEventListener('click', () => {
      if (musicOverlay && musicOverlay.style.display !== 'flex') {
        // When opening music overlay, hide theme menu/panel if open
        if (themeDropdownMenu && themeDropdownMenu.classList.contains('active')) {
          themeDropdownMenu.classList.remove('active');
        }
        if (customThemePanel && customThemePanel.style.display === 'flex') {
          customThemePanel.style.display = 'none';
        }
        updateOverlayInfo();
        musicOverlay.style.display = 'flex';
      } else if (musicOverlay) {
        musicOverlay.style.display = 'none';
      }
    });

    if (musicOverlayClose) {
      musicOverlayClose.addEventListener('click', () => {
        if (musicOverlay) musicOverlay.style.display = 'none';
      });
    }

    if (musicOverlayPlay) musicOverlayPlay.addEventListener('click', togglePlayPause);

    if (musicNext) {
      musicNext.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) audio.play();
        updateOverlayInfo();
      });
    }

    if (musicPrev) {
      musicPrev.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) audio.play();
        updateOverlayInfo();
      });
    }

    if (musicProgress) {
      musicProgress.addEventListener('input', (e) => {
        if (audio.duration) {
          audio.currentTime = (e.target.value / 100) * audio.duration;
        }
      });
    }

    audio.addEventListener('play', () => {
      isPlaying = true;
      updatePlayButton('playing');
      updateOverlayPlayButton();
    });

    audio.addEventListener('pause', () => {
      isPlaying = false;
      updatePlayButton('paused');
      updateOverlayPlayButton();
    });

    audio.addEventListener('timeupdate', updateOverlayProgress);
    audio.addEventListener('loadedmetadata', updateOverlayProgress);

    audio.addEventListener('ended', () => {
      currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
      loadTrack(currentTrackIndex);
      updateOverlayInfo();
      // Wait for audio to be ready before playing
      audio.addEventListener('canplay', () => {
        audio.play().catch(() => { });
      }, { once: true });
      // Fallback: try to play if it takes too long
      setTimeout(() => {
        if (!isPlaying) {
          audio.play().catch(() => { });
        }
      }, 500);
    });

    volumeSlider.addEventListener('input', (e) => {
      audio.volume = parseFloat(e.target.value);
      saveMusicState({
        track: currentTrackIndex,
        time: audio.currentTime,
        playing: isPlaying,
        volume: audio.volume
      });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !e.target.matches('input, textarea, button')) {
        e.preventDefault();
        togglePlayPause();
      }
      if (e.code === 'KeyN' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) audio.play();
        updateOverlayInfo();
      }
      if (e.code === 'KeyP' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) audio.play();
        updateOverlayInfo();
      }
    });

    // Save state before unload
    window.addEventListener('beforeunload', () => {
      saveMusicState({
        track: currentTrackIndex,
        time: audio.currentTime,
        playing: isPlaying,
        volume: audio.volume
      });
    });

    // Autoplay logic
    window.addEventListener('load', () => {
      if (initialState) {
        loadTrack(currentTrackIndex, initialState.time);
        updateOverlayInfo();
        if (initialState.playing) {
          audio.play().catch(() => { });
        }
      } else {
        loadTrack(currentTrackIndex);
        updateOverlayInfo();
        attemptAutoplay();
      }
    });

    let scrollTriggered = false;
    window.addEventListener('scroll', () => {
      if (!scrollTriggered && !isPlaying) {
        scrollTriggered = true;
        attemptAutoplay();
      }
    });

    const heroSection = document.querySelector('#hero');
    if (heroSection) {
      heroSection.addEventListener('mousemove', () => {
        if (!isPlaying) attemptAutoplay();
      }, { once: true });
    }

    document.addEventListener('click', (e) => {
      if (!isPlaying && e.target !== toggleBtn && !toggleBtn?.contains(e.target)) {
        attemptAutoplay();
      }
    }, { once: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (isPlaying) {
          audio.pause();
          autoPausedByVisibility = true;
        }
      } else if (autoPausedByVisibility) {
        audio.play().catch(() => { });
        autoPausedByVisibility = false;
      }
    });

    console.log('🎵 Real Face Playlist siap!');
  }

})();