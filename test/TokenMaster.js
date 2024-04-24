const { expect } = require("chai")
const { ethers } = require("hardhat")

const NAME = "TokenMaster"
const SYMBOL = "TM"

const ONE_ETHER = ethers.utils.parseUnits("1", 'ether')

const OCCASION_NAME = "ETH Texas"
const OCCASION_COST = ONE_ETHER
const OCCASION_MAX_TICKETS = 100
const OCCASION_DATE = "Apr 27"
const OCCASION_TIME = "10:00AM CST"
const OCCASION_LOCATION = "Austin, Texas"

const OCCASION_ID = 1
const SEAT = 50
const AMOUNT = ONE_ETHER

describe("TokenMaster", () => {
  let tokenMaster
  let deployer, buyer

  beforeEach(async () => {
    // represent a users on the blockchain that can sign transactions 
    // It's not an address itself its a key pair with a lot of other functionality assosciated
    // can get the address, private key, ...
    [deployer, buyer] = await ethers.getSigners()
    // getting the contract using ethers from hardhat
    // TokenMaster = undeployed contract (wiht camel case)
    const TokenMaster = await ethers.getContractFactory("TokenMaster")
    // deploy undeployed contract using deploy function
    // tokenMaster = deplotyed contract
    tokenMaster = await TokenMaster.deploy(NAME, SYMBOL)

    // we are doing a transaction on the blockchain
    // and need the specify address we're doing that transaction
    // and in this case will be a deployer
    const transaction = await tokenMaster.connect(deployer).list(
      OCCASION_NAME,
      OCCASION_COST,
      OCCASION_MAX_TICKETS,
      OCCASION_DATE,
      OCCASION_TIME,
      OCCASION_LOCATION
    )

    //.wait(): This is a function call that is waiting for the transaction to be mined and confirmed on the Ethereum blockchain.
    await transaction.wait()
  })

  describe("Deployment", () => {
    it("Sets the name", async () => {
      // get name form deployed contract 
      // expect name deploy contract will be "TokenMaster"
      expect(await tokenMaster.name()).to.equal(NAME)
    })

    it("Sets the symbol", async () => {
      expect(await tokenMaster.symbol()).to.equal(SYMBOL)
    })

    it("Sets the owner", async () => {
      expect(await tokenMaster.owner()).to.equal(deployer.address)
    })

  })

  describe("Occasions", () => {
    it("Updates occasions count", async () => {
      expect(await tokenMaster.totalOccasions()).to.be.equal(1)
    })

    it("Returns occasions attributes", async () => {
      const occasion = await tokenMaster.getOccasion(1);
      expect(occasion.id).to.be.equal(1)
      expect(occasion.name).to.be.equal(OCCASION_NAME)
      expect(occasion.cost).to.be.equal(OCCASION_COST)
      expect(occasion.tickets).to.be.equal(OCCASION_MAX_TICKETS)
      expect(occasion.date).to.be.equal(OCCASION_DATE)
      expect(occasion.time).to.be.equal(OCCASION_TIME)
      expect(occasion.location).to.be.equal(OCCASION_LOCATION)
    })

  })

  describe("Minting", () => {
    beforeEach(async () => {
      const transaction = await tokenMaster.connect(buyer).mint(OCCASION_ID, SEAT, { value: AMOUNT })
      await transaction.wait()
    })

    it("Update ticket count", async () => {
      const occasion = await tokenMaster.getOccasion(1)
      expect(occasion.tickets).to.equal(OCCASION_MAX_TICKETS - 1)
    })

    it("Update buying status", async () => {
      const status = await tokenMaster.hasBought(OCCASION_ID, buyer.address)
      expect(status).to.equal(true)
    })

    it("Update seat status", async () => {
      const owner = await tokenMaster.seatTaken(OCCASION_ID, SEAT)
      expect(owner).to.equal(buyer.address)
    })

    it("Update overall seating status", async () => {
      const seats = await tokenMaster.getSeatsTaken(OCCASION_ID)
      expect(seats.length).to.equal(1)
      expect(seats[0]).to.equal(SEAT)
    })

    it("Update the contract balance", async () => {
      const balance = await ethers.provider.getBalance(tokenMaster.address)
      expect(balance).to.equal(AMOUNT)
    })

  })

  describe("Withdrawing", () => {
    let balanceBefore

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address)

      let transaction = await tokenMaster.connect(buyer).mint(OCCASION_ID, SEAT, { value: AMOUNT })
      await transaction.wait()

      transaction = await tokenMaster.connect(deployer).withdraw()
      await transaction.wait()
    })

    it("Update the owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.greaterThan(balanceBefore)
    })

    it("Update the contract balance", async () => {
      const balance = await ethers.provider.getBalance(tokenMaster.address)
      expect(balance).to.equal(0)
    })

  })
})
