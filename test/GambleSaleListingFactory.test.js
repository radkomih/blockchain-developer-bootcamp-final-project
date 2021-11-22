const { assertRevertError } = require("./exceptionExpectationHelpers.js");
const GambleSaleListingFactory = artifacts.require('GambleSaleListingFactory');

contract('GambleSaleListingFactory', async (accounts) => {
  beforeEach(async () => {
    factoryInstance = await GambleSaleListingFactory.new();

    manager = accounts[0]

    itemListingArgs = [
      'Some-IPFS-Address-Id',
      'Some-IPFS-Item-Content-Hash',
      'Street 10, 1001, City, Country',
      'DHL',
      6,
      3
    ]

    collateral = 6
  });

  it('publishes new gamble-sale listing by providing enough collateral', async() => {
    await factoryInstance.publish(...itemListingArgs, 
                                  {
                                    from: manager,
                                    value: web3.utils.toWei(collateral.toString(), 'ether')
                                  })

    let [gambleSaleListingAddress] = await factoryInstance.fetch()

    assert.ok(gambleSaleListingAddress)
  })

  it('fails to publish new gamble-sale listing by not providing enough collateral', async() => {
    assertRevertError(
      factoryInstance.publish(...itemListingArgs, 
                              {
                                from: manager,
                                value: web3.utils.toWei((collateral).toString(), 'ether')
                              })
    )
  })
})