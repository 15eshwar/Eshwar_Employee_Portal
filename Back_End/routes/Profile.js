const express = require('express');
const router = express.Router();
const request = require('request');
const xml2js = require('xml2js');
require('dotenv').config();

router.post('/profile', (req, res) => {
  const { employeeID } = req.body;
  console.log('Received Customer ID:', employeeID);

  if (!employeeID) {
    return res.status(400).json({ message: 'Customer ID is required.' });
  }

  const soapBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:urn="urn:sap-com:document:sap:rfc:functions">
         <soapenv:Header/>
         <soapenv:Body>
            <urn:ZFM_EMPPORT_PROF>
               <EMPLOYEE_ID>${employeeID}</EMPLOYEE_ID>
            </urn:ZFM_EMPPORT_PROF>
         </soapenv:Body>
      </soapenv:Envelope>
`;

  const options = {
    method: 'POST',
    url: 'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zempport_prof_esh?sap-client=100',
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
      return res.status(500).json({ message: 'Failed to send SOAP request.' });
    }

    xml2js.parseString(body, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error('XML Parsing Error:', err);
        return res.status(500).json({ message: 'Failed to parse SOAP response.' });
      }

      try {
        const profile =
          result['soap-env:Envelope']?.['soap-env:Body']?.['n0:ZFM_EMPPORT_PROFResponse']?.EMP_PROFILE?.item;
        if (!profile) {
          return res.status(404).json({ message: 'Employee profile not found.' });
        }
        console.log('Extracted Profile:', profile);
        return res.status(200).json(profile);

      } catch (parseErr) {
        console.error('Error extracting profile:', parseErr);
        return res.status(500).json({ message: 'Failed to extract employee profile.' });
      }
    });
  });
});

module.exports = router;
