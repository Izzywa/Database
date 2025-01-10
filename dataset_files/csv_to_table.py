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
    password = env('DB_PASSWORD')
)


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

dosage = pd.read_csv('dosage.csv')
dosage_columns_to_keep = [
    'ab',
    'type',
    'dose',
    'dose_times'
]
dosage.drop(
    columns=[col for col in dosage if col not in dosage_columns_to_keep],
    inplace=True
    )

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

count = 0
for index, row in abx.iterrows():
    try:
        for x in row['synonyms']:
            if len(x) > count:
                count = len(x)
    except:
        pass
    
print(count)