## Project features (Please read me!) ##
- Tech stacks: nodejs, typescript, esm, sqlite3, jsonwebtoken, eslint, typeorm, ubuntu-server 25, vps server cloud ssh.
- APIs include: register(), login(), logout(), get-profile().
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
- Database and syntax use SQLITE3. See on NPM document.
- Database table and table data is avaiable when first run app (init.sql will generated).
- Index root entry file: index.ts.
- Refresh token save in cookie.
- Login response standard base on OAUTH 2.0.
- Project use CI/CD with Github Actions workflows.

## Steps on run project (on local) ##
0. Clone the project, install node version >22, npm,.. setup your environment,..bla bla,..
1. Open terminal with folder project path.
2. Install package dependencies (librabry): ```npm install```.
3. Create a new .env file on root. (Copy .env.example and paste).
4. Run program: ```npm run dev```.
6. Test api. Path / default for print Hello World! (my images test by postman in /src/assets/images..).
7. Enjoy.

## Steps on build project ##
1. Run build: ```npm run build ```. The dist folder will generate.
2. Run program ```node dist/index.js```.
3. Or run program in PM2 background: ```pm2 start dist/index.js --name jwt-cookie-api```.

## Steps CI/CD with Github Actions workflows ##
1. Setup an (vmware/any vps cloud) server (i use an ubuntu server 25).
2. Install node/npm and pm2 via NVM.
3. Make sure Steps on build project done and Step on run but use pm2.
4. Open port/port forwarding 22 (SSH) to your server.
5. Generate pair key (pub/priv key) on your project path: ```ssh-keygen -t ed25519 -f github_action_key```.
6. Copy pub key to ```nano ~/.ssh/authorized_keys```.
7. Create some secrets in Secrets and variable on Github repo.
```SSH_PRIVATE_KEY```: Paste priv key value. Ex: -----BEGIN OPENSSH PRIVATE KEY----- ... -----END OPENSSH PRIVATE KEY-----.
```SERVER_HOST```: Fill your server ipv4 address. Ex: 115.73.1.53.
```SERVER_USER```: Fill username login to ssh server. Ex: deploy.
```APP_PATH```: Fill your project path on server. Ex: /home/deploy/app/repo-name.
8. Export npm and pm2 path on your server by:
- Using: ```which npm```, ```which pm2```.
- Using ```nano ~/.profile```.
- Adding at the end of file: ```export PATH=$PATH:{PATH_NPM}:{PATH_PM2}```. Ex: ```export PATH=$PATH:/home/deploy/.nvm/versions/node/v25.5.0/bin```.
9. Edit file ```.github/workflows/deploy.yml``` config suit to your environment.
10. Commit và Push to test CI/CD.

## Somethings you could change to your like ##
- Change .env value to your key secret.
- Change avatarUrl to your hobby image url online.
- Connect your DBMS to SQLITE by import file database.sqlite (i use DBEver).
- Change api url from local to your domain if deployed.
- To run format code: ```npm run lint```.
- Database SQLite not have UTC+time zone. So i made an avaiable function in ```/src/utils/date.js``` to convert (VN country) for future if you want to use.
- To test api login, use some username and password: user01 | 087663az, user02 | 087663az, user03 | 087663az.
- You may use advaced step by add ecosystem.config.cjs file to project to use pm2.

ALERT: Project just only used in development environment purpose!

#### ============================ THANKS FOR USING ============================ ####