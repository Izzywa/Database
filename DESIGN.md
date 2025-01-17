# About the Database
## Scope
The use of the database is primarily for healthcare workers to store information on their use of antibiotics.

Example datasets taken from [AMR (FOR R)](https://msberends.github.io/AMR/index.html).

Although the datasets taken as an example focus on the research of AMR and the microorganisms, this database focuses on storing and collecting the information of the patient by the health practicioner.


To further investigate the misuse and overuse of the antibiotics, more data is stored about their:
- Unique ID and compound ID
- Name, brand name, synonyms and abbreviation are included as they can be known or referred differently according to locations
- Dosage; The different type of dose given by the dataset are "standard  dosage", "high dosage" and "uncomplicated uti"

In the patient side of the dataset, the healthcare practitioner would be expected to record:
- location
    - to record the location of origin and residence of the patient.
- details of the patients
    - name
    - email
    - age
- their signs and symptoms
    - anatomy
    - signs
    - symptoms
- The type of medication and their dosage
    - duration of antibiotic therapy
    - timestamp, to monitor the frequency the patient was given antibiotic therapy
- The differential diagnosis/ reason for prescription
    - Map to the common reasons but can insert other reasons too
- Follow up on the patient's condition and their compliance to the mediation
    - healed, improved, worsen, no change
    - compliant, defaulted, intermittent

Out of scope are :
- Details of microorganism affected by the antibiotics and their resistance
- other non-antibiotic or antifungal related medication

## Functional Requirements

The database is expected to be of use to two groups of users:
- Healthcare practitioners prescribing antibiotics
- Reasearchers investigating the use and misuse of antibiotics

The healtcare practitioner will be able to:
- Register the patient's information and record the medication they are taking, as well as their symptoms
- They would also see the history of the antibiotics previously prescribed by the patient and see the frequency, compliance, or any other complications
- Should the patient be allergic to a certain antibiotics, the user will also be notified when prescribing

Researchers should be able to:
- Input information of the history of antibiotics use and misuse of patients
- Evaluate the common cause for antibiotics prescriptions and their frequency

The database might not have all the necessary data for research of AMR but for a person logging in as a researcher instead of the healthworker will have limited view to the patient's personal information

Out of the scope of the database is other medications not listed
- The database priotise on collecting and analysing information for antibiotics and antifungals

## Entities

`antibiotic_groups`
<details>
<summary>collection of unique groups of antibiotic</summary>

- `id`
    - Primary Key
    - `TINYINT UNSIGNED NOT NULL`
    - `TINYINT` is used because there are only 22 unique groups of antibiotics in the dataset, and this is unlikely to increase over 255, the maximum value for unsigned `TINYINT`
- `name`
    - short and concise group name based on WHONET and WHOCC
    - `VARCHAR(32) NOT NULL`
</details>

`antibiotics`
<details>
<summary>list of unique type of antibiotics</summary>

- `ab`
    - Antibiotic ID
    - The official EARS-Net (European Antimicrobial Resistance Surveillance Network) codes where available, unique
    - Primary Key
    - `CHAR(3) NOT NULL UNIQUE`
    - The official code for antibiotics are the unique combination of 3 letters, so the data type of `CHAR(3)` is used.
- `cid`
    - Compound ID as found in PubChem, unique
    - `INT UNSIGNED UNIQUE`
    - Although unique, some antibiotics in the dataset does not have a compound ID so they `NULL` value is allowed
- `name`
    - Official name as used by WHONET/EARS-Net or the WHO, unique.
    - `VARCHAR(64) UNIQUE`
- `group_id`
    - Foreign Key to `antibiotic_groups`'s `id`
    - `TINYINT UNSIGNED NOT NULL`
</details>

`abbreviations`
<details>
<summary>List of abbreviations for the antibiotics used in many countries</summary>

- `id`
    - Primary Key
    - `SMALLINT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT`
    - 484 abbreviations in the dataset so `SMALLINT` is used
- `ab`
    - Foreign Key to the unique ID of the antibiotic related to the `ab` column on the `antibiotics` table
    - `CHAR(3) NOT NULL`
- `abbreviation`
    - abbreviated name
    - `VARCHAR(32) NOT NULL`
</details>

`synonyms`
<details>
<summary>often trade names of a drug, as found in PubChem based on their compound ID</summary>

- `id`
    - Primary Key
    - `SMALLINT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT`
    - 5933 synonyms in the dataset so `SMALLINT` is used
- `ab`
    - Foreign Key to the unique ID of the antibiotic related to the `ab` column on the `antibiotics` table
    - `CHAR(3) NOT NULL`
- `synonym`
    - The other name of the drug
    - `VARCHAR(32) NOT NULL`
</details>


`dosage`
<details>
<summary>List of standard dosage for antibiotics</summary>

- `id`
    - Primary Key
    - `SMALLINT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT`
- `ab`
    -  Foreign Key referencing the `ab` column in the `antibiotics` table
- `type`
    - `ENUM('standard_dosage','high_dosage','uncomplicated_uti')`
    - Three types of dosage based on the dataset
- `dose`
    - There are variable ranges of doses either in gram, MU, mg/kg or a combination of different dose for antibiotics that are a combination of different material.
    - Thus, `VARCHAR` is used to include units of the dosage in the value
    - `VARCHAR(24) NOT NULL`
- `dose_times`
    - `TINYINT UNSIGNED`
    - Number of times dose must be administered
- `administration`
    - `ENUM('iv','oral','im')`
    - Allowed NULL because of some missing information in the csv dataset

</details>


`countries`
<details>
<summary>List of countries and their unique three letter ISO 3166-1 alpha-3 codes </summary>

- `code`
    - Primary key
    - `CHAR(3) UNIQUE NOT NULL`
    - Added constraint to ensure the value inserted into this column is always uppercase
- `name`
    - The official english name of a country

</details>

`dial_codes`
<details>
<summary>List of dial codes and the associated country</summary>

Separated from the `countries` table as there are some countries that share dial codes and some that have multiple

- `id`
    - Primary Key
    - `SMALLINT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT`
- `dial`
    - The dial code of the country without any '-' symbol.
    - `SMALLINT UNSIGNED NOT NULL`
- `country_code`
    - Foreign Key referencing the `code` column in the `countries` table

Added a unique constraint to ensure that there is no duplicate row of a country with a similar dial code.

</details>

`patients`
<details>
<summary>Personal information of patients</summary>

- `id`
    - Primary Key
    - `INT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT`
- `full_name`
    - Full name of the patient
    - Although it is common for name of a person to be stored into first name and last name, this information is stored this way to take into consideration for cultures that does not have a surname or last name. From my experience living in Malaysia, where many does not have a last name and instead have their father's name following their first name, there had always been confusion on what should be included in the last name section of a formal form. This results in inconsistencies with the name in a particular form and the name in the National Identification Card.
    - `VARCHAR(100) NOT NULL`
- `email`
    - email of the patient, allowed `NULL` to take into consideration for patients without one.
    - `VARCHAR(100)`
- `dial_code_id`
    - Foreign key, referencing the `id` column in the `dial_codes` table
    - `SMALLINT UNSIGNED`
- `phone`
    - `VARCHAR(15)`
    - `CHECK(phone is NULL or phone regexp '^[0-9]+$')`
    - Used `VARCHAR` instead of int to take into consideration of phone numbers that need to be stored with 0 as the leading character.
    - Constraint added to only allow digits to be stored in this column.
- `birth_date`
    - `DATE NOT NULL`
    - Stored in 'YYYY-MM-DD' format.
- `resident_country_code`
    - Foreign Key referencing the `code` column in the `countries` table
    - `CHAR(3) NOT NULL`
- `birth_country_code`
    - Foreign Key referencing the `code` column in the `countries` table
    - `CHAR(3) NOT NULL`
- `deleted`
    - 0 for false, 1 for true
    - `ENUM(0,1) DEFAULT 0` 
    

</details>

`allergies`
<details>
<summary>list of the antibiotics registered patients are allergic to</summary>

- `id`
    - Primary Key 
    - `INT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT`
- `patient_id`
    - Foreign Key referencing the `id` column in the `patients` table
- `ab`
    - Foreign Key referencing the `ab` column in the `antibiotics` table

Added constraint between `patient_id` and `ab` so that no duplicate of the same information.

</details>

`visits`
<details>
<summary>Visit details of patients</summary>

- `id`
    - Primary Key
    - `INT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT`
- `patient_id`
    - Foreign Key referencing the `id` column in the `patients` table
- `visit_date`
    - `DATE DEFAULT NOW`
- `timestamp`
    - `DATETIME DEFAULT CURRENT_TIMESTAMP`
- `signs_and_symptoms`
- `deleted`
    - 0 for false, 1 for true
    - `ENUM(0,1) DEFAULT 0` 

The `visits` table purposed is to collect information on the signs and symptoms of the patient.
For accountability:

</details>


`prescriptions`
<details>
<summary>List of antibiotics prescribed or previously prescribed to patients</summary>

- `patient_id`
    - Foreign Key referencing the `id` column in the `patients` table 
- `dose_id`
    - Foreign Key referencing the `id` column in the `dosage` table 
    - Default NULL
- `prescription_date`
    - `DATE DEFAULT NOW`
- `timestamp`
    - `DATETIME DEFAULT CURRENT_TIMESTAMP`
- `deleted`
    - 0 for false, 1 for true
    - `ENUM(0,1) DEFAULT 0` 
- `diagnosis_id`
    - Default NULL
- `deleted`
    - 0 for false, 1 for true
    - `ENUM(0,1) DEFAULT 0` 

The purpose of this table is to record antibiotics prescribed to the patient by the current user or previously taken by the patients.
Often patients did not know what or why they were prescribed antibiotics, this also includes those who took antibiotics without prescriptions. Thus, the `dose_id` and `diagnosis_id` is allowed `NULL` so that it can be further investigated in the future.

</details>

`diagnoses`
<details>
<summary>List of the common diagnosis for antibiotics usage.</summary>

- `id`
    - Primary Key
- `diagnosis`
    - `VARCHAR(64) NOT NULL`

</details>

`usage`
<details>
<summary>List of common use and misuse of antibiotics</summary>

Created a table instead of `ENUM` for easier potential new insertion.
- `id`
- `use`

</details>

`compliance`
<details>
<summary>A single prescription of antibiotics could have been misused in many ways, so a separate table is created to monitor the compliance of the medication.</summary>

- `prescription_id`
- `use_id`
Primary Key(`prescription_id`, `use_id`)

</details>


## Relationships

## Optimisations
In this section you should answer the following questions:

* Which optimizations (e.g., indexes, views) did you create? Why?

## Limitations
In this section you should answer the following questions:

* What are the limitations of your design?
* What might your database not be able to represent very well?


write for a technical audience 
- explain why you made certain design choices
- neighbourhood of 1000 words
- describing the project and all aspects of its functionality

## Entity Relationship Diagram
![ER diagram](images/ER_diagram.png)

## video overview
- short video no more than 3 minutes
- begin with an opening section that display's:
    - project's title
    - name
    - GitHub and edX usernames
    - city & country
    - date video recorded