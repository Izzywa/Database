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

microorg = pd.read_csv('microorganisms.csv')
microorg_columns_to_keep = [
    'NA',
    'fullname',
    'kingdom',
    'oxygen_tolerance'
]
microorg.drop(
    columns=[col for col in microorg if col not in microorg_columns_to_keep],
    inplace=True
)

resistance = pd.read_csv('intrinsic_resistant.csv')

ab_groups = abx['group'].dropna().unique()

insert_ab_group = 'INSERT INTO antibiotic_groups (name) VALUES (?);'
get_group_id = 'SELECT id FROM antibiotic_groups WHERE name = ? LIMIT 1;'
insert_ab = 'INSERT INTO antibiotics (ab, cid, name, group_id) VALUES(?,?,?,?);'
insert_abbr = 'INSERT INTO abbreviations (ab, abbreviation) VALUES(?,?);'
insert_syn = 'INSERT INTO synonyms (ab, synonym) VALUES (?,?);'
insert_mo = 'INSERT INTO microorganisms (mo, fullname, kingdom, oxygen_tolerance) VALUES (?,?,?,?);'
insert_res = 'INSERT INTO intrinsic_resistance (mo, ab) VALUES (?,?);'
get_mo = 'SELECT mo FROM microorganisms WHERE fullname = ? LIMIT 1;'
get_ab = 'SELECT ab FROM antibiotics WHERE name = ? LIMIT 1;'

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

# insert microorganisms
for index, row in microorg.iterrows():
    mo = row['NA']
    fullname = row['fullname']
    kingdom = row['kingdom']
    oxygen_tolerance = row['oxygen_tolerance']
    if type(oxygen_tolerance) != str:
        oxygen_tolerance = None
    
    microorganism = (mo, fullname, kingdom, oxygen_tolerance)
    try:
        m.execute(insert_mo, microorganism)
    except Exception as e:
        print(e)
        
# insert instrinsic resistance 
for index, row in resistance.iterrows():
    mo_fullname = row['microorganism']
    ab_name = row['antibiotic']
    m.execute(get_mo, (mo_fullname,))
    mo = m.fetchone()[0]
    m.execute(get_ab, (ab_name,))
    ab = m.fetchone()[0]
    
    try:
        m.execute(insert_res, (mo, ab))
    except Exception as e:
        print(e)
mydb.close()