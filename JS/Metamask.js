//Variaveis enderços
let userWallet
const bank = "0xCf1B9A7cceaD435E90eBb7a905b3332e32A5507d"
const usdtContract = "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd"
const fragContract = "0xe56b4B9a294937f17B259dDfAD49556201b0901A"
const bonusContract = "0x3Bb626fb6aCD79568F2740548c68f741681a6C88"
const nftContract = "0x4293EDD9145DF55D20769577cE5AE6bF4948a5a1"


//variaveis elementos web
const userWalletSpan = document.getElementById('userWallet')
const usdtBalanceSpan = document.getElementById('usdtBalance')
const fragBalanceSpan = document.getElementById('fragBalance')
const fragDispSpan = document.getElementById('fragDispSpan')
const nftBalanceSpan = document.getElementById('nftBalance')
const nftDiv = document.getElementById('nft')
const nftImgSpan = document.getElementById('nftImage')
const nftOwnerSpan = document.getElementById('owner')
const nftNameSpan = document.getElementById('nftName')
const nftStatusSpan = document.getElementById('nftStatus')




//variaveis funçoes solidity
const balanceFunc = "function balanceOf(address) view returns (uint)"
const mintFunc = "function Mint() external returns(bool)"
const returnNftDataFunc = "function returnNftData(uint256 _key)external view returns(NFT memory)"
const returnNftNameFunc = "function returnNftName(uint256 _key) external view returns(string memory)"
const returnNftImgFunc = "function returnNftImg(uint256 _key) external view returns(string memory)"
const returnNftStatusFunc = "function returnNftStatus(uint256 _key) external view returns(string memory)"
const returnNftOwnerFunc = "function returnNftOwner(uint256 _key) external view returns(address)"

const returnUserNftListFunc = "function realReturnUserNftList(address _address, uint256 _index)public view returns(uint256, address, string memory, string memory, string memory)"
const returnUserNftAmountFunc = "function returnUserNftAmount(address _address) external view returns(uint256)"

const increaseAllowanceFunc = "function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool)"

const allowanceFunc = "function allowance(address owner, address spender) public view virtual override returns (uint256)"



//Provider
function getProvider(){
    if(!window.ethereum){
        console.log('Sem metamask instalada')
    }else{
        console.log('Processando...')
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        return provider
    }
    
}



//Função de login com a metamask
async function loginMetamask(){
    let accounts = await ethereum.request({method: 'eth_requestAccounts'})
    userWallet = accounts[0]
    userWalletSpan.innerHTML = userWallet
    await attBalance()
}



//Funções de Atualização e Consulta de saldo
async function attBalance(){
    await getUsdtBalance()
    await getFragBalance()
    await getFragBonusBalance()
    await getNftBalance()
}

async function getFragBonusBalance(){
    const provider = getProvider()
    const contract = new ethers.Contract(fragContract,[balanceFunc], provider)
    const totalFragBonus = await contract.balanceOf(bank)
    fragDispSpan.innerHTML = ethers.utils.formatUnits(totalFragBonus.toString(), 18)
}

async function getUsdtBalance(){
    const provider = getProvider()
    const contract = new ethers.Contract(usdtContract, [balanceFunc], provider)
    const balanceUsdt = await contract.balanceOf(userWallet)
    usdtBalanceSpan.innerHTML = ethers.utils.formatUnits(balanceUsdt.toString(), 18)
}

async function getFragBalance(){
    const provider = getProvider()
    const contract = new ethers.Contract(fragContract,[balanceFunc], provider)
    const balanceFrag = await contract.balanceOf(userWallet)
    fragBalanceSpan.innerHTML = ethers.utils.formatUnits(balanceFrag.toString(), 18)
    return ethers.utils.formatUnits(balanceFrag.toString(), 18)
}

async function getNftBalance(){
    const provider = getProvider()
    const contract = new ethers.Contract(nftContract, [returnUserNftListFunc, returnUserNftAmountFunc], provider)

    const amountNft = await contract.returnUserNftAmount(userWallet)
    let allNftUser = []
    for(let i = 0; i < amountNft; i++){
        const balanceNft = await contract.realReturnUserNftList(userWallet, i)
        allNftUser.push(balanceNft)
        console.log(balanceNft)
        console.log(balanceNft[0].toString())
        console.log(balanceNft[1])
        console.log(balanceNft[2])
        console.log(balanceNft[3])
        console.log(balanceNft[4])
        console.log("______________________________________")
    }
    console.log(allNftUser)
    console.log("______________________________________")





    let nftInv = await generateNftStruct(allNftUser)
    nftBalanceSpan.innerHTML = nftInv

}

async function generateNftStruct(allNftUser){
    let count = allNftUser.length
    console.log(count + "AQUI TA O COUNT")
    console.log(allNftUser[0][2])
    let strmessage = ``
    
    for(let i = 0; i < count; i++){
        let owner = allNftUser[i][1]
        strmessage = strmessage + `<div id="nft">
            <img src="${allNftUser[i][2]}" alt="nftImage" id="nftImage">
            <h1 id="nftId">#${allNftUser[i][0]}</h1>
            <h1 id="nftName">${allNftUser[i][3]}</h1>
            <h1 id="nftStatus">${allNftUser[i][4]}</h1>
            <h1 id="owner">${owner.slice(0,5)}...${owner.slice(-5)}</h1>
            </div>`
    }
    console.log(strmessage + "!!!")
    return strmessage
}


async function getNftName(){
    const provider= getProvider()
    const contract = new ethers.Contract(nftContract, [returnNftNameFunc], provider)
    const nftName = await contract.returnNftName(1)
    console.log(nftName)
}



//funcoes do form para ganhar 100 fragmentos de graça
async function getBonus(){
    const provider = getProvider()
    const signer = provider.getSigner()
    const contract = new ethers.Contract(bonusContract, ["function withrawYourTokens()external returns(bool)"], provider)
    const contractSigner = contract.connect(signer)
    const tx = await contractSigner.withrawYourTokens()
    console.log(tx)
}


//MINT FORM
async function fragPermToMint(){
    const provider = getProvider()
    const signer = provider.getSigner()
    const contract = new ethers.Contract(fragContract,[increaseAllowanceFunc, allowanceFunc], provider)
    const contractSigner = contract.connect(signer)
    console.log(increaseAllowanceFunc)
    const tx = await contractSigner.increaseAllowance(nftContract, ethers.utils.parseUnits("100"))
    console.log(tx + "TRANSAÇÃO DE PERMISSAO")
    while(true){
        const permi = await contractSigner.allowance(userWallet, nftContract)
        console.log(permi)
        if(permi["_hex"] != "0x00"){
            break
        }
    }

}

async function mint(){
    let balanceTrue = await getFragBalance()
    console.log(balanceTrue)
    if (balanceTrue >= 100){
        await fragPermToMint()
        const provider = getProvider()
        const signer = provider.getSigner()
        const contract = new ethers.Contract(nftContract, [mintFunc], provider)
        
        const contractSigner = contract.connect(signer)
        const tx = await contractSigner.Mint()


        console.log(tx)
        await attBalance()
    }else{
        console.log("sem saldo para mintar nova nft")
    }
}