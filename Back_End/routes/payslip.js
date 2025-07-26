const express = require('express');
const router = express.Router();
const axios = require('axios');
const xml2js = require('xml2js');
require('dotenv').config();

router.post('/payslip-download', async (req, res) => {
  const { pernr } = req.body;

  if (!pernr) {
    return res.status(400).json({ status: 'E', message: 'pernr/month/year is required' });
  }

  const soapEnvelope = `<?xml version="1.0"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:urn="urn:sap-com:document:sap:rfc:functions">
  <soapenv:Header/>
  <soapenv:Body>
    <urn:ZFM_EMPPORT_PAYSLIP>
      <PERNR>${pernr}</PERNR>
    </urn:ZFM_EMPPORT_PAYSLIP>
  </soapenv:Body>
</soapenv:Envelope>`;

  try {
    const response = await axios.post(
      'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zempport_payslip_esh?sap-client=100',
      soapEnvelope,
      {
        headers: {
          'Content-Type': 'text/xml',
          'Authorization': `Basic ${process.env.Password}`,
        },
        responseType: 'text',
      }
    );

    const pdfMatch = response.data.match(/<PAYSLIP_PDF(?:[^>]*)>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/PAYSLIP_PDF>/i);

    if (!pdfMatch || !pdfMatch[1]) {
      return res.status(500).json({ status: 'E', message: 'PDF not found in SAP response' });
    }

    const base64String = pdfMatch[1].replace(/\s/g, '');
    const buffer = Buffer.from(base64String, 'base64');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=payslip_${pernr}.pdf`);
    res.send(buffer);
  } catch (error) {
    console.error('PDF download error:', error.message);

    // extract error detail from SAP XML
    if (error.response?.data) {
      const parser = new xml2js.Parser({ explicitArray: false });
      parser.parseString(error.response.data, (err, result) => {
        if (!err) {
          const fault = result?.['soapenv:Envelope']?.['soapenv:Body']?.['soapenv:Fault'];
          if (fault) {
            return res.status(500).json({
              status: 'E',
              message: `SAP Error: ${fault.faultstring || 'Unknown fault'}`,
            });
          }
        }
      });
    }

    res.status(500).json({ status: 'E', message: 'PDF download error' });
  }
});

module.exports = router;
