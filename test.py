import unittest
import mysql.connector
import environ
import os
import re
from pathlib import Path

env = environ.Env(
    DEBUG=(bool, False)
)
BASE_DIR = Path(__file__).resolve().parent

environ.Env.read_env(os.path.join(BASE_DIR, 'database/.env'))

config = {
    'user' : env('DB_USER'),
    'password' : env('DB_PASSWORD'),
    'database' : "test_db",
}

class TestMySQL(unittest.TestCase):
    def setUp(self):
        # connect to mysql database
        with mysql.connector.connect(**config) as self.connection:
        
            # Initialise database for testing
            self.execute_sql_script('schema.sql')
    
    def execute_sql_script(self, file_path):
        f = open(file_path, mode='r')
        statements = [sql for sql in re.split(';\\n', f.read(), re.M)]
        f.close()
        cursor = self.connection.cursor()
        for statement in statements:
            # Remove comments
            statement = re.sub('--.*$', '', statement, 0, re.M)
                # Execute non-empty command
            cursor.execute(statement)
        cursor.close()
    
    def test_country_codes(self):
    # insert into countries and dial_codes
        with mysql.connector.connect(**config) as self.connection:
            cursor = self.connection.cursor()
            cursor.execute('INSERT INTO countries (code, name) VALUES ("MYS", "Malaysia");')
            cursor.execute('SELECT name FROM countries WHERE code = "MYS";')
            country = cursor.fetchone()[0]
    
        self.assertEqual('Malaysia', country)
        
        
if __name__ == '__main__':
    unittest.main()