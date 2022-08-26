// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract fragmentos is ERC20{
    address admin;
    constructor()
    ERC20("Fragmentos","FGT"){
        admin = msg.sender;
        _mint(admin, 10000 * 10 ** 18);
    }
}
contract bonus{
    mapping(address => bool) permToWithraw;
    address fragContract;
    address bank;
    constructor(){
        fragContract = 0xe56b4B9a294937f17B259dDfAD49556201b0901A;
        bank = 0xCf1B9A7cceaD435E90eBb7a905b3332e32A5507d;
    }

    function withrawYourTokens()external returns(bool){
        require(permToWithraw[msg.sender] == false, "Ja fez o saque");
        permToWithraw[msg.sender] = true;
        ERC20 frag = ERC20(fragContract);
        frag.transferFrom(bank, msg.sender, 100 * 10 ** 18);
        return true;
    }

    function viewUserPerm()external view returns(bool){
        return permToWithraw[msg.sender];
    }
}

contract nft{
    address nullAddress;
    address fragmentosContract;
    uint256 mintCountID;
    uint256 marketID;
    NFT nft;
    nftToSale buildMarket;

    constructor(){
        fragmentosContract = 0xe56b4B9a294937f17B259dDfAD49556201b0901A;
        nullAddress = 0x0000000000000000000000000000000000000001;
        mintCountID = 0;
    }

    struct NFT{
        uint256 id;
        address owner;
        string img;
        string name;
        string status;
    }
    mapping(uint256 => NFT) mintedNft;
    mapping(address => NFT[]) nftOwnerList; 
    
    

    struct nftToSale{
        uint256 price;
        NFT nft;
    }
    mapping(address => nftToSale[])market;

   
    function returnUserNftAmount(address _address) external view returns(uint256){
        return nftOwnerList[_address].length;
    }

    function realReturnUserNftList(address _address, uint256 _index)public view returns(uint256, address, string memory, string memory, string memory){
        NFT storage nft = nftOwnerList[_address][_index];
        
        return (nft.id, nft.owner, nft.img, nft.name, nft.status);
    }

   
    
    function sell(uint256 _price, uint256 _id)external returns(bool){
        require(mintedNft[_id].owner == msg.sender, "ERRO: nao petence ao usuario a nft");
        buildMarket = nftToSale(_price, mintedNft[_id]);
        market[msg.sender].push(buildMarket);
        return true;
    }

    function returnUserNftInSale(address _address, uint256 _index)external view returns(uint256, uint256, address, string memory, string memory, string memory){
        nftToSale storage nft = market[_address][_index];
        return (nft.price, nft.nft.id, nft.nft.owner, nft.nft.img, nft.nft.name, nft.nft.status);
    }



   
    function returnNftData(uint256 _key)external view returns(NFT memory){
        return mintedNft[_key];
    }


    function returnNftName(uint256 _key) external view returns(string memory){
        return mintedNft[_key].name;
    }
    function returnNftImg(uint256 _key) external view returns(string memory){
        return mintedNft[_key].img;
    }
    function returnNftStatus(uint256 _key) external view returns(string memory){
        return mintedNft[_key].status;
    }
    function returnNftOwner(uint256 _key) external view returns(address){
        return mintedNft[_key].owner;
    }
    
    function Mint() external returns(bool){
      
        ERC20 frag = ERC20(fragmentosContract);
        require(frag.balanceOf(msg.sender) >= 100 * 10 ** 18, "Sem fragmentos suficientes para Mint");
        frag.transferFrom(msg.sender, nullAddress, 100 * 10 ** 18);
        
   
        nft = NFT(mintCountID, msg.sender,"images/mage.jpg", "Mage", "0%");

        mintedNft[mintCountID] = nft;
        nftOwnerList[msg.sender].push(nft);
        mintCountID = mintCountID + 1;
        return true;
    }

}