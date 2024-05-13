import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
import { dirname } from "path";
import { fileURLToPath } from "url";
import env from "dotenv";

const app = express();
const port = 3000;
const API_URL = "https://covers.openlibrary.org/"
const __dirname = dirname(fileURLToPath(import.meta.url));
env.config();


const db = new pg.Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get("/", async (req, res) => {
    const result = await db.query(
        "SELECT * FROM Book ORDER BY rating, last_update DESC;"
    );

    const books = result.rows.map((book) => {
        let path = `${API_URL}b/isbn/${book.isbn}-L.jpg`;
        return {
            book_id: book.book_id,
            img: path,
            rating: book.rating,
            date: book.last_update,
            title: book.book_name,
            summary: book.summary,
            category: book.category
        };
    });
    res.render("index.ejs", { books: books });
});

app.get("/about", async (req, res) => {
    res.render("about.ejs");
});

app.get("/contact", async (req, res) => {
    res.render("contact.ejs");
});

app.get("/book/create", async (req, res) => {
    res.render("create_book.ejs");
});

app.get("/book/edit/:book_id", async (req, res) => {
    const book_id = parseInt(req.params.book_id);
    try {
        let result = await db.query("SELECT * FROM Book WHERE book_id = $1", [book_id]);
        let book = result.rows[0];
        console.log(book);
        res.render("edit_book.ejs", {
            book_id: book_id,
            title: book.book_name,
            isbn: book.isbn,
            category: book.category,
            rating: book.rating,
            summary: book.summary,
            finished: book.finished,
        });
    } catch (err) {
        console.error('Error executing query:', err.stack);
    }
});

app.get("/book/search/", async (req, res) => {
    const entry = req.query.entry;
    const searchPattern = `%${entry}%`;

    try {
        let result = await db.query(`
            SELECT * 
            FROM Book
            WHERE book_name ILIKE $1 OR isbn LIKE $1 ORDER BY rating, last_update DESC;
        `, [searchPattern]);
        const books = result.rows.map((book) => {
            let path = `${API_URL}b/isbn/${book.isbn}-L.jpg`;
            return {
                book_id: book.book_id,
                img: path,
                rating: book.rating,
                date: book.last_update,
                title: book.book_name,
                summary: book.summary,
                category: book.category
            };
        });
        res.render("index.ejs", { books: books });
    } catch (err) {
        console.error('Error executing query:', err.stack);
    }
})

app.post("/book/edit/:book_id", async (req, res) => {
    const book_id = req.params.book_id;
    const book = req.body;
    let finished = false;
    if (book.finished == "on") finished = true;
    try {
        let result = await db.query(`
        UPDATE Book 
        SET book_name = $1,
            isbn = $2,
            last_update = CURRENT_TIMESTAMP,
            category = $3,
            summary = $4,
            rating = $5,
            finished = $6
        WHERE book_id = $7;
        `, [book.title, book.isbn, book.category, book.summary, book.rating, book.finished, book_id]);
        res.redirect(`/notes/?book_id=${book_id}`);

    } catch (err) {
        console.error('Error executing query:', err.stack);
    }
});
app.post("/book/delete/:book_id", async (req, res) => {
    const book_id = req.params.book_id;

    try {
        let result = await db.query("DELETE FROM Book WHERE book_id = $1;", [book_id]);
        res.redirect("/");
    } catch (err) {
        console.error('Error executing query:', err.stack);
    }
})

app.post("/book/create", async (req, res) => {
    const book = req.body;
    let finished = false;
    if (book.finished == "on") finished = true;
    try {
        let result = await db.query(
            "INSERT INTO Book (book_name, isbn, category, summary, rating, finished) VALUES ($1, $2, $3, $4, $5, $6) RETURNING book_id",
            [book.title, book.isbn, book.category, book.summary, book.rating, finished]
        );
        let book_id = result.rows[0].book_id;
        console.log(result.rows);
        res.redirect(`/notes/?book_id=${book_id}`);
    } catch (err) {
        console.error('Error executing query:', err.stack);
    }
})

app.get("/notes", async (req, res) => {
    const book_id = req.query["book_id"]
    try {
        let result = await db.query(`
        SELECT *
        FROM Note
        WHERE Note.book_id = $1
        ORDER BY created_at DESC;
        `, [book_id]);
        let notes = result.rows;
        result = await db.query(`
            SELECT *
            FROM Book
            WHERE Book.book_id = $1;
        `, [book_id]);
        let book = result.rows[0];
        res.render("book_notes.ejs", {
            book: {
                book_id: book.book_id,
                img: `${API_URL}b/isbn/${book.isbn}-L.jpg`,
                rating: book.rating,
                date: book.last_update,
                title: book.book_name,
                summary: book.summary,
                category: book.category
            },
            notes: notes,
        });
    } catch (err) {
        console.log(err);
    }
});

app.post("/note/:book_id", async (req, res) => {
    const book_id = parseInt(req.params.book_id);
    const note = req.body.note;
    // console.log(note);
    try {
        let result = await db.query(`
        INSERT INTO Note (book_id, note)
        VALUES ($1, $2);
        `, [book_id, note]);
        await db.query("UPDATE Book SET last_update = CURRENT_TIMESTAMP WHERE book_id = $1;", [book_id]);
        res.redirect(`/notes/?book_id=${book_id}`);
    } catch (err) {
        console.error('Error executing query:', err.stack);
    }
});

app.post("/note/delete/:note_id", async (req, res) => {
    const note_id = parseInt(req.params.note_id);
    try {
        let result = await db.query("DELETE FROM Note WHERE Note.note_id = $1 RETURNING Note.book_id", [note_id]);
        let book_id = result.rows[0].book_id;
        res.redirect(`/notes/?book_id=${book_id}`);
    } catch (err) {
        console.error('Error executing query:', err.stack);
    }
});

app.post("/note/edit/:note_id", async (req, res) => {
    const note_id = parseInt(req.params.note_id);
    const note = req.body.note;
    console.log(note_id);
    console.log(note);
    try {
        let result = await db.query("UPDATE Note SET note = $1 WHERE note_id = $2 RETURNING book_id", [note, note_id]);
        let book_id = result.rows[0].book_id;
        await db.query("UPDATE Book SET last_update = CURRENT_TIMESTAMP WHERE book_id = $1;", [book_id]);
        res.redirect(`/notes/?book_id=${book_id}`);
    } catch (err) {
        console.error('Error executing query:', err.stack);
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});