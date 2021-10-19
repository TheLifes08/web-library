let sortingType = "id";

function checkForm() {
    let nameInput = document.getElementById("create-book-form-name");
    let authorInput = document.getElementById("create-book-form-author");
    let descInput = document.getElementById("create-book-form-desc");
    let submitInput = document.getElementById("create-book-form-submit");

    if (nameInput.value !== "" && authorInput.value !== "" && descInput.value !== "") {
        submitInput.disabled = false;
    } else {
        submitInput.disabled = true;
    }
}

function deleteBook(id) {
    restDeleteBook(id, (response) => {
        if (response.success) {
            updateBooks();
        }
    });
}

function updateBooks() {
    restGetBooks((response) => {
        let table = document.getElementById("books-table-body");

        if (sortingType === "id") {
            response.result.sort((a, b) => {
                return a.id - b.id;
            });
        } else if (sortingType === "return-date") {
            response.result.sort((a, b) => {
                if (a.holder && b.holder) {
                    dateA = Date.parse(a.holder.returnDate);
                    dateB = Date.parse(b.holder.returnDate);
                    return dateA - dateB;
                } else if (a.holder) {
                    return -1;
                } else if (b.holder) {
                    return 1;
                }

                return 0;
            });
        } else if (sortingType === "available") {
            response.result.sort((a, b) => {
                if (a.available && b.available) {
                    return 0;
                } else if (a.available) {
                    return -1;
                } else if (b.available) {
                    return 1;
                }

                return 0;
            });
        }

        table.innerHTML = "";

        for (let i = 0; i < response.result.length; ++i) {
            let book = response.result[i];
            let row = document.createElement("tr");
            let idCell = document.createElement("td");
            let nameCell = document.createElement("td");
            let authorCell = document.createElement("td");
            let availableCell = document.createElement("td");
            let returnDateCell = document.createElement("td");
            let removeButtonCell = document.createElement("td");

            idCell.appendChild(document.createTextNode(book.id));
            let bookHref = document.createElement("a");
            bookHref.setAttribute("href", `/books/${book.id}/card`);
            bookHref.appendChild(document.createTextNode(book.name));
            idCell.setAttribute("class", "w3-right-align");
            nameCell.appendChild(bookHref);
            authorCell.appendChild(document.createTextNode(book.author));
            availableCell.setAttribute("class", "w3-center");
            if (book.available) {
                availableCell.appendChild(document.createTextNode("Да"));
            } else {
                availableCell.appendChild(document.createTextNode("Нет"));
            }
            returnDateCell.setAttribute("class", "w3-center");
            if (book.holder) {
                returnDateCell.appendChild(document.createTextNode(book.holder.returnDate));
            } else {
                returnDateCell.appendChild(document.createTextNode("-"));
            }
            let buttonImage = document.createElement("img")
            buttonImage.setAttribute("style", "width: 15px;")
            buttonImage.setAttribute("src", "/public/images/delete.png");
            let removeButton = document.createElement("button");
            removeButton.setAttribute("onclick", "deleteBook(" + book.id + ")");
            removeButton.setAttribute("style", "padding: 2px;");
            removeButton.setAttribute("class", "w3-button w3-circle");
            removeButton.appendChild(buttonImage);
            removeButtonCell.setAttribute("class", "w3-center");
            removeButtonCell.appendChild(removeButton);

            row.appendChild(idCell);
            row.appendChild(nameCell);
            row.appendChild(authorCell);
            row.appendChild(availableCell);
            row.appendChild(returnDateCell);
            row.appendChild(removeButtonCell);

            table.appendChild(row);
        }
    });
}

function createBook() {
    let nameInput = document.getElementById("create-book-form-name");
    let authorInput = document.getElementById("create-book-form-author");
    let descInput = document.getElementById("create-book-form-desc");
    let releaseDateInput = document.getElementById("create-book-form-release-date");
    let book = {
        "name": nameInput.value,
        "description": descInput.value,
        "author": authorInput.value,
        "releaseDate": releaseDateInput.value
    }

    restPostBook(book, (response) => {
        let messageBlock = document.getElementById("create-book-form-message")
        if (response.success) {
            if (updateBooks) {
                updateBooks();
            }
            messageBlock.classList.remove("w3-red");
            messageBlock.classList.add("w3-green");
        } else {
            messageBlock.classList.remove("w3-green");
            messageBlock.classList.add("w3-red");
        }
        document.getElementById("create-book-form-message-p").textContent = response.message;
        messageBlock.style.display = "block";
    });
}

function sortBooks() {
    let sortSelectElement = document.getElementById("sort-select");
    console.log(sortingType, sortSelectElement.value);

    if (sortSelectElement.value !== sortingType) {
        sortingType = sortSelectElement.value;
        updateBooks();
    }
}