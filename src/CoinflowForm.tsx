import { useCallback, useEffect, useState } from "react";
import { CoinflowPurchase } from "@coinflowlabs/react";
import { NftSuccessModal } from "./modals/NftSuccessModal";
import { useWallet } from "./wallet/Wallet.tsx";
import { LoadingSpinner } from "./App.tsx";

export function CoinflowForm() {
  const { wallet, connection } = useWallet();
  const [nftSuccessOpen, setNftSuccessOpen] = useState<boolean>(false);

  if (!wallet || !wallet.publicKey || !connection)
    return (
      <div className={"w-full min-h-96 flex items-center justify-center"}>
        <LoadingSpinner className={"!text-gray-900/20 !fill-gray-900"} />
      </div>
    );

  return (
    <div className={"w-full flex-1 "}>
      <CoinflowPurchaseWrapper
        onSuccess={() => setNftSuccessOpen(true)}
        subtotal={{cents: 20_00}}
      />
      <NftSuccessModal isOpen={nftSuccessOpen} setIsOpen={setNftSuccessOpen} />
    </div>
  );
}

function CoinflowPurchaseWrapper({
  onSuccess,
                                     subtotal,
}: {
  onSuccess: () => void;
  subtotal: {cents: number;};
}) {
  const { wallet, connection } = useWallet();

  const [height, setHeight] = useState<number>(0);
  const [handleHeightChange, setHandleHeightChange] = useState<
    ((newHeight: string) => void) | undefined
  >(undefined);

  const handleHeight = useCallback((newHeight: string) => {
    setHeight(Number(newHeight));
  }, []);

  useEffect(() => {
    if (wallet.publicKey) {
      setHandleHeightChange(() => handleHeight);
    }
  }, [handleHeight, wallet]);

  return (
    <div className={"h-full flex-1 w-full relative pb-20"}>
      <div
        className={"absolute w-full min-h-96 flex items-center justify-center"}
      >
        <LoadingSpinner className={"!text-gray-900/20 !fill-gray-900"} />
      </div>
      <div
        style={{ height: `${height}px`, minHeight: `${height}px` }}
        className={
          "flex-col h-full flex mx-auto relative overflow-hidden rounded-none md:rounded-xl md:border border-black/5"
        }
      >
        <CoinflowPurchase
          handleHeightChange={handleHeightChange}
          wallet={{
              publicKey: wallet.publicKey,
              sendTransaction: () => {throw new Error('Not Implemented')}
          }}
          merchantId={"swe-challenge"}
          env={'sandbox'}
          connection={connection}
          onSuccess={onSuccess}
          amount={subtotal.cents / 100}
          blockchain={"solana"}
        />
      </div>
    </div>
  );
}
