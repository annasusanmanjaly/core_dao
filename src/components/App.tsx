import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import customTokenAbi from '../contract/CustomToken.json'

const contractAddress = '0xf6B9c31a9Ab2049A23aaf4f984cF5e337f7A8EA7'; // Update with your deployed contract address
const abi = customTokenAbi.abi;

function App() {
  const [currentAccount, setCurrentAccount] = useState(null)
  const [balance, setBalance] = useState(0)
  const [transferTo, setTransferTo] = useState('')
  const [transferAmount, setTransferAmount] = useState(0)

  const checkWalletIsConnected = async () => {
    const { ethereum } = window

    if (!ethereum) {
      console.log('Make sure you have Metamask installed!')
      return
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' })

    if (accounts.length !== 0) {
      const account = accounts[0]
      console.log('Found an authorized account: ', account)
      setCurrentAccount(account)
    } else {
      console.log('No authorized account found')
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window

    if (!ethereum) {
      alert('Please install Metamask!')
      return
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      console.log('Found an account! Address: ', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (err) {
      console.log(err)
    }
  }

  const mintTokens = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('Ethereum object does not exist')
        return
      }

      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const customTokenContract = new ethers.Contract(
        contractAddress,
        abi,
        signer
      )

      console.log('Minting tokens')
      const tx = await customTokenContract.mint(currentAccount, ethers.utils.parseEther('100'))
      await tx.wait()
      console.log('Tokens minted successfully!')
    } catch (err) {
      console.log(err)
    }
  }

  const transferTokens = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('Ethereum object does not exist')
        return
      }

      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const customTokenContract = new ethers.Contract(
        contractAddress,
        abi,
        signer
      )

      console.log('Transferring tokens')
      const tx = await customTokenContract.transfer(transferTo, ethers.utils.parseEther(transferAmount.toString()))
      await tx.wait()
      console.log('Tokens transferred successfully!')
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    checkWalletIsConnected()
  }, [])

  return (
    <div className="bg-black">
      <div className="mx-auto max-w-screen-xl py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-12">
            <h1 className="my-3 text-3xl font-bold text-pink-400 sm:text-5xl sm:tracking-tight lg:text-6xl">Core Dao DApp</h1>
          </div>
          {currentAccount ? (
            <div>
              <p className="text-xl text-white">Connected Account: {currentAccount}</p>
              <p className="text-xl text-white">Balance: {balance} tokens</p>
              <button onClick={mintTokens} className="btn-primary mt-4 bg-pink-400 hover:bg-pink-400">Mint 100 Tokens</button>
              <div className="mt-8">
                <input
                  type="text"
                  placeholder="Recipient Address"
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  className="rounded-l-lg border-2 border-solid border-gray-300 py-1 px-2 h-10"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(Number(e.target.value))}
                  className="rounded-r-none border-2 border-solid border-gray-300 py-1 px-2 h-10"
                />
                <button onClick={transferTokens} className="btn-primary rounded-l-none w-40 bg-pink-400 hover:bg-pink-400">Transfer</button>
              </div>
            </div>
          ) : (
            <button onClick={connectWalletHandler} className="btn-primary mt-10 w-40 rounded text-white bg-pink-400">Connect Wallet</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
