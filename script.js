$(document).ready(function() {
  // Client ID and API key
  var clientId = '114997386937393522489';
  var apiKey = 'AIzaSyBobcAMjlEr1RxQaFpof0ErSD8PApshsmI';
  var discoveryDocs = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];
  var sheetId = '1C5qjYQEWi9Cp5i1Yw0eELpBKtpZBA09On345OD8fiSo';

  // Array of API discovery doc URLs for authorization
  var scopes = 'https://www.googleapis.com/auth/spreadsheets';

  // Load the API client and authorize the client
  function handleClientLoad() {
    gapi.load('client:auth2', initClient);
  }

  function initClient() {
    gapi.client.init({
      apiKey: apiKey,
      clientId: clientId,
      discoveryDocs: discoveryDocs,
      scope: scopes
    }).then(function() {
      // Authorize and make a request to load and display the service requests
      authorize(loadServiceRequests);

      // Handle the form submission
      $('#newRequestForm').submit(function(event) {
        event.preventDefault();
        addServiceRequest();
      });
    });
  }

  function authorize(callback) {
    gapi.auth2.getAuthInstance().signIn().then(callback);
  }

  function loadServiceRequests() {
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1' // Change the range if needed
    }).then(function(response) {
      var data = response.result.values;
      var rows = '';
      if (data && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          var row = data[i];
          rows += '<tr>';
          rows += '<td>' + row[0] + '</td>';
          rows += '<td>' + row[1] + '</td>';
          rows += '<td>' + row[2] + '</td>';
          rows += '<td>' + row[3] + '</td>';
          rows += '<td>' + row[4] + '</td>';
          rows += '<td>' + row[5] + '</td>';
          rows += '<td><button onclick="deleteServiceRequest(' + (i + 1) + ')">Delete</button></td>';
          rows += '</tr>';
        }
      } else {
        rows = '<tr><td colspan="7">No service requests found.</td></tr>';
      }
      $('#serviceTable tbody').html(rows);
    });
  }

  function addServiceRequest() {
    var requestData = [
      $('#dateReceived').val(),
      $('#clientName').val(),
      $('#device').val(),
      $('#status').val(),
      $('#dateCompleted').val(),
      $('#engineer').val()
    ];
  
    gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1', // Change the range if needed
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [requestData]
      }
    }).then(function(response) {
      $('#newRequestForm')[0].reset();
      loadServiceRequests();
    });
  }

  function deleteServiceRequest(rowNumber) {
    gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      resource: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: 0,
              dimension: 'ROWS',
              startIndex: rowNumber - 1,
              endIndex: rowNumber
            }
          }
        }]
      }
    }).then(function(response) {
      loadServiceRequests();
    });
  }

  // Load the Google Sheets API client library
  handleClientLoad();
});