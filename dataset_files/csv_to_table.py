'''
This file will take only the required information about the antibiotics from 
the available dataset and insert into the database
'''
import environ
import math
import mysql.connector
import os
import pandas as pd
from pathlib import Path

env = environ.Env(
    DEBUG=(bool, False)
)

BASE_DIR = Path(__file__).resolve().parent.parent

environ.Env.read_env(os.path.join(BASE_DIR, 'database/.env'))

mydb = mysql.connector.connect(
    host = env('DB_HOST'),
    user = env('DB_USER'),
    password = env('DB_PASSWORD'),
    database = env('DB_DB'),
)
m = mydb.cursor(prepared=True)

abx = pd.read_csv('antibiotics.csv')
abx_columns_to_keep = [
    'NA',
    'cid',
    'name',
    'group',
    'abbreviations',
    'synonyms'
]

# drop the columns that will not be stored in the database
abx.drop(
    columns=[col for col in abx if col not in abx_columns_to_keep], 
    inplace=True
    )
# convert the synonyms and abbreviations into list
abx['synonyms'] = abx.synonyms.apply(lambda x: x.split(',') if isinstance(x, str) else x)
abx['abbreviations'] = abx.abbreviations.apply(lambda x: x.split(',') if isinstance(x, str) else x)

ab_groups = abx['group'].dropna().unique()

dosage = pd.read_csv('dosage.csv')
dosage_columns_to_keep = [
    'ab',
    'type',
    'dose',
    'dose_times',
    'administration'
]
dosage.drop(
    columns=[col for col in dosage if col not in dosage_columns_to_keep],
    inplace=True
    )
dosage.drop_duplicates(inplace=True)

insert_ab_group = 'INSERT INTO antibiotic_groups (name) VALUES (?);'
get_group_id = 'SELECT id FROM antibiotic_groups WHERE name = ? LIMIT 1;'
insert_ab = 'INSERT INTO antibiotics (ab, cid, name, group_id) VALUES(?,?,?,?);'
insert_abbr = 'INSERT INTO abbreviations (ab, abbreviation) VALUES(?,?);'
insert_syn = 'INSERT INTO synonyms (ab, synonym) VALUES (?,?);'
insert_dose = 'INSERT INTO dosage (ab, type, dose, dose_times, administration) VALUES (?,?,?,?,?);'

# insert antibiotic groups
for ab in ab_groups:
    try:
        m.execute(insert_ab_group, (ab,))
    except Exception as e:
        print(e)

for index, row in abx.iterrows():
    ab = row['NA']
    cid = row['cid']
    name = row['name']
    group = row['group']
    
    if type(group) == str:
        m.execute(get_group_id, (group,))
        group_id = m.fetchone()[0]
    else:
        group_id = None
    
    if math.isnan(cid):
        cid = None
    
    # insert the antibiotics into the table
    antibiotic = (ab,cid, name, group_id)
    try:
        m.execute(insert_ab, antibiotic)
    except Exception as e:
        print(e)
    
    # insert the abbreviations
    try:
        for abr in row['abbreviations']:
            m.execute(insert_abbr, (ab, abr))
    except:
        pass
    # insert the synonyms
    try:
        for syn in row['synonyms']:
            m.execute(insert_syn,(ab, syn))
    except:
        pass
    
# insert dosage
for index, row in dosage.iterrows():
    ab = row['ab']
    type =row['type']
    dose = row['dose']
    dose_times = row['dose_times']
    administration = row['administration']
    if math.isnan(dose_times):
        dose_times = None
        
    if not isinstance(administration, str):
        administration = None
    
    doses = (ab, type, dose, dose_times, administration)
    try:
        m.execute(insert_dose, (doses))
    except Exception as e:
        print(e)
        
mydb.commit()
mydb.close()