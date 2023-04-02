// Create an instance of the SDK.
// Automatically starts a DHT node and announces a data server listening on a public key.
import { SDK, SlashURL } from '@synonymdev/slashtags-sdk'
const sdk = new SDK({ storage: './alice' })

// Create a slashtag for Alice
const slashtagAlice = sdk.slashtag('Alice')

// For slashtagAlice, return the public drive and show the public key.
// The drive is automatically announced to the Hyperswarm network.
const alicePublicDrive = slashtagAlice.drivestore.get()
await alicePublicDrive.ready()

// Show the public key for the drive
const url = SlashURL.format(alicePublicDrive.key, {
  path: '/profile.json',
  protocol: 'slashfeed:'
})
console.log('Hey my name is Alice and this is my profile:', url)

// Store Alice's profile data onto the drive as a buffer
const profile = { name: 'Alice Smith', age: 36, occupation: 'Lawyer' }
console.log('This is my info', profile)
await alicePublicDrive.put('/profile.json', Buffer.from(JSON.stringify(profile)))
