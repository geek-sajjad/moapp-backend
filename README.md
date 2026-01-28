# Factive Backend

## Table of Contents

- [Factive Backend](#factive-backend)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Local Setup](#local-setup)
  - [Project Structure](#project-structure)
  - [Local Setup](#local-setup-1)
  - [Documentation](#documentation)
  - [Key Features](#key-features)
  - [Technologies Used](#technologies-used)
  - [Deployment](#deployment)
  - [Common Tasks](#common-tasks)
    - [Adding a New Environment Variable](#adding-a-new-environment-variable)
    - [Creating a New API Endpoint](#creating-a-new-api-endpoint)
    - [Adding a New Database Collection](#adding-a-new-database-collection)
    - [Creating a New Email Template](#creating-a-new-email-template)

## Prerequisites

- Node.js v18 (Nestjs)
- Nestjs
- Yarn v1 or ( npm )
- Create a .env.aws file in the root directory with the following content:

```bash
SECRET_MANAGER_AWS_ACCESS_KEY_ID=your_access_key_id
SECRET_MANAGER_AWS_SECRET_ACCESS_KEY=your_secret_access_key
```

Alternative : the env.example file exists in the root folder, you can rename it to .env and use instead of secrect manager

All other env values will be fetched dynamically from AWS Secrets Manager.

## Local Setup

```bash
# install dependencies
yarn install
# start server
yarn start
# start server in watch mode
yarn start --watch
```

````bash
# install dependencies
npm install
# start server in watch mode
npm run start


## Project Structure

```plaintext
/factive-backend
|-- /src
|   |-- /config        # Directory contains all project confiurations
|   |   |-- /database        # Database configueration
|   |   |-- /app.config   # cofig the applition
|   |   |-- /cors.config         # cors configuration
|   |   |-- /firbease.config     # firbase configuration
|   |   |-- /jwt.config          # jwt configuration
|   |   |-- /swagger.config      # swagger configuration
|   |-- /core        # Directory for shared code between all projects of company
|   |   |-- /constants        # Directory for all the global constants
|   |   |-- /decorators       # Directory for all the global decorators
|   |   |-- /dtos             # Directory for all the global dtos
|   |   |-- /enums            # Directory for all the global enums
|   |   |-- /exceptions       # Directory for all the global exceptions
|   |   |-- /interfaces       # Directory for all the global interfaces
|   |   |-- /pips             # Directory for all the global pips
|   |   |-- /types            # Directory for all the global typs
|   |   |-- /filters          # Directory for all the global filters
|   |   |-- /interceptors     # Directory for all the global interceptors
|   |   |-- /utils            # Directory for all the global utils
|-- /common         # Directory for project related code required by multiple modules (global)
|   |   |-- /filters        # Directory for all the global filters
|   |   |-- /interceptors   # Directory for all the global interceptors
|   |   |-- /utils          # Directory for all the global utils
|   |-- /modules        # Directory for all application resources
|   |   |-- /resource-1
|   |   |   |-- /schema		# Directory for mongoose schemas for resource-1 module
|   |   |   |-- /dto   		# Directory for DTOs for resource-1 module
|   |   |   |-- resource-1.controller.ts  # The file which contains all the routes for resource-1 module
|   |   |   |-- resource-1.service.ts     # The file which contains all the business logic for resource-1 module
|   |   |   |-- resource-1.module.ts
|   |-- main.ts       # Entry point of the application, which will bootstrap the application
|   |-- app.module.ts # The file which mounts all the modules
|-- .env.aws   # This file will contain AWS credentials, which will be used to download to dynamically fetch environment variables from AWS Secrets Manager
|-- .env       # This file will be created with the environment variables, after the values are fetched from from AWS Secrets Manager. This reduces the friction of constantly updating the env file and communicating it with the team
|-- package.json
|-- tsconfig.json
|-- yarn.lock
|-- README.md
````

## Local Setup

```bash
# install dependencies
yarn install
# start server on staging environment
yarn start
# start server in watch mode
yarn start --watch
# start server on production environment
yarn start:prod
```

## Documentation

[Postman Link](https://app.getpostman.com/join-team?invite_code=3cfa07585f31167abb3dfbe2d50f0764&target_code=d7728041a2087bdff3f2179bfd79721e)

[Swagger Link](https://staging-api.factive.app/docs)

[ERD Diagram](https://dbdiagram.io/d/jismik-655517607d8bbd6465446569) (Some fields might have different names in the actual DB but generally the structure of the ERD is the same as the actual structure of the DB)

## Key Features

1. Authentication: The project uses various authentication strategies, including JWT for user facing APIs and API key authentication for third parties (for e.g. WhatsApp bot).

2. **Push Notifications**: [Firebase Cloud Messaging](https://github.com/factiveteam/factive-backend/blob/staging/src/common/utils/push-notifications.ts) is used for sending push notifications.

3. **Logging**: [Custom logging service](https://github.com/factiveteam/factive-backend/blob/staging/src/common/utils/logger/.ts) for better debugging and monitoring.

4. **Exception Handling**: [Global exception filter](https://github.com/factiveteam/factive-backend/blob/staging/src/common/filters/exception-filter.ts) for consistent error responses.
5. **Email Sending**: The [Email Service](https://github.com/factiveteam/factive-backend/blob/staging/src/common/utils/email/email.service.ts) uses Mailtrap to send emails (templates are defined on Mailtrap UI).

6. **Database**: MongoDB integration using Mongoose.

For more detailed information on specific modules or functionalities, refer to the respective files in the project structure.

## Technologies Used

- NestJS
- MongoDB with Mongoose
- AWS Secrets Manager for .env management
- Firebase Admin SDK for push notifications
- Mailtrap for sending emails
- Swagger for API documentation

## Deployment

The application is designed to be deployed on multiple environments (staging, production). The environment is determined by the `ENVIRONMENT` variable set in the AWS Secrets Manager.

## Common Tasks

### Adding a New Environment Variable

1. Log in to the AWS Console and navigate to Secrets Manager.
2. Find the secret for the appropriate environment (e.g., `staging/jismik-backend` or `production/jismik-backend`).
3. Add the new variable to the secret in AWS Secrets Manager.
4. Use the new environment variable in your code by accessing it through `process.env.YOUR_NEW_VARIABLE`.

### Creating a New API Endpoint

1. Decide which module the new endpoint belongs to, or create a new module if necessary.
2. Use the [NestJS CLI](https://docs.nestjs.com/cli/usages) to generate a new resource: `nest generate res MODULE_NAME --no-spec`
3. Implement the new endpoint in the controller file (e.g., `module-name.controller.ts`).
4. Add the business logic in the service file (e.g., `module-name.service.ts`).

### Adding a New Database Collection

1. Create a new schema file in the appropriate module's `schema` directory.
2. Define the schema using Mongoose schema definitions.
3. Create a corresponding DTO (Data Transfer Object) in the module's `dto` directory.
4. Update the module's service to interact with the new collection.
5. Add the new schema to the `MongoCollections` enum:

### Creating a New Email Template

1. Log in to the Mailtrap account associated with the project.
2. Navigate to the Email Templates section.
3. Create a new template with the desired HTML content and subject line.
4. In the codebase, update the `EmailTypes` enum and add the template id to `EmailTypesToTemplateMap`
5. When sending an email, use the new value for the EmailTypes enum and provide any necessary variables that have been declared in the HTML template.

## TODO's:

[ ]. add ability to run migrations from ts files for not running `npm run build` everytime.
[ ]. use unified way of serilization
[ ]. use unified way of responses for all methods like `DELETE`
[ ]. use intefaces for all service in order to force return ResponseDTO instead of raw entities
[ ]. use abstract Service and impliment toResponseDto protected method in order to simply convert to ResponseDto
[ ]. add a file based logger like nestjs-pino
[ ]. add error tracing like centry
[ ]. use mapper in base abstract class of services
[ ]. Caching: If you’ll display these combinations a lot, denormalize into a “catalog” view for quick queries.