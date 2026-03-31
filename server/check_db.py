from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.user import User
from app.models.content import ContentItem

def check_data():
    db = SessionLocal()
    try:
        # Check User
        user = db.query(User).filter(User.email == "admin@reeftotem.ai").first()
        if user:
            print(f"User found: {user.email}")
            print(f" - Role: {user.role}")
            print(f" - Active: {user.is_active}")
        else:
            print("User NOT found!")

        # Check Features
        features = db.query(ContentItem).filter(ContentItem.type == "feature").all()
        print(f"Features count: {len(features)}")
        for f in features:
            print(f" - {f.title} (Active: {f.is_active})")
            
    finally:
        db.close()

if __name__ == "__main__":
    check_data()
