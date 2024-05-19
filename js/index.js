const userNameInput = document.querySelector("#userName");
const buttonContainer = document.querySelector("button");
const tbody = document.querySelector("tbody");
const removeItem = document.querySelector(".remove");

/* IF TBODY DONT HAS ELEMENTS ADD H1*/
if (tbody.children.length === 0) {
  const element = `<h1>Sem nenhum usuario favoritado. Pesquise um usuario para adicionar na lista</h1>`;

  tbody.innerHTML = element;
}

buttonContainer.addEventListener("click", e => {
  e.preventDefault();
  const userNameInputValue = userNameInput.value;
  if (!userNameInputValue) {
    showErrorMessage("Usuario inválido tente novamente");
  }
  selectedFavoriteUser(userNameInputValue);
});

console.log(removeItem)

function showErrorMessage(message) {
  const errorMessage = document.querySelector(".error-message");
  errorMessage.classList.toggle("hide");
  errorMessage.textContent = message;

  setTimeout(() => {
    errorMessage.classList.toggle("hide");
  }, 3000);
}

async function selectedFavoriteUser(userName) {
  const endpoint = `https://api.github.com/users/${userName}`;

  const userData = await fetch(endpoint)
    .then(data => data.json())
    .then(data => data);

  if (userData.message) {
    showErrorMessage("Usuario não encotrado, tente novamente");
  }

  createUserFavorite(userData);
}

function createUserFavorite(user) {
  /* IF TBODY HAS ELEMENTS REMOVE H1*/
  if (tbody.children[0].localName === "h1") {
    tbody.children[0].classList.add("hide");
  }

  const html = `
      <tr id="${user.id}" >
        <td><img src="${user.avatar_url}" alt="Avatar url"></td>
        <td class="name">${user.name} <span class="login">${user.login}</td>
        <td>${user.public_repos}</td>
        <td>${user.followers}</td>
        <td data-id=${user.id} class="remove"> x </td>
      </tr>
  `;

  tbody.innerHTML += html;
}

function removeElementOfTable(e) {
  console.log(e.target);
}
