var GambleSaleListingFactory = artifacts.require("GambleSaleListingFactory");

module.exports = function(deployer) {
  deployer.deploy(GambleSaleListingFactory);
};