import fs from 'node:fs'
import readline from 'node:readline'
import { SDK, SlashURL } from '@synonymdev/slashtags-sdk'

const sdk = new SDK()
const slashtag = sdk.slashtag('demo')

const drive = slashtag.drivestore.get()
await drive.ready()

console.log('Convert me to QR and scan with bitkit:', SlashURL.format(drive.key, { protocol: 'slashfeed:' }))

const img = fs.readFileSync('./image.bs64', 'utf-8')
await drive.put('/slashfeed.json', Buffer.from(JSON.stringify({
  name: 'Jan says',
  description: 'Jan will send his love here',
  icons: { 200: img },
  fields: [
    {
      name: 'to all of you',
      main: '/feed/text/'
    }
  ]
})))

await drive.put('/feed/text/', Buffer.from('hello world'))

console.log('Type something below and hit Enter:')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
rl.on('line', async (line) => {
  console.log('Type something below and hit Enter:')
  await drive.put('/feed/text/', Buffer.from(line))
})

rl.on('close', async () => {
  await drive.close()
  console.log('Input stream closed.')
  process.exit()
})
