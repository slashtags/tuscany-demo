import SDK from '@synonymdev/slashtags-sdk'
const sdk = new SDK({ storage: './alice' })

const slashtagAlice = sdk.slashtag('Alice')

const alicePublicDrive = slashtagAlice.drivestore.get()
await alicePublicDrive.ready()

console.log('Hey my name is Alice and this is my key:', alicePublicDrive.key.toString('hex'))

const profile = { name: 'Alice Smith', age: 36, occupation: 'Lawyer' }
console.log('This is my info', profile)
await alicePublicDrive.put('/profile.json', Buffer.from(JSON.stringify(profile)))
