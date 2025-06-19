from . import database, models


def seed():
    db = database.SessionLocal()
    try:
        # Tags
        prod_tag = models.Tag(name="production")
        nonprod_tag = models.Tag(name="non-production")
        db.add_all([prod_tag, nonprod_tag])
        db.commit()
        # Applications
        apps = [
            models.Application(
                name="Google",
                url="https://www.google.com",
                is_production=True,
                tags=[prod_tag],
            ),
            models.Application(
                name="GitHub",
                url="https://www.github.com",
                is_production=True,
                tags=[prod_tag],
            ),
            models.Application(
                name="Wikipedia",
                url="https://www.wikipedia.org",
                is_production=False,
                tags=[nonprod_tag],
            ),
        ]
        db.add_all(apps)
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed() 