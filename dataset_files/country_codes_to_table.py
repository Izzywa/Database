import environ
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
    database = env('DB_DB')
)
m = mydb.cursor(prepared=True)

codes = pd.read_csv('country-codes.csv')
codes_columns_to_keep = [
    'Dial',
    'ISO3166-1-Alpha-3'
]
codes.drop(
    columns=[col for col in codes if col not in codes_columns_to_keep],
    inplace=True
    )

# remove the '-' from the dial 
codes['Dial'] = codes.Dial.apply(lambda x: x.replace('-','') if isinstance(x, str) else x)

for index, row in codes.iterrows():
    # find the countries with more than one dial code
    dial = row['Dial'].split(',')
    if len(dial) != 1:
        print(row['ISO3166-1-Alpha-3'])