import unittest
import mysql.connector
import environ
import os
from pathlib import Path

env = environ.Env(
    DEBUG=(bool, False)
)
BASE_DIR = Path(__file__).resolve().parent.parent

environ.Env.read_env(os.path.join(BASE_DIR, 'database/.env'))

class TestMySQL(unittest.TestCase):
    def setUp(self):
        self.connection = mysql.connector.connect (
            host = env('DB_HOST'),
            user = env('DB_USER'),
            password = env('DB_PASSWORD'),
            database = env('DB_NAME'),
        )