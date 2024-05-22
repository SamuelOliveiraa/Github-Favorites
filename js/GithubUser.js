export class GithubUser {
  static getUser(userName) {
    const endpoint = `https://api.github.com/users/${userName}`;

    const userData = fetch(endpoint)
      .then(data => data.json())
      .then(data => data);

    return userData;
  }
}