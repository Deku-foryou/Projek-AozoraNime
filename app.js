//variabel
const animeContainer = document.getElementById("anime-list");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const genreSelect = document.getElementById("genre-select"); // Ambil dropdown genre

async function fetchAnime(query = "") {
  console.log("Mencari:", query); // Cek apakah fungsi terpanggil

  animeContainer.innerHTML = `
        <div class="text-center w-100 p-5">
            <div class="spinner-border text-primary"></div>
            <p>Loading AozoraNime...</p>
        </div>`;

  // URL dinamis
  let url = query
    ? `https://api.jikan.moe/v4/anime?q=${query}&limit=10`
    : `https://api.jikan.moe/v4/top/anime?limit=10`;

  try {
    const response = await fetch(url);
    const result = await response.json();
    console.log("Data diterima:", result.data);
    renderAnime(result.data);
  } catch (error) {
    console.error("Gagal Fetch:", error);
    animeContainer.innerHTML = `<p class="text-danger text-center w-100">Gagal ambil data!</p>`;
  }
}

//search result
function renderAnime(animeList) {
  animeContainer.innerHTML = "";
  if (!animeList || animeList.length === 0) {
    animeContainer.innerHTML =
      '<p class="text-center w-100">Yah, nggak ketemu bro...</p>';
    return;
  }

  animeList.forEach((anime) => {
    // Logika ambil jumlah episode
    const ep = anime.episodes ? `${anime.episodes} Eps` : "Ongoing";

    const cardMarkup = `
            <div class="col">
                <div class="card shadow-sm h-100">
                    <img src="${
                      anime.images.jpg.image_url
                    }" class="card-img-top anime-img">
                    <div class="card-body p-2 text-center">
                        <h6 class="card-title text-truncate" style="font-size: 0.8rem;">${
                          anime.title
                        }</h6>
                        
                        <div class="d-flex justify-content-between align-items-center mb-2 px-1">
                            <span class="text-warning small" style="font-size: 0.7rem;">⭐ ${
                              anime.score || "N/A"
                            }</span>
                            <span class="badge bg-dark text-light" style="font-size: 0.6rem;">${ep}</span>
                        </div>

                        <a href="${
                          anime.url
                        }" target="_blank" class="btn btn-primary btn-sm w-100">Detail</a>
                    </div>
                </div>
            </div>`;
    animeContainer.innerHTML += cardMarkup;
  });
}

// FITUR FILTER GENRE

genreSelect.addEventListener("change", () => {
  const genreId = genreSelect.value;
  const genreName = genreSelect.options[genreSelect.selectedIndex].text;

  if (genreId !== "") {
    // Ganti judul utama menjadi nama genre yang dipilih
    mainTitle.innerText = `Genre: ${genreName}`;

    // Kosongkan input pencarian
    searchInput.value = "";

    // Parameter genres dari Jikan/mal api
    const urlGenre = `https://api.jikan.moe/v4/anime?genres=${genreId}&order_by=score&sort=desc&limit=15`;
    fetchAnimeByUrl(urlGenre);
  } else {
    // Jika pilih "Semua Genre", balik ke tampilan Top Anime
    mainTitle.innerText = "Top Anime";
    fetchAnime();
  }
});
// Fungsi agar bisa menerima URL kustom (untuk Genre)
async function fetchAnimeByUrl(url) {
  animeContainer.innerHTML = `
        <div class="text-center w-100 p-5">
            <div class="spinner-border text-primary"></div>
            <p>Mencari genre...</p>
        </div>`;

  try {
    const response = await fetch(url);
    const result = await response.json();
    renderAnime(result.data);
  } catch (error) {
    console.error("Gagal Fetch Genre:", error);
    animeContainer.innerHTML = `<p class="text-danger text-center w-100">Gagal memuat genre!</p>`;
  }
}

