const userNameInput = document.querySelector("#userName");
const buttonContainer = document.querySelector("button");
const tbody = document.querySelector("tbody");
let allFavoritesUsers;

// CRIA LOCAL STORAGE
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

// ATUALIZAR DADOS NA TELA
function updateDataInScreen() {
  let html = "";
  for (const user of allFavoritesUsers) {
    html += `
      <tr id="${user.id}" >
        <td><img src="${user.avatar_url}" alt="Avatar url"></td>
        <td class="name">${user.name} <span class="login">${user.login}</td>
        <td>${user.public_repos}</td>
        <td>${user.followers}</td>
        <td data-id=${user.id} class="remove-button"> x </td>
      </tr>
  `;
  }
  tbody.innerHTML = html;
}

// SE O LOCAL STORAGE ESTA VAZIO, MOSTRA O H1 NA TELA
function ifLocalStorageIsEmpty() {
  if (allFavoritesUsers.length === 0) {
    const element = `<h1>Sem nenhum usuario favoritado. Pesquise um usuario para adicionar na lista</h1>`;

    tbody.innerHTML = element;
  }
}

// REMOVE ITEM DO LOCAL STORAGE
function removeElementOfFavoriteUsers(id) {
  allFavoritesUsers = allFavoritesUsers.filter(user => Number(id) !== user.id);
  console.log(allFavoritesUsers);
  updateLocalStorage();
  updateDataInScreen();
  ifLocalStorageIsEmpty();
}

// MOSTRA MENSAGEM DE ERRO NA TELA CONFORME O TEXTO PASSADO
function showErrorMessage(message) {
  const errorMessage = document.querySelector(".error-message");
  errorMessage.classList.remove("hide");
  errorMessage.textContent = message;

  setTimeout(() => {
    errorMessage.classList.add("hide");
  }, 3000);
}

// PEGA O USUARIO DA API CONFORME USERNAME PASSADO PARA ELE
async function getUserFromApi(userName) {
  const endpoint = `https://api.github.com/users/${userName}`;

  const userData = await fetch(endpoint)
    .then(data => data.json())
    .then(data => data);

  if (userData.message) {
    showErrorMessage("Usuario não encotrado, tente novamente");
    return;
  }

  createUser(userData);
}

// VERIFICA SE O USUARIO JÁ EXISTE E RETORNA TRUE OU FALSE
function verifyIfElementExists(user) {
  for (const allUser of allFavoritesUsers) {
    if (user.id === Number(allUser.id)) {
      showErrorMessage("Usuario já cadastrado, não pode registrar o mesmo usuario");
      return false;
    }
  }
  return true;
}

// CRIA O USUARIO E FAZ VERIFICAÇÕES
function createUser(user) {
  // VERIFICA SE O TBODY ESTA VAZIO E ADICIONA O H1
  if (tbody.children[0].localName === "h1") {
    tbody.children[0].remove();
  }

  // VERIFICA SE O ELEMENTO JA EXISTE NO FAVORITEUSERS
  if (verifyIfElementExists(user)) {
    insertElementsInFavoriteUsers(user);
  }

  //ADICIONA O EVENTO DE CLICK NO BUTTON DE REMOVER ELEMENTO
  addEventClickToButtons();
}

// ADICIONA O ELEMENTO NO ARRAY FAVORITE USER E ATUALIZA O LOCAL STORAGE E OS DADOS NA TELA
function insertElementsInFavoriteUsers({ id, avatar_url, name, login, followers, public_repos }) {
  const newUser = {
    id,
    name,
    avatar_url,
    login,
    public_repos,
    followers
  };

  allFavoritesUsers.push(newUser);
  updateDataInScreen();
  updateLocalStorage();
}

//ADICIONA O EVENTO DE CLICK NO BUTTON DE REMOVER ELEMENTO
function addEventClickToButtons() {
  const removeButtons = document.querySelectorAll(".remove-button");
  removeButtons.forEach(button => {
    button.addEventListener("click", e => removeElementOfFavoriteUsers(e.target.dataset.id));
  });
}

// TODOS OS EVENTOS

// ADICIONA EVENTO DE CLICK NO BUTTON
buttonContainer.addEventListener("click", e => {
  e.preventDefault();
  const userNameInputValue = userNameInput.value;
  if (!userNameInputValue) {
    showErrorMessage("Usuario inválido tente novamente");
  }
  getUserFromApi(userNameInputValue);
});

// INSTANCIA O LOCAL STORAGE
createLocalStorage();
