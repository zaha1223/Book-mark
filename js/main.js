const token = localStorage.getItem("token");
if (!token) {
  window.location.replace("../index.html");
}
//=====================================
const elLogOutBtn = document.querySelector(".logout-btn");
function logOut() {
  localStorage.removeItem("token");
  window.location.replace("../login.html");
}
//===================================================
let arrBook = [];
function renderBooks(books) {
  for (let i of books) {
    // console.log(i);
    arrBook.push({
      id: i.id,
      etag: i.etag,
      title: i.volumeInfo.title,
      author: i.volumeInfo.authors,
      date: i.volumeInfo.publishedDate,
      link: i.volumeInfo.previewLink,
    });
    const elBookItem = document.createElement("li");
    const result = document.querySelector(".result-text");
    elBookItem.className = "books-info";
    elBookItem.id = i.id;
    elBookItem.innerHTML = `
    <img class="book-img" src="${i.volumeInfo.imageLinks.smallThumbnail}" alt="" />
    <h5 class="book-title">${i.volumeInfo.title}</h5>
    <p class="book-author-name">${i.volumeInfo.authors}</p>
    <span class="book-date">${i.volumeInfo.publishedDate}</span>
    <button id="${i.etag}" class="add-btn">Bookmark</button>
    <button id="${i.id}" onclick="openModal()" class="info-btn">More Info</button>
    <button class="readd-btn"><a href="${i.volumeInfo.infoLink}" target="blank">Read</a></button>`;
    const elList = document.querySelector(".list");
    elList.append(elBookItem);
    changeItem(elBookItem, books);
    addBook(arrBook, elBookItem);
    result.textContent = `Showing (${arrBook.length}) Result(s)`;
  }
}

const URL_BOOKS = "https://www.googleapis.com/books/v1/volumes?q=search+terms";

fetch(URL_BOOKS, {
  method: "GET",
  headers: {
    "Content-type": "application/json",
  },
})
  .then((data) => {
    return data.json();
  })
  .then((result) => {
    renderBooks(result.items);
  });

//=============================
function openModal() {
  const elModal = document.querySelector(".modal");
  elModal.classList.add("modal-open");
}

//=============================
function changeItem(item, eachbooks) {
  item.addEventListener("click", (e) => {
    function renderModal() {
      for (let i of eachbooks) {
        const elModalList = document.querySelector(".modal");
        if (e.target.id == i.id) {
          elModalList.innerHTML = `<div class="modal-head">
          <h5 class="modal-title">${i.volumeInfo.title}</h5>
          <button onclick="removeModal()" class="modal-remove"></button>
          </div>
          <div class="modal-info">
              <img src="${
                i.volumeInfo.imageLinks.smallThumbnail
              }" alt="" class="modal-img" />
              <p class="modal-text">${i.volumeInfo.description}</p>
              <p class="author-name">
                  Author: <span class="author-link">${
                    i.volumeInfo.authors
                  }</span>
              </p>
              <p class="published-date">
                  Published: <span class="date-link">${(i.volumeInfo.publishedDate =
                    undefined ? i.volumeInfo.publishedDate : 2000)}</span>
              </p>
              <p class="publishers">
                  Publishers: <span class="publisher-link">${
                    i.volumeInfo.publisher
                  }</span>
              </p>
              <p class="categorie">
                  Categories: <span class="categorie-link">${
                    i.volumeInfo.categories
                  }</span>
              </p>
              <p class="page-count">
                  Pages Count: <span class="page-number">${
                    i.volumeInfo.pageCount
                  }</span>
              </p>
            </div>
          <button class="btn-to-read"><a href="${
            i.volumeInfo.previewLink
          }" target="_blank">READ</a></button>`;
        }
      }
    }
    renderModal();
  });
}
//=============================
function removeModal() {
  document.querySelector(".modal").classList.remove("modal-open");
}
//===========================

function addBook(arr, item) {
  item.addEventListener("click", (e) => {
    for (let j of arr) {
      let obj = [];
      if (!obj.includes(j)) {
        obj.push({
          id: j.etag,
          title: j.title,
          author: j.author,
          link: j.link,
        });
        localStorage.setItem("book", JSON.stringify(obj));
      }
      function renderMarkBook(id) {
        const books = JSON.parse(localStorage.getItem("book"));
        if (e.target.id == j.etag) {
          const elid = books.find((book) => book.id !== id);
          for (let m of books) {
            console.log(m);
            if (!books.includes(elid) !== m.id) {
              const elMarkList = document.querySelector(".bookmark-list");
              const elBookMarkItem = document.createElement("li");
              elBookMarkItem.className = "bookmark-item";
              elBookMarkItem.id = m.id;
              elBookMarkItem.innerHTML = `
                  <h4 class="book-name">${m.title}</h4>
                          <p class="book-author">${m.author}</p>
                          <a href="${m.link}" target="_blank" class="read-btn"></a>
                          <button  id="${m.id}" class="delete-btn"></button>`;
              if (books.includes(m.id) !== elBookMarkItem) {
                elMarkList.prepend(elBookMarkItem);
              }
              removeBook(elBookMarkItem);
            }
          }
        }
      }
      renderMarkBook(j.etag);
    }
  });
}

function removeBook(item) {
  item.addEventListener("click", (e) => {
    if (e.target.id == item.id) {
      item.style.display = "none";
    }
  });
}
