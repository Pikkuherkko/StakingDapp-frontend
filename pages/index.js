import { useMoralis } from "react-moralis";
import { useState } from "react";
import NavBar from "../components/NavBar";
import StakingModule from "../components/StakingModule";

export default function StakingApp() {
  const { isWeb3Enabled } = useMoralis();

  return (
    <div className="">
      <NavBar />
      {isWeb3Enabled ? (
        <div>
          <StakingModule />
        </div>
      ) : (
        <div className="text-3xl font-bold flex justify-center mt-20">
          <div className="bg-orange-400 p-10 rounded-xl">
            Please connect wallet
          </div>
        </div>
      )}
    </div>
  );
}
