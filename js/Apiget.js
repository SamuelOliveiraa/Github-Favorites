export class Api {
  async getUser(userName) {
    const endpoint = `https://api.github.com/users/${userName}`;

    const userData = await fetch(endpoint)
      .then(data => data.json())
      .then(data => data);

    return userData;
  }
}
