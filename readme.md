# Airbnb Clone

# Live on: https://homiego.onrender.com/

## Introduction
This project is an **Airbnb Clone** built using **Node.js, Express, MongoDB, and EJS**. The web application allows users to browse, search, and list rental properties. It also features user authentication, search filters, and a responsive UI.

## Features
- **User Authentication**: Sign up, login, and logout functionality.
- **Listings Management**: Users can create, edit, and delete listings.
- **Search and Filters**: Search by country, location, and category filters.
- **Responsive Design**: Fully responsive UI with Bootstrap for styling.
- **Session-Based Authentication**: User sessions managed using `express-session` and MongoDB.
- **EJS Templating**: Modular views using `ejs-mate`.
- **Navigation Bar & Filters Section**: Collapsible navbar and filters menu using Bootstrap.

## Tech Stack
- **Frontend**: HTML, CSS, Bootstrap, EJS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Atlas)
- **Authentication**: Passport.js (Local Strategy)

## Installation
### Prerequisites
Ensure you have the following installed:
- **Node.js** (v14+ recommended)
- **MongoDB** (or MongoDB Atlas for cloud database)

### Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/airbnb-clone.git
   cd airbnb-clone
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up environment variables**
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```env
     MONGO_URI=your_mongodb_connection_string
     SESSION_SECRET=your_secret_key
     ```
4. **Run the application**
   ```bash
   node app.js
   ```
    OR (install nodemon package)
    ```bash
   nodemon app.js
   ```
5. **Open in Browser**
   - Visit `http://localhost:8080`

## Project Structure
```
/airbnb-clone
│── /public           # Static assets (CSS, JS, Images)
│── /views            # EJS templates
│── /routes           # Express routes
│── /models           # Mongoose schemas
│── /init             # Initialization files (DB, config, etc.)
│── app.js            # Main Express app file
│── package.json      # Dependencies & scripts
│── controller        # To control the flow of route logic
│── utils             # Error Control Middleware 
│── .env.example      # Environment variables (example file)
```


## Future Enhancements
- Add **booking system** with Stripe payment integration.
- Implement **Google OAuth authentication**.
- Improve **UI animations and styling**.

## Contributors
- **Anup Dangi** 
- Contributions are welcome! Feel free to submit pull requests.

## License
This project is licensed under the **MIT License**.

