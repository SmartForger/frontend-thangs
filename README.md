# Thangs Front-end

- [Thangs Front-end](#thangs-front-end)
  - [Requirements](#requirements)
  - [Usage](#usage)
  - [Tests](#tests)
    - [Cypress setup](#cypress-setup)
  - [Webpack bundle analyzer](#webpack-bundle-analyzer)
  - [Local development with API Platform](#local-development-with-api-platform)
  - [Formatting (with Prettier)](#formatting-with-prettier)
    - [Editor configuration](#editor-configuration)
  - [Deploying to Production](#deploying-to-production)
  - [HOOPS Communicator and Web Viewer](#hoops-communicator-and-web-viewer)
    - [Summary of Hoops Data Model](#summary-of-hoops-data-model)
    - [Hoops Usage](#hoops-usage)
  - [GAE Routing](#gae-routing)
  - [Updating CORS rules on Google Cloud Storage buckets](#updating-cors-rules-on-google-cloud-storage-buckets)
  - [Circle Ci](#circle-ci)
  - [Storybook](#storybook)
    - [How to run](#how-to-run)

## Requirements

- [NodeJs (> 10.xx.x)](https://nodejs.org/en/)
- [Yarn](https://www.npmjs.com/package/yarn)

## Usage

1. Clone the repository
2. If you are currently not a part of Physna's private NPM org, reach out to Raul or Brandon for an invite
3. If you are not currently logged into NPM in your terminal, run `npm adduser` on your machine and log in with your credentials
4. Once you're logged in, run `npm token create` and follow the prompts to create your token
    - For `thangs-react`, you only need a readonly token
5. In your .bashrc/.zshrc/shell profile, add `export NPM_TOKEN=YOUR_TOKEN_HERE`
6. Reload your terminal or manually export the token to your path
7. Run the following command in the root directory:
    ```bash
    yarn install
    ```
8. Create a file named `.env.development.local` in the root folder and make sure it contains the necessary details for your dev environment:
    ```ini
    REACT_APP_WEBSITE_NAME=(The Document Title you wish to display)
    REACT_APP_API_KEY=https://development-api-platform-dot-thangs.uc.r.appspot.com/
    REACT_APP_IMG_PATH=(Url for the thumbnailer you are currently using **not currently relevant)
    NODE_PATH="src/"
    HTTPS=false
    GENERATE_SOURCEMAP=false
    REACT_APP_HOOPS_MODEL_PREP_ENDPOINT_URI=https://dev-thangs-hoops-server-dot-thangs.uc.r.appspot.com/api/prepare-model
    REACT_APP_HOOPS_WS_ENDPOINT_URI=wss://dev-thangs-hoops-server-dot-thangs.uc.r.appspot.com
    REACT_APP_THUMBNAILS_HOST=https://development-thangs-thumbs-dot-thangs.uc.r.appspot.com/convert/
    REACT_APP_TIW_THUMBNAILS_HOST=https://development-thangs-thumbs-dot-thangs.uc.r.appspot.com/tiw
    REACT_APP_MODEL_BUCKET=https://storage.googleapis.com/thangs-public/thumbnails/production/
    REACT_APP_GOOGLE_CLOUD_PROJECT_ID=thangs
    REACT_APP_GOOGLE_CLOUD_ERROR_REPORTING_KEY=AIzaSyCUmGwa9UJArRbPKt5YvT8ogf8EnEJCRyQ
    REACT_APP_GOOGLE_OAUTH_CLIENT_ID=652666760169-ndjpimc700rnh4hevhe94ep5225coa9v.apps.googleusercontent.com
    REACT_APP_GOOGLE_OAUTH_REDIRECT_URI=https://development.thangs.com/authenticate/google
    REACT_APP_FACEBOOK_OAUTH_CLIENT_ID=1012480789175810
    REACT_APP_FACEBOOK_OAUTH_REDIRECT_URI=https://development.thangs.com/authenticate/facebook
    REACT_APP_OPTIMIZELY_API_KEY=RnhiUtviYt3wbWKaEdpLN
    ```
9. Run the following command in the terminal to start the app:
    ```bash
    yarn run dev
    ```

    *NOTE:* If updating the web worker files (src/workers/*), you'll need to run `yarn build:workers` after those changes and reload the app. This may change in the future (i.e. along with a future migration away from `create-react-app`).

## Tests

Run Jest (unit tests) with:

```bash
yarn test
```

Open Cypress (integration & UI tests) with:

```bash
yarn cypress:open
```

Run Cypress tests headless with:

```bash
yarn test:cypress
```

See Cypress options with:

```bash
yarn cypress
```

### Cypress setup
Make sure you are pointed at staging and using HTTPS by setting these keys in .env.development.local:

```ini
REACT_APP_API_KEY=https://staging-api-platform-dot-gcp-and-physna.uc.r.appspot.com/
HTTPS=true
```

## Webpack bundle analyzer

To inspect the webpack generated js bundles run

```bash
yarn analyze
```

## Local development with API Platform
To have the Thangs React app work with your local version of [API Platform](https://github.com/physna/api-platform), start up the API Platform and set this key in .env.development.local:

```ini
REACT_APP_API_KEY='http://localhost:8080/'
```

## Formatting (with [Prettier](https://prettier.io/))

Run manually with:

```bash
yarn lint --fix
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

## HOOPS Communicator and Web Viewer

https://docs.techsoft3d.com/communicator/latest/build/overview/getting-started.html

> "HOOPS Communicator is an SDK for development of 3D engineering applications in a
> web-browser. Its main component is the HOOPS Web Viewer, a powerful and flexible
> JavaScript library purposely built for engineering data, and based on a graphics
> kernel designed for high performance visualization."

HOOPS Communicator utilizes its own proprietary file format called [Stream Cache
(SC)](https://docs.techsoft3d.com/communicator/latest/build/prog_guide/viewing/data_model/stream_cache/overview.html).
The HOOPS Stream Cache Server facilitates "fast, granular and intelligent"
streaming via a direct WebSocket connection to the HOOPS Web Viewer component
running in the browser.

### Summary of Hoops Data Model

A node is the basic building block of the model tree in the Web Viewer. All
visible or non-visible geometry and attributes are always associated with a
node. A node may contain many child nodes, or it can just encapsulate a single
entity.

Each node has a NodeId, a unique identifier generated when the model is
authored, that will stay persistent when loading the same model multiple times.
Functions that operate on nodes will either return a NodeId or will use it as
input.

The node hierarchy in the Web Viewer forms a tree like structure with a single
root node at its top. The root node will always have one child node per loaded
model with the hierarchy of each loaded model underneath it. Only the _leaf
nodes_ of the model tree can contain mesh geometry and any nodes returned from a
selection will always point to leaf nodes.

**Hoops Data Model Docs:** https://docs.techsoft3d.com/communicator/latest/build/prog_guide/viewing/data_model/model-tree.html

![Hoops data model node hierarchy tree](https://docs.techsoft3d.com/communicator/latest/build/prog_guide/viewing/data_model/images/model-tree-two-loaded-models.png)

### Hoops Usage

Create and start a Hoops WebViewer.

- WebViewer API Ref: https://docs.techsoft3d.com/communicator/latest/build/api_ref/typedoc/classes/communicator.webviewer.html
- Configuration docs: https://docs.techsoft3d.com/communicator/latest/build/prog_guide/viewing/configuration.html
- Callback docs: https://docs.techsoft3d.com/communicator/latest/build/prog_guide/viewing/callbacks.html

```javascript
const viewer = new Communicator.WebViewer({
  container: document.getElementById('#hoops-container'),
  endpointUri: 'ws://hoops-stream-cache-server/websocket/uri',
  model: `modelName.scz`,
  rendererType: Communicator.RendererType.Client,
  // see configuration docs...
});

viewer.setCallbacks({
  sceneReady() {
    console.log("Scene loaded!")
  },
  modelLoadFailure(name, reason, e) {
    console.error('HOOPS failed loading the model:', e);
  },
  // see callback docs...
});

viewer.start()

const handleResize = () => {
  viewer.resizeCanvas();
}

window.addEventListener('resize', handleResize);

setTimeout(function cleanup() {
  window.removeEventListener('resize', handleResize);
  viewer.shutdown() // release memory
}, 5000)
```

For interacting with the display and canvas, look at the `viewer.view` object ([docs](https://docs.techsoft3d.com/communicator/latest/build/api_ref/typedoc/classes/communicator.view.html)).

```javascript
viewer.view.setDrawMode(
  Communicator.DrawMode.WireframeOnShaded
);
```

For interacting with the model data (nodes, faces, lines, meshes, geometry,
colors), look at the `viewer.model` object ([docs](https://docs.techsoft3d.com/communicator/latest/build/api_ref/typedoc/classes/communicator.model.html)).

```javascript
/**
 * Recursively walk the node hierarchy down to leaves
 */
function gatherLeafNodeIds(nodes) {
  return nodes.flatMap(node => {
    const kids = viewer.model.getNodeChildren(node);
    if (kids.length === 0) {
      return node;
    }
    return gatherLeafNodeIds(kids);
  });
};

const rootNode = viewer.model.getAbsoluteRootNode();
const topLevelModelNodes = viewer.model.getNodeChildren(rootNode); // one per loaded model

const allLeafNodeIds = gatherLeafNodeIds(topLevelModelNodes);
```

## GAE Routing

We override GAE's default routing with a [dispatch file][0].

Any changes to these rules need to be explicitly deployed, the following command will deploy your routing rules:

```bash
gcloud app deploy dispatch.yaml
```

You can reference [dispatch.yaml syntax][1] for more information about this file.

[0]: https://cloud.google.com/appengine/docs/standard/python3/how-requests-are-routed#routing_with_a_dispatch_file "How requests are routed"
[1]: https://cloud.google.com/appengine/docs/standard/python3/reference/dispatch-yaml#deploying_the_dispatch_file] "`dispatch.yaml` reference"

## Updating CORS rules on Google Cloud Storage buckets

The GCS CORS rules are defined in their respective `cors-<env>.json` files in this repository. To set these rules you must use `gsutil cors set <rules.json> <bucket-uri>`. You can fetch the applied rules with `gsutil cors get <bucket-uri>`.

Below are some examples:

Update the CORS rules on the production bucket:

```bash
gsutil cors set cors-production.json gs://gcp-and-physna.appspot.com
```

Update the CORS rules on the staging bucket:

```bash
gsutil cors set cors-staging.json gs://staging-thangs-uploads
```

## Circle Ci

This repo is managed by Circle Ci which comes with two considerations:

1. Any commits to the `development` branch will be automatically deployed to the staging environment

2. Any commits to the `master` branch will be automatically deployed to the production environment (with non promote flag, allowing some quick testing before going fully live)

With these considerations in mind, make sure to always follow our branching strategy and create PR's for any changes, and when merging into `development` if there are possible breaking changes, let the team know in slack (others may be currently testing in staging)

## Storybook

This is a tool we use to make it easier to develop and iterate on components in
isolation.

The best place to keep stories is as siblings to the component they test, to
encourage more focused stories.

### How to run
```
yarn storybook
```
- Then open http://localhost:9009/
+
