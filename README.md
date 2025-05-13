# sit323-737-2024-t1-prac7p

• Install MongoDB into the Kubernetes cluster, either as a standalone instance or a replica set, depending on your requirements

Step 1: I decided to do it as a standalone instance.

Step 2: I created mongodb-deployment.yaml & mongodb-service.yaml files to handle mongoDB.

Step 3: I took the contents from CloudDeakin's Week 7 Workshop PPT slides.

• Create a MongoDB user with appropriate permissions for your application

Step 1: Made a new connection according to the PPT slides

Step 2: Open up MongoDB Shell to insert a user

Step 3: Added a MongoDB user for permission authentication (screenshot in docs)

• Configure persistent storage for the MongoDB database by creating a Persistent Volume and Persistent Volume Claim

Step 1: Took both PV and PVC files from PPT and pasted it into VSC for further changes

Step 2: Modified accessModes to ReadWriteOnce

• Create a Kubernetes Secret for the MongoDB user credentials and add them to the deployment manifest

Step 1: Created file "mongodb-secret.yaml"

Step 2: Filled the file with username & password 

Step 3: Needed to encode credentials for access

• Modify the Kubernetes deployment manifest for your application to include the newly added MongoDB database. Ensure that the configuration includes information such as the database type, credentials, and other necessary parameters  

Step 1: Added "mongodb-secret" contents into createDeployment.yaml

Step 2: Make sure that each valueFrom was correct and no mistakes since it is crucial for autentication

• Configure the application to connect to the MongoDB database using the MongoDB client driver library and the connection string in the deployment manifest

Step 1: Modified the calculator.js to connect to Kubernetes for MongoDB

Step 2: Test the connection by running the pods and port-forward to port 3001 for testing and bug purposes. (There were a lot of back-and-forth to make sure the pods did not keep crashing, used kubectl logs to find errors in pods)

• Test the deployment to ensure that the application can connect to the MongoDB database and perform basic CRUD (Create, Read, Update, Delete) operations

Step 1: Added endpoitns for CRUD operations on User Details

Step 2: Tested the endpoints on Postman since it was impossible to test in browser

Step 3: Tested whether the CRUD operations was updaitng the MongoDB Compass under "mydb/users"

Step 4: Each endpoint was working as expected and screenshots are in the docs

• Set up database backups and disaster recovery options as necessary

Step 1: I did some research and it said that using mongodump was the best

Step 2: I used "https://www.mongodb.com/docs/database-tools/mongodump/"

Step 3: I installed MongoDB Database Tools for mongodump and it created a dump file where it can store MongoDB data manually

Step 4: Just in case, I also made a PV and PVC just for backup purposes to allow for simple backup

Step 5: If anything does go wrong in MongoDB data, mongorestore will be executed to restore data from mongodump into the main database

• Monitor the MongoDB database and application performance to ensure that the database is running smoothly and efficiently

Step 1: Used the downloaded tools from MongoDB and used "mongostat"

Step 2: Information can be found here "https://www.mongodb.com/docs/database-tools/mongostat/"

Step 3: I used the application to see different values being updated and monitored every second.

Step 4: It was very difficult to understand but the most important values are the first four which highlights the entries made.