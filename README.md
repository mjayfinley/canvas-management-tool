# Canvas Management Tool

Lightweight application for tracking and managing individuals canvassing a given region.

## Features

-   Add and remove your canvassers
-   View list of existing canvassers
-   Draw, edit, and delete regions on map
-   Assign one or more canvassers to each region
-   View region details w/ assigned canvassers
-   Detailed dashboard to view canvassers stats
-   Fully mobile and desktop responsive design w/ light and dark mode

## Startup

Once cloned, run the following commands to get up and running:

```
cd canvas-management-tool
npm install
npm run dev
```

In a seperate terminal, run the following command in the repo to start the mock database:

```
npm run db
```

Then, open your browser and navigate to:

```
http://localhost:5173/
```

## Tech Stack

-   React w/ Vite
-   Typescript
-   MUI
-   Mapbox
-   Chart.js/React-chartjs-2
-   Turf
-   React Router
-   React hook form

## Screenshots (all of these are in dark mode)

Map View+Canvassers in Desktop
<img width="1546" alt="Map View" src="https://github.com/user-attachments/assets/4bcb1b0f-694b-4341-98ac-9416a8ef3458" />

Map View+Canvassers Icon in Mobile
<img width="293" alt="Map View Mobile" src="https://github.com/user-attachments/assets/90fd4954-dd0f-4321-8398-1d93dee506e5" />

Dashboard in Desktop
<img width="1543" alt="Dashboard View" src="https://github.com/user-attachments/assets/1fd6b3ea-4a39-47ce-b638-6e7f407bfbfb" />

Dashboard in Mobile
<img width="321" alt="Dashboard View Mobile" src="https://github.com/user-attachments/assets/826655e2-aff6-483c-bc14-4b1b3aabcad1" />


## Architecture Decisions

#### Auth

-   For Auth I used a basic token based system, since I have no real backend or way to generate a real token, I just used the user's id and save it to `localStorage` for page refreshes.
-   Secondly, I protect the `Dashboard` and `Map` components using `react-router` - without a token, the user gets redirected back to Login
-   The forms for both Login and Register are built using `react-hook-form` to manage the local state and submission
-   Upon registration, I store the user in `db.json` using `json-server` in a simple object containing an auto-generated `id` (from `json-server`), `username`, `email`, and for sake of this project with a mocked database, just a plain-text password.
-   Upon login - I check the mocked db for a username and password match, if there is a match, login, if not, an error is shown
-   Right now, no matter the user, the same data is loaded into the app as far as regions, canvassers, assignements is concerned
-   Future ideas
    -   I would have each user be assigned to a campagin in a many-to-many relationship where a multiple users can manage multiple campaigns which each contain unique canvassers and regions

#### Map

-   Mapbox - I use two hooks in my Map component, one to set up the map and the other to handle any updates (draw, edit, markers etc). These both handle everything my map needs including mouse/touch/click events to allow the user to manage the regions.
-   Users can add canvassers or edit regions by clicking on a given region, which causes a popover to appear with the two selections available.
-   Once a canvasser is selected, a marker will be placed over the region with the canvassers initials. Multiple markers can be added to regions. The markers will spread around from the center thanks to the library `@turf`, which has a feature called `center-of-mass` which allows me to dynamically find the center of each polygon.
-   For right now I just have the map centered on my neighborhood for testing/demo purposes. Eventually I'd add a way to get the user's current location so that the map is centered where they are, and also add the ability to quickily select a state/country for a user to then zoom in on.
-   Another thing for the future I'd add is a way to store the map area the user was last viewing - either in local storage or on the backend.
-   Some notes on Mapbox - there is a React wrapper version `react-map-gl`, which I did not use simply because the documentation wasn't quite as robust. Since I had not used Mapbox before, I needed to learn it and have some references, which base `mapbox` had - along with some good tutorials on how to build things in React without the wrapper.

#### Canvassers

-   Viewable on the side of the map with the ability to add/delete
-   Clicking the `+` icon allows the user to create a new canvasser with the first and last name, along with email fields being required
-   Each card also displays the number of regions assigned to the canvasser
-   Future ideas
    -   Editing canvassers
    -   Click action on the canvasser card to highlight or only show their markers and assigned regions
    -   Drag/drop feature where you drag either their card or a pin attached to their card onto a region

#### Dashboard

-   Top section - I just have some mocked data that gets generated when I create a canvasser with relevant statistics - these would be the sums of each canvassers stats
-   The bottom section contains 2 charts by default for all canvassers, using Chart.js
-   The dropdown allows the user to select specific canvassers, which loads in a new chart for their mocked KPI's

#### Mobile View

-   `MUI` is used for handling the styling, responsiveness, and handling light/dark mode. All views are mobile and desktop friendly
-   One major change between desktop and mobile - the canvassers UI is now handled with an icon click as seen in the screenshot. When the icon is clicked, a canvasser drawer is opened to manage the adding, deleting, and viewing of canvassers
-   Second major change would be the moving of the navbar to a hamburger menu in mobile view
