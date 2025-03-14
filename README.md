# ANTIBIOTICS DATABASE PROJECT
According to The World Health Organisation (WHO), AMR is one of the top global public health and development threats. It is estimated that bacterial AMR was directly responsible for 1.27 million global deaths in 2019 and contributed to 4.95 million deaths. [link](https://www.who.int/news-room/fact-sheets/detail/antimicrobial-resistance)

The misuse and overuse of antimicrobials in humans, animals, and plants are the main drivers in the development of drug-resistant pathogens.
## The database design [here](DESIGN.md)

## [YouTube Video URL of the project](https://youtu.be/g7YD6gS2-ws)

# Details on The Project Limitation
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

For the Django Application to be functionally optimised, it is assumed the information in the following tables are filled:
- antibiotic_groups
- sntibiotics
- synonyms
- dosage
- ab_usage
- countries
- dial_codes
- diagnoses

# Project functionalities

##  MySQL Database
<details>
<summary> Views </summary>
The `current_patients`, `current_visits`, and `current_prescription` listed the data from each table that is not marked as deleted (deleted column = 0) while also concatinating and joining views from other tables.

![current patients](images/current_patients.png)
![current visits](images/current_visits.png)
![current prescriptions](images/current_prescriptions.png)

</details>

<details>
<summary> Stored Procedures </summary>

<details>
<summary>`allergy_trade_name_by_pt_id` and `allergy_official_name_by_pt_id`</summary>

Takes in a patient's ID as a parameter and returns either the trade name or official name of the antibiotics the patient is allergic to.
![allergy stored procedure](images/call_allergy.png)

</details>

<details>
<summary>`visit_prescription_by_pt_id`</summary>

Takes in a patient's ID as a parameter and returns the visit notes and dose of antibiotic prescribed to the patient grouped by date.
![visits and prescriptions stored procedure](images/call_visit_prescriptions.png)

</details>

<details>
<summary>`search_ab`</summary>

Takes in a string as a parameter and matches it with the abbreviation, trade name and official names of antibiotics and returning the official name of the antibiotics.
![seach antibiotic stored procedure](images/call_search_ab.png)

</details>

</details>

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

<details>
<summary>
dataset_files
</summary>

- The CSV files in this folder contains the set of sample data used to populate the database during trial and testing.
- The Python files contains functions that takes in arguments to automate transferring the data from the CSV files to the database.
</details>

<details>
<summary>
database
</summary>

- This folder contains all the files for the Django web application.

<details>
<summary>
backend
</summary>

- The backend application for the Django project used for handling of API requests using Django REST Framework
</details>

<details>
<summary>
frontend
</summary>

- The frontend application for the Django project where the client side application is rendered using React
</details>
</details>