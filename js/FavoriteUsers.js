import { First, updateDataInScreen } from "./index.js";
import { Storage } from "./LocalStorage.js";

export class FavoriteUsers extends First {
  constructor(myLocalStorage) {
    super(myLocalStorage);
  }

  update(newValue) {
    this.allFavoritesUsers = newValue;
  }

  get() {
    return this.allFavoritesUsers;
  }

  removeElement(id) {
    this.allFavoritesUsers = this.allFavoritesUsers.filter(user => Number(id) !== user.id);
    this.myLocalStorage.update();
    updateDataInScreen();
    this.myLocalStorage.ifIsEmpty();
  }

  insertElement({ id, avatar_url, name, login, followers, public_repos }) {
    const newUser = {
      id,
      name,
      avatar_url,
      login,
      public_repos,
      followers
    };

    this.allFavoritesUsers.push(newUser);

    //ADICIONA O EVENTO DE CLICK NO BUTTON DE REMOVER ELEMENTO
    //addEventClickToButtons();
    updateDataInScreen();
    this.myLocalStorage.update();
  }
}
