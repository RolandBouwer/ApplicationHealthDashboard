import os
import re
import psycopg2
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from urllib.parse import quote_plus  # new import

# Load environment variables from .env if present
load_dotenv()

# Try to get connection string from environment
CONN_STR = os.getenv('DATABASE_CONNECTION_STRING')

if CONN_STR:
    # Parse connection string like:
    # Host=localhost;Port=5432;Database=dotnetHero;Username=admin;Password=secret;
    pattern = (
        r"Host=(.*?);"
        r"Port=(.*?);"
        r"Database=(.*?);"
        r"Username=(.*?);"
        r"Password=(.*?);"
    )
    match = re.match(pattern, CONN_STR)
    if match:
        (
            POSTGRES_HOST,
            POSTGRES_PORT,
            POSTGRES_DB,
            POSTGRES_USER,
            POSTGRES_PASSWORD,
        ) = match.groups()
    else:
        raise ValueError("Invalid DATABASE_CONNECTION_STRING format.")
else:
    POSTGRES_USER = os.getenv('POSTGRES_USER', 'postgres')
    POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD', 'postgres')
    POSTGRES_DB = os.getenv('POSTGRES_DB', 'app_health')
    POSTGRES_HOST = os.getenv('POSTGRES_HOST', 'localhost')
    POSTGRES_PORT = os.getenv('POSTGRES_PORT', '5432')

# URL encode username and password
POSTGRES_USER_ENC = quote_plus(POSTGRES_USER)
POSTGRES_PASSWORD_ENC = quote_plus(POSTGRES_PASSWORD)

SQLALCHEMY_DATABASE_URL = (
    f"postgresql://{POSTGRES_USER_ENC}:{POSTGRES_PASSWORD_ENC}"
    f"@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ...existing code...