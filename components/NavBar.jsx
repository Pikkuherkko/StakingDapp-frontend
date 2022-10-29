import { useMoralis } from "react-moralis";
import { useEffect } from "react";

export default function NavBar() {
  const { isWeb3Enabled, enableWeb3, account, deactivateWeb3 } = useMoralis();

  useEffect(() => {
    if (
      !isWeb3Enabled &&
      typeof window !== "undefined" &&
      window.localStorage.getItem("connected")
    ) {
      enableWeb3();
    }
  }, []);

  const disconnect = async () => {
    window.localStorage.removeItem("connected");
    deactivateWeb3();
  };

  return (
    <div className="">
      <div className="flex flex-row justify-between p-2 border-2 font-bold">
        <h1 className="mt-2 px-4 font text-2xl">Staking App</h1>
        {account ? (
          <button
            className="w-30 bg-orange-400 px-4 py-2 rounded-xl hover:bg-black hover:text-orange-400"
            onClick={() => disconnect()}
          >
            Connected
          </button>
        ) : (
          <button
            onClick={async () => {
              const res = await enableWeb3();
              if (typeof res !== "undefined") {
                if (typeof window !== "undefined") {
                  window.localStorage.setItem("connected", "injected");
                }
              }
            }}
            className="w-24 bg-orange-400 p-2 rounded-xl hover:bg-black hover:text-orange-400"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
}
