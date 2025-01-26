import environ
import os
import pandas as pd
from pathlib import Path

env = environ.Env(
    DEBUG=(bool, False)
)
BASE_DIR = Path(__file__).resolve().parent.parent

def insert_usage_to_table(cursor, filename):
    usage = pd.read_csv(os.path.join(BASE_DIR, filename))
    insert_usage = 'INSERT INTO `ab_usage` (`use`) VALUES (?);'

    for index, row in usage.iterrows():
        use = row['use_misuse']
        cursor.execute(insert_usage, (use,))