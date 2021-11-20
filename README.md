# Decentralized peer-reviewed package registry with increased security/transparency/durability

Alice has developed a software package that she wants to publish in a registry for distribution but in a more decentralized manner. It should have increased durability/transparency/security that keeps other people motivated to review/contribute/host it.
Bob wants to use existing software libraries, but he wants packages to be always available (not deleted at some point by the press of a button). Also, secure (by transparent ranking), and supported by an active community. He needs to pay a small fee to download the package and use it.

## Example
1. Alice submits a software package to the registry.

2. To be accepted and reviewed by the community, Alice needs to lock some amount of ETH in the registry contract.

3. Alice decides the amount she is willing to lock. It acts as an anti-spam incentive but also keeps other community members participating.

4. The package content gets hashed then stored in IPFS. The hash is also stored in the contract and broadcasted for review by the community.

5. For a member to participate/contribute/review the package, he needs to lock some amount of ETH too.

6. Once the majority comes to a consensus the changes are approved.

7. To download and use the package, a fee percentage proportional to the total amount locked needs to be paid. Anyone that contributed to the package receives a reward proportional to his locked amount.
The higher the fee, the more members will have the motivation to participate and share a reward. A higher number of reviewers means a higher security rank if approved (this might affect the speed for approval).

8. In the case of a bug/malicious code, an issue could be opened and the members that introduced the bug might get penalized.

9. To be successfully published/accepted, it needs the majority of reviewers to approve it.

10. Any changes need to go through voting by the community members (could be slower than alternative centralized solution, but more secure).