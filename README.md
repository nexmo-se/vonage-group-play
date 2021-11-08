# Vonage Group Play
This documentation is for Vonage Group Play. In short, it uses `create-react-app`. You can refer to the deployment guide provided by `create-react-app` for more information.

## Configuration
You need to setup your `apiKey`, `sessionId`, and `token` inside `src/pages/Main/index.tsx`.

## Running the Application in Development Mode
1. Make sure you have installed the dependencies by running `yarn install` or `npm install`
2. Run `yarn start` or `npm run start` to start in development mode
3. The server should run on port 3000.

## Running the Appliaction in Production Mode
There are several way for the application to be deployed. This only provide you a guide to build the application into a static HTML page. You can deploy the static HTML page to several hosting provider such as Firebase.

1. Install the dependencies by running `yarn install` or `npm install`
2. Build the appliation `yarn build` or `npm run build`

You will see a `build/` folder in created. Next, you can upload the build folder into the hosting provider.