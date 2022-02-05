# Trisonics Scouting Application

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