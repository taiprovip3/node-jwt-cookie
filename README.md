## Project features (Please read me!) ##
- APIs: register(), login(), logout(), get-profile();
- Project typescript was configured params;
- Project use ESM syntax (not CJS);
- Using import/export next modules syntax but compliper to CommonJS by ts-node-dev run (not module, NEXTJS). ts-node-dev support build CommonJS good;
- Project using tsx run in dev environment with ESM;
- Database and syntax using simple lite: SQLITE3;
- TypeORM hibernate entity relationship;
- Index root entry file: index.js;
- Refresh token save in cookie;
- Login response standard base on OAUTH 2.0;
- Using eslint format code;
- Authorization API in middleware;
- Middleware: verify token & check roles request (USER, MODERATOR, ADMIN);

## Steps on run project (on local) ##
1. Open folder project in terminal (or vscode workspace)
2. Install package dependencies (librabry): ```npm install```
3. Create a new .env file on root. (Copy .env.example and paste)
4. Run program: ``` npm run start:dev ```
5. Open your DBMS and import SQL scripts: ``` /src/database/migrations/*.sql ```
6. Test api. Path / default for print Hello World! (my images test by postman in /src/assets/images..)
7. Enjoy.

## Somethings you cound change to your like ##
- Change .env value to your key secret.
- Change avatarUrl to your hobby image url online.
- Connect your SQL-IDE to SQLITE (i use DBEver).
- Change api url from local to your domain if deployed.
- To run format code: ```npm run lint```
- Database SQLite not have UTC+ 1time zone. So i make avaiable function data.js in /src/utils.js to convert (VN country) for future if you want to use.



#### ============================ THANKS FOR USING ============================ ####