function checkUpdateForm() {
    let nameInput = document.getElementById("update-book-form-name");
    let authorInput = document.getElementById("update-book-form-author");
    let descInput = document.getElementById("update-book-form-desc");
    let submitInput = document.getElementById("update-book-form-submit");

    if (nameInput.value !== "" && authorInput.value !== "" && descInput.value !== "") {
        submitInput.disabled = false;
    } else {
        submitInput.disabled = true;
    }
}

function checkGiveForm() {
    let nameInput = document.getElementById("give-book-form-name");
    let submitInput = document.getElementById("give-book-form-submit");

    if (nameInput.value !== "") {
        submitInput.disabled = false;
    } else {
        submitInput.disabled = true;
    }
}

function closeUpdateForm() {
    document.getElementById('modal-update-book').style.display = "none";
    document.getElementById('update-book-form-message').style.display = "none";
}

function closeGiveForm() {
    document.getElementById('modal-give-book').style.display = "none";
    document.getElementById('give-book-form-message').style.display = "none";
}

function updateBookInfo(id) {
    restGetBook(id, (response) => {
        if (response.success) {
            document.getElementById("book-name").textContent = response.result.name;
            document.getElementById("book-author").textContent = response.result.author;
            document.getElementById("book-description").textContent = response.result.description;
            document.getElementById("book-release-date").textContent = response.result.releaseDate;
            document.getElementById("book-available").textContent = (response.result.available)? "Да" : "Нет";

            document.getElementById("update-book-form-name").value = response.result.name;
            document.getElementById("update-book-form-author").value = response.result.author;
            document.getElementById("update-book-form-release-date").value = response.result.releaseDate;
            document.getElementById("update-book-form-desc").textContent = response.result.description;

            if (response.result.holder) {
                document.getElementById("book-holder-p").style.display = "block";
                document.getElementById("book-return-date-p").style.display = "block";
                document.getElementById("button-return-book").style.display = "";
                document.getElementById("button-give-book").style.display = "none";
                document.getElementById("book-holder-name").textContent = response.result.holder.name;
                document.getElementById("book-return-date").textContent = response.result.holder.returnDate;
                document.getElementById("holder-info-name").textContent = response.result.holder.name;
                document.getElementById("holder-info-return-date").textContent = response.result.holder.returnDate;
            } else {
                document.getElementById("book-holder-p").style.display = "none";
                document.getElementById("book-return-date-p").style.display = "none";
                document.getElementById("button-return-book").style.display = "none";
                document.getElementById("button-give-book").style.display = "";
            }
        }
    });
}

function updateBook(id) {
    restGetBook(id, (response) => {
        if (response.success) {
            let nameInput = document.getElementById("update-book-form-name");
            let authorInput = document.getElementById("update-book-form-author");
            let releaseDateInput = document.getElementById("update-book-form-release-date");
            let descInput = document.getElementById("update-book-form-desc");
            let book = response.result;

            book.name = nameInput.value;
            book.author = authorInput.value;
            book.releaseDate = releaseDateInput.value;
            book.description = descInput.value;

            restPutBook(book, (response) => {
                let messageBlock = document.getElementById("update-book-form-message");
                if (response.success) {
                    updateBookInfo(id);
                    messageBlock.classList.remove("w3-red");
                    messageBlock.classList.add("w3-green");
                } else {
                    messageBlock.classList.remove("w3-green");
                    messageBlock.classList.add("w3-red");
                }
                document.getElementById("update-book-form-message-p").textContent = response.message;
                messageBlock.style.display = "block";
            });
        }
    });
}

function deleteBook(id) {
    restDeleteBook(id, (response) => {
        if (response.success) {
            document.location.href = "/";
        }
    });
}

function giveBook(id) {
    restGetBook(id, (response) => {
        let messageBlock = document.getElementById("give-book-form-message");
        if (response.success) {
            let book = response.result;

            if (!book.available) {
                messageBlock.classList.remove("w3-green");
                messageBlock.classList.add("w3-red");
                document.getElementById("give-book-form-message-p").textContent = "Книга уже выдана.";
                messageBlock.style.display = "block";
                return;
            }

            book.available = false;
            book.holder = {
                "name": document.getElementById("give-book-form-name").value,
                "returnDate": document.getElementById("give-book-form-return-date").value
            };

            restPutBook(book, (response) => {
                if (response.success) {
                    updateBookInfo(id);
                    messageBlock.classList.remove("w3-red");
                    messageBlock.classList.add("w3-green");
                } else {
                    messageBlock.classList.remove("w3-green");
                    messageBlock.classList.add("w3-red");
                }
                document.getElementById("give-book-form-message-p").textContent = response.message;
                messageBlock.style.display = "block";
            });
        }
    });
}

function returnBook(id) {
    restGetBook(id, (response) => {
        if (response.success) {
            let book = response.result;
            book.available = true;
            book.holder = null;
            restPutBook(book, (response) => {
                if (response.success) {
                    updateBookInfo(id);
                }
            });
        }
    });
}