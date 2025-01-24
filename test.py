import unittest
import mysql.connector
import environ
import os
import pandas as pd
import re
from pathlib import Path
from django.db import transaction
from dataset_files.country_codes_to_table import insert_countries_and_dial_codes

env = environ.Env(
    DEBUG=(bool, False)
)
BASE_DIR = Path(__file__).resolve().parent

environ.Env.read_env(os.path.join(BASE_DIR, 'database/.env'))

config = {
    'user' : env('DB_USER'),
    'password' : env('DB_PASSWORD'),
    'database' : "test_db",
    'host': env('DB_HOST')
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
        test_country = {
            'name': 'Malaysia',
            'code': 'MYS',
            'dial_code': 60
        }
        insert_country = 'INSERT INTO countries (code, name) VALUES (?,?);'
        insert_dial = 'INSERT INTO dial_codes (dial, country_code) VALUES (?,?);'
        with mysql.connector.connect(**config) as self.connection:
            cursor = self.connection.cursor(prepared=True)
            insert_countries_and_dial_codes(cursor, 'dataset_files/country-codes.csv')            
            
            cursor.execute('SELECT name FROM countries WHERE code = ?;', (test_country['code'],))
            country = cursor.fetchone()[0]
            cursor.execute('SELECT dial FROM dial_codes WHERE country_code = ?;', (test_country['code'],))
            dial = cursor.fetchone()[0]
            
            try:
                with transaction.atomic():
                    cursor.execute(insert_country, (test_country['code'], test_country['name']))
                    self.fail('should not be allowed to insert duplicate countries')
            except:
                pass
            
            try:
                with transaction.atomic():
                    cursor.execute(insert_dial, (test_country['dial_code'], test_country['code']))
                    self.fail('should not be allowed to insert duplicate dial code and country')
            except:
                pass
    
        self.assertEqual(test_country['name'], country)
        self.assertEqual(test_country['dial_code'], dial)
        
        def test_antibiotics(self):
            pass
        
        
if __name__ == '__main__':
    unittest.main()