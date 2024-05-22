import { GithubUser } from "./GithubUser.js";

export class Favorites {
  constructor() {
    this.userNameInput = document.querySelector("#userName");
    this.buttonContainer = document.querySelector("button");
    this.tbody = document.querySelector("tbody");
    this.allFavoritesUsers = [];
    this.tbody.classList.add('isLoading')  
    this.createLocalStorage();
    this.addEventToButton();
  }

  // CRIA LOCAL STORAGE
  createLocalStorage() {
    if (localStorage.getItem("github-favorites") === null) {
      localStorage.setItem("github-favorites", JSON.stringify([]));
      this.allFavoritesUsers = JSON.parse(localStorage.getItem("github-favorites"));
    } else {
      this.allFavoritesUsers = JSON.parse(localStorage.getItem("github-favorites"));
    } 
    setTimeout(() => {
      this.tbody.classList.remove('isLoading') 
    }, 500);
    this.updateLocalStorage();
    this.updateDataInScreen();
    this.ifLocalStorageIsEmpty();
  }

  // ATUALIZAR LOCAL STORAGE
  updateLocalStorage() {
    localStorage.setItem("github-favorites", JSON.stringify(this.allFavoritesUsers));
  } 

  // ATUALIZAR DADOS NA TELA
  updateDataInScreen() {
    let html = ""; 

    for (const user of this.allFavoritesUsers) {
      html += `
            <tr id="${user.id}">
              <td>
                <a href="${user.html_url}">
                  <img src="${user.avatar_url}" alt="Avatar url">
                </a>
              </td>
              <td class="name">
                <a href="${user.html_url}">
                  ${user.name} <span class="login">${user.login}</span>
                </a>
              </td>
              <td>${user.public_repos}</td>
              <td>${user.followers}</td>
              <td data-id=${user.id} class="remove-button"> x </td>
            </tr>
        `;
    } 

    
    this.tbody.innerHTML = html;
    
    this.addEventOfRemoveInAllX();
  }

  // SE O LOCAL STORAGE ESTA VAZIO, MOSTRA O H1 NA TELA
  ifLocalStorageIsEmpty() {
    if (this.allFavoritesUsers.length === 0) {
      const element = `<h1>Sem nenhum usuario favoritado. Pesquise um usuario para adicionar na lista</h1>`;

      this.tbody.innerHTML = element;
    }
  }

  // REMOVE ITEM DO LOCAL STORAGE
  removeElementOfFavoriteUsers(id) {
    this.allFavoritesUsers = this.allFavoritesUsers.filter(user => Number(id) !== user.id);
    this.updateDataInScreen();
    this.updateLocalStorage();
    this.ifLocalStorageIsEmpty();
  }

  //ADICIONA O EVENTO DE CLICK EM TODOS OS X
  addEventOfRemoveInAllX() {
    document.querySelectorAll(".remove-button").forEach(button => {
      button.addEventListener("click", e => this.removeElementOfFavoriteUsers(e.target.dataset.id));
    });
  }

  // MOSTRA MENSAGEM DE ERRO NA TELA CONFORME O TEXTO PASSADO
  showErrorMessage(message) {
    const errorMessage = document.querySelector(".error-message");
    errorMessage.classList.remove("hide");
    errorMessage.textContent = message;

    setTimeout(() => {
      errorMessage.classList.add("hide");
    }, 3000);
  }

  // PEGA O USUARIO DA API CONFORME USERNAME PASSADO PARA ELE
  async getUserFromApi(userName) {
    const user = await GithubUser.getUser(userName);

    if (user.message) {
      this.showErrorMessage("Usuario não encotrado, tente novamente");
      return;
    } 

    this.createUser(user);
  }

  // VERIFICA SE O USUARIO JÁ EXISTE E RETORNA TRUE OU FALSE
  verifyIfElementExists(user) {
    for (const allUser of this.allFavoritesUsers) {
      if (user.id === Number(allUser.id)) {
        this.showErrorMessage("Usuario já cadastrado, não pode registrar o mesmo usuario");
        return false;
      }
    }
    return true;
  }

  // CRIA O USUARIO E FAZ VERIFICAÇÕES
  createUser(user) {
    // VERIFICA SE O TBODY ESTA VAZIO E ADICIONA O H1
    if (this.tbody.children[0].localName === "h1") {
      this.tbody.children[0].remove();
    }

    // VERIFICA SE O ELEMENTO JA EXISTE NO FAVORITEUSERS
    if (this.verifyIfElementExists(user)) {
      this.insertElementsInFavoriteUsers(user);
    }
  }

  // ADICIONA O ELEMENTO NO ARRAY FAVORITE USER E ATUALIZA O LOCAL STORAGE E OS DADOS NA TELA
  insertElementsInFavoriteUsers({ id, avatar_url, name, login, followers, public_repos, html_url }) {
    const newUser = {
      id,
      name,
      avatar_url,
      login,
      public_repos,
      followers,
      html_url
    };

    let newFavoritesUsers = [...this.allFavoritesUsers, newUser];

    this.allFavoritesUsers = newFavoritesUsers;

    //ADICIONA O EVENTO DE CLICK NO BUTTON DE REMOVER ELEMENTO
    //addEventClickToButtons();
    this.updateDataInScreen();
    this.updateLocalStorage();
  }

  // ADICIONA EVENTO DE CLICK NO BUTTON
  addEventToButton() {
    this.buttonContainer.addEventListener("click", e => {
      e.preventDefault();
      const userNameInputValue = this.userNameInput.value;
      if (!userNameInputValue) {
        this.showErrorMessage("Usuario inválido tente novamente");
      }
      this.getUserFromApi(userNameInputValue);
      this.userNameInput.value = "";
    });
  }
}
