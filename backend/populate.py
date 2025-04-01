from database import SessionLocal
from models.users_test import UserTest

def clear_test_users(session):
    """
    Clear existing test users
    """
    try:
        session.execute('TRUNCATE TABLE users_test CASCADE')
        session.commit()
        print("Cleared existing test users")
    except Exception as e:
        session.rollback()
        print(f"Error clearing test users: {str(e)}")

def add_test_users(session):
    """
    Add dummy test users to the database
    """
    try:
        # Create test users data
        test_users = [
            {
                "clerk_user_id": "clerk_test_001",
                "username": "john_doe",
                "email": "john@test.com"
            },
            {
                "clerk_user_id": "clerk_test_002",
                "username": "jane_smith",
                "email": "jane@test.com"
            },
            {
                "clerk_user_id": "clerk_test_003",
                "username": "bob_wilson",
                "email": "bob@test.com"
            },
            {
                "clerk_user_id": "clerk_test_004",
                "username": "alice_johnson",
                "email": "alice@test.com"
            },
            {
                "clerk_user_id": "clerk_test_005",
                "username": "charlie_brown",
                "email": "charlie@test.com"
            }
        ]

        # Add users to database
        for user_data in test_users:
            user = UserTest(**user_data)
            session.add(user)
            print(f"Added test user: {user.username}")

        session.commit()
        print("Successfully added all test users!")

    except Exception as e:
        session.rollback()
        print(f"Error adding test users: {str(e)}")
        raise

def main():
    """
    Main function to run the population script
    """
    session = SessionLocal()
    try:
        print("Starting test user population...")
        clear_test_users(session)  # Clear existing users first
        add_test_users(session)
        print("\nCompleted adding test users.")
    except Exception as e:
        print(f"An error occurred: {str(e)}")
    finally:
        session.close()

if __name__ == "__main__":
    main()
