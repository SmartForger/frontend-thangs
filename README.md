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
