# jwt-auth-example
## Authentication Application
### Server
- PostgreSQL
- TypeORM
- TypeScript
- Node
- ApolloServer / Express
- JSONWebToken
### Web
- TypeScript
- React
- GraphQL
- ApolloClient

### How to Run Application
1. **Clone Repository**
- **HTTPS** `git clone https://github.com/dustin-longenecker/jwt-auth-example.git`
- **SSH** `git clone git@github.com:dustin-longenecker/jwt-auth-example.git`
- **GitHub CLI** `gh repo clone dustin-longenecker/jwt-auth-example`
2. **Setup PostGreSQL Server**
   1. [Download](https://postgresapp.com/downloads.html) PostgreSQL APP
   2. Start server
   3. `createdb jwt-auth-example`
   4. Amend `database: ` in [jwt-auth-example/server/ormconfig.json](server/ormconfig.json) with `jwt-auth-example`
3. **From Folder `/jwt-auth-token`**
   - **Start Server**
   - `cd server && yarn install && yarn start`
   - **Start Web**
   - `cd web && yarn install && yarn start`

#### Package Dependencies
- [Server](server/package.json)
- [Web](web/package.json)
- [ORM Config](server/ormconfig.json)


   
#### Video Guide
[JWT Authentication Node.js Tutorial with GraphQL and React](https://www.youtube.com/watch?v=25GS0MLT8JU)