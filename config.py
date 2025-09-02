from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file

class Config:
    HF_API_TOKEN = os.environ.get('HF_API_TOKEN')import os

class Config:
    HF_API_TOKEN = os.environ.get('HF_API_TOKEN', 'your_default_token_here')
