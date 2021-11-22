// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

struct Item {
  string productIPFSId;
  string productHash; // hash(title, description, image)
}