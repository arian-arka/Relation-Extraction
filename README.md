# Relation Extractor

- [Description](#description)
  - [Key features](#key-features)
  - [Glossary](GLOSSARY.md)
- [Installation](#installation)
- [Running Dev](#running-dev)
- [Deploy Production](#deploy-production)
  - [NGINX Config](#nginx-suggested-config)
- [Defaults](#defaults)


## Description
Relation Extractor is an online system for those who seek to tag sentences with entities and create relations with those entities.

This system makes it easy for linguist create sentences, entities, relations, assign jobs to other linguist by sentence status, ...


### Key Features

- CRUD on admins
  - add or remove privileges of admins
- CRUD on relations
  - search through relations 
  - find how many sentences have a specific relation
  - find sentences that have a specific relation
- CRUD on sentences
  - Sentences are automatically divided into words(for being user-friendly)
  - each sentence has a status of below
    - Published or Refused(with a statement to help other linguists)
    - Waiting to be published or Refused
    - Editing
      - When its editing, Only the user that is working on that has the permission to modify that
  - Annotators are specified
  - You can Tag a word or group of words with an entity
  - you can click on an entity then click on another entity to assign a relation to those(made easy by just clicking)
  - You can view list of relations in the sentences.

---------------------------------

## Running Dev
```bash
 cd flowbite-solid & node deployToBack.js & cd ../custom-fastify &  npm run start
```

---------------------------------

## Deploy Production
```bash
 cd flowbite-solid & node deployToBack.js https://your-domain.example & cd ../custom-fastify & nohup npm run start >/dev/null 2>&1 &
```
### NGINX Suggested Config
you should specify server_name and proxy_pass
```nginx
server {
        listen 80;
        listen [::]:80;

        server_name 0.0.0.0;

        location / {
                proxy_pass http://localhost:3000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
                proxy_read_timeout 1800;
                proxy_connect_timeout 1800;
                proxy_send_timeout 1800;
                send_timeout 1800;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
        }

}
```

---------------------------------

## Defaults

- Default User Credentials to login
  - Username : admin@gmail.com 
  - Password : 12345678 
  - base url : /

---------------------------------

