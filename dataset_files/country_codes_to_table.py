import environ
import os
import pandas as pd
from pathlib import Path
# This file inserts data into the countries and dial_codes table

env = environ.Env(
    DEBUG=(bool, False)
)
BASE_DIR = Path(__file__).resolve().parent.parent

def insert_countries_and_dial_codes(cursor, filename):
    # read the csv and only keep the necessary columns 
    codes = pd.read_csv(os.path.join(BASE_DIR, filename))
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
            cursor.execute(insert_country, country)
        except:
            pass
        
        if len(row['Dial'].split(',')) != 1:
            for d in row['Dial'].split(','):
                dial_code = (d, row['ISO3166-1-Alpha-3'])
                try:
                    cursor.execute(insert_dial_code, dial_code)
                except:
                    pass
        else:
            dial_code = (row['Dial'], row['ISO3166-1-Alpha-3'])
            try:
                cursor.execute(insert_dial_code, dial_code)
            except:
                pass