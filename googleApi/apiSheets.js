const CLIENT_ID = '1035463602081-fh003g44hje92qpcc53j4sf98pcikt2f.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBBUQ6OE64_ZQwawEXrDpx1XkB4ea6SL7A';
const DOC_SHEET = '13ZcUrdXTx86inyA5Ca-ZUqdhx3MoPrdrGmPqniZM5Us';
const HOJAS = { actual: "06-05", anterior: "10-05"};
const CELDA_DEFAULT = '';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('apiGoogleCargar').addEventListener('load',gapiLoaded());
document.getElementById('clienteGoogleCargar').addEventListener('load',gisLoaded());
document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';

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
    document.getElementById('signout_button').style.visibility = 'visible';
    document.getElementById('authorize_button').innerText = 'Refresh';
    await obtenerOkrs();
  };

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
    document.getElementById('signout_button').style.visibility = 'hidden';
  }
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
async function getApiGoogle(sheet, rango, okrPosition) {
  let response;
  try {
    // Fetch first 10 files
    response = await gapi.client.sheets.spreadsheets.values.get({
      //spreadsheetId: '1AGj-V9_mYw87hX_mVPzrexU-dLF4YAXg_X9MuiwJ5pc',
      spreadsheetId: DOC_SHEET,
      range: rango,
    });
  } catch (err) {
    //document.getElementById('content').innerText = err.message;
    console.error(err.message);
    return false;
  }
  const range = response.result;
  if (!range || !range.values || range.values.length == 0) {
    document.getElementById('content').innerText = 'No values found.';
    return false;
  }
  // Flatten to string to display
  const salida = range.values.filter( row => {
    if(row[0] && row[0].trim().length>0){
      return  row;
    }
  }).map( row => {
    let valor = row[25]=='#DIV/0!'? "0,00": row[25].substring(0,row[25].length-1); 
    if(okrPosition == "anterior"){
      return { "nombre": row[0].trim(), "anterior": valor};
    }
    else{
      return { "nombre": row[0].trim(), "posterior": valor};
    }
  });
  //console.log(salida);
  return salida;
}
async function obtenerOkrs()
{  
  try {
    let hoy = new Date();
    let rangoActual = formatfechaDDMM(hoy)+'!A5:Z';
    let rangoAnterior = formatfechaDDMM(getFechaAnterior(hoy))+'!A5:Z';
    const hojaAnterior = await getApiGoogle(DOC_SHEET, rangoAnterior, "anterior");
    const hojaActual = await getApiGoogle(DOC_SHEET, rangoActual, "posterior");
    console.log(hojaActual);
    console.log(hojaAnterior);
    let tbody = document.getElementById('okrBody');
    tbody.innerHTML = "";
    actualizarTablaOkr(hojaAnterior, tbody);
    actualizarTablaOkr(hojaActual, tbody);
  } catch (error) {
    console.error(error.message);
    return;
  }
}

function verificaDatos(cadena, nodoDom){
  cadena.forEach(item => {
    nodoDom.appendChild(creaFila(item.nombre, item.valor, ''));
  });
}

function creaFila(nombre, valorAyer, valorHoy){
  let nuevaFila = document.createElement('tr');
  nuevaFila.innerHTML = `
    <td class="nombreOrk">${nombre}</td>
    <td class="">${valorAyer}</td>
    <td class="">${valorHoy}</td>
  `;
  return nuevaFila;
}
/*****    busca por defecto en la primera fila    *******/
function getFilaPorNombre(nombre, tbody){
  let tr = false;
  tbody.querySelectorAll('tr').forEach(fila => {
    if(fila.querySelector('td:first-child').innerText == nombre)
      tr = fila;
  });
  return tr;
}

function actualizarTablaOkr(cadena, nodoDom)
{
  cadena.forEach(item => {
    let tr = getFilaPorNombre(item.nombre, nodoDom);
    if(tr){
      if(item.anterior){
        tr.querySelector('td:nth-child(2)').innerHTML = item.anterior;
      }
      if(item.posterior){
        tr.querySelector('td:nth-child(3)').innerHTML = item.posterior;
      }
    }
    else{
      nodoDom.appendChild(creaFila(item.nombre, item.anterior??CELDA_DEFAULT, item.posterior??CELDA_DEFAULT));
    }
  });
}
function validaFecha(date){
  return isNaN(Date.parse(date))? new Date(): date;
}

function getFechaAnterior(date)
{
  let fecha = validaFecha(date);                  
  return new Date(fecha.setDate(fecha.getDate() - 1)); 
}
function getFormatNumber( numero )
{
  return ("00"+numero).slice(-2);
}
function formatfechaDDMM(date){
  let fecha = validaFecha(date);
  return getFormatNumber(fecha.getDate()) +"-"+ getFormatNumber(fecha.getMonth()+1);
}