# Trisonics Scouting Application

This repository consists of two related projects. Under the 'api' directory you'll find an Azure Function v4 projedct written in Python that acts as the data layer for the application. This handles connections back to our Cosmos database or any other API we might want to pull from.

The 'trisonics-scouting' directory has an Angualr v13 application that is the user interface users see. This is a TypeScript (typed JavaScript) based project.

Both applications deploy to Azure Static Web Apps via Github Actions. Anything checked into the 'release' branch goes live.