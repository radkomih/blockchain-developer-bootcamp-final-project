# Design Patterns

## Factory Pattern
`GambleSaleListingFactory` provides a common interface to publish(deploy) and keep track of previously published(deployed) `GambleSaleListing` contracts by a given user(address).

## Access Controll Pattern
Adds restrictions to some actions in `GambleSaleListing` by using modfiers (`onlyOwner`) from the imported `Ownable` contract.