import environ
import mysql.connector
import os
import pandas as pd
from pathlib import Path
from common_usage import input_diagnoses_to_table

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

diagnosis_err = input_diagnoses_to_table(m)
print(diagnosis_err)