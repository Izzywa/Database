# ANTIBIOTICS DATABASE PROJECT
According to The World Health Organisation (WHO), AMR is one of the top global public health and development threats. It is estimated that bacterial AMR was directly responsible for 1.27 million global deaths in 2019 and contributed to 4.95 million deaths. [link](https://www.who.int/news-room/fact-sheets/detail/antimicrobial-resistance)

The misuse and overuse of antimicrobials in humans, animals, and plants are the main drivers in the development of drug-resistant pathogens.
## The database design [here](DESIGN.md)

## [YouTube Video URL of the project](https://youtu.be/g7YD6gS2-ws)

# Details on The Project Limitation in Database Migration
The project starts of as a final project for an SQL course, thus the database was designed and created in MySQL.
The following web application, made with Django and React, was made after the database was created to display the practical appliation of the database.

The Database was then imported to Django with the following command.

```
python3 manage.py inspectdb > backend/models.py
```
The above command `inspectdb` maps the database structure to the file `models.py`
After some mofification on the Django Models, the application is now suited to query and modify the database.

However, the plan for proper migration for the application is to create a separate database and copy the data from the existing database.
But as the course requires the database to be created with the [schema.sql](schema.sql) file, no further action is taken

# Project files
<details>
<summary>
.github/workflows/cy.yml
</summary>

- Written to apply github Actions
- Every a push is made to the repository, it will automate the running of the test file.

</details>

<details>
<summary> 
test.py
</summary>

- This file will be run for testing during github actions
- A test database will be connected and populated with sample data from the csv files in hte [dataset_files](dataset_files) folder.

</details>

<details>
<summary>
SQL files
</summary>

<details>
<summary>
schema.sql
</summary>

- Contains the query run in MySQL to create the tables and views for the database.
</details>

<details>
<summary>
stored_procedures.sql
</summary>

- Contains the query run in MySQL to create the stored procedures for the database.
</details>

<details>
<summary>
privilege.sq
</summary>

- The list of privilege granted to the user 'test_user'.
</details>

<details>
<summary>
queries.sql
</summary>

- Contains the list of queries expected to be commonly run with the database.
</details>

</details>