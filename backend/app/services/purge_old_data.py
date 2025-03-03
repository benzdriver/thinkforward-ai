from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import UserProfile

def purge_old_data():
    db = SessionLocal()
    one_month_ago = datetime.utcnow() - timedelta(days=30)
    # Find all unpaid profiles older than one month
    profiles = db.query(UserProfile).filter(
        UserProfile.is_subscribed == False,
        UserProfile.subscription_updated_at < one_month_ago
    )
    for profile in profiles:
        profile.basic_ground = {}  # Purge or anonymize the basic_ground data
    db.commit()
    db.close()

scheduler = BackgroundScheduler()
scheduler.add_job(purge_old_data, 'interval', days=1)
scheduler.start()
