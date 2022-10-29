import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ethers } from "ethers";
import Image from "next/image";
import StakedAssets from "./StakedAssets";
import artifact from "./constants/Staking.json";
import tokenjson from "./constants/Farmtoken.json";
import coin from "./images/coin.jpeg";

const CONTRACT_ADDRESS = "0x31cB463f6137796D6F8e0a83Edb39C32bC10D32C";
const FARMTOKEN_ADDRESS = "0xd5bce816F394dD9a28F4f765521f2cd96c7c7727";

export default function StakingModule() {
  const { isWeb3Enabled } = useMoralis();
  const [stakingLength, setStakingLength] = useState(undefined);
  const [amount, setAmount] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(undefined);

  const { runContractFunction: StakeEther } = useWeb3Contract({
    abi: artifact.abi,
    contractAddress: CONTRACT_ADDRESS,
    functionName: "StakeEther",
    msgValue: amount,
    params: { _numDays: stakingLength },
  });

  const handleSuccess = async (tx) => {
    try {
      await tx.wait(1);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const { runContractFunction: getBalance } = useWeb3Contract({
    abi: tokenjson.abi,
    contractAddress: FARMTOKEN_ADDRESS,
    functionName: "balanceOf",
    params: { account: CONTRACT_ADDRESS },
  });

  const farmTokenBalance = async () => {
    const tokenBalance = await getBalance();
    setTokenBalance(ethers.utils.formatEther(tokenBalance));
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      farmTokenBalance();
    }
  }, [isWeb3Enabled]);

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div className="bg-orange-400 rounded-xl h-80">
        <div className="text-center text-2xl font-bold mt-4 font">Stake</div>
        <div className="text-center my-4 font-bold">
          Earn FARM tokens by locking ETH
        </div>
        <div className="flex flex-row ml-2 mt-4">
          <div className="basis-1/3 flex flex-row">
            <Image
              src={coin}
              alt="coin.jpeg"
              width={50}
              height={50}
              layout="fixed"
            />
            <div className="flex-col ml-4 text-xl">
              <div>1 days</div>
              <div>7 %</div>
            </div>
          </div>
          <div className="basis-1/3 flex flex-row">
            <input
              className="h-8 w-24 rounded-2xl ml-4 mt-3 focus:outline-none text-center font-bold"
              onChange={(e) => {
                try {
                  setStakingLength(1);
                  setAmount(ethers.utils.parseEther(e.target.value));
                } catch (err) {
                  console.log(err);
                }
              }}
            />
            <div className="ml-1 mt-4">ETH</div>
          </div>
          <div className="basis-1/3">
            <button
              className="ml-8 mt-3 bg-black text-white px-8 h-8 rounded-2xl hover:bg-white hover:text-orange-400"
              onClick={async () => {
                await StakeEther({
                  onSuccess: handleSuccess,
                  onError: (err) => console.log(err),
                });
              }}
            >
              Stake
            </button>
          </div>
        </div>
        <div className="flex flex-row ml-2 mt-4">
          <div className="basis-1/3 flex flex-row">
            <Image
              src={coin}
              alt="coin.jpeg"
              width={50}
              height={50}
              layout="fixed"
            />
            <div className="flex-col ml-4 text-xl">
              <div>2 days</div>
              <div>10 %</div>
            </div>
          </div>
          <div className="basis-1/3 flex flex-row">
            <input
              className="h-8 w-24 rounded-2xl ml-4 mt-3 focus:outline-none text-center font-bold"
              onChange={(e) => {
                try {
                  setStakingLength(3);
                  setAmount(ethers.utils.parseEther(e.target.value));
                } catch (err) {
                  console.log(err);
                }
              }}
            />
            <div className="ml-1 mt-4">ETH</div>
          </div>
          <div className="basis-1/3">
            <button
              className="ml-8 mt-3 bg-black text-white px-8 h-8 rounded-2xl hover:bg-white hover:text-orange-400"
              onClick={async () => {
                await StakeEther({
                  onSuccess: handleSuccess,
                  onError: (err) => console.log(err),
                });
              }}
            >
              Stake
            </button>
          </div>
        </div>
        <div className="flex flex-row ml-2 mt-4">
          <div className="basis-1/3 flex flex-row mb-4">
            <Image
              src={coin}
              alt="coin.jpeg"
              width={50}
              height={50}
              layout="fixed"
            />
            <div className="flex-col ml-4 text-xl">
              <div>6 days</div>
              <div>12 %</div>
            </div>
          </div>
          <div className="basis-1/3 flex flex-row">
            <input
              className="h-8 w-24 rounded-2xl ml-4 mt-3 focus:outline-none text-center font-bold"
              onChange={(e) => {
                try {
                  setStakingLength(6);
                  setAmount(ethers.utils.parseEther(e.target.value));
                } catch (err) {
                  console.log(err);
                }
              }}
            />
            <div className="ml-1 mt-4">ETH</div>
          </div>
          <div className="basis-1/3">
            <button
              className="ml-8 mt-3 bg-black text-white px-8 h-8 rounded-2xl hover:bg-white hover:text-orange-400"
              onClick={async () => {
                await StakeEther({
                  onSuccess: handleSuccess,
                  onError: (err) => console.log(err),
                });
              }}
            >
              Stake
            </button>
          </div>
        </div>
      </div>

      <div className="bg-orange-400 rounded-xl h-full">
        <div className="text-center text-2xl font-bold mt-4 font">
          Your Staked Assets
        </div>
        <div className="text-center my-4 font-bold">
          If you unstake before unlock, no rewards
        </div>
        <StakedAssets abi={artifact.abi} StakingAddress={CONTRACT_ADDRESS} />
      </div>
      <footer className="mt-10">
        Farmtoken vault balance: {tokenBalance} FARM
        <div>Staking contract address on Goerli:</div>
        <div className="font-bold">
          0x31cB463f6137796D6F8e0a83Edb39C32bC10D32C
        </div>
        <div>FARM token contract address on Goerli:</div>
        <div className="font-bold">
          0xd5bce816F394dD9a28F4f765521f2cd96c7c7727
        </div>
      </footer>
    </div>
  );
}
