import environ
import mysql.connector
import os
import pandas as pd
from pathlib import Path
# This file inserts data into the countries and dial_codes table

env = environ.Env(
    DEBUG=(bool, False)
)
BASE_DIR = Path(__file__).resolve().parent.parent

environ.Env.read_env(os.path.join(BASE_DIR, 'database/.env'))

# connect to the database
mydb = mysql.connector.connect(
    host = env('DB_HOST'),
    user = env('DB_USER'),
    password = env('DB_PASSWORD'),
    database = env('DB_DB')
)
m = mydb.cursor(prepared=True)

# read the csv and only keep the necessary columns 
codes = pd.read_csv('country-codes.csv')
codes_columns_to_keep = [
    'Dial',
    'ISO3166-1-Alpha-3',
    'official_name_en'
]

codes.drop(
    columns=[col for col in codes if col not in codes_columns_to_keep],
    inplace=True
    )

# remove the '-' from the dial 
codes['Dial'] = codes.Dial.apply(lambda x: x.replace('-','') if isinstance(x, str) else x)

# drop countries without dial codes
codes = codes[codes['ISO3166-1-Alpha-3'] != 'UMI']


insert_country = 'INSERT INTO countries (code, name) VALUES (?,?);'
insert_dial_code = 'INSERT INTO dial_codes (dial, country_code) VALUES (?,?);'

for index, row in codes.iterrows():
    country = (row['ISO3166-1-Alpha-3'], row['official_name_en'])
    try:
        m.execute(insert_country, country)
    except:
        print(country)
    
    if len(row['Dial'].split(',')) != 1:
        for d in row['Dial'].split(','):
            dial_code = (d, row['ISO3166-1-Alpha-3'])
            try:
                m.execute(insert_dial_code, dial_code)
            except:
                pass
    else:
        dial_code = (row['Dial'], row['ISO3166-1-Alpha-3'])
        try:
            m.execute(insert_dial_code, dial_code)
        except:
            pass
mydb.commit()
mydb.close()