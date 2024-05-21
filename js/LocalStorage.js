

// CRIA O LOCAL STORAGE
function createLocalStorage() {
  if (localStorage.getItem("github-favorites") === null) {
    localStorage.setItem("github-favorites", JSON.stringify([]));
    allFavoritesUsers = JSON.parse(localStorage.getItem("github-favorites"));
  } else {
    allFavoritesUsers = JSON.parse(localStorage.getItem("github-favorites"));
  }
  updateLocalStorage();
  updateDataInScreen();
  ifLocalStorageIsEmpty();
}

// ATUALIZAR LOCAL STORAGE
function updateLocalStorage() {
  localStorage.setItem("github-favorites", JSON.stringify(allFavoritesUsers));
}

function ifLocalStorageIsEmpty() {
  if (allFavoritesUsers.length === 0) {
    const element = `<h1>Sem nenhum usuario favoritado. Pesquise um usuario para adicionar na lista</h1>`;

    tbody.innerHTML = element;
  }
}


export {createLocalStorage, updateLocalStorage}