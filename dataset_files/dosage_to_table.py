import pandas as pd
import environ
import mysql.connector
import os
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