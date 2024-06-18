## Getting started

- Clone the repository
- Run ```docker compose up -d``` from the infra directory. This will start up the database, mailpit and caddy
- Start the backend, it should already be configured to work with values in docker compose for db connection
- Run npm install and start the frontend
- Provide your own keys for s3 and github, the ones you see in application.properties are deleted
