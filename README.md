# TourApp Documentation

## Overview

TourApp is a comprehensive travel and tourism platform designed to help users discover, plan, and book travel experiences, with a special focus on trekking adventures in Nepal. The application features AI-powered travel assistance, personalized trek suggestions, and a user-friendly interface for exploring destinations and booking tours.

## Architecture

TourApp follows a modern full-stack architecture with:

- **Frontend**: React-based SPA (Single Page Application) built with Vite
- **Backend**: Node.js/Express REST API
- **Database**: MongoDB for data persistence
- **AI Integration**: Hugging Face API for natural language processing and travel recommendations

### Tech Stack

#### Frontend

- **React**: UI library for building the user interface
- **React Router**: For client-side routing
- **Tailwind CSS**: For styling and responsive design
- **Framer Motion**: For animations and transitions
- **Axios**: For API requests
- **React Toastify**: For notifications
- **React Icons**: For UI icons
- **AOS (Animate On Scroll)**: For scroll animations

#### Backend

- **Express**: Web framework for Node.js
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: For authentication
- **Multer**: For file uploads
- **Nodemailer**: For email functionality
- **Axios**: For external API calls
- **Bcrypt**: For password hashing

## Project Structure

### Frontend Structure

```
Frontend/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   │   ├── AI/          # AI-related components
│   │   ├── Auth/        # Authentication components
│   │   ├── Tours/       # Tour and trek components
│   │   ├── Places/      # Place-related components
│   │   ├── Navbar/      # Navigation components
│   │   └── ...          # Other component directories
│   ├── context/         # React context providers
│   ├── data/            # Static data
│   ├── pages/           # Page components
│   ├── services/        # API service functions
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

### Backend Structure

```
server/
├── middleware/          # Express middleware
├── models/              # Mongoose models
├── public/              # Static files
├── routes/              # API routes
├── uploads/             # Uploaded files
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
└── server.js            # Server entry point
```

## Key Components

### Frontend Components

#### TrekSuggester

The TrekSuggester component allows users to find personalized trek suggestions based on their preferences. It features:

- A form for users to input their trek preferences (duration, difficulty, interests, budget)
- A tabbed interface for switching between the form and suggestions
- Animated cards displaying trek suggestions with images and details
- A "View Details" button that navigates to the TrekDetails page

#### Chatbot

The Chatbot component provides an AI-powered travel assistant that can answer questions about travel destinations, provide recommendations, and help with trip planning. It features:

- A chat interface with user and bot messages
- Real-time responses from the AI backend
- Loading animations and error handling
- Automatic scrolling to the latest message

#### TrekDetails

The TrekDetails component displays comprehensive information about a selected trek, including:

- High-quality images of the trek
- Detailed description and highlights
- Key information (duration, cost, difficulty)
- A "Book This Trek" button that navigates to the contact page

### Backend Routes

#### aiRoutes.js

The AI routes handle all AI-related functionality, including:

- Chat endpoint for the AI travel assistant
- Trek suggestions endpoint for personalized trek recommendations
- Travel recommendations endpoint for destination suggestions
- Error handling and fallback responses when the AI service is unavailable

#### tourRoutes.js

The tour routes manage tour-related functionality, including:

- Getting all available tours
- Getting tours by preferences
- Tour details and booking

## AI Integration

TourApp integrates with the Hugging Face API to provide AI-powered features:

1. **Travel Assistant**: The chatbot uses the Hugging Face API to generate natural language responses to user queries about travel.

2. **Trek Suggestions**: The trek suggester uses a combination of predefined trek data and AI-generated content to provide personalized trek recommendations.

3. **Fallback Mechanism**: When the AI service is unavailable, the application uses predefined responses to ensure a seamless user experience.

## Authentication and Authorization

TourApp implements a comprehensive authentication system:

- User registration and login
- JWT-based authentication
- Protected routes for authenticated users
- Role-based access control (admin vs. regular users)

## Setup Instructions

### Frontend Setup

1. Navigate to the Frontend directory:

   ```
   cd Frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```
   npm run dev
   ```

### Backend Setup

1. Navigate to the server directory:

   ```
   cd server
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   ```

4. Start the server:
   ```
   npm run dev
   ```

## Deployment

For production deployment:

1. Build the frontend:

   ```
   cd Frontend
   npm run build
   ```

2. Deploy the backend to a cloud provider (e.g., Heroku, AWS, DigitalOcean)

3. Set up environment variables on the cloud provider

4. Configure the frontend to point to the deployed backend API

## Future Enhancements

Potential future enhancements for TourApp include:

1. **Payment Integration**: Add payment processing for booking tours
2. **User Reviews**: Allow users to leave reviews and ratings for tours
3. **Offline Support**: Implement PWA features for offline access
4. **Multi-language Support**: Add support for multiple languages
5. **Advanced AI Features**: Implement more sophisticated AI features like image recognition for landmarks

## Conclusion

TourApp is a modern, feature-rich travel platform that leverages AI to provide personalized travel experiences. Its modular architecture and comprehensive documentation make it easy to understand, extend, and maintain.
# Tour-Final
