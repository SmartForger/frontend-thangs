# Thangs Front-end

## Usage

1. Clone the repository

2. Run the following command in the root directory:

```bash
yarn install
```

3. Create a file named `.env.development` in the root folder and make sure it contains the necessary details for your dev environment:

```ini
REACT_APP_API_KEY=(Url pointing to the instance of "thangs-social-service" you are currently working with, eg: http://localhost:8000/api/)
REACT_APP_WEBSITE_NAME=(The Document Title you wish to display)
REACT_APP_IMG_PATH=(Url for the thumbnailer you are currently using **not currently relevant)
NODE_PATH="src/"
HTTPS=false
HOOPS_MODEL_PREP_ENDPOINT_URI=https://hoops-scs-dot-gcp-and-physna.uc.r.appspot.com/api/prepare-model
HOOPS_WS_ENDPOINT_URI=wss://hoops-scs-dot-gcp-and-physna.uc.r.appspot.com
```

4. Run the following command in the terminal to start the app:

```bash
yarn start
```

## Tests

Run Jest (unit tests) with:

```bash
yarn test
```

Open Cypress (integration & UI tests) with:

```bash
yarn cypress
```

Run Cypress tests headless with:

```bash
yarn test:cypress
```

## Formatting (with [Prettier](https://prettier.io/))

Run manually with:

```bash
yarn format
```

### Editor configuration

- [VSCode extension](https://prettier.io/docs/en/editors.html#visual-studio-code)

```jsonc
{
    ...
    "editor.formatOnSave": false,
    // Only auto-format if a prettier.config.js file exists in project codebase
    "prettier.requireConfig": true,
    // Plain Javascript files
    "[javascript]": {
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    // React/JSX files
    "[javascriptreact]": {
        "editor.formatOnSave": true
    },
    ...
}
```

## Deploying to Production

1. Ensure you have the [Gcloud SDK](https://cloud.google.com/sdk/install) installed  
  
2. Initialize your [Gcloud](https://cloud.google.com/sdk/gcloud/reference/init)
  
3. Create a new [Gcloud Configuration](https://cloud.google.com/sdk/gcloud/reference/init) following the prompts to target the correct project 

4. Build the project by running:
```bash
yarn build
```
  
5. Run the following in the route directory to deploy:
```bash
gcloud app deploy
```  
  
6. Once the app has finished deploying you can run the following to view the app in production:
```bash
gcloud app browse
```


