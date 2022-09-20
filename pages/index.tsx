import type { NextPage } from 'next';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button, Text, VStack } from '@chakra-ui/react';
import { useBundler } from '@/state/bundlr.context';
import { chainId, useAccount, useNetwork } from 'wagmi';
import FundWallet from '@/components/FundWallet';
import UploadJson from '@/components/UploadJson';
import { useEffect, useState } from 'react';

const Home: NextPage = () => {
  const { data } = useAccount();
  const { activeChain } = useNetwork();
  const { initialiseBundlr, bundlrInstance, balance } = useBundler();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  // This when the wallet is not connected
  if (!data) {
    return (
      <div className='justify-center items-center h-screen flex '>
        <VStack gap={8}>
          <Text className='text-4xl font-bold'>
            Connect your wallet first
          </Text>
          <ConnectButton />
        </VStack>
      </div>
    )
  }

  // This when wallet is not connected to polygon network
  if (activeChain && activeChain.id !== chainId.polygonMumbai) {
    return (
      <div className='justify-center items-center h-screen flex '>
        <VStack gap={8}>
          <Text className='text-4xl font-bold'>
            Opps, wrong network!! Switch to Polygon Mumbai Testnet
          </Text>
          <ConnectButton />
        </VStack>
      </div>
    )
  }

  // initialiization required before starting
  if (!bundlrInstance) {
    return (
      <div className='justify-center items-center h-screen flex '>
        <VStack gap={8}>
          <ConnectButton />
          <Text className='text-4xl font-bold'>
            Let's initialise Bundlr now
          </Text>
          <Button className='mt-10' onClick={initialiseBundlr}>Initialise Bundlr</Button>
        </VStack>
      </div>
    )
  }

  // Users should add funds if they have no BNDLR
  if (!balance || Number(balance) <= 0) {
    return (
      <div className='justify-center items-center h-screen flex '>
        <VStack gap={8}>
          <ConnectButton />
          <Text className='text-4xl font-bold'>
            Opps, out of funds!, let's add some
          </Text>
          <FundWallet />
        </VStack>
      </div>
    )
  }

  return (
    <div className='justify-center items-center h-screen flex'>
      <div className="flex">
        <div className='w-1/3'>
          <VStack gap={8}>
            <ConnectButton />
            <FundWallet />
          </VStack>
        </div>
        <div className='w-2/3'>
          <VStack gap={8}>
            <Text fontSize={'4xl'}>
              Select Json File To Upload
            </Text>
            <UploadJson />
          </VStack>
        </div>
      </div>
    </div>
  );
};

export default Home;