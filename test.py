import unittest
import mysql.connector
import environ
import os
import re
from pathlib import Path
from dataset_files.country_codes_to_table import insert_countries_and_dial_codes

env = environ.Env(
    DEBUG=(bool, False)
)
BASE_DIR = Path(__file__).resolve().parent

environ.Env.read_env(os.path.join(BASE_DIR, 'database/.env'))

class TestMySQL(unittest.TestCase):
    def setUp(self):
        # connect to mysql database
        self.connection = mysql.connector.connect (
            user = env('DB_USER'),
            password = env('DB_PASSWORD'),
            database = "test_db",
        )
        
        # Initialise database for testing
        self.execute_sql_script('schema.sql')
        cursor = self.connection.cursor()
        
    def test_country_codes(self):
        # insert into countries and dial_codes
        cursor = self.connection.cursor()
        cursor.execute('INSERT INTO countries (code, name) VALUES ("MYS", "Malaysia");')
        cursor.execute('SELECT name FROM countries WHERE code = "MYS";')
        country = cursor.fetchone()[0]
        cursor.close()
        
        self.assertEqual('Malaysia', country)
    
    def test_antibiotics(self):
        pass
        
    
    def execute_sql_script(self, file_path):
        f = open(file_path, mode='r')
        statements = [sql for sql in re.split(';\\n', f.read(), re.M)]
        f.close()
        cursor = self.connection.cursor()
        for statement in statements:
            # Remove comments
            statement = re.sub('--.*$', '', statement, 0, re.M)
        cursor.close()
        
        
if __name__ == '__main__':
    unittest.main()