import requests
import time
from sqlalchemy.orm import Session
from models.book import Book, book_genres
from models.genre import Genre  # Assuming you have a Genre model
from database import SessionLocal
from datetime import datetime

OPEN_LIBRARY_API = "https://openlibrary.org"

OPEN_LIBRARY_API = "https://openlibrary.org"

def fetch_bulk_books(limit=1000, max_retries=5):
    """
    Fetch a bulk list of books from Open Library with retries.
    """
    books = []
    page = 1

    while len(books) < limit:
        print(f"Fetching books from page {page}...")

        url = f"{OPEN_LIBRARY_API}/search.json?q=the&page={page}&limit=100"
        retries = 0

        while retries < max_retries:
            try:
                response = requests.get(url, timeout=20)  # Increased timeout
                response.raise_for_status()

                data = response.json()
                
                if "docs" not in data:
                    print(f"Unexpected API response: {data}")
                    return books

                docs = data.get("docs", [])
                if not docs:
                    print("No books found. Stopping.")
                    return books

                for doc in docs:
                    if "isbn" in doc:
                        books.append(doc["isbn"][0])  # Take the first ISBN

                    if len(books) >= limit:
                        return books

                page += 1
                time.sleep(2)  # Prevent rate-limiting
                break  # Exit retry loop if successful

            except requests.exceptions.ReadTimeout:
                retries += 1
                print(f"Timeout. Retrying {retries}/{max_retries}...")

            except requests.exceptions.RequestException as e:
                print(f"Error fetching books: {e}")
                return books  # Exit on other errors

    return books


def fetch_book_details(isbn):
    """
    Fetch book details from Google Books API based on ISBN.
    """
    try:
        response = requests.get(f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}")
        response.raise_for_status()
        
        items = response.json().get("items", [])
        if not items:
            return None
            
        data = items[0].get("volumeInfo", {})

        authors = data.get("authors", [])
        author_string = ", ".join(authors) if authors else "Unknown Author"

        published_date = data.get("publishedDate")
        pub_date = None
        if published_date:
            try:
                pub_date = datetime.strptime(published_date, "%Y-%m-%d").date()
            except ValueError:
                try:
                    pub_date = datetime.strptime(published_date, "%Y-%m").date()
                except ValueError:
                    try:
                        pub_date = datetime.strptime(published_date, "%Y").date()
                    except ValueError:
                        pass

        return {
            "title": data.get("title", "Unknown Title"),
            "author": author_string,
            "isbn": isbn,
            "publication_date": pub_date,
            "summary": data.get("description", ""),
            "cover_image_url": data.get("imageLinks", {}).get("thumbnail", ""),
            "genres": data.get("categories", [])  # Get genres/categories if available
        }

    except requests.RequestException as e:
        print(f"Error fetching book details for ISBN {isbn}: {e}")
        return None


def store_book_in_db(isbn, session):
    """
    Fetch book details using ISBN and store in the database.
    """
    try:
        book_data = fetch_book_details(isbn)
        if not book_data:
            print(f"No data found for ISBN {isbn}")
            return

        existing_book = session.query(Book).filter(Book.isbn == isbn).first()
        if existing_book:
            print(f"Book with ISBN {isbn} already exists. Skipping.")
            return

        book = Book(
            title=book_data["title"],
            author=book_data["author"],
            isbn=book_data["isbn"],
            publication_date=book_data["publication_date"],
            summary=book_data["summary"],
            cover_image_url=book_data["cover_image_url"]
        )

        for genre_name in book_data["genres"]:
            genre_name = genre_name.lower()
            genre = session.query(Genre).filter(Genre.name == genre_name).first()
            if not genre:
                genre = Genre(name=genre_name)
                session.add(genre)
            book.genres.append(genre)

        session.add(book)
        session.commit()
        print(f"Added book: {book_data['title']}")

    except Exception as e:
        session.rollback()
        print(f"Error storing book with ISBN {isbn}: {e}")


if __name__ == "__main__":
    session = SessionLocal()
    isbns = fetch_bulk_books(limit=1000)  # Fetch 1000 books

    for isbn in isbns:
        store_book_in_db(isbn, session)

    session.close()
    print("Completed fetching and storing books.")
