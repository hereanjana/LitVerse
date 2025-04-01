from database import SessionLocal
from models.users_test import UserTest
from models.books_test import BookTest
from sqlalchemy.exc import IntegrityError

def populate_test_data():
    db = SessionLocal()
    try:
        # Create test users
        test_users = [
            UserTest(
                clerk_user_id="clerk_123",
                username="john_doe",
                email="john@example.com"
            ),
            UserTest(
                clerk_user_id="clerk_456",
                username="jane_smith",
                email="jane@example.com"
            ),
            UserTest(
                clerk_user_id="clerk_789",
                username="bob_wilson",
                email="bob@example.com"
            )
        ]
        
        # Add users to database
        for user in test_users:
            try:
                db.add(user)
                db.flush()
                print(f"Added user: {user.username}")
            except IntegrityError:
                db.rollback()
                print(f"User {user.username} already exists, skipping...")
                continue

        # Create test books
        test_books = [
            BookTest(
                title="The Great Adventure",
                description="An exciting journey through unknown lands",
                isbn="9781234567890",
                cover_id=101,
                first_publish_year=2020,
                open_library_key="OL1234567M"
            ),
            BookTest(
                title="Mystery at Midnight",
                description="A thrilling detective story",
                isbn="9789876543210",
                cover_id=102,
                first_publish_year=2021,
                open_library_key="OL7654321M"
            ),
            BookTest(
                title="The Science of Everything",
                description="A comprehensive guide to modern science",
                isbn="9784567891230",
                cover_id=103,
                first_publish_year=2022,
                open_library_key="OL9876543M"
            )
        ]

        # Add books to database
        for book in test_books:
            try:
                db.add(book)
                db.flush()
                print(f"Added book: {book.title}")
            except IntegrityError:
                db.rollback()
                print(f"Book {book.title} already exists, skipping...")
                continue

        # Create some associations between users and books
        # John likes first two books
        test_users[0].selected_books.extend(test_books[0:2])
        
        # Jane likes last two books
        test_users[1].selected_books.extend(test_books[1:3])
        
        # Bob likes all books
        test_users[2].selected_books.extend(test_books)

        # Commit all changes
        db.commit()
        print("\nSuccessfully added test data!")

        # Verify the data
        print("\nVerifying data:")
        for user in db.query(UserTest).all():
            print(f"\nUser: {user.username}")
            print("Selected books:", [book.title for book in user.selected_books])

    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    populate_test_data() 