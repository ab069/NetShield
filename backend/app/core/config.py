from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "NetShield API"
    VERSION: str = "1.0.0"
    DATABASE_URL: str = "postgresql+psycopg2://netshield:netshield@localhost:5432/netshield"
    SECRET_KEY: str = "netshield-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = ".env"


settings = Settings()
