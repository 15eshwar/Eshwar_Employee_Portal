const express = require('express');
const router = express.Router();
const request = require('request');
const xml2js = require('xml2js');
require('dotenv').config();

router.post('/PSD', (req, res) => {
  const { employeeID } = req.body;

  if (!employeeID) {
    return res.status(400).json({ message: 'Employee ID is required.' });
  }

  const soapBody = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                    xmlns:urn="urn:sap-com:document:sap:rfc:functions">
    <soapenv:Header/>
    <soapenv:Body>
      <urn:ZFM_EMPPORT_PSD>
        <EMPLOYEE_ID>${employeeID}</EMPLOYEE_ID>
      </urn:ZFM_EMPPORT_PSD>
    </soapenv:Body>
  </soapenv:Envelope>`;

  const options = {
    method: 'POST',
    url: 'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zempport_psd_esh?sap-client=100',
    headers: {
      'Content-Type': 'text/xml',
      'Authorization': `Basic ${process.env.Password}`,
      'Cookie': 'sap-usercontext=sap-client=100',
    },
    body: soapBody,
  };

  request(options, (error, response, body) => {
    if (error) {
      console.error('SOAP Request Error:', error);
      return res.status(500).json({ message: 'Failed to connect to SAP.' });
    }

    xml2js.parseString(body, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error('XML Parse Error:', err);
        return res.status(500).json({ message: 'Error parsing XML response.' });
      }

      try {
        const responseData = result['soap-env:Envelope']?.['soap-env:Body']?.['n0:ZFM_EMPPORT_PSDResponse']?.PAY_SLIP?.item;
        return res.status(200).json({responseData});
      } catch (e) {
        console.error('Unexpected Response Format:', e);
        return res.status(500).json({ message: 'Unexpected response format from SAP.' });
      }
    });
  });
});

module.exports = router;
