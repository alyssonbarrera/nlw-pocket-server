<div align="center" style="margin-bottom: 20px;">
  <img width="100%" src="./assets/thumbnail.png" alt="Print da tela de login e cadastro." />
</div>

# API

Goal tracking with weekly progress API

---
Documentation for the API can be found [here](https://documenter.getpostman.com/view/20700565/2sAXqmCmGh)
---

### 💻 To run on your machine, follow the steps below:  

<br/>

📄 Clone the project on your machine;  

🔐 Having done that, go into the project folder and create the .env file;  

📄 Once created, it should contain:  

```
# Database
DATABASE_URL="postgresql://docker:docker@localhost:5432/nlw_pocket_db"

#Server
PORT=3333
```
💡 Remember to update the variables based on your configurations.  

📂 Next, open the terminal in the project folder and run the following command:  

```shell
docker compose up
 ```

⌨ After that, it will be necessary to install the dependencies, so run the following command in your terminal:  

```shell
npm install
```

🌎 Next, run the migrations using:  

```shell
npm run migration:run
```

🚀 Finally, to start the application, run:  

```shell
npm run dev
```

📡 With everything set up, you will be able to access the application using:  

```text
http://localhost:3000
```

---

## Stack

- TypeScript
- Node.js
- PostgreSQL
- Fastify
- Drizzle ORM
- Zod