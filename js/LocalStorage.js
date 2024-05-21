import { FavoriteUsers } from "./FavoriteUsers.js";
import { First, tbody, updateDataInScreen } from "./index.js";

export class Storage extends First {
  constructor(allFavoritesUsers) {
    super(allFavoritesUsers);
  }

  get() {
    return JSON.parse(localStorage.getItem("github-favorites"));
  }

  create() {
    if (localStorage.getItem("github-favorites") === null) {
      localStorage.setItem("github-favorites", JSON.stringify([]));
      this.allFavoritesUsers.update(JSON.parse(localStorage.getItem("github-favorites")));
    } else {
      this.allFavoritesUsers.update(JSON.parse(localStorage.getItem("github-favorites")));
    }
    this.update();
    updateDataInScreen();
    this.ifIsEmpty();
  }

  update() {
    localStorage.setItem("github-favorites", JSON.stringify(this.allFavoritesUsers.get()));
  }

  ifIsEmpty() {
    if (this.allFavoritesUsers.length === 0) {
      const element = `<h1>Sem nenhum usuario favoritado. Pesquise um usuario para adicionar na lista</h1>`;

      tbody.innerHTML = element;
    }
  }
}

export {};
