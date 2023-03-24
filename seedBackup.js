import bip39 from 'bip39'
import { BIP32Factory as bip32 } from 'bip32'
import * as ecc from 'tiny-secp256k1'
import readline from 'node:readline'
import SDK, { constants } from '@synonymdev/slashtags-sdk'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const mnemonic = await getMnemonic(rl)
console.log(`Using mnemonic: "${mnemonic}"`)

const drive = await getDrive(mnemonic)
const currentContent = await drive.get('/seed/test')
if (currentContent) {
  console.log('Current content of /seed/test is:', currentContent.toString())
} else {
  console.log('Current drive is empty')
}
await puToDrive(rl, drive)

rl.on('close', async () => {
  await drive.close()

  console.log('Input stream closed.')
  process.exit()
})

function getMnemonic (rl) {
  return new Promise((resolve, reject) => {
    rl.question('Type seed phrase or press Enter to generate new one: ', (line) => {
      const mnemonic = line || bip39.generateMnemonic()
      if (!bip39.validateMnemonic(mnemonic)) {
        console.log('Invalid Mnemonic')
        reject('Invalid Mnemonic')
        process.exit()
      }
      resolve(mnemonic)
    })
  })
}

function puToDrive (rl, drive) {
  return new Promise((resolve, reject) => {
    rl.question('Type something to be stored on your public drive: ', async (line) => {
      try {
        await drive.put('/seed/test', Buffer.from(line))
        console.log(`Stored ${line} to public drive`)
        console.log('Exit the process and try again with precviously used seed')
        process.exit()
      } catch (e) {
        reject(e)
      }
    })
  })
}

async function getDrive (mnemonic) {
  const seed = await bip39.mnemonicToSeed(mnemonic)
  const root = bip32(ecc).fromSeed(seed)
  const primaryKey = root.derivePath(constants.PRIMARY_KEY_DERIVATION_PATH).privateKey
  const sdk = new SDK({ primaryKey })
  const slashtag = sdk.slashtag('seed demo')
  const drive = slashtag.drivestore.get()
  await drive.ready()

  return drive
}
