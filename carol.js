// TODO: share by URL instead of public key
import readline from 'node:readline'
import { SDK, SlashURL } from '@synonymdev/slashtags-sdk'
const sdk = new SDK({ storage: './carol' })

const slashtagCarol = sdk.slashtag('Carol')

const carolPublicDrive = slashtagCarol.drivestore.get()
await carolPublicDrive.ready()
await carolPublicDrive.put('/profile.json', Buffer.from(JSON.stringify({ name: 'Carol', age: 99, occupation: 'Shitposter' })))

const url = SlashURL.format(carolPublicDrive.key, {
  path: '/profile.json',
  protocol: 'slashfeed:'
})
console.log('I am Carol, and this is my key', url)

console.log('Paste somebody\'s key below to introduce them')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
rl.on('line', async (url) => {
  const { key, path, privateQuery } = SlashURL.parse(url)
  const encryptionKey = typeof privateQuery.encryptionKey === 'string'
    ? SlashURL.decode(privateQuery.encryptionKey)
    : undefined

  const opts = encryptionKey ? { encryptionKey} : undefined
  const drive = sdk.drive(key, opts)
  await drive.ready()

  const file = await drive.get(path)
  if (encryptionKey) {
    console.log(`This is private file: ${file}`)
  } else {
    const { name } = JSON.parse(file)
    console.log(`Hey, ${name}! Nice to meet you!`)
  }
})

rl.on('close', async () => {
  await carolPublicDrive.close()
  console.log('Input stream closed.')
  process.exit()
})
