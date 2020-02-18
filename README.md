# Usage

1. Clone the repository
2. Run the following command in the root directory:
    <code>yarn install</code>
3. create a file named <code>.env.development</code> in the root folder and make sure it contains the necessary details for your dev environment:
 <code>
    REACT_APP_API_KEY=<Url pointing to the instance of "thangs-social-service" you are currently working with>
    REACT_APP_WEBSITE_NAME=<The Document Title you wish to display>
    REACT_APP_IMG_PATH=<Url for the thumbnailer you are currently using **not currently relevant>
    NODE_PATH="src/"
    HTTPS=false
 </code>
 4. run the following command in the terminal to start the app:
 <code>yarn start</code>
