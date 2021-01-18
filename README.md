# Backend

Things may get heavy here!
This is the backend API.
For our setup, we use Node.js in a serverless infrastructure, to reduce the initial overhead of letting servers running idle.

To accomplish it, we leverage the AWS infrastructure on the serverless paradigm: API Gateway, Lambda, S3, and CloudFront.
Once a API request reaches API Gateway, AWS Lambda spins up a Node.js container and thread the request information into our code.
Our code uses Express.js to handle the HTTP integration, identifying routes, sent information, and authentication.
Its response is sent back to API Gateway, which will 
Authentication is provided via JWT tokens, with a clear cut 

As our persistant state layer, we use MongoDB.
Given the flexible schema, the prototyping in a weekend is much quicker than in a fixed schema SQL database.
Parts of the system may be rethinked in the future to migrate to a SQL database, as we see fit.

Course content, such as podcasts and videos, are to be provided via S3 and CloudFront, a cheap and robust infrastructure for a Content Delivery Network.
The textual content and metadata from courses provided by the API can be easily cached at the API Gateway level, so to reduce the number of Lambda executions.

The main code list under the `src` folder.
The index provides the main Express app wrapped in the serverless-http, to parse the HTTP request information provided by API Gateway.
HTTP POST bodies must be in the JSON format, automatically handled by Express.
Our routes are under `src/routes`, using explicit body validation and JWT middleware.

Tests are handled by Mocha and the Serverless lib, spawning an environment close to what is present in the AWS Lambda containers.
We plan to include continuous integration with Github actions, in a Dockerized environment.