// EVENT LISTENER
searchButton.addEventListener("click", () => {
  console.log("Tombol diklik!"); // Cek apakah tombol ngrespon
  fetchAnime(searchInput.value);
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    console.log("Enter ditekan!");
    fetchAnime(searchInput.value);
  }
});

// wweekly anime
const weeklyContainer = document.getElementById("anime-weekly");

// Fungsi Top Mingguan
async function fetchWeeklyAnime() {
  const URL_WEEKLY =
    "https://api.jikan.moe/v4/top/anime?filter=airing&limit=10";

  try {
    const response = await fetch(URL_WEEKLY);
    const result = await response.json();

    // Ngintip data buat mastiin jumlah episode
    console.log(
      "Cek Episode Trending:",
      result.data.map((a) => a.episodes)
    );

    weeklyContainer.innerHTML = "";

    result.data.forEach((anime) => {
      // logika episode: Ambil dari anime.episodes
      const jmlEpisode =
        anime.episodes !== null ? `${anime.episodes} Eps` : "Ongoing";

      const card = `
                <div class="col">
                    <div class="card shadow-sm h-100 border-0">
                        <img src="${
                          anime.images.jpg.image_url
                        }" class="card-img-top anime-img">
                        <div class="card-body p-2 text-center">
                            <h6 class="card-title text-truncate" style="font-size: 0.8rem;">${
                              anime.title
                            }</h6>
                            
                            <div class="d-flex justify-content-between align-items-center mb-2 px-1">
                                <span class="text-warning small" style="font-size: 0.7rem;">⭐ ${
                                  anime.score || "N/A"
                                }</span>
                                <span class="badge bg-dark text-light" style="font-size: 0.6rem;">${jmlEpisode}</span>
                            </div>

                            <a href="${
                              anime.url
                            }" target="_blank" class="btn btn-outline-primary btn-sm w-100">Detail</a>
                        </div>
                    </div>
                </div>`;
      weeklyContainer.innerHTML += card;
    });
  } catch (error) {
    console.error("Gagal ambil data mingguan:", error);
    weeklyContainer.innerHTML = `<p class="text-danger text-center w-100">Gagal memuat trending...</p>`;
  }
}

// Integrasi fitur pencarian dengan judul dinamis
const mainTitle = document.getElementById("main-title");

searchButton.addEventListener("click", () => {
  const query = searchInput.value;

  if (query.trim() !== "") {
    mainTitle.innerText = `Hasil Pencarian: "${query}"`;
    fetchAnime(query);
  } else {
    mainTitle.innerText = "Top Anime";
    fetchAnime();
  }
});

//  fitur Enter
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchButton.click();
});

//  FITUR DARK / LIGHT MODE

const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
const navbar = document.querySelector(".navbar");

//  Cek apakah user pernah simpan preferensi mode sebelumnya
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  enableLightMode();
}

// Fungsi saat tombol diklik
themeToggle.addEventListener("click", () => {
  if (body.classList.contains("light-mode")) {
    disableLightMode();
  } else {
    enableLightMode();
  }
});

// Fungsi Mengaktifkan Mode Terang
function enableLightMode() {
  body.classList.add("light-mode");
  themeToggle.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
  themeToggle.classList.replace("btn-outline-light", "btn-outline-dark");

  navbar.classList.remove("navbar-dark", "bg-dark");
  navbar.classList.add("navbar-light", "bg-light", "shadow-sm");

  localStorage.setItem("theme", "light");
}

// Fungsi Mengaktifkan Mode Gelap (Balik ke Awal)
function disableLightMode() {
  body.classList.remove("light-mode");
 themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
  themeToggle.classList.replace("btn-outline-dark", "btn-outline-light");

  navbar.classList.add("navbar-dark", "bg-dark");
  navbar.classList.remove("navbar-light", "bg-light", "shadow-sm");

  localStorage.setItem("theme", "dark");
}

// Panggil fungsinya barengan sama fetchAnime() yang lama
fetchAnime();
fetchWeeklyAnime();
// Jalankan pertama kali
fetchAnime();
