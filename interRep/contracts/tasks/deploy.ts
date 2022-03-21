import { poseidon_gencontract as poseidonContract } from "circomlibjs"
import { Contract } from "ethers"
import { task, types } from "hardhat/config"

task("deploy", "Deploy a Interep contract")
    .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
    .addParam("verifiers", "Tree depths and verifier addresses", undefined, types.json)
    .setAction(async ({ logs, verifiers }, { ethers }): Promise<Contract> => {
        const poseidonABI = poseidonContract.generateABI(2)
        const poseidonBytecode = poseidonContract.createCode(2)

        const [signer] = await ethers.getSigners()

        const PoseidonLibFactory = new ethers.ContractFactory(poseidonABI, poseidonBytecode, signer)
        const poseidonLib = await PoseidonLibFactory.deploy()

        await poseidonLib.deployed()

        logs && console.log(`Poseidon library has been deployed to: ${poseidonLib.address}`)

        const IncrementalBinaryTreeLibFactory = await ethers.getContractFactory("IncrementalBinaryTree", {
            libraries: {
                PoseidonT3: poseidonLib.address
            }
        })
        const incrementalBinaryTreeLib = await IncrementalBinaryTreeLibFactory.deploy()

        await incrementalBinaryTreeLib.deployed()

        logs && console.log(`IncrementalBinaryTree library has been deployed to: ${incrementalBinaryTreeLib.address}`)

        const ContractFactory = await ethers.getContractFactory("Interep", {
            libraries: {
                IncrementalBinaryTree: incrementalBinaryTreeLib.address
            }
        })

        const contract = await ContractFactory.deploy(
            verifiers.map((v: [number, number]) => v[0]),
            verifiers.map((v: [number, number]) => v[1])
        )

        await contract.deployed()

        logs && console.log(`Interep contract has been deployed to: ${contract.address}`)

        return contract
    })
