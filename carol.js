import readline from 'node:readline'
import SDK from '@synonymdev/slashtags-sdk'
const sdk = new SDK({ storage: './carol' })
const slashtagCarol = sdk.slashtag('Carol')

const carolPublicDrive = slashtagCarol.drivestore.get()
await carolPublicDrive.ready()
await carolPublicDrive.put('/profile.json', Buffer.from(JSON.stringify({ name: 'Carol', age: 99, occupation: 'Shitposter' })))

console.log('I am Carol, and this is my key', carolPublicDrive.key.toString('hex'))

console.log('Paste somebody\'s key below to introduce them')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
rl.on('line', async (key) => {
  const contact = sdk.drive(Buffer.from(key, 'hex'))
  const profile = await contact.get('/profile.json')

  const { name } = JSON.parse(profile)
  console.log(`Hey, ${name}! Nice to meet you!`)

  const cloneContacts = await contact.get('/contacts.json')
  console.log('But I can not get his private contacts', cloneContacts)

  await contact.close()
})
rl.on('close', async () => {
  await carolPublicDrive.close()
  console.log('Input stream closed.')
  process.exit()
})
