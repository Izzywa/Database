# About the Database;
## Scope
According to The World Health Organisation (WHO), AMR is one of the top global public health and development threats. It is estimated that bacterial AMR was directly responsible for 1.27 million global deaths in 2019 and contributed to 4.95 million deaths. [link](https://www.who.int/news-room/fact-sheets/detail/antimicrobial-resistance)

The misuse and overuse of antimicrobials in humans, animals, and plats are the main drivers in the development of drug-resistant pathogens.

The use of the database is primarily for healthcare workers to store information on their use of antibiotics.

Example datasets taken from [AMR (FOR R)](https://msberends.github.io/AMR/index.html) and [antibiotic dataset from kaggle](https://www.kaggle.com/datasets/kanchana1990/antibiotic-dataset).

Although the datasets taken as an example was focused on the research of AMR and the microorganism, this database focuses on storing and collecting the information of the patient and the health practicioner.

The data on the microorganism was simplified due to insufficient knowledge but taking into consideration their name, resistance, kingdom, and oxygen tolerance.
- Each microorganism from the [AMR (FOR R)](https://msberends.github.io/AMR/index.html) dataset have a unique fullname and ID
- The oxygen tolerance is either "aerobe", "anaerobe", "anaerobe/microaerophile", "facultative anaerobe", "likely facultative anaerobe", or "microaerophile".


To further investigate the misuse and overuse of the antibiotics, more data is stored about their:
- Unique ID and compound ID
- Name, brand name, synonyms and abbreviation are included as they can be known or referred differently according to locations
- Dosage; The different type of dose given by the dataset are "standard  dosage", "high dosage" and "uncomplicated uti"
- The bacteria they are resistance against

In the patient side of the dataset, the healthcare practitioner would be expected to record:
- location
    - to record the location of origin and residence of the patient, and where the medication was prescribed
- details of the patients
    - contains PII
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
- other non-antibiotic or microbial related medication

## Functional Requirements
In this section you should answer the following questions:

* What should a user be able to do with your database?
* What's beyond the scope of what a user should be able to do with your database?
- The expected users of the datab

## Entities
In this section you should answer the following questions:

* Which entities will you choose to represent in your database?
* What attributes will those entities have?
* Why did you choose the types you did?
* Why did you choose the constraints you did?
`antibiotic_groups`: collection of unique groups of antibiotic
- `id`
    - Primary Key
- `name`
    - short and concise group name based on WHONET and WHOCC

`antibiotics`: list of unique type of antibiotics
- `ab`
    - Antibiotic ID
    - Using the official EARS-Net (European Antimicrobial Resistance Surveillance Network) codes where available
    - <i>Unique</i>
    - Primary Key
- `cid`
    - Compound ID as found in PubChem
    - <i>Unique</i>
- `name`
    - Official name as used by WHONET/EARS-Net or the WHO
    - <i>Unique</i>
- `group_id`
    - Foreign Key to `antibiotic_groups`'s `id`

`abbreviations`: List of abbreviations for the antibiotics used in many countries
- `id`
    - Primary Key
- `ab_id`
    - Foreign Key to the unique ID of the antibiotic related to the `ab` column on the `antibiotics` table
- `abbr`
    - abbreviated name

`synonyms`: often trade names of a drug, as found in PubChem based on their compound ID
- `id`
    - Primary Key
- `ab_id`
    - Foreign Key to the unique ID of the antibiotic related to the `ab` column on the `antibiotics` table
- `name`
    - The name of the drug

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