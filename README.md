According to The World Health Organisation (WHO), AMR is one of the top global public health and development threats. It is estimated that bacterial AMR was directly responsible for 1.27 million global deaths in 2019 and contributed to 4.95 million deaths. [link](https://www.who.int/news-room/fact-sheets/detail/antimicrobial-resistance)

The misuse and overuse of antimicrobials in humans, animals, and plants are the main drivers in the development of drug-resistant pathogens.
# The database design [here](DESIGN.md)

# REST framework
install and register rest framework and CORS
allow request to the Django app from other origins
- in this, allowed request from localhost:8081

install django-cors-headers library and add the configuration for CORS in `settings.py`

```
pip install django-cors-headers
```

```
INSTALLED_APPS = [
    ...
    'corsheaders'
]
```

added midlleware class to listen in on responses
```
MIDDLEWARE = [
    ...
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

CORS_ORIGIN_ALLOW_ALL = False
CORS_ORIGIN_WHITELIST = (
    'http://localhost:8081'
)
```
- CORS_ORIGIN_ALLOW_ALL: if `True`, all origins will be accepted. will not use the whitelist. Defaults to `False`
- CORS_ORIGIN_WHITELIST: Lis of origins that are authorised to make cross-site HTTP request. Defaults to `[]`

## importing mysql to Django
```
python3 manage.py inspectdb > backend/models.py
```

The above command `inspectdb` maps the database structure to the file `models.py`
- django will create the models based on the database