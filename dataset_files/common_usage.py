import pandas as pd
import environ
import os
from pathlib import Path

env = environ.Env(
    DEBUG=(bool, False)
)
BASE_DIR = Path(__file__).resolve().parent.parent

'''
The following contains 100 of the commonly used antibiotics and their usage
This dataset is used as a template to populate the diagnosis table of the database, subjected to future change
However, the dataset contains redundant and repetitive categorisation.
Thus, after separating the uniquely listed usage, the file was manually removed of repetitive diagnosis
'''
def separate_data():
    abx_list = pd.read_csv('antibiotics_list.csv')
    abx_list = abx_list['Usage'].unique()

    new_list = []
    for x in abx_list:
        if '(' in x:
            bracket_prefix = x[: x.index('(')]
            in_brackets = x[x.index('(') + 1 : x.index(')')]
            not_in_brackets = x[x.index(')') + 1 :].strip()
            
            for item in in_brackets.split(','):
                if len(item) != 0:
                    new_list.append(bracket_prefix.strip() + ' ' + item.strip())
            
            if len(not_in_brackets) != 0:
                for item in not_in_brackets.split(','):
                    if len(item) != 0:
                        new_list.append(item.strip())
        else:
            for item in x.split(','):
                new_list.append(item.strip())
                
    new_list = set(new_list)

    df = pd.DataFrame(new_list, columns=['Usage'])
    df['Usage'] = df['Usage'].apply(str.upper)
    df.drop_duplicates(inplace=True)
    df.to_csv('common_usage.csv', index=False)

def insert_diagnoses_to_table(cursor, filename):
    diagnoses = pd.read_csv(os.path.join(BASE_DIR, filename))
    insert_diagnoses = 'INSERT INTO diagnoses (diagnosis) VALUES (?);'

    for index, row in diagnoses.iterrows():
        diagnosis = row['Usage']
        try:
            cursor.execute(insert_diagnoses, (diagnosis,))
        except Exception as e:
            pass