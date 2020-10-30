const { BaseKonnector } = require('cozy-konnector-libs')
const generatePdf = require('./pdf-util')
const intoStream = require('into-stream')
const { format } = require('date-fns')
require('isomorphic-fetch')

module.exports = new BaseKonnector(start)

async function start(fields) {
  const pdfBase = await fetch(
    'https://raw.githubusercontent.com/LAB-MI/attestation-deplacement-derogatoire-q4-2020/main/src/certificate.pdf'
  ).then((res) => res.buffer())

  const now = new Date()
  const nowDate = format(now, 'dd/MM/yyyy')
  const nowHour = format(now, `HH'h'mm`)

  const values = { datesortie: nowDate, heuresortie: nowHour, ...fields }

  const identity = {
    fullname: `${values.firstname} ${values.lastname}`,
    name: {
      familyName: values.lastname,
      givenName: values.firstname,
    },
    birthday: values.birthday,
    birthplace: values.placeofbirth,
    address: [
      {
        street: values.address,
        postcode: values.zipcode,
        city: values.city,
      },
    ],
  }

  await this.saveIdentity(identity, `${values.lastname} ${values.firstname}`)

  const pdfBytes = await generatePdf(values, values.reasons, pdfBase)

  const { reasons, datesortie, heuresortie } = values

  await this.saveFiles(
    [
      {
        filename: `${values.lastname} ${
          values.firstname
        }-${reasons}-${datesortie.split('/').join('')} ${heuresortie}.pdf`,
        filestream: intoStream(pdfBytes),
        reasons,
        datesortie,
        heuresortie,
      },
    ],
    fields,
    {
      contentType: true,
      sourceAccountIdentifier: `${values.lastname} ${values.firstname}`,
      fileIdAttributes: ['reasons', 'datesortie', 'heuresortie'],
    }
  )
}
