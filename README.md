# TODO List

## Getting Started

Follow the steps bellow to get things up and running:

```bash
# get mongodb up
docker compose up

# import everything inside ./postman to your postman collection

# run npm install
cd todo-list
npm ci

# run db migration scripts
npm run prisma:generate
npm run prisma:migrate

# run the application
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
