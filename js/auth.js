/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */
const btn = document.getElementById('generate')
// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = '467014818858-nkdcklppbbd0v561a2ftqml252jtaqmt.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBNDNwveK8pQoUdz59VFHDJHR6LEoPDaZI';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('gapi').addEventListener('load', gapiLoaded)
document.getElementById('gis').addEventListener('load', gisLoaded)

document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.display = 'none';
btn.style.display = 'none'

/**
 * Callback after api.js is loaded.
 */

function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById('authorize_button').style.visibility = 'visible';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw (resp);
    }
    document.getElementById('signout_button').style.display = 'inline-block';
    btn.style.display = 'inline-block'
    document.getElementById('authorize_button').innerText = 'REFRESCAR';
    await listSheets()
  };

btn.onclick = async() =>{
  const workbookId = document.getElementById('workbookId').value 
  const teachers = document.getElementById('profesores').value 
  const classes = document.getElementById('class').value
  const grado = document.getElementById('grado').value 
  const sheet = document.getElementById('sheet-selection').value
  console.log(classes, grado, teachers, sheet,workbookId)
  if(classes == '' || grado == '' || teachers == '' || sheet == '' || workbookId == '') {
    alert('Faltan campos por llenar.')
    return
  }
  await listStudentData()
}

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({prompt: 'consent'});
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({prompt: ''});
  }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    document.getElementById('content').innerText = '';
    document.getElementById('authorize_button').innerText = 'Authorize';
    document.getElementById('signout_button').style.display = 'none';
  }
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */

