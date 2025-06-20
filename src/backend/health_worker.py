import requests
import certifi
from apscheduler.schedulers.background import BackgroundScheduler
from . import crud, database
import time
import traceback  # Add for better exception logging

CHECK_INTERVAL = 60  # seconds


def check_health():
    db = database.SessionLocal()
    try:
        apps = crud.get_applications(db)
        for app in apps:
            try:
                start = time.time()
                response = requests.get(app.url, verify=certifi.where(), timeout=10)
                elapsed = time.time() - start
                if response.status_code in [200, 201]:
                    status = 'up'
                else:
                    status = 'down'
            except Exception as e:
                status = 'down'
                elapsed = None
                print(f"Exception checking {app.url}: {e}")
                traceback.print_exc()
            crud.add_health_check(db, app.id, status, elapsed)
    finally:
        db.close()


def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(check_health, 'interval', seconds=CHECK_INTERVAL)
    scheduler.start()