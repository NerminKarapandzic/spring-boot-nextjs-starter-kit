## Getting started

- Clone the repository
- cd infra folder
- Run ```docker compose up -d``` from the infra directory. This will start up the database, mailpit and caddy
- Start the backend, it should already be configured to work with values in docker compose for db connection
- Run npm install and start the frontend
- Provide your own keys for s3 and github, the ones you see in application.properties are deleted

## Generating typescript types from your backend automatically

There is a maven plugin included and configured in the backend code which allows you to automatically generate typescript types and http client with all the rest endpoint methods.
To generate the types there is a convenient script in the frontend package:

`npm run update-types`

This will generate the types and copy them to your frontend package. You should do this whenever you change your DTO's entities or controllers.
Types will be generated only for types that you annotate with @Client, you can change this in the plugin configuration.
