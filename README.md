# Stayora

Stayora is a full-stack travel and accommodation listing platform inspired by Airbnb-style experiences. Users can browse listings, search by location and category, create new property listings, upload images, leave reviews, and manage their own homes.

Live demo:
[https://project-1web.onrender.com/listings](https://project-1web.onrender.com/listings)

## Features

- Browse and discover travel stays from a MongoDB-backed listing database
- Search listings by destination, title, location, or country
- Filter listings by category
- Add new property listings with image upload support
- Edit and delete owned listings
- User signup/login/logout using Passport.js and local authentication
- Leave ratings and reviews on listings
- Cloudinary integration for storing listing images
- Mapbox geocoding support for location-based listing creation
- Flash messages and session-based user handling

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- EJS + EJS Mate
- Passport.js
- Cloudinary
- Mapbox SDK
- Bootstrap

## Project Structure

```bash
project_1web/
├── app.js
├── cloudeConfig.js
├── controllers/
│   ├── listings.js
│   └── users.js
├── init/
│   └── data.js
├── middleware.js
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── utils/
│   ├── ExpressError.js
│   ├── listingCategories.js
│   └── wrapasync.js
├── views/
│   ├── includes/
│   ├── layouts/
│   ├── listings/
│   ├── routes/
│   ├── users/
│   └── error.ejs
├── .env.example
├── package.json
├── schema.js
└── README.md
```

## Prerequisites

- Node.js 20.11.1 or compatible version
- MongoDB database
- Cloudinary account
- Mapbox access token

## Installation

1. Clone the repository

```bash
git clone <repository-url>
cd project_1web
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the project root and add the required environment variables:

```env
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloud_api_key
CLOUD_API_SECRET=your_cloud_api_secret
MAPBOX_TOKEN=your_mapbox_token
ALTASDB=your_mongodb_connection_string
SECRET=your_session_secret
```

> Do not commit your real `.env` file to version control.

## Running the App

Start the server:

```bash
node app.js
```

If you want live reload during development:

```bash
npx nodemon app.js
```

Then open:

```bash
http://localhost:3000
```

## Usage

- Sign up for a new account from the signup page
- Log in to add or manage listings
- Create a new home listing with title, location, price, description, category, and image
- View listing details to read and add reviews
- Use the search bar in the navbar to find listings by keyword

## Notes

This project is built as a learning and portfolio-style web application for managing short-term rental listings. It demonstrates a practical full-stack Node.js workflow using Express, MongoDB, image uploads, map geocoding, and user authentication.

## License

This project is for educational and portfolio use.
