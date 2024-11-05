-- Creating basic table of books --
CREATE TABLE books (
	isbn CHAR(13) PRIMARY KEY UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
	date_read date NOT NULL,
	rating INT NOT NULL,
	about TEXT,
	notes TEXT	
)
