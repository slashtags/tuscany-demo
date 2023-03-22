import readline from 'node:readline'
import SDK from '@synonymdev/slashtags-sdk'

const sdk = new SDK({ storage: './bob' })
const slashtagBob = sdk.slashtag('Bob')

const bobPublicDrive = slashtagBob.drivestore.get() // or get("public")
await bobPublicDrive.ready()
await bobPublicDrive.put('/profile.json', Buffer.from(JSON.stringify({ name: 'Bob Johnson', age: 45, occupation: 'Musician' })))

console.log('Hey, I am Bob! This is my key', bobPublicDrive.key.toString('hex'))
console.log('Paste somebody\'s key below to introduce them')

const bobContactsDrive = slashtagBob.drivestore.get('contacts') // private drive
await bobContactsDrive.ready()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
rl.on('line', async (key) => {
  const contact = sdk.drive(Buffer.from(key, 'hex'))
  const profile = await contact.get('/profile.json')

  const { name } = JSON.parse(profile)
  console.log(`Hey, ${name}! Nice to meet you!`)

  console.log(`This is my private contact of ${name}`, profile.toString())
  await bobContactsDrive.put('/contacts.json', Buffer.from(JSON.stringify({ name: `${name}(bowling)`, public_key: key })))

  await contact.close()
})
rl.on('close', async () => {
  await bobPublicDrive.close()
  await bobContactsDrive.close()

  console.log('Input stream closed.')
  process.exit()
})

