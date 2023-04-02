import readline from 'node:readline'
import { SDK, SlashURL } from '@synonymdev/slashtags-sdk'

const sdk = new SDK({ storage: './bob' })
const slashtagBob = sdk.slashtag('Bob')

const bobPublicDrive = slashtagBob.drivestore.get() // or get("public")
await bobPublicDrive.ready()
await bobPublicDrive.put('/profile.json', Buffer.from(JSON.stringify({ name: 'Bob Johnson', age: 45, occupation: 'Musician' })))

const url = SlashURL.format(bobPublicDrive.key, {
  protocol: 'slashfeed:',
  path: '/profile.json'
})
console.log('Hey, I am Bob! This is my profile', url)
console.log('Paste somebody\'s profile below to introduce them')

// Create an encrypted hyperdrive for Bob's contacts
const bobContactsDrive = slashtagBob.drivestore.get('contacts')
await bobContactsDrive.ready()
sdk.join(bobContactsDrive.key, { server: true, client: true })
// Clone the hyperdrive identified by a public key entered into the terminal. 
// Parse the profile data and store the name with public key in the contacts drive. 
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
rl.on('line', async (url) => {
  const { key, path } = SlashURL.parse(url)
  const contact = sdk.drive(Buffer.from(key, 'hex'))
  const profile = await contact.get(path)

  const { name } = JSON.parse(profile)
  console.log(`Hey, ${name}! Nice to meet you!`)

  console.log(`This is my private contact of ${name}`, profile.toString())
  await bobContactsDrive.put('/contacts.json', Buffer.from(JSON.stringify({ name: `${name}`, public_key: key })))
  // TODO: FIXME to share private drive
  const privateUrl = SlashURL.format(bobContactsDrive.key, {
    protocol: 'slashfeed:',
    path: '/contacts.json',
  })
  console.log('This is url to my private drive, but you need to fix me first', privateUrl)

  await contact.close()
})
rl.on('close', async () => {
  await bobPublicDrive.close()
  await bobContactsDrive.close()

  console.log('Input stream closed.')
  process.exit()
})

