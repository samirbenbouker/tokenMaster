// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// import external library ERC721 from OpenZepplin
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// TokenMaster contract will be extends from ERC721
contract TokenMaster is ERC721 {
    // owner of smart contract, person who have all permisions
    address public owner;
    uint256 public totalOccasions;
    uint256 public totalSupply; // number of nfts exists

    // struct = class
    struct Occasion {
        uint256 id;
        string name;
        uint256 cost;
        uint256 tickets;
        uint256 maxTickets;
        string date;
        string time;
        string location;
    }

    mapping(uint256 => Occasion) occasions;
    mapping(uint256 => mapping(address => bool)) public hasBought;
    mapping(uint256 => mapping(uint256 => address)) public seatTaken;
    mapping(uint256 => uint256[]) public seatsTaken;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    function list(
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location
    ) public onlyOwner {
        totalOccasions++;
        occasions[totalOccasions] = Occasion(
            totalOccasions,
            _name,
            _cost,
            _maxTickets,
            _maxTickets,
            _date,
            _time,
            _location
        );
    }

    // going to create the tickets or the nfts from scratch
    // and will to send buyer wallet
    function mint(uint256 _occasionId, uint256 _seat) public payable {
        //require that _id is not 0 or less than total occasions
        require(_occasionId != 0);
        require(_occasionId <= totalOccasions);

        // require that eth sent is greater than cost...
        require(msg.value >= occasions[_occasionId].cost);

        // require that the seat is not taken, and the seat exist...
        require(seatTaken[_occasionId][_seat] == address(0)); // address(0) = null address
        require(_seat <= occasions[_occasionId].maxTickets);

        occasions[_occasionId].tickets -= 1; // update ticket count
        hasBought[_occasionId][msg.sender] = true; // update buying status
        seatTaken[_occasionId][_seat] = msg.sender; // assign seat
        seatsTaken[_occasionId].push(_seat); // update seats currently taken

        // this function come from ERC721
        totalSupply++;
        _safeMint(msg.sender, totalSupply);
    }

    function getOccasion(uint256 _id) public view returns (Occasion memory) {
        return occasions[_id];
    }

    function getSeatsTaken(uint256 _id) public view returns (uint256[] memory) {
        return seatsTaken[_id];
    }

    function withdraw() public onlyOwner {
        // take that smart contract and cast to address and get the ether balance
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
