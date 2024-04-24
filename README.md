# Tokenmaster

## Technology Stack & Tools

- Solidity (Writing Smart Contracts & Tests)
- Javascript (React & Testing)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ethers.js](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [React.js](https://reactjs.org/) (Frontend Framework)
- [MetaMask](https://metamask.io/)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/). Recommended to use the LTS version.
- Install [MetaMask](https://metamask.io/) on your browser.

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
`$ npm install`

### 3. Run tests
`$ npx hardhat test`

### 4. Start Hardhat node
`$ npx hardhat node`

### 5. Run deployment script
In a separate terminal execute:
`$ npx hardhat run ./scripts/deploy.js --network localhost`

### 6. Start frontend
`$ npm run start`

# Smart Ticketing System

This project implements a ticket selling system using smart contracts on the Ethereum blockchain. It allows for the creation and sale of non-fungible tokens (NFTs) representing tickets for specific events.

## Functionality

The `TokenMaster` contract implements the main functionality of the ticket selling system. Here's a summary of the key features:

- **Event Creation**: The contract owner can create new events by specifying the event name, ticket cost, maximum ticket quantity, date, time, and location of the event.
  
- **Ticket Sale**: Users can purchase tickets for events using the `mint` function. They are assigned a unique NFT token representing their ticket. The contract ensures that no more tickets can be purchased than available for an event and that each seat is available only once.
  
- **Event and Seat Query**: Users can query information about available events and occupied seats using the `getOccasion` and `getSeatsTaken` functions.

- **Fund Withdrawal**: The contract owner can withdraw funds collected from ticket sales using the `withdraw` function.

## Smart Contract

The `TokenMaster` smart contract is based on the ERC721 standard for non-fungible tokens (NFTs) and extends the functionality provided by the base `ERC721` contract from OpenZeppelin. Here's a summary of the main structures and functions of the contract:

- **Occasion Structure**: Defines the structure of an event, including a unique identifier, name, ticket cost, available ticket quantity, date, time, and location of the event.
  
- **`list` Function**: Allows the contract owner to create new events and specify their details.
  
- **`mint` Function**: Allows users to purchase tickets for a specified event and assigns a unique NFT token as their ticket. It also handles updating the event state and ensuring the integrity of sold seats.

- **Query Functions**: Allow users and the contract owner to query information about events and occupied seats.

- **`withdraw` Function**: Allows the contract owner to withdraw funds collected from ticket sales.

## Setup

To use this system, the `TokenMaster` contract must be deployed on the Ethereum blockchain, and it must be interacted with using an Ethereum-compatible wallet such as MetaMask.
