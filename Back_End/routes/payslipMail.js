const express = require('express');
const router = express.Router();
const axios = require('axios');
const xml2js = require('xml2js');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
  user: process.env.Mail,
  pass: process.env.Mail_Password,
  },
});

router.post('/send-payslip-mail', async (req, res) => {
  const { pernr, email } = req.body;

  if (!pernr || !email) {
    return res.status(400).json({ error: 'pernr and email are required' });
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

    // Parse the XML
    xml2js.parseString(response.data, { explicitArray: false, ignoreAttrs: true }, async (err, result) => {
      if (err) {
        console.error('XML Parse Error:', err);
        return res.status(500).json({ error: 'Failed to parse SOAP response' });
      }

      try {
        const base64Pdf =
          result['soap-env:Envelope']['soap-env:Body']['n0:ZFM_EMPPORT_PAYSLIPResponse']['PAYSLIP_PDF'];

        if (!base64Pdf) {
          return res.status(500).json({ error: 'Could not extract PDF from response' });
        }

        // Decode base64 and save the PDF temporarily
        const filePath = path.join(__dirname, `temp_${pernr}.pdf`);
        fs.writeFileSync(filePath, Buffer.from(base64Pdf, 'base64'));

        // Send email with PDF attachment
        const mailOptions = {
          from: 'eshw1506@gmail.com',
          to: email,
          subject: 'Your Payslip',
          text: `Hi, Please find attached the payslip for Employee ID: ${pernr}`,
          attachments: [
            {
              filename: `Payslip_${pernr}.pdf`,
              path: filePath,
            },
          ],
        };

        await transporter.sendMail(mailOptions);
        // Delete file after sending
        fs.unlinkSync(filePath);

        res.json({ status: 'S', message: 'Payslip sent successfully' });
      } catch (error) {
        console.error('Error processing PDF:', error);
        res.status(500).json({ error: 'Failed to process PDF from SOAP response' });
      }
    });
  } catch (error) {
    console.error('SOAP Request Failed:', error.message);
    res.status(500).json({ error: 'Failed to call SAP service' });
  }
});
module.exports = router;