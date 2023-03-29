import fs from 'node:fs'
import readline from 'node:readline'
import { SDK, SlashURL } from '@synonymdev/slashtags-sdk'
import qrcode from 'qrcode-terminal'

const sdk = new SDK()
const slashtag = sdk.slashtag('demo')
const drive = slashtag.drivestore.get()
await drive.ready()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.on('close', async () => {
  await drive.close()
  console.log('Input stream closed.')
  process.exit()
})

const path = '/feed/text'
const url = SlashURL.format(drive.key, { protocol: 'slashfeed:' })

qrcode.generate(url, { small: true })
console.log(`Scan the QR or copy url:\n${url}\n`)

await drive.put(path, Buffer.from('hello world'))

const img = fs.readFileSync('./image.bs64', 'utf-8')
await drive.put('/slashfeed.json', Buffer.from(JSON.stringify({
  name: 'Jan says',
  description: 'Jan will send his love here',
  icons: { 200: img },
  fields: [
    {
      name: 'to all of you',
      main: path
    }
  ]
})))

console.log('Type something below and hit Enter:')
rl.on('line', async (line) => {
  await drive.put(path, Buffer.from(line))
  console.log('Type something below and hit Enter:')
})

