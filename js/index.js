const userNameInput = document.querySelector("#userName");
const buttonContainer = document.querySelector("button");
const tbody = document.querySelector("tbody");

/* IF TBODY DONT HAS ELEMENTS ADD H1*/
ifTbodyIsEmpty();

function ifTbodyIsEmpty() {
  if (tbody.children.length === 0) {
    const element = `<h1>Sem nenhum usuario favoritado. Pesquise um usuario para adicionar na lista</h1>`;

    tbody.innerHTML = element;
  }
}

buttonContainer.addEventListener("click", e => {
  e.preventDefault();
  const userNameInputValue = userNameInput.value;
  if (!userNameInputValue) {
    showErrorMessage("Usuario inválido tente novamente");
  }
  selectedFavoriteUser(userNameInputValue);
});

function showErrorMessage(message) {
  const errorMessage = document.querySelector(".error-message");
  errorMessage.classList.remove("hide");
  errorMessage.textContent = message;

  setTimeout(() => {
    errorMessage.classList.add("hide");
  }, 3000);
}

async function selectedFavoriteUser(userName) {
  const endpoint = `https://api.github.com/users/${userName}`;

  const userData = await fetch(endpoint)
    .then(data => data.json())
    .then(data => data);

  if (userData.message) {
    showErrorMessage("Usuario não encotrado, tente novamente");
    return;
  }

  createUserFavorite(userData);
}

function createUserFavorite(user) {
  /* IF TBODY HAS ELEMENTS REMOVE H1*/
  if (tbody.children[0].localName === "h1") {
    tbody.children[0].remove();
  }

  const html = `
      <tr id="${user.id}" >
        <td><img src="${user.avatar_url}" alt="Avatar url"></td>
        <td class="name">${user.name} <span class="login">${user.login}</td>
        <td>${user.public_repos}</td>
        <td>${user.followers}</td>
        <td data-id=${user.id} class="remove-button"> x </td>
      </tr>
  `;
  tbody.innerHTML += html;

  const removeButtons = document.querySelectorAll(".remove-button");
  console.log(removeButtons);
  removeButtons.forEach(button => {
    button.addEventListener("click", e => removeElementOfTable(e));
  });
}

function removeElementOfTable(e) {
  e.target.parentNode.remove();
  ifTbodyIsEmpty();
}
       