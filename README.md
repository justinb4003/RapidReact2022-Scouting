# Trisonics Scouting Application Overview
This repository consists of three related projects. Under the 'api' directory
you'll find an Azure Function v4 projedct written in Python that acts as the
data layer for the application. This handles connections back to our Cosmos
database or any other API we might want to pull from.

If online connectivy isn't possible there's a QR code in the application that
can be read back in to a master system to aggregate results. That is what you'll
find under the 'data-reader' directory.

The 'trisonics-scouting' directory has an Angualr v13 application that is the
user interface users see. This is a TypeScript (typed JavaScript) based project.

The Angular applicatino and Python api can deploy to Azure Static Web Apps via
Github Actions. Anything checked into the 'release' branch goes live in our
testing site.

# Install Instructions
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

You will likely want to put something like the following in a ```setenv.bat``` file witin the api directory to set them easily before starting a session:
```
set COSMOS_ENDPOINT=https://.....
set COSMOS_KEY=mumbojumbo
set TBA_KEY=moremumbojumbo
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