import { useState, useCallback} from "react";
import { CoinflowPurchase,  } from "@coinflowlabs/react";
import { Transaction } from "@solana/web3.js";
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
    <>
        <CoinflowPurchaseWrapper
          onSuccess={() => setNftSuccessOpen(true)}
          subtotal={{cents: 20_00}}
          transaction={undefined} // To be replaced with actual transaction if needed
        />

 
      <NftSuccessModal isOpen={nftSuccessOpen} setIsOpen={setNftSuccessOpen} />
  </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CoinflowPurchaseWrapperProps {
  onSuccess: () => void;
  subtotal: {cents: number};
  transaction: Transaction | undefined;
}

function CoinflowPurchaseWrapper({
  onSuccess,
  subtotal,
  transaction,
}: CoinflowPurchaseWrapperProps) {
  const { wallet, connection } = useWallet();
  const [height, setHeight] = useState<number>(0);

  const handleHeight = useCallback((newHeight: string) => {
    const parsedHeight = parseFloat(newHeight);
    if (!isNaN(parsedHeight)) {
      setHeight(parsedHeight);
    } else {
      console.warn("CoinflowPurchaseWrapper: Received invalid height string:", newHeight);
      setHeight(0);
    }
  }, []);

  if (!wallet || !wallet.publicKey || !connection) {
    return null; //This should be handled by the parent container, but just in case we've added a fallback here.
  }
  return (
    <div  style={{ height: `${height}px` }} className={"h-full flex-1 w-full relative pb-20"}>
      <CoinflowPurchase
        wallet={wallet}
        merchantId={"swe-challenge"}
        env={"sandbox"}
        connection={connection} 
        onSuccess={onSuccess} 
        transaction={transaction} 
        blockchain={"solana"}
        {...(subtotal?.cents > 0 && { subtotal })} //If cents is not defined, custom amount will be allowed
        loaderBackground={"#FFFFFF"}
        handleHeightChange={handleHeight}
        chargebackProtectionData={[]}
        />
    </div>
  );
}