import unittest
import mysql.connector
import environ
import os
import re
from pathlib import Path
from datetime import date
from dataset_files.country_codes_to_table import insert_countries_and_dial_codes
from dataset_files.csv_to_table import insert_antibiotics

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
        # sample testing data 
        test_country = {
            'name': 'Malaysia',
            'code': 'MYS',
            'dial_code': 60
        }
        
        # query commands
        insert_country = 'INSERT INTO countries (code, name) VALUES (?,?);'
        insert_dial = 'INSERT INTO dial_codes (dial, country_code) VALUES (?,?);'
        
        # establish connection
        with mysql.connector.connect(**config) as self.connection:
            cursor = self.connection.cursor(prepared=True)
            # insert data from dataset files
            insert_countries_and_dial_codes(cursor, 'dataset_files/country-codes.csv')            
            
            cursor.execute('SELECT name FROM countries WHERE code = ?;', (test_country['code'],))
            country = cursor.fetchone()[0]
            cursor.execute('SELECT dial FROM dial_codes WHERE country_code = ?;', (test_country['code'],))
            dial = cursor.fetchone()[0]
            
            # Test constraint for duplicate countries
            try:
                cursor.execute(insert_country, (test_country['code'], test_country['name']))
                self.fail('should not be allowed to insert duplicate countries')
            except mysql.connector.Error as err:
                if err.errno == -1:
                    pass
                else:
                    raise
            
            # Test constraint for duplicate dial codes
            try:
                cursor.execute(insert_dial, (test_country['dial_code'], test_country['code']))
                self.fail('should not be allowed to insert duplicate dial code and country')
            except mysql.connector.Error as err:
                if err.errno == -1:
                    pass
                else:
                    raise
    
        # Test the data that was input
        self.assertEqual(test_country['name'], country)
        self.assertEqual(test_country['dial_code'], dial)
        
    def test_antibiotics(self):
        # sample testing data
        test_abx = {
            'ab': 'AMX',
            'cid': 33613,
            'name': 'Amoxicillin',
            'group': 'Beta-lactams/penicillins',
            'abbreviation': 'amox',
            'synonym': 'actimoxi',
            'dose_type': 'standard_dosage',
            'dose': '0.5 g',
            'dose_times': 3,
            'dose_administration': 'oral'
        }
        
        # query commands
        get_group_id = 'SELECT id FROM antibiotic_groups WHERE name = ?;'
        insert_ab_group = 'INSERT INTO antibiotic_groups (name) VALUES (?);'
        insert_ab = 'INSERT INTO antibiotics (ab, cid, name, group_id) VALUES(?,?,?,?);'
        insert_abbr = 'INSERT INTO abbreviations (ab, abbreviation) VALUES(?,?);'
        insert_syn = 'INSERT INTO synonyms (ab, synonym) VALUES (?,?);'
        insert_dose = 'INSERT INTO dosage (ab, type, dose, dose_times, administration) VALUES (?,?,?,?,?);'
        
        with mysql.connector.connect(**config) as self.connection:
            cursor = self.connection.cursor(prepared=True)
            # insert into table data from dataset files
            insert_antibiotics(cursor, 'dataset_files/antibiotics.csv', 'dataset_files/dosage.csv')
            
            # Test constraint for duplicate ab group
            try:
                cursor.execute(insert_ab_group, (test_abx['group'],))
                self.fail('should not be able to insert duplicate antibiotic group')
            except mysql.connector.Error as err:
                if err.errno == -1:
                    pass
                else:
                    raise
            
            cursor.execute(get_group_id, (test_abx['group'],))
            group_id = cursor.fetchone()[0]
            ab = (test_abx['ab'], test_abx['cid'], test_abx['name'], group_id)
            
            # Test constraint for duplicate ab
            try:
                cursor.execute(insert_ab, ab)
                self.fail('should not be able to insert duplicate antibiotics')
            except mysql.connector.Error as err:
                if err.errno == -1:
                    pass
                else:
                    raise
        
            # Test constraint for duplicate abbreviations
            try:
                cursor.execute(insert_abbr, (test_abx['ab'],test_abx['abbreviation']))
                self.fail('should not be able to insert duplicate abbreviation')
            except mysql.connector.Error as err:
                if err.errno == -1:
                    pass
                else:
                    raise
                
            # Test constraint for duplicate synonyms
            try:
                cursor.execute(insert_syn, (test_abx['ab'],test_abx['synonym']))
                self.fail('should not be able to insert duplicate synonyms')
            except mysql.connector.Error as err:
                if err.errno == -1:
                    pass
                else:
                    raise
                
            # Test constraint for duplicate dosage
            dosage = (test_abx['ab'],test_abx['dose_type'],test_abx['dose'],test_abx['dose_times'],test_abx['dose_administration'])    
            try:
                cursor.execute(insert_dose, dosage)
                self.fail('should not be able to insert duplicate dosage')
            except mysql.connector.Error as err:
                if err.errno == -1:
                    pass
                else:
                    raise
    
    def test_patients(self):
        # sample testing data
        test_pt = {
            'full_name': 'foo',
            'email': 'foo@example.com',
            'dial_code': 60,
            'phone': '0123456789',
            'birth_date': '2025-01-01',
            'country': 'Malaysia'
        }
        test_visit = {
            'visit_date' : date.today(),
            'note' : 'visit note'
        }
        test_prescription = {
            'prescription_date': date.today(),
            'ab': 'AMX',
            'dose_type': 'standard_dossage',
            'dose_administration': 'oral'
        }
        
        # query commands
        insert_pt = 'INSERT INTO patients \
            (full_name, email, dial_code_id, phone, birth_date,resident_country_code, birth_country_code)\
            VALUES (?,?,?,?,?,?,?);'
        get_country = 'SELECT code FROM countries WHERE name = ?;'
        get_dial = 'SELECT id FROM dial_codes WHERE dial = ? AND country_code = ?;'
        
        
        with mysql.connector.connect(**config) as self.connection:
            cursor = self.connection.cursor(prepared=True)
            
            # insert into tables data from dataset files
            insert_countries_and_dial_codes(cursor, 'dataset_files/country-codes.csv')   
            insert_antibiotics(cursor, 'dataset_files/antibiotics.csv', 'dataset_files/dosage.csv')
            
            cursor.execute(get_country, (test_pt['country'],))
            country_code = cursor.fetchone()[0]
            cursor.execute(get_dial, (test_pt['dial_code'], country_code))
            dial = cursor.fetchone()[0]
            
            try:
                cursor.execute(
                    insert_pt,
                    (test_pt['full_name'], None, None, test_pt['phone'], test_pt['birth_date'], country_code,country_code)
                )
                self.fail('phone_dial_constraint on the table should not allow inserting phone number without a dial code')
            except mysql.connector.Error as err:
                if err.errno == -1:
                    pass
                else:
                    raise
            
            try:
                cursor.execute(
                    insert_pt,
                    (test_pt['full_name'], None, dial, None, test_pt['birth_date'], country_code,country_code)
                )
                self.fail('phone_dial_constraint on the table should not allow inserting dial code without a phone')
            except mysql.connector.Error as err:
                if err.errno == -1:
                    pass
                else:
                    raise
                
            cursor.execute(
                insert_pt,
                (test_pt['full_name'], None, None, None, test_pt['birth_date'], country_code, country_code)
            )
            pt_id = cursor.lastrowid
            
            # clear database
            self.execute_sql_script('drop.sql')
                
                    
                    
if __name__ == '__main__':
    unittest.main()