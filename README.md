# Trisonics Scouting Application Overview - Updated for 2023
This repository consists of three related projects. Under the 'api' directory
you'll find an Azure Function v4 projedct written in Python that acts as the
data layer for the application. This handles connections back to our Cosmos
database, Blob storage, and connection to any other API we might want to pull
from.

The 'trisonics-scouting' directory has an Angular v13 application that is the
user interface users see. This is a TypeScript (typed JavaScript) based project.

The Angular applicatino and Python api can deploy to Azure Static Web Apps via
Github Actions. Anything checked into the 'release' branch goes live in our
site at https://www.frcscout.org.

# Architecture
The Angular application runs on the user's device either in a web browser or
as a PWA (Progressive Web App) which looks like an app on mobile or desktop
platforms that runs inside of a web container of some kind.

The application needs to gather and and send data to a central location and it
does this by making HTTP calls to the the API (Application Programming
Interface) that we've created in Python. This code will be running "in the
cloud" where anybody on the internet can interact with it. Only that portion of
the code knows the keys to interact with the data storage, like CosmosDB. In
this way it acts as a security layer but it primarily acts as a business or
logic layer that allows the Angular application to best accomplish the task at
hand.

The format of almost all data in this stack, either in storage or transport,
will be JSON (JavaScript Object Notation) which is a subset of valid JavaScript
that could be used to define a data structure. For instance:
```
var aList = ['A', 'B', 'C'];
```
is a valid way to define a list in JavaScript. The JSON representation of this
is the ```['A', 'B', 'C']``` portion.

This is also the storage format of the CosmosDB that will be used to store all
of the information collected, aside from raw image files.

The CosmosDB can be queried using SQL (Structured Query Language) or rather
something approximating proper SQL. That is how the Python API layer will
extract data from our CosmosDB instance.

Generally when the application requests some data from the API the API will be
performing some kind of aggregation, calculation, or shaping of the data before
presenting it back to the application. For this we generally use Pandas
dataframes if needed. Some methods will simply pass the same data straight
through or need so little manipulation that Pandas isn't warranted.

# Development Install Instructions
## Python API
The 'api' portion of the project is in Python and you will need to install that.
A 3.9 release is suggsted, downloads of a suitable version can be found here:
https://www.python.org/downloads/release/python-3911/

To run the 'api' portion of the project you will also need Azure Functions Core
Tools v4. Download instructions can be found here:
https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=v4%2Cwindows%2Ccsharp%2Cportal%2Cbash#v2

Next you should construct a python virtual environment for the api runtime. From the cloned repository, and in the 'api' directory run:
```python3 -m venv venv-scouting```. To activate the new environment run ```.\venv-scouting\Scripts\Activate``` on Windows or ```. ./venv-scouting/bin/activate``` on Linux and macOS systems.

Next you need to pull in all of the Python packages required to run the solution. To do that run: ```pip install -r requirements.txt```.

Now you'll need to set the following environment variables:
- ```COSMOS_ENDPOINT```: https://trisonics-scouting.documents.azure.com:443/ or other DB endpoint
- ```COSMOS_KEY```: Secret key to authenticate to Cosmos DB
- ```TBA_KEY```: Another secret key, this from from The Blue Alliance
- ```BLOB_CONN```: A connection string that contains a secret key to an Azure Blob Storage container
- ```BLOB_PUB_URL```: https://scoutdata.blob.core.windows.net/images or the URL to your storage container after it has been configured for public access. 

You will likely want to put something like the following in a ```setenv.bat``` file within the ```api``` directory to set them easily before starting a session:
```
set COSMOS_ENDPOINT=https://.....
set COSMOS_KEY=mumbojumbo
set TBA_KEY=moremumbojumbo
set BLOB_CONN=blob_connection_string
set BLOB_PUB_URL=https://your.public.blobstorage.url.here/
```

Finally, run ```func start``` from the command line to start the development server. This will service data requests from the Angular application both to the Cosmos databse and The Blue Alliance API data.

## Angular App
The first step to getting the Angular environment running is to install NodeJS:
https://nodejs.org/en/. Essentially this gets you the command line tool ```npm``
or the Node Pakcage Manger which is needed for everything JavaScript related.

With the project cloned, from the command line and in the working directory of
```trisonics-scouting``` run ```npm ci``` to install the required packages for
the application to run. You can also run ```npm install``` here instead to grab
the latest available packages for all dependencies but this is a bit riskier.
The ```npm ci``` command will only reference the ```package-lock.json``` file
and not try and upgrade any versions; it is what a CI/CD system will use for a
repatable build.

Now you can run the command ```ng serve``` from this directory and it will start
a local webserver for your application at ```http://localhost:4200```. If you
point a browser to that location you will see the application display. Data
requests from the web app will be directed to ```https://localhost:7071/api```
in accordance with the value of ```baseUrl``` in
```src/environments/enviornment.ts```. That directs request to the local Azure
Functions you have running from the previous step.

## Development Tips
The toolchain is very command-line centric and the Terminal window at the bottom of Visual Studio Code is where you should be running your ```func start``` or ```ng serve``` when developing a project. It's just very handy. 

If you do not plan on developing the Python API side and Angular side at the same time there's no reason to load both into two copies of Visual Studio Code. You can just run then project you're not developing from a terminal window just fine.

If you do plan on developing both the api and application at the same time I recommend the Peacock extension (https://marketplace.visualstudio.com/items?itemName=johnpapa.vscode-peacock) which lets you set a border color around Visual Studio Code that makes it easier to see which project you're in.
