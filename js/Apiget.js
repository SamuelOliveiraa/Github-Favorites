async function getUserFromApi(userName) {
  const endpoint = `https://api.github.com/users/${userName}`;

  const userData = await fetch(endpoint)
    .then(data => data.json())
    .then(data => data);

  /*  if (userData.message) {
    showErrorMessage("Usuario não encotrado, tente novamente");
    return;
  }

  createUser(userData); */
}
