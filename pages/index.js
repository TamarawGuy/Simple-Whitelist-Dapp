import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useState, useRef, useEffect } from "react";
import Whitelist from "../artifacts/contracts/Whitelist.sol/Whitelist.json";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numberOfWhitelistedAddresses, setNumberOfWhitelistedAddresses] =
    useState(0);
  const web3ModalRef = useRef();

  const connectWallet = async () => {
    await getProviderOrSigner();
    setWalletConnected(true);
    checkIfAddressInWhitelist();
    getNumberOfWhitelistedAddresses();
  };

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();

    if (chainId !== 4) {
      alert("Change network to rinkeby");
      throw new Error("Change network to rinkeby");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }

    return web3Provider;
  };

  const addAddressToWhitelist = async () => {
    const signer = await getProviderOrSigner(true);
    const whitelistContract = new ethers.Contract(
      "0xA6991A520A35C47635Fa6071728b0EFd3cB712F8",
      Whitelist.abi,
      signer
    );
    const tx = await whitelistContract.addAddressToWhitelist();
    setLoading(true);
    await tx.wait();
    setLoading(false);

    await getNumberOfWhitelistedAddresses();
    setJoinedWhitelist(true);
  };

  const getNumberOfWhitelistedAddresses = async () => {
    const provider = await getProviderOrSigner();
    const whitelistContract = new ethers.Contract(
      "0xA6991A520A35C47635Fa6071728b0EFd3cB712F8",
      Whitelist.abi,
      provider
    );
    const addresses = await whitelistContract.numberOfWhitelistedAddresses();
    setNumberOfWhitelistedAddresses(addresses);
  };

  const checkIfAddressInWhitelist = async () => {
    const signer = await getProviderOrSigner(true);
    const whitelistContract = new ethers.Contract(
      "0xA6991A520A35C47635Fa6071728b0EFd3cB712F8",
      Whitelist.abi,
      signer
    );
    const address = await signer.getAddress();
    const isJoined = await whitelistContract.whitelistedAddresses(address);
    setJoinedWhitelist(isJoined);
  };

  const Button = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return <div className={styles.description}>Thanks for joining!</div>;
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button
            className={styles.button}
            onClick={() => addAddressToWhitelist()}
          >
            Join Whitelist!
          </button>
        );
      }
    } else {
      return (
        <button className={styles.button} onClick={() => connectWallet()}>
          Connect your wallet
        </button>
      );
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Whitelist Dapp!</h1>
          <div className={styles.description}>
            This is and NFT collection for devs!
          </div>
          <div className={styles.description}>
            {ethers.BigNumber.from(numberOfWhitelistedAddresses).toNumber()}{" "}
            have already joined!
          </div>
          {Button()}
        </div>
      </main>
    </div>
  );
}
