/*
 * Used to update src/@services/graphql-service/fragmentsTypes.json.
 *
 * BEFORE RUNNING: check your env file to be sure that it includes the required
 * env vars.
 */
const axios = require('axios');
const { promises: fs } = require('fs');

const SOCIAL_SERVICE_URL = process.env.SCRIPTS_SOCIAL_SERVICE_URL;
const email = process.env.SCRIPTS_SOCIAL_SERVICE_EMAIL;
const password = process.env.SCRIPTS_SOCIAL_SERVICE_PASSWORD;

async function getToken({ email, password }) {
    const response = await axios.post(`${SOCIAL_SERVICE_URL}/api/login/`, {
        email,
        password,
    });
    const { access } = response.data;
    return access;
}

const SCHEMA_QUERY = `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `;

async function requestFragments(token) {
    const { data: result } = await axios.post(
        `${SOCIAL_SERVICE_URL}/graphql/`,
        {
            variables: {},
            query: SCHEMA_QUERY,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    // here we're filtering out any type information unrelated to unions or interfaces
    const filteredData = result.data.__schema.types.filter(
        type => type.possibleTypes !== null
    );
    result.data.__schema.types = filteredData;
    return result.data;
}

async function main() {
    try {
        const token = await getToken({ email, password });
        const fragments = await requestFragments(token);
        await fs.writeFile(
            './src/@services/graphql-service/fragmentTypes.json',
            JSON.stringify(fragments)
        );
        console.log('Fragment types successfully extracted!');
    } catch (err) {
        console.error('Error writing fragmentTypes file', err);
    }
}

main();
