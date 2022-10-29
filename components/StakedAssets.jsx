import React, { useState, useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ethers } from "ethers";

export default function StakedAssets(props) {
  const { isWeb3Enabled, account } = useMoralis();
  const [assetIds, setAssetIds] = useState([]);
  const [assets, setAssets] = useState([]);

  const { abi, StakingAddress } = props;

  const { runContractFunction: getPositionIdsForAddress } = useWeb3Contract({
    abi: abi,
    contractAddress: StakingAddress,
    functionName: "getPositionIdsForAddress",
    params: { _walletAddress: account },
  });

  const calcDaysRemaining = (unlockDate) => {
    const timeNow = Date.now() / 1000;
    const secondsRemaining = unlockDate - timeNow;
    return Math.max((secondsRemaining / 60 / 60 / 24).toFixed(0), 0);
  };

  const toEther = (wei) => ethers.utils.formatEther(wei); // wei to ether

  const getAssets = async (ids) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(StakingAddress, abi);
    let asset;
    let queriedAssets = [];
    for (let i = 0; i < ids.length; i++) {
      asset = await contract.connect(signer).getPositionById(i);
      queriedAssets.push(asset);
    }

    queriedAssets.map(async (queriedAssets) => {
      const parsedAsset = {
        positionId: queriedAssets.positionId.toString(),
        percentInterest: Number(queriedAssets.percentInterest) / 100,
        daysRemaining: calcDaysRemaining(Number(queriedAssets.unlockDate)),
        etherInterest: toEther(queriedAssets.weiInterest),
        etherStaked: toEther(queriedAssets.weiStaked),
        open: queriedAssets.open,
      };
      setAssets((prev) => [...prev, parsedAsset]);
    });
  };

  const unStake = async (id) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(StakingAddress, abi);
      await contract.connect(signer).closePosition(id);
      await tx.wait(1);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const updateUIValues = async () => {
    const assetIds = await getPositionIdsForAddress();
    setAssetIds(assetIds);
    await getAssets(assetIds);
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUIValues();
    }
  }, [isWeb3Enabled]);

  return (
    <div className="">
      <div className="flex flex-row text-center font-bold mt-4 mb-4">
        <div className="basis-1/5">Status</div>
        <div className="basis-1/5">APR</div>
        <div className="basis-1/5">days</div>
        <div className="basis-1/5">earn</div>
        <div className="basis-1/5">staked</div>
      </div>
      <div>
        {assets.map((a, idx) => (
          <div key={idx} className="flex flex-row text-black text-center mb-2">
            {a.open ? (
              <button
                className="basis-1/5 bg-white rounded-2xl"
                onClick={async () => await unStake(a.positionId)}
              >
                Unstake
              </button>
            ) : (
              <div className="basis-1/5">Closed</div>
            )}
            <div className="basis-1/5">{a.percentInterest}%</div>
            <div className="basis-1/5">{a.daysRemaining}</div>
            <div className="basis-1/5">{a.etherInterest} FARM</div>
            <div className="basis-1/5">{a.etherStaked} ETH</div>
          </div>
        ))}
      </div>
    </div>
  );
}
