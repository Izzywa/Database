import environ
import mysql.connector
import os
import pandas as pd
import sqlite3
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

citiesdb = sqlite3.connect("cities.db")
c = citiesdb.cursor()
countries = c.execute('SELECT * FROM countries;').fetchall()
cities = c.execute('SELECT * FROM cities;').fetchall()

insert_countries ='INSERT INTO countries (id, name) VALUES(%s,%s);'
insert_cities = 'INSERT INTO cities (id, name, country_id, latitude, longitude) VALUES(%s,%s,%s,%s,%s);'

try:
       
    m.executemany(insert_countries, countries)

    m.executemany(insert_cities, cities)

    mydb.commit()
except:
    pass

m.close()
c.close()