# Rate Database Project

This project is designed to manage and store various rates such as technician rates, machinery rates, and security rates. It consists of a backend service built with TypeScript and a frontend application that interacts with the backend API.

## Project Structure

```
rate-database-project
├── backend                # Backend application
│   ├── src
│   │   ├── index.ts      # Entry point for the backend
│   │   ├── controllers    # Contains controllers for handling requests
│   │   │   └── ratesController.ts
│   │   ├── routes         # Defines API routes
│   │   │   └── rates.ts
│   │   ├── services       # Business logic for managing rates
│   │   │   └── ratesService.ts
│   │   ├── models         # Data models
│   │   │   └── rate.ts
│   │   ├── db            # Database configuration and migrations
│   │   │   ├── prisma
│   │   │   │   └── schema.prisma
│   │   │   └── migrations
│   │   └── utils          # Utility functions
│   │       └── logger.ts
│   ├── package.json       # Backend dependencies and scripts
│   ├── tsconfig.json      # TypeScript configuration for backend
│   └── .env.example       # Example environment variables
├── frontend               # Frontend application
│   ├── src
│   │   ├── App.tsx       # Main component of the frontend
│   │   ├── index.tsx     # Entry point for the frontend
│   │   ├── components     # UI components
│   │   │   ├── RateList.tsx
│   │   │   └── RateEditor.tsx
│   │   ├── api           # API calls to the backend
│   │   │   └── rates.ts
│   │   └── types         # Type definitions
│   │       └── rate.ts
│   ├── package.json       # Frontend dependencies and scripts
│   ├── tsconfig.json      # TypeScript configuration for frontend
│   └── public
│       └── index.html     # Main HTML file for the frontend
├── scripts                # Scripts for database management
│   └── seed.ts           # Database seeding script
├── docker-compose.yml     # Docker configuration
├── package.json           # Overall project dependencies and scripts
├── tsconfig.json          # Overall TypeScript configuration
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- Docker (for running the application in containers)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd rate-database-project
   ```

2. Install dependencies for the backend:
   ```
   cd backend
   npm install
   ```

3. Install dependencies for the frontend:
   ```
   cd frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. Start the frontend application:
   ```
   cd frontend
   npm start
   ```

3. Alternatively, you can run the entire application using Docker:
   ```
   docker-compose up
   ```

### Usage

- Access the frontend application at `http://localhost:3000`.
- The backend API is available at `http://localhost:5000/api/rates`.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

### License

This project is licensed under the MIT License.