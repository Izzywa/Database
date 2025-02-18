import pandas as pd
import mysql.connector

connection = mysql.connector.connect(
    user='root',
    password="password",
    host="127.0.0.1",
    database="myproject"
)

data = pd.read_csv('country-codes.csv')
data = data[[        
        'ISO3166-1-Alpha-3',
        'ISO3166-1-Alpha-2']]

with connection.cursor(prepared=True) as cursor:
    for index,row in data.iterrows():
        code = row['ISO3166-1-Alpha-3']
        ISO2 = row['ISO3166-1-Alpha-2']
        try:
            cursor.execute('UPDATE countries SET ISO2=? WHERE code =?;', (ISO2, code))
        except:
            pass
    
connection.commit()
connection.close()