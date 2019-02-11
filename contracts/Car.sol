pragma solidity ^0.4.17;

contract Car {
    bytes32 public brand;

    constructor(bytes32 initialBrand) public {
        brand = initialBrand;
    }

    function setBrand(bytes32 newBrand) public {
        brand = newBrand;
    }
}