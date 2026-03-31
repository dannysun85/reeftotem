from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.crud.user import get_user_by_email
from app.core.security import get_password_hash
from app.models.user import User

def reset_admin_password():
    db = SessionLocal()
    try:
        email = "admin@reeftotem.ai"
        # Manual query since get_user_by_email exists
        user = db.query(User).filter(User.email == email).first()
        if user:
            print(f"User found: {user.email}")
            # Force update password
            new_password = "adminpassword"
            hashed_password = get_password_hash(new_password)
            
            # Direct update to ensure it works
            user.hashed_password = hashed_password
            user.is_active = True
            db.add(user)
            db.commit()
            print(f"Password reset successfully for {email}")
        else:
            print(f"User {email} not found!")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    reset_admin_password()
