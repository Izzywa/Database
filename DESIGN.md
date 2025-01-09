# About the Database;
## Purpose
According to The World Health Organisation (WHO), AMR is one of the top global public health and development threats. It is estimated that bacterial AMR was directly responsible for 1.27 million global deaths in 2019 and contributed to 4.95 million deaths. [link](https://www.who.int/news-room/fact-sheets/detail/antimicrobial-resistance)

The misuse and overuse of antimicrobials in humans, animals, and plats are the main drivers in the development of drug-resistant pathogens.

This database is created to store more information about the use of antibiotics in the healthcare industry.
The use of the database is primarily for healthcare workers to store information on:
- The patients
- The medication presscribed
- The symptoms and signs of the patient
- The reason for the prescription
- The compliance of the medication
- The follow up result of the patient

Datasets taken from [AMR (FOR R)](https://msberends.github.io/AMR/index.html) and [antibiotic dataset from kaggle](https://www.kaggle.com/datasets/kanchana1990/antibiotic-dataset).

Although the datasets taken as an example was focused on the research of AMR and the microorganism, this database focuses on storing and collecting the information of the patient and the health practicioner.

## Scope
The information on the antibiotics and micororganism was taken from an existing dataset.
The data on the microorganism was simplified due to insufficient knowledge but taking into consideration their name, resistance, kingdom, and oxygen tolerance.
- Each microorganism from the [AMR (FOR R)](https://msberends.github.io/AMR/index.html) dataset have a unique fullname and ID
- The oxygen tolerance is either "aerobe", "anaerobe", "anaerobe/microaerophile", "facultative anaerobe", "likely facultative anaerobe", or "microaerophile".


To further investigate the misuse and overuse of the antibiotics, more data is stored about their:
- Unique ID and compound ID
- Name, brand name, synonyms and abbreviation are included as they can be known or referred differently according to locations
- The common usage. Although this information is subject to change, this can serve as a guideline to measure if antibiotics are misused or overused
- Dosage
- The bacteria they are resistance against

In the patient side of the dataset, the healthcare practitioner would be expected to record:
- location
    - to record the location of origin and residence of the patient, and where the medication was prescribed
- details of the patients
    - This would include some personally identifiable information, so a different view or different authorisation will be given to data analyst or reserchers
    - each patient will be given a unique indentifier
    - medical history
    - family history
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
    - compliant, default, intermittent

## Entities

## Relationships

## Optimisations

## Limitations

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