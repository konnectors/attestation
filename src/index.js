const { BaseKonnector } = require('cozy-konnector-libs')
const generatePdf = require('./pdf-util')
const intoStream = require('into-stream')

module.exports = new BaseKonnector(start)

async function start(fields) {
  const pdfBytes = await generatePdf(
    {
      lastname: 'test',
      firstname: 'test',
      birthday: 'test',
      placeofbirth: 'test',
      address: 'test',
      zipcode: 'test',
      city: 'test',
      datesortie: 'test',
      heuresortie: 'test',
    },
    'test'
  )
  await this.saveFiles(
    [
      {
        filename: 'test.pdf',
        filestream: intoStream(pdfBytes),
      },
    ],
    fields,
    {
      contentType: true,
    }
  )
}
