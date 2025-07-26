const express = require('express');
const router = express.Router();
const request = require('request');
const xml2js = require('xml2js');
require('dotenv').config();

router.post('/login', (req, res) => {
  console.log('Received from frontend:', req.body.employeeID, req.body.password);
  const { employeeID, password } = req.body;
     if (!employeeID || !password) {
    return res.status(400).json({ message: 'Employee ID and password are required.' });
  }

  const soapBody = 
          `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                            xmlns:urn="urn:sap-com:document:sap:rfc:functions">
             <soapenv:Header/>
             <soapenv:Body>
                <urn:ZFM_EMPPORT_LOGIN>
                   <EMPLOYEE_ID>${employeeID}</EMPLOYEE_ID>
                   <PASSWORD>${password}</PASSWORD>
                </urn:ZFM_EMPPORT_LOGIN>
             </soapenv:Body>
          </soapenv:Envelope>`;

  const options = {
    method: 'POST',
    url: 'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zempport_login_esh?sap-client=100',
    headers: {
      'Content-Type': 'text/xml',
      'Authorization': `Basic ${process.env.Password}`,
      'Cookie': 'sap-usercontext=sap-client=100',
    },
    body: soapBody,
  };

  request(options, (error,response, body) => {
     
    if (error) {
      console.error('SOAP Request Error:', error);
      return res.status(500).json({ message: 'Failed to connect to SAP.' });
    }

    xml2js.parseString(body, { explicitArray: true }, (err, result) => {
      if (err) {
        console.error('XML Parse Error:', err);
        return res.status(500).json({ message: 'Failed to parse SOAP response' });
      }

      try {
        const log = result['soap-env:Envelope']['soap-env:Body'][0]['n0:ZFM_EMPPORT_LOGINResponse'][0];
        const message = log.LOGIN_MESSAGE[0];
        const status = log.LOGIN_STATUS[0];

      res.status(200).json({ status, message });
      } catch (e) {
        console.error('Response Parsing Error:', e);
        res.status(500).json({ message: 'Unexpected SOAP response structure' });
      }
    });
  });
});

module.exports = router;
