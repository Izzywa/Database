# About the Database
## Scope
The use of the database is primarily for healthcare workers to store information on their use of antibiotics.

Example datasets taken from [AMR (FOR R)](https://msberends.github.io/AMR/index.html).

Although the datasets taken as an example focus on the research of AMR and the microorganisms, this database focuses on storing and collecting the information of the patient by the health practicioner.

The data on the microorganism was simplified due to insufficient knowledge but taking into consideration their name, resistance, kingdom, and oxygen tolerance.
- Each microorganism from the [AMR (FOR R)](https://msberends.github.io/AMR/index.html) dataset have a unique fullname and ID
- The oxygen tolerance is either "aerobe", "anaerobe", "anaerobe/microaerophile", "facultative anaerobe", "likely facultative anaerobe", or "microaerophile".


To further investigate the misuse and overuse of the antibiotics, more data is stored about their:
- Unique ID and compound ID
- Name, brand name, synonyms and abbreviation are included as they can be known or referred differently according to locations
- Dosage; The different type of dose given by the dataset are "standard  dosage", "high dosage" and "uncomplicated uti"
- The bacteria they are resistant against

In the patient side of the dataset, the healthcare practitioner would be expected to record:
- location
    - to record the location of origin and residence of the patient.
    - a collection of cities and countries could be selected from the database
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
- further details of microorganism such as their DNA, subspecies, etc.
- other non-antibiotic or antifungal related medication

## Functional Requirements

The expected users of the database are the healthcare practicioner prescribing or recording the use of antibiotics
- The users should be able to register the patient's information and record the medication they are taking, as well as their symptoms
- They would also see the history of the antibiotics previously prescribed by the patient and see the frequency, compliance, or any other complications
- Should the patient be allergic to a certain antibiotics, the user will also be notified when prescribing

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
- `ab_id`
    - Foreign Key to the unique ID of the antibiotic related to the `ab` column on the `antibiotics` table
    - `CHAR(3) NOT NULL`
- `abbr`
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
- `ab_id`
    - Foreign Key to the unique ID of the antibiotic related to the `ab` column on the `antibiotics` table
    - `CHAR(3) NOT NULL`
- `synonym`
    - The other name of the drug
    - `VARCHAR(32) NOT NULL`
</details>

`microorganisms`
<details>
<summary>Containing partial information of microorganisms</summary>

- `mo`
    - Primary Key
    - `VARCHAR(16) NOT NULL UNIQUE`
    - The unique identifier of each microorganism taken from the dataset
- `fullname`
    - `VARCHAR(32) NOT NULL UNIQUE`
    - fullname Unique identifier
- `kingdom`
    - The taxonomic kingdom of the microorganism
    - `ENUM('Bacteria', 'Fungi', '(unknown kingdom)', 'Protozoa', 'Archaea', 'Animalia', 'Chromista')`
- `oxygen_tolerance`
    - The oxygen tolerance of the microorganism
    - Items that contain "likely" are missing from BacDive and were extrapolated from other species within the same genus to guess the oxygen tolerance. 
    - `ENUM('facultative anaerobe', 'likely facultative anaerobe', 'anaerobe', 'aerobe', 'microaerophile', 'anaerobe/microaerophile')`

For the `kingdom` and `oxygen_tolerance` of the microorganism, creating a separate table to be referenced as foreign key was considered.
However, since the collection of set was small and very unlikely to change, the data type `ENUM` was used instead
</details>

`intrinsic_resistance`
<details>
<summary>Contains all defined intrinsic resistance by EUCAST</summary>

Intrinsic resistance is when a bacterial species is naturally resistant to a certain antibiotic or family of antibiotics, without the need for mutation or gain of further genes. This means that these antibiotics can never be used to treat infections caused by that species of bacteria.

- `mo`
    - The unique identifier of an organism
    - Foreign Key referencing the `mo` column in the `microorganisms` table
- `ab`
    - The unique identifier of an antibiotic
    - Foreign Key referencing the `ab` column in the `antibiotics` table

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
- `full name`
    - Full name of the patient
    - Although it is common for name of a person to be stored into first name and last name, this information is stored this way to take into consideration for cultures that does not have a surname or last name. From my experience living in Malaysia, where many does not have a last name and instead have their father's name following their first name, there had always been confusion on what should be included in the last name section of a formal form. This results in inconsistencies with the name in a particular form and the name in the National Identification Card.
    - `VARCHAR(100) TEXT NOT NULL`
- `email`
    - email of the patient, allowed `NULL` to take into consideration for patients without one.
    - `VARCHAR(100) TEXT`
- `dial_code_id`
    - Foreign key, referencing the `id` column in the `dial_codes` table
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
- `birth_country_code`
    - Foreign Key referencing the `code` column in the `countries` table
    

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

## entity relationship diagram
- can use Mermaid.js [live editor](https://mermaid.live/)
    - can create and export diagrams
- embed the image in the DESIGN.md

## video overview
- short video no more than 3 minutes
- begin with an opening section that display's:
    - project's title
    - name
    - GitHub and edX usernames
    - city & country
    - date video recorded