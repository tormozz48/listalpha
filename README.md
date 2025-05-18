# ListAlpha Competitor Finder

Test task for position in ListAlpha company

## Task description

The goal is to be able to find out 5 competitors for a given business based on its size, industry, geographic position and nature of operations. For example if an investor is looking at an American shoe company (e.g., Nike), the competitive list should include other American or global shoe companies (Addidas, Puma, etc.).

However if I am looking at a Ukranian software development oursourcing company (e.g., SoftServe), I should get only other Ukranian outsourcing companies (Infopulse, N-iX, etc.)

I think that the current OpenAI model should be good enough to perform this analysis, however we have not done this  before so it would be great to test first.

Technical requirements:

- Take the search string from the front end which will be in the form of domain url
- Pass it to Apollo.io (company database) to enrich it and get the CompanyInfo JSON which will contain a bunch of helpful data on the company
- Create an Open AI GPT prompt that will analyse the target company and respond with 5 competitors
- The design and structure of the prompt is for you to develop. Please focus on achieving the best results for the end customer - i.e., the most accurate and thoughtful list of competitors
- Pass the list from OpenAI to Apollo.io again to enrich the companies and find our the name, logo and description
- Present the results back to the front end so that the user can view them
- EXTRA BONUS: Some of our customers have asked for a custom score that allows to judge how similar a given competitor is to the target. E.g., Infosys (Indian outsourcing company is not very similar to SoftServe thus the score would be 4 or 6). However EPAM is very similar to SoftServe, thus the score would be 8 or 9. if you have some time, can you please think of how we can accomplish this and include it into the API response payload

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v8 or later)
- Apollo.io API key
- Google Gemini API key

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/listalpha.git
   cd listalpha
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:

   ```env
   APOLLO_API_KEY=your_apollo_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

### Running the Application

1. Start the development server

   ```bash
   npm run start:dev
   ```

2. The API will be available at `http://localhost:3000`

## Testing

### Running Unit Tests

```bash
npm run test
```

### Running End-to-End Tests

```bash
npm run test:e2e
```

### Running Linting

```bash
npm run lint
```

## API Endpoints

### Status Check

```http
GET /api/status
```

Returns the status of the API.

### Search for Competitors

```http
POST /api/search
```

Body:

```json
{
  "searchValue": "example.com"
}
```

Returns a list of competitors for the given domain.

## Third-Party Libraries

### Backend Framework

- [NestJS](https://nestjs.com/) - A progressive Node.js framework for building efficient and scalable server-side applications.

### API Integration

- [Apollo.io](https://www.apollo.io/) - Company database used for enriching organization data.

### AI Services

- [Google Gemini AI](https://ai.google.dev/) - AI model used for generating competitor information based on company data.
- [Vercel AI SDK](https://sdk.vercel.ai/docs) - SDK for integrating with AI models.

### Testing

- [Jest](https://jestjs.io/) - JavaScript testing framework.
- [Supertest](https://github.com/ladjs/supertest) - HTTP assertion library for testing API endpoints.
- [Nock](https://github.com/nock/nock) - HTTP server mocking and expectations library for Node.js.

### Validation

- [Zod](https://zod.dev/) - TypeScript-first schema validation library.
- [class-validator](https://github.com/typestack/class-validator) - Decorator-based property validation for classes.
- [class-transformer](https://github.com/typestack/class-transformer) - Transform plain objects to class instances and vice versa.

### Configuration

- [dotenv](https://github.com/motdotla/dotenv) - Loads environment variables from a .env file.
- [@nestjs/config](https://docs.nestjs.com/techniques/configuration) - Configuration module for NestJS.

### Development Tools

- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript.
- [ESLint](https://eslint.org/) - Tool for identifying and reporting on patterns in JavaScript/TypeScript.
- [Prettier](https://prettier.io/) - Code formatter.
