const express = require('express');
const router = express.Router();
const request = require('request');
const xml2js = require('xml2js');
require('dotenv').config();

router.post('/ld', (req, res) => {
  const { employeeID } = req.body;

  if (!employeeID || typeof employeeID !== 'string') {
    return res.status(400).json({ message: 'Valid Employee ID is required.' });
  }

  const soapBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZFM_EMPPORT_LD>
          <EMPLOYEE_ID>${employeeID}</EMPLOYEE_ID>
        </urn:ZFM_EMPPORT_LD>
      </soapenv:Body>
    </soapenv:Envelope>
  `;

  const options = {
    method: 'POST',
    url: 'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zempport_ld_esh?sap-client=100',
    headers: {
      'Content-Type': 'text/xml;charset=UTF-8',
      'Authorization': `Basic ${process.env.Password}`,
      'Cookie': 'sap-usercontext=sap-client=100',
    },
    body: soapBody.trim(),
  };

  request(options, (error, response, body) => {
    if (error) {
      console.error('SOAP Request Error:', error);
      return res.status(500).json({ message: 'Failed to connect to SAP server.' });
    }

    xml2js.parseString(body, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error('XML Parsing Error:', err);
        return res.status(500).json({ message: 'Failed to parse SOAP response.' });
      }

      try {
        const envelope = result['soap-env:Envelope'] || result['SOAP-ENV:Envelope'];
        const bodyContent = envelope?.['soap-env:Body'] || envelope?.['SOAP-ENV:Body'];

        if (!bodyContent || bodyContent['soap-env:Fault'] || bodyContent['SOAP-ENV:Fault']) {
          console.warn('SOAP Fault:', bodyContent?.['soap-env:Fault']?.faultstring || bodyContent?.['SOAP-ENV:Fault']?.faultstring);
          return res.status(500).json({ message: 'SAP service returned a fault. Check SAP logs.' });
        }

        const ldResponse = bodyContent['n0:ZFM_EMPPORT_LDResponse'] || bodyContent['ZFM_EMPPORT_LDResponse'];
        const leaveData = ldResponse?.LEAVE_DATA?.item;

        if (!leaveData) {
          return res.json({ message: 'No data found.' });
        }

        const dataArray = Array.isArray(leaveData) ? leaveData : [leaveData];

        return res.json({ leaveData: dataArray });
      } catch (parseError) {
        console.error('Response parsing error:', parseError);
        return res.status(500).json({ message: 'Error processing SOAP response.' });
      }
    });
  });
});

module.exports = router;
