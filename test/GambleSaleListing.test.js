const GambleSaleListingFactory = artifacts.require('GambleSaleListingFactory');
const GambleSaleListing = artifacts.require('GambleSaleListing');

contract('GambleSaleListing', async (accounts) => {
  beforeEach(async () => { 
    manager = accounts[0]
    participants = accounts.slice(1, 9)

    const factoryInstance = await GambleSaleListingFactory.deployed()

    await factoryInstance.publish('Some-IPFS-Address-Id',
                                  'Some-IPFS-Product-Content-Hash',
                                  'Street 10, 1001, City, Country',
                                  'DHL',
                                  6,
                                  3,
                                  { from: manager, value: web3.utils.toWei('6', 'ether') })
    
    const gambleSaleListingAddresses = await factoryInstance.fetch()
    GambleSaleListingInstance = await GambleSaleListing.at(gambleSaleListingAddresses[gambleSaleListingAddresses.length - 1])
  })

  it('sets the factory contract caller as manager of the published gamble-auction', async () => {
    const creator = await GambleSaleListingInstance.owner()

    assert.equal(manager, creator)
  });

  it('allows an account to participate', async () => {
    // 6 ETH / 3 => 2 ETH => 2 * (10 ** 18) => 2000000000000000000 wei
    await GambleSaleListingInstance.enter({ from: participants[0], value: web3.utils.toWei('2', 'ether') })

    const participantsList = await GambleSaleListingInstance.getParticipants()

    assert.equal(participants[0], participantsList[0])
    assert.equal(1, participantsList.length)
  })

  it('allows multiple accounts to participate', async () => {
    await GambleSaleListingInstance.enter({
      from: participants[0],
      value: web3.utils.toWei('2', 'ether')
    })

    await GambleSaleListingInstance.enter({
      from: participants[1],
      value: web3.utils.toWei('2', 'ether')
    })

    await GambleSaleListingInstance.enter({
      from: participants[2],
      value: web3.utils.toWei('2', 'ether')
    })
    
    let participantsList = await GambleSaleListingInstance.getParticipants()

    assert.equal(accounts[1], participantsList[0])
    assert.equal(accounts[2], participantsList[1])
    assert.equal(accounts[3], participantsList[2])
    assert.equal(3, participantsList.length)
  })

  it('does not allow same account to enter multiple times', async () => {
    let expected = 'Returned error: VM Exception while processing transaction: revert'

    try {
      await GambleSaleListingInstance.enter({
        from: participants[0],
        value: web3.utils.toWei('2', 'ether')
      })
      await GambleSaleListingInstance.enter({
        from: participants[0],
        value: web3.utils.toWei('2', 'ether')
      })
      assert.fail(`Expectation ${expected}`)
    } catch (err) {
      if (err.message != expected) throw err
    }
  })

  it('does not allow more account than the maximum number of slots', async () => {
    let expected = 'Returned error: VM Exception while processing transaction: revert'

    try {
      await GambleSaleListingInstance.enter({
        from: participants[0],
        value: web3.utils.toWei('2', 'ether')
      })
      await GambleSaleListingInstance.enter({
        from: participants[1],
        value: web3.utils.toWei('2', 'ether')
      })
      await GambleSaleListingInstance.enter({
        from: participants[2],
        value: web3.utils.toWei('2', 'ether')
      })
      await GambleSaleListingInstance.enter({
        from: participants[3],
        value: web3.utils.toWei('2', 'ether')
      })
      assert.fail(`Expectation ${expected}`)
    } catch (err) {
      if (err.message != expected) throw err
    }
  })

  it('requires entry amount equal to the price divided by the number of slots', async () => {
    let expected = 'Returned error: VM Exception while processing transaction: revert'

    try {
      await GambleSaleListingInstance.enter({
        from: participants[0],
        value: web3.utils.toWei('1.99', 'ether')
      })
      assert.fail(`Expectation ${expected}`)
    } catch (err) {
      if (err.message != expected) throw err
    }
  })

  xit('releases the money to the winner and resets', async () => {
    await GambleSaleListingInstance.enter({
      from: manager,
      value: web3.utils.toWei('1', 'ether')
    })

    const initialBalance = await web3.eth.getBalance(manager)

    await GambleSaleListingInstance.pickWinner({ from: manager })

    const finalBalance = await web3.eth.getBalance(manager)
    const difference = finalBalance - initialBalance;
    assert(difference > web3.utils.toWei('1.8', 'ether'));

    const players = await GambleSaleListingInstance.getParticipants()
    // assert.equal([], players)
  })
})
