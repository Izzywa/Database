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
        
        with mysql.connector.connect(**config) as self.connection:
            self.execute_stored_procedure('stored_procedures.sql')
    
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
    
    def execute_stored_procedure(self, filename):
        fd = open(filename, 'r')
        sqlFile = fd.read()
        fd.close()
        sqlCommands = sqlFile.split('|')
        cursor = self.connection.cursor()

        for command in sqlCommands:
            try:
                if command.strip() != '':
                    cursor.execute(command)
            except IOError as msg:
                print("Command skipped: ", msg) 
        
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
            self.duplicates_testing(cursor, insert_country, (test_country['code'], test_country['name']), 'countries')
            
            # Test constraint for duplicate dial codes
            self.duplicates_testing(cursor, insert_dial, (test_country['dial_code'], test_country['code']), 'dial code')
    
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
            self.duplicates_testing(cursor, insert_ab_group, (test_abx['group'],), 'antibiotic group')
            
            cursor.execute(get_group_id, (test_abx['group'],))
            group_id = cursor.fetchone()[0]
            ab = (test_abx['ab'], test_abx['cid'], test_abx['name'], group_id)
            
            # Test constraint for duplicate ab
            self.duplicates_testing(cursor, insert_ab, ab, 'antibiotic')
        
            # Test constraint for duplicate abbreviations
            self.duplicates_testing(cursor, insert_abbr, (test_abx['ab'], test_abx['abbreviation']), 'abbreviation')
                
            # Test constraint for duplicate synonyms
            self.duplicates_testing(cursor, insert_syn, (test_abx['ab'], test_abx['synonym']), 'synonym')
                
            # Test constraint for duplicate dosage duplicates
            dosage = (test_abx['ab'],test_abx['dose_type'],test_abx['dose'],test_abx['dose_times'],test_abx['dose_administration'])    
            self.duplicates_testing(cursor, insert_dose, dosage, 'dosage')
    
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
            'dose_type': 'standard_dosage',
            'dose_administration': 'oral'
        }
        
        # query commands
        insert_pt = 'INSERT INTO patients \
            (full_name, email, dial_code_id, phone, birth_date,resident_country_code, birth_country_code)\
            VALUES (?,?,?,?,?,?,?);'
        insert_allergy = 'INSERT INTO allergies (patient_id, ab) VALUES (?,?);'
        insert_visit = 'INSERT INTO visits (patient_id, visit_date, note) VALUES (?,?,?);'
        insert_pres = 'INSERT INTO prescriptions (patient_id, prescription_date, dose_id) VALUES (?,?,?);'
        get_country = 'SELECT code FROM countries WHERE name = ?;'
        get_dial = 'SELECT id FROM dial_codes WHERE dial = ? AND country_code = ?;'
        get_dose = 'SELECT id FROM dosage WHERE ab = ? AND type= ? AND administration = ?;'
        
        
        with mysql.connector.connect(**config) as self.connection:
            cursor = self.connection.cursor(prepared=True)
            
            # insert into tables data from dataset files
            insert_countries_and_dial_codes(cursor, 'dataset_files/country-codes.csv')   
            insert_antibiotics(cursor, 'dataset_files/antibiotics.csv', 'dataset_files/dosage.csv')
            
            cursor.execute(get_country, (test_pt['country'],))
            country_code = cursor.fetchone()[0]
            cursor.execute(get_dial, (test_pt['dial_code'], country_code))
            dial = cursor.fetchone()[0]
            
            # test phone_dial_constraint
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
            # test phone_dial_constraint
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
                
            # test insertion of patient into the table
            cursor.execute(
                insert_pt,
                (test_pt['full_name'], None, None, None, test_pt['birth_date'], country_code, country_code)
            )
            pt_id = cursor.lastrowid
            
            # test insertion of allergies
            cursor.execute(
                insert_allergy,
                (pt_id, test_prescription['ab'])
            )
            # test constraint for duplicate allergies
            self.duplicates_testing(cursor, insert_allergy, (pt_id, test_prescription['ab']), 'allergies')
            
            # test insertion for visits
            cursor.execute(
                insert_visit,
                (pt_id, test_visit['visit_date'], test_visit['note'])
            )
            visit_id = cursor.lastrowid
            
            #test insertion for prescriptions
            cursor.execute(
                get_dose,
                (test_prescription['ab'],test_prescription['dose_type'],test_prescription['dose_administration'])
            )
            dose_id = cursor.fetchone()[0]
            cursor.execute(
                insert_pres,
                (pt_id, test_prescription['prescription_date'], dose_id)
            )
            pres_id = cursor.lastrowid
            cursor.execute('SELECT patient_id FROM prescriptions WHERE id = ?;', (pres_id,))
            test_pt_id = cursor.fetchone()[0]
            self.assertEqual(test_pt_id, pt_id)
            
            # test delete_pt_cascade TRIGGER
            cursor.execute('UPDATE patients SET deleted = 1 WHERE id = ?;', (pt_id,))
            cursor.execute('SELECT deleted FROM prescriptions WHERE id = ?;', (pres_id,))
            deleted_pres = cursor.fetchone()[0]
            cursor.execute('SELECT deleted FROM visits WHERE id = ?;', (visit_id,))
            deleted_visit = cursor.fetchone()[0]
            
            self.assertEqual(deleted_pres, 1, 'prescription not set as deleted when patient is deleted')
            self.assertEqual(deleted_visit, 1, 'visit not set as deleted when patient is deleted')
            
            # clear database
            self.execute_sql_script('drop.sql')
                
    def duplicates_testing(self, cursor, query, argument, table_name):
        try:
            cursor.execute(
                query,
                argument
            )
            self.fail(f'should not be able to insert duplicate {table_name}')
        except mysql.connector.Error as err:
            if err.errno == -1:
                pass
            else:
                raise
                    
if __name__ == '__main__':
    unittest.main()