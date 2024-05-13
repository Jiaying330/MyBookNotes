-- DDL 
CREATE TABLE Book (
	book_id SERIAL PRIMARY KEY,
	book_name TEXT NOT NULL,
	isbn CHAR(13) NOT NULL,
	last_update DATE NOT NULL DEFAULT CURRENT_DATE,
	category VARCHAR(20),
	summary TEXT,
	rating SMALLINT,
	finished BOOLEAN
);

CREATE TABLE Note (
	note_id SERIAL PRIMARY KEY,
	book_id INT,
	note TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (book_id) REFERENCES Book(book_id)
);

