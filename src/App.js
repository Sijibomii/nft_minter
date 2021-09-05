import { useState, useEffect } from 'react';
import './App.css';
import { ethers } from 'ethers'
import { minterAddress } from "./util.js"
import { create as ipfsHttpClient } from 'ipfs-http-client'
import nft from './artifacts/contracts/pictures.sol/NFT_Minter.json'

function App() {
  const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
  const [provider, setProvider]= useState(null);
  const [signer, setSigner]= useState(null);
  const [desc, setDesc]= useState("");
  const [name, setName]= useState("");
  const [fileUrl, setFileUrl] = useState(null)
  const [address, setAddress]= useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  useEffect(() => {
    init();
  }, [])
  const init = ()=>{
    const provider = new ethers.providers.JsonRpcProvider()
    const contract = new ethers.Contract(minterAddress, nft.abi, provider)
    setTokenContract(contract)
  }
  const connect =async()=>{
    if(provider !== null) return
    try{
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    setSigner(signer)
    const address= await signer.getAddress();
    setAddress(address);
    }
    catch(error){
      alert("we're having issues connecting you")
    }
  }
  const onchange =async(e)=>{
    const file = e.target.files[0]
    console.log(file)
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
      console.log(fileUrl)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  const mintNft = async()=>{
    if (!fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({ name, desc, image: fileUrl})
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      createNft(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  const createNft = async (url) =>{
    console.log('creating...')
    let contract = new ethers.Contract(minterAddress, nft.abi, signer)
    let transaction = await contract.createNFT(url)
    console.log('done')
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    console.log('done')
    let tokenId = value.toNumber()
    alert(`nft successfully minted! id: ${tokenId}`)
  }

  return (
    <div className="App">
     <div className="container">
       <div className="inner">
         <h1>NFT Minting Sample Project </h1>
         <h3><a href="https://twitter.com/bigbrutha_/status/1432024777456341004">Project multivation</a></h3>
         <h4>Contract address: {minterAddress}</h4>
         {address === null ?(
         <button className="connect" onClick={connect}>Connect your wallet</button>
         ):(
           <h4>{address} connected!</h4> 
         )}
         <div className="form">
          <form>
          <div>
            <label for="img">name:</label>
            <input type="text" onChange={e => setName(e.target.value) }
              placeholder="enter a name" className="desc" />
            </div>
            <div>
            <label for="img">Description:</label>
            <input type="text" onChange={e => setDesc(e.target.value) }
              placeholder="enter a description" className="desc" />
            </div>
            <div>
            <label for="img">Upload an Image:</label>
            <input type="file" id="img" name="img" 
            onChange={onchange}
            accept="image/*"/>
            </div>
          </form>
         </div>
         {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        }
         <button className="mint" onClick={mintNft}>Mint </button>
       </div>
     </div>
    </div>
  );
}

export default App;
