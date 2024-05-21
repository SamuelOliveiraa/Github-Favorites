import { Api } from "./Apiget.js";
import { Storage } from "./LocalStorage.js";

const userNameInput = document.querySelector("#userName");
const buttonContainer = document.querySelector("button");
const tbody = document.querySelector("tbody");

const myLocalStorage = new Storage();
const api = new Api();

class First {
  constructor(allFavoritesUsers, myLocalStorage) {
    this.allFavoritesUsers = allFavoritesUsers;
    this.myLocalStorage = myLocalStorage;
  }
}

// ATUALIZAR DADOS NA TELA
function updateDataInScreen() {
  myLocalStorage.create();
  let html = "";
  for (const user of myLocalStorage.allFavoritesUsers.get()) {
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
  addEventOfRemoveInAllX();
}

//ADICIONA O EVENTO DE CLICK EM TODOS OS X
function addEventOfRemoveInAllX() {
  document.querySelectorAll(".remove-button").forEach(button => {
    button.addEventListener("click", e => removeElementOfFavoriteUsers(e.target.dataset.id));
  });
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
function getUserFromApi(userName) {
  const userData = api.getUser(userName);

  if (userData.message) {
    showErrorMessage("Usuario não encontrado, tente novamente");
    return;
  }

  createUser(userData);
}

// VERIFICA SE O USUARIO JÁ EXISTE E RETORNA TRUE OU FALSE
function verifyIfElementExists(user) {
  for (const allUser of allFavoritesUsers.get()) {
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
    allFavoritesUsers.insertElement(user);
  }
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
myLocalStorage.create();

export { tbody, updateDataInScreen, showErrorMessage, addEventOfRemoveInAllX, First };
