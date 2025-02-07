## Introduction

This project is a wrapper application built on top of Okto using the @okto_web3/core-js-sdk. It aims to enhance the functionality and user experience of the Okto ecosystem by providing a streamlined and user-friendly interface.


## Tech Stack

* # Frontend (FR): React.js, TypeScript

* # Backend (BE): Node.js, Express

* # Blockchain SDK: @okto_web3/core-js-sdk

## Installation & Setup

# Prerequisites

Ensure you have the following installed:

* Node.js (>=16.x)

* npm or yarn

### Clone the Repository
Copy and paste the following command into your terminal:
```sh
git clone https://github.com/localakatsuki/wewillfixitlater.git
cd frontend
```

## Install Dependencies

Copy and paste the following command:
```sh
npm install
```
## Environment Variables

Create a .env file in the root directory and configure it with your Okto API keys and other necessary environment variables.

```sh
OKTO_API_KEY=your_api_key
PORT=3000
```

## Running the Application

# Start Backend

Copy and run the following command:

```sh
cd backend
npm run dev
```

# Start Frontend

Copy and run the following command:

```sh
cd frontend
npm start
```

Usage

- Users interact with the frontend UI, which communicates with the backend.
- The backend interacts with Okto using the `@okto_web3/core-js-sdk` to fetch and process blockchain-related data.

