## Project features (Please read me!) ##
- Tech stacks: nodejs, typescript, esm, sqlite3, jsonwebtoken, eslint, typeorm.
- APIs include: register(), login(), logout(), get-profile();
- Project use modern ESM syntax (import from). Not like old CJS (require..).
- Project use node version > 22.
- Project use typescript > 5.0 (not legacy, stricter than old).
- Project use tsx to run code typescript in dev environment with ESM, with node.
- Project use typescript compiler to compile all code to JS dist folder.
- Project use eslint to format code.
- Project use Authorization API in middleware.
- Project custom middleware: verify token & check roles request (USER, MODERATOR, ADMIN).
- Project custom standard response api's information (success or error request).
- TypeORM current is intense conflict with typescript 5.0 beacause the stricter. Therefore, the mapping entity relationship has some different from traditonal.
- ts-node-dev, module, nextjs, next module, tsx, tsx is very comlex thing to understand. Just follow tsconfig.json.
- ts-node-dev support build CommonJS good.
- Database and syntax using simple lite: SQLITE3. SQLITE3 have no default timestamp server. So i made a simple `convertTimeToGM7T` function in date.js to convert time. You could change the time zone code suit on your country.
- Database table and table data is avaiable when first run app (init.sql will generated).
- Index root entry file: index.ts.
- Refresh token save in cookie.
- Login response standard base on OAUTH 2.0.

## Steps on run project (on local) ##
0. Clone the project, install node version >22,.. setup your environment,..bla bla,..
1. Open terminal with folder project path.
2. Install package dependencies (librabry): ```npm install```
3. Create a new .env file on root. (Copy .env.example and paste)
4. Run program: ```npm run dev```
6. Test api. Path / default for print Hello World! (my images test by postman in /src/assets/images..)
7. Enjoy.

## Step build project ##
1. Run build: ```npm run build ```. The dist folder will generate.
2. Run program ```node dist/index.js```.
2. Or run program in PM2 background: ```pm2 start dist/index.js --name jwt-cookie-api```.

## Somethings you could change to your like ##
- Change .env value to your key secret.
- Change avatarUrl to your hobby image url online.
- Connect your DBMS to SQLITE by import file database.sqlite (i use DBEver).
- Change api url from local to your domain if deployed.
- To run format code: ```npm run lint```
- Database SQLite not have UTC+ 1time zone. So i make avaiable function data.js in /src/utils.js to convert (VN country) for future if you want to use.
- To test user login api use username and password: user01 | 087663az, user02 | 087663az, user03 | 087663az


#### ============================ THANKS FOR USING ============================ ####