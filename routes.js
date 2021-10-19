const express = require("express");
const router = express.Router();
const storage = require("./storage");

function createBook(name, author, description, releaseDate) {
    return {
        "id": generateBookId(),
        "name": name,
        "author": author,
        "description": description,
        "releaseDate": releaseDate,
        "available": true,
        "holder": null
    };
}

function getBookIds() {
    let ids = new Array(storage.books.length);
    for (let i = 0; i < storage.books.length; ++i) {
        ids[i] = storage.books[i].id;
    }
    return ids;
}

function generateBookId() {
    let id = 1;
    while (getBookIds().includes(id)) {
        ++id;
    }
    return id;
}

function getBook(id) {
    let books = storage.books.filter((book) => {
        return book.id.toString() === id;
    });

    if (books.length > 0) {
        return books[0];
    }
    return null;
}

router.get("/books/", (request, response) => {
    response.json({"success": true, "result": storage.books});
});

router.get("/books/:bookId([0-9]{1,})", (request, response) => {
    let book = getBook(request.params.bookId);
    response.json({"success": book !== null, "result": book});
});

router.get("/books/:bookId([0-9]{1,})/card", (request, response) => {
    let book = getBook(request.params.bookId);

    if (book) {
        response.render("book", {
            book: book
        });
    } else {
        response.status(404);
        response.render("not-found");
    }
});

router.get("/", (request, response) => {
    response.render("index", {
        books: storage.books
    });
});

router.get("/*", (request, response) => {
    response.status(404);
    response.render("not-found");
});

router.post("/books/", (request, response) => {
    let body = request.body;

    if (!body || !body.name || !body.author || !body.releaseDate || !body.description) {
        response.json({"success": false, "message": "Ошибка добавления новой книги!"});
    } else {
        storage.books.push(createBook(body.name, body.author, body.description, body.releaseDate))
        response.json({"success": true, "message": "Книга успешно добавлена!"});
    }
});

router.put("/books/", (request, response) => {
    let body = request.body;

    if (body && body.id) {
        let book = getBook(body.id.toString());

        if (book) {
            book.name = body.name;
            book.author = body.author;
            book.releaseDate = body.releaseDate;
            book.description = body.description;
            book.available = body.available;
            book.holder = body.holder;

            response.json({"success": true, "message": "Книга успешно изменена!"});
            return;
        }
    }

    if (body && body.name && body.author && body.releaseDate && body.description) {
        storage.books.push(createBook(body.name, body.author, body.description, body.releaseDate));
        response.json({"success": true, "message": "Книга успешно добавлена!"});
        return;
    }

    response.json({"success": false, "message": "Ошибка при добавлении или изменении книги!"});
});

router.delete("/books/:bookId([0-9]{1,})", (request, response) => {
    const bookId = request.params.bookId;
    let index = -1;

    for (let i = 0; i < storage.books.length; ++i) {
        if (storage.books[i].id.toString() === bookId) {
            index = i;
            break;
        }
    }

    if (index === -1) {
        response.json({"success": false});
    } else {
        storage.books.splice(index, 1);
        response.json({"success": true});
    }
});


module.exports = router;