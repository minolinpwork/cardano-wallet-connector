import React from 'react'
import {
    Address,
    BaseAddress,
    MultiAsset,
    Assets,
    ScriptHash,
    Costmdls,
    Language,
    CostModel,
    AssetName,
    TransactionUnspentOutput,
    TransactionUnspentOutputs,
    TransactionOutput,
    Value,
    TransactionBuilder,
    TransactionBuilderConfigBuilder,
    TransactionOutputBuilder,
    LinearFee,
    BigNum,
    BigInt,
    TransactionHash,
    TransactionInputs,
    TransactionInput,
    TransactionWitnessSet,
    Transaction,
    PlutusData,
    PlutusScripts,
    PlutusScript,
    PlutusList,
    Redeemers,
    Redeemer,
    RedeemerTag,
    Ed25519KeyHashes,
    ConstrPlutusData,
    ExUnits,
    Int,
    NetworkInfo,
    EnterpriseAddress,
    TransactionOutputs,
    hash_transaction,
    hash_script_data,
    hash_plutus_data,
    ScriptDataHash, Ed25519KeyHash, NativeScript, StakeCredential,
    TxBuilderConstants,
    encode_json_str_to_plutus_datum,
    PlutusDatumSchema,
    ExUnitPrices, UnitInterval, PlutusWitness, TxInputsBuilder, 
    Vkeywitnesses, Vkeywitness, PublicKey, Vkey, Ed25519Signature,
} from "@emurgo/cardano-serialization-lib-asmjs"
import "./App.css";
import {blake2b} from "blakejs";

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { ListItemButton } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Tooltip from '@mui/material/Tooltip';
import ButtonGroup from '@mui/material/ButtonGroup';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import axios from 'axios';

import { properties } from './properties/properties.js'
import LottoView, {Lottery} from './component/Lottery'
import BasicTable from './component/BasicTable'
import NewLottery from './component/NewLottery'

import clipboard from 'clipboardy';

import { sha256 } from 'js-sha256';

let blake = require('blakejs')
let Buffer = require('buffer/').Buffer

export default class App extends React.Component
{
    constructor(props)
    {
        super(props);

        //const lotteriesX = this.createLotteries();
        //let newLottery = new Lottery("Bingo"+Date.now(), 5, 1);
        //newLottery.choices[1]=true;
        //newLottery.amount=5;

        this.state = {
            //selectedTabId: "1",
            whichWalletSelected: undefined,
            walletFound: false,
            walletIsEnabled: false,
            walletName: undefined,
            walletIcon: undefined,
            walletAPIVersion: undefined,
            wallets: [],

            networkId: undefined,
            Utxos: undefined,
            CollatUtxos: undefined,
            balance: undefined,
            changeAddress: undefined,
            rewardAddress: undefined,
            usedAddress: undefined,

            txBody: undefined,
            txBodyCborHex_unsigned: "",
            txBodyCborHex_signed: "",
            submittedTxHash: "",

            addressBech32SendADA: "addr_test1qrt7j04dtk4hfjq036r2nfewt59q8zpa69ax88utyr6es2ar72l7vd6evxct69wcje5cs25ze4qeshejy828h30zkydsu4yrmm",
            //lovelaceToSend: 3000000,
            assetNameHex: "4c494645",
            assetPolicyIdHex: "ae02017105527c6c0c9840397a39cc5ca39fabe5b9998ba70fda5f2f",
            assetAmountToSend: 5,
            //addressScriptBech32: "addr_test1wpnlxv2xv9a9ucvnvzqakwepzl9ltx7jzgm53av2e9ncv4sysemm8",
            //datumStr: "12345678",
            //plutusScriptCborHex: "4e4d01000033222220051200120011",
            //transactionIdLocked: "",
            transactionIndxLocked: 0,
            //lovelaceLocked: 3000000,
            manualFee: 900000,

            selectedTabId: "5",
            plutusScriptCborHex: properties.plutusScriptCborHex,
            addressScriptBech32: properties.addressScriptBech32,
            datumStr: "872e4e50ce9990d8b041330c47c9ddd11bec6b503ae9386a99da8584e9bb12c4".toUpperCase(),
            redeemStr: "HelloWorld",
            transactionIdLocked: "85d607cba9edd396eb4a87591cb4df84f0c8a265f8fc64bb5a1a0309ee3da8bb",
            lovelaceToSend: 4321000,
            lovelaceLocked: 4321000,

            openAvailableWalletsDialog: false,
            openWalletDetailsDialog: false,
            openNFTDetailsDialog: false,
            openNFTSuccessAlert: false,
            openNFTFailureAlert: false,
            showWalletInfo: false,
            connectWallet: true,

            nft_policyName: 'ADANFTCreator',
            nft_name: '',
            nft_description: '',
            nft_imageType: 'PNG',
            statusUpdate: "",

            lotteries: [],
            //selectedLottery: lotteriesX[0],

            selectedLottery : null,
            createNewLottery: false,

            winningNumbersAlert: false,
            youWonAlert: false,
            youLostAlert: false,
            nameRequiredAlert: false,
            errorAlert: false,
            newLotteryCreatedAlert: false,

            showWorking: true,


/**            
            selectedTabId: "5",
            plutusScriptCborHex: "59076d59076a01000033232323232323232323232323232332232323232222232325335333006375c00a6666ae68cdc39aab9d37540089000100c11931a99ab9c01a0180170163333573466e1cd55cea8012400046644246600200600464646464646464646464646666ae68cdc39aab9d500a480008cccccccccc888888888848cccccccccc00402c02802402001c01801401000c008cd40508c8c8cccd5cd19b8735573aa0049000119910919800801801180f9aba150023019357426ae8940088c98d4cd5ce01501401381309aab9e5001137540026ae854028cd4050054d5d0a804999aa80bbae501635742a010666aa02eeb94058d5d0a80399a80a00f9aba15006335014335502202075a6ae854014c8c8c8cccd5cd19b8735573aa00490001199109198008018011919191999ab9a3370e6aae754009200023322123300100300233502575a6ae854008c098d5d09aba2500223263533573805c05805605426aae7940044dd50009aba150023232323333573466e1cd55cea8012400046644246600200600466a04aeb4d5d0a80118131aba135744a004464c6a66ae700b80b00ac0a84d55cf280089baa001357426ae8940088c98d4cd5ce01501401381309aab9e5001137540026ae854010cd4051d71aba15003335014335502275c40026ae854008c070d5d09aba2500223263533573804c04804604426ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226aae7940044dd50009aba150023232323333573466e1d400520062321222230040053017357426aae79400c8cccd5cd19b875002480108c848888c008014c064d5d09aab9e500423333573466e1d400d20022321222230010053015357426aae7940148cccd5cd19b875004480008c848888c00c014dd71aba135573ca00c464c6a66ae7008407c07807407006c0684d55cea80089baa001357426ae8940088c98d4cd5ce00d00c00b80b080b89931a99ab9c4910350543500017016135573ca00226ea800448c88c008dd6000990009aa80a111999aab9f00125009233500830043574200460066ae8800804c8c8c8c8cccd5cd19b8735573aa00690001199911091998008020018011919191999ab9a3370e6aae7540092000233221233001003002301535742a00466a01c0286ae84d5d1280111931a99ab9c01a018017016135573ca00226ea8004d5d0a801999aa803bae500635742a00466a014eb8d5d09aba2500223263533573802c02802602426ae8940044d55cf280089baa0011335500175ceb44488c88c008dd5800990009aa80911191999aab9f0022500823350073355014300635573aa004600a6aae794008c010d5d100180909aba100111220021221223300100400312232323333573466e1d4005200023212230020033005357426aae79400c8cccd5cd19b8750024800884880048c98d4cd5ce00900800780700689aab9d500113754002464646666ae68cdc39aab9d5002480008cc8848cc00400c008c014d5d0a8011bad357426ae8940088c98d4cd5ce00780680600589aab9e5001137540024646666ae68cdc39aab9d5001480008dd71aba135573ca004464c6a66ae7003402c0280244dd500089119191999ab9a3370ea00290021091100091999ab9a3370ea00490011190911180180218031aba135573ca00846666ae68cdc3a801a400042444004464c6a66ae7004003803403002c0284d55cea80089baa0012323333573466e1d40052002212200223333573466e1d40092000212200123263533573801801401201000e26aae74dd5000919191919191999ab9a3370ea002900610911111100191999ab9a3370ea004900510911111100211999ab9a3370ea00690041199109111111198008048041bae35742a00a6eb4d5d09aba2500523333573466e1d40112006233221222222233002009008375c6ae85401cdd71aba135744a00e46666ae68cdc3a802a400846644244444446600c01201060186ae854024dd71aba135744a01246666ae68cdc3a8032400446424444444600e010601a6ae84d55cf280591999ab9a3370ea00e900011909111111180280418071aba135573ca018464c6a66ae7005004804404003c03803403002c0284d55cea80209aab9e5003135573ca00426aae7940044dd50009191919191999ab9a3370ea002900111999110911998008028020019bad35742a0086eb4d5d0a8019bad357426ae89400c8cccd5cd19b875002480008c8488c00800cc020d5d09aab9e500623263533573801a01601401201026aae75400c4d5d1280089aab9e500113754002464646666ae68cdc3a800a400446424460020066eb8d5d09aab9e500323333573466e1d400920002321223002003375c6ae84d55cf280211931a99ab9c00a008007006005135573aa00226ea800444888c8c8cccd5cd19b8735573aa0049000119aa80498031aba150023005357426ae8940088c98d4cd5ce00500400380309aab9e500113754002930900088910919800801801249035054310011232300100122330033002002001333222222323253350011008133573800400e666ae68cdc78028020038031b993371400800624400424400291010c48656c6c6f20576f726c64210001",
            addressScriptBech32: "addr_test1wrck8y8kgr5065thlzz5h9e38d9wpcufhrw5s5jzzue3zns4csddy",
            datumStr: "Hello World!",
            transactionIdLocked: "85d607cba9edd396eb4a87591cb4df84f0c8a265f8fc64bb5a1a0309ee3da8bb",
            lovelaceToSend: 4400000,
            lovelaceLocked: 4400000,
*/            
        }

        /**
         * When the wallet is connect it returns the connector which is
         * written to this API variable and all the other operations
         * run using this API object
         */
        this.API = undefined;

        /**
         * Protocol parameters
         * @type {{
         * keyDeposit: string,
         * coinsPerUtxoWord: string,
         * minUtxo: string,
         * poolDeposit: string,
         * maxTxSize: number,
         * priceMem: number,
         * maxValSize: number,
         * linearFee: {minFeeB: string, minFeeA: string}, priceStep: number
         * }}
         */
        this.protocolParams = {
            linearFee: {
                minFeeA: "44",
                minFeeB: "155381",
            },
            minUtxo: "1000000",
            poolDeposit: "500000000",
            keyDeposit: "2000000",
            maxValSize: 5000,
            maxTxSize: 16384,
            priceMem: 0.0577,
            priceStep: 0.0000721,
            coinsPerUtxoWord: "34482",
        }

        this.pollWallets = this.pollWallets.bind(this);
    }

    /**
     * Poll the wallets it can read from the browser.
     * Sometimes the html document loads before the browser initialized browser plugins (like Nami or Flint).
     * So we try to poll the wallets 3 times (with 1 second in between each try).
     *
     * Note: CCVault and Eternl are the same wallet, Eternl is a rebrand of CCVault
     * So both of these wallets as the Eternl injects itself twice to maintain
     * backward compatibility
     *
     * @param count The current try count.
     */
    pollWallets = (count = 0) => {
        const wallets = [];
        for(const key in window.cardano) {
            if (window.cardano[key].enable && wallets.indexOf(key) === -1) {
                wallets.push(key);
            }
        }
        if (wallets.length === 0 && count < 3) {
            setTimeout(() => {
                this.pollWallets(count + 1);
            }, 1000);
            return;
        }
        this.setState({
            wallets,
            whichWalletSelected: wallets[0]
        }, () => {
            this.refreshData().then(() => {
                this.setState({showWorking: false})
            })
        });
    }

    /**
     * Generate address from the plutus contract cborhex
     */
    generateScriptAddress = () => {
        
        this.createStringDatum_hex_to_hex(this.state.datumStr, "generateScriptAddress")

        const script = PlutusScript.from_bytes(Buffer.from(this.state.plutusScriptCborHex, "hex"))

        const scripthash = script.hash()
        console.log("hash: " + scripthash.to_hex())
        //console.log("hash: " + scripthash.to_bech32())
        const cred = StakeCredential.from_scripthash(scripthash);
        const networkId = NetworkInfo.testnet().network_id();
        const baseAddr = EnterpriseAddress.new(networkId, cred);
        const addr = baseAddr.to_address();
        const addrBech32 = addr.to_bech32();

        // hash of the address generated from script
        console.log(Buffer.from(addr.to_bytes(), "utf8").toString("hex"))

        // hash of the address generated using cardano-cli
        const ScriptAddress = Address.from_bech32("addr_test1wp4pdj3gd3pqzgpf6ljq67hukzt80hmf2jf8w32vwpfs43q8zu9v7");
        console.log(Buffer.from(ScriptAddress.to_bytes(), "utf8").toString("hex"))


        console.log("Beech32 1: " + ScriptAddress.to_bech32())
        console.log("Beech32 2: " + addrBech32)


        this.createStringDatum_hex_to_hex(this.state.datumStr, "generateScriptAddress")
        this.createStringDatum_utf_to_hex(this.state.redeemStr, "generateScriptAddress ")

        console.log("sha256: " + this.state.redeemStr + " " + sha256(this.state.redeemStr))

    }

    /**
     * Checks if the wallet is running in the browser
     * Does this for Nami, Eternl and Flint wallets
     * @returns {boolean}
     */

    checkIfWalletFound = () => {
        const walletKey = this.state.whichWalletSelected;
        const walletFound = !!window?.cardano?.[walletKey];
        this.setState({walletFound})
        return walletFound;
    }

    /**
     * Checks if a connection has been established with
     * the wallet
     * @returns {Promise<boolean>}
     */
    checkIfWalletEnabled = async () => {
        let walletIsEnabled = false;

        try {
            const walletName = this.state.whichWalletSelected;
            walletIsEnabled = await window.cardano[walletName].isEnabled();
        } catch (err) {
            console.log(err)
        }
        this.setState({walletIsEnabled});

        return walletIsEnabled;
    }

    /**
     * Enables the wallet that was chosen by the user
     * When this executes the user should get a window pop-up
     * from the wallet asking to approve the connection
     * of this app to the wallet
     * @returns {Promise<boolean>}
     */

    enableWallet = async () => {
        const walletKey = this.state.whichWalletSelected;
        try {
            this.API = await window.cardano[walletKey].enable();
        } catch(err) {
            console.log(err);
        }
        return this.checkIfWalletEnabled();
    }

    /**
     * Get the API version used by the wallets
     * writes the value to state
     * @returns {*}
     */
    getAPIVersion = () => {
        const walletKey = this.state.whichWalletSelected;
        const walletAPIVersion = window?.cardano?.[walletKey].apiVersion;
        this.setState({walletAPIVersion})
        return walletAPIVersion;
    }

    /**
     * Get the name of the wallet (nami, eternl, flint)
     * and store the name in the state
     * @returns {*}
     */

    getWalletName = () => {
        const walletKey = this.state.whichWalletSelected;
        const walletName = window?.cardano?.[walletKey].name;
        this.setState({walletName})
        return walletName;
    }

    /**
     * Gets the Network ID to which the wallet is connected
     * 0 = testnet
     * 1 = mainnet
     * Then writes either 0 or 1 to state
     * @returns {Promise<void>}
     */
    getNetworkId = async () => {
        try {
            const networkId = await this.API.getNetworkId();
            this.setState({networkId})

        } catch (err) {
            console.log(err)
        }
    }

    /**
     * Gets the UTXOs from the user's wallet and then
     * stores in an object in the state
     * @returns {Promise<void>}
     */

    getUtxos = async () => {

        let Utxos = [];

        try {
            const rawUtxos = await this.API.getUtxos();

            for (const rawUtxo of rawUtxos) {
                const utxo = TransactionUnspentOutput.from_bytes(Buffer.from(rawUtxo, "hex"));
                const input = utxo.input();
                const txid = Buffer.from(input.transaction_id().to_bytes(), "utf8").toString("hex");
                const txindx = input.index();
                const output = utxo.output();
                const amount = output.amount().coin().to_str(); // ADA amount in lovelace
                const multiasset = output.amount().multiasset();
                let multiAssetStr = "";

                if (multiasset) {
                    const keys = multiasset.keys() // policy Ids of thee multiasset
                    const N = keys.len();
                    // console.log(`${N} Multiassets in the UTXO`)


                    for (let i = 0; i < N; i++){
                        const policyId = keys.get(i);
                        const policyIdHex = Buffer.from(policyId.to_bytes(), "utf8").toString("hex");
                        // console.log(`policyId: ${policyIdHex}`)
                        const assets = multiasset.get(policyId)
                        const assetNames = assets.keys();
                        const K = assetNames.len()
                        // console.log(`${K} Assets in the Multiasset`)

                        for (let j = 0; j < K; j++) {
                            const assetName = assetNames.get(j);
                            const assetNameString = Buffer.from(assetName.name(),"utf8").toString();
                            const assetNameHex = Buffer.from(assetName.name(),"utf8").toString("hex")
                            const multiassetAmt = multiasset.get_asset(policyId, assetName)
                            multiAssetStr += `+ ${multiassetAmt.to_str()} + ${policyIdHex}.${assetNameHex} (${assetNameString})`
                            // console.log(assetNameString)
                            // console.log(`Asset Name: ${assetNameHex}`)
                        }
                    }
                }


                const obj = {
                    txid: txid,
                    txindx: txindx,
                    amount: amount,
                    str: `${txid} #${txindx} = ${amount}`,
                    multiAssetStr: multiAssetStr,
                    TransactionUnspentOutput: utxo
                }
                Utxos.push(obj);
                // console.log(`utxo: ${str}`)
            }
            this.setState({Utxos})
        } catch (err) {
            console.log(err)
        }
    }

    /**
     * The collateral is need for working with Plutus Scripts
     * Essentially you need to provide collateral to pay for fees if the
     * script execution fails after the script has been validated...
     * this should be an uncommon occurrence and would suggest the smart contract
     * would have been incorrectly written.
     * The amount of collateral to use is set in the wallet
     * @returns {Promise<void>}
     */
    getCollateral = async () => {

        let CollatUtxos = [];

        try {

            let collateral = [];

            const wallet = this.state.whichWalletSelected;
            if (wallet === "nami") {
                collateral = await this.API.experimental.getCollateral();
            } else {
                collateral = await this.API.getCollateral();
            }

            for (const x of collateral) {
                const utxo = TransactionUnspentOutput.from_bytes(Buffer.from(x, "hex"));
                CollatUtxos.push(utxo)
                // console.log(utxo)
            }
            this.setState({CollatUtxos})
        } catch (err) {
            console.log(err)
        }

    }

    /**
     * Gets the current balance of in Lovelace in the user's wallet
     * This doesnt resturn the amounts of all other Tokens
     * For other tokens you need to look into the full UTXO list
     * @returns {Promise<void>}
     */
    getBalance = async () => {
        try {
            const balanceCBORHex = await this.API.getBalance();

            const balance = Value.from_bytes(Buffer.from(balanceCBORHex, "hex")).coin().to_str();
            this.setState({balance})

        } catch (err) {
            console.log(err)
        }
    }

    /**
     * Get the address from the wallet into which any spare UTXO should be sent
     * as change when building transactions.
     * @returns {Promise<void>}
     */
    getChangeAddress = async () => {
        try {
            const raw = await this.API.getChangeAddress();
            const changeAddress = Address.from_bytes(Buffer.from(raw, "hex")).to_bech32()
            this.setState({changeAddress})
        } catch (err) {
            console.log(err)
        }
    }

    /**
     * This is the Staking address into which rewards from staking get paid into
     * @returns {Promise<void>}
     */
    getRewardAddresses = async () => {

        try {
            const raw = await this.API.getRewardAddresses();
            const rawFirst = raw[0];
            const rewardAddress = Address.from_bytes(Buffer.from(rawFirst, "hex")).to_bech32()
            // console.log(rewardAddress)
            this.setState({rewardAddress})

        } catch (err) {
            console.log(err)
        }
    }

    /**
     * Gets previsouly used addresses
     * @returns {Promise<void>}
     */
    getUsedAddresses = async () => {

        try {
            const raw = await this.API.getUsedAddresses();
            const rawFirst = raw[0];
            const usedAddress = Address.from_bytes(Buffer.from(rawFirst, "hex")).to_bech32()
            // console.log(rewardAddress)
            this.setState({usedAddress})

        } catch (err) {
            console.log(err)
        }
    }

    refreshBeforeSubmit = async () => {
        const callName = "refreshBeforeSubmit: ";

        console.log(callName + "start");

        //await this.getUtxos();
        //await this.getCollateral();

        try{
            const walletFound = this.checkIfWalletFound();
            if (walletFound) {
                await this.getAPIVersion();
                await this.getWalletName();
                const walletEnabled = await this.enableWallet();
                if (walletEnabled) {
                    await this.getNetworkId();
                    await this.getUtxos();
                    await this.getCollateral();
                    await this.getBalance();
                    await this.getChangeAddress();
                    await this.getRewardAddresses();
                    await this.getUsedAddresses();
                }
            }
        }  catch (err) {
            console.log(callName + " error: " + err)
        }

        console.log(callName + "end");
    }

    /**
     * Refresh all the data from the user's wallet
     * @returns {Promise<void>}
     */
    refreshData = async () => {
        const callName = "refreshData: ";

        console.log(callName + "start");

        this.handleLoadLotteries();

        //this.generateScriptAddress()

        try{
            const walletFound = this.checkIfWalletFound();
            if (walletFound) {
                await this.getAPIVersion();
                await this.getWalletName();
                const walletEnabled = await this.enableWallet();
                if (walletEnabled) {
                    await this.getNetworkId();
                    await this.getUtxos();
                    await this.getCollateral();
                    await this.getBalance();
                    await this.getChangeAddress();
                    await this.getRewardAddresses();
                    await this.getUsedAddresses();
                } else {
                    await this.setState({
                        Utxos: null,
                        CollatUtxos: null,
                        balance: null,
                        changeAddress: null,
                        rewardAddress: null,
                        usedAddress: null,

                        txBody: null,
                        txBodyCborHex_unsigned: "",
                        txBodyCborHex_signed: "",
                        submittedTxHash: "",
                    });
                }
            } else {
                await this.setState({
                    walletIsEnabled: false,

                    Utxos: null,
                    CollatUtxos: null,
                    balance: null,
                    changeAddress: null,
                    rewardAddress: null,
                    usedAddress: null,

                    txBody: null,
                    txBodyCborHex_unsigned: "",
                    txBodyCborHex_signed: "",
                    submittedTxHash: "",
                });
            }
        } catch (err) {
            console.log(err)
        }
        console.log(callName + "end");
    }

    /**
     * Every transaction starts with initializing the
     * TransactionBuilder and setting the protocol parameters
     * This is boilerplate
     * @returns {Promise<TransactionBuilder>}
     */
    initTransactionBuilder = async () => {

        const txBuilder = TransactionBuilder.new(
            TransactionBuilderConfigBuilder.new()
                .fee_algo(LinearFee.new(BigNum.from_str(this.protocolParams.linearFee.minFeeA), BigNum.from_str(this.protocolParams.linearFee.minFeeB)))
                .pool_deposit(BigNum.from_str(this.protocolParams.poolDeposit))
                .key_deposit(BigNum.from_str(this.protocolParams.keyDeposit))
                .coins_per_utxo_word(BigNum.from_str(this.protocolParams.coinsPerUtxoWord))
                .max_value_size(this.protocolParams.maxValSize)
                .max_tx_size(this.protocolParams.maxTxSize)
                .prefer_pure_change(true)
                .build()
        );

        return txBuilder
    }

    /**
     * Builds an object with all the UTXOs from the user's wallet
     * @returns {Promise<TransactionUnspentOutputs>}
     */
    getTxUnspentOutputs = async () => {
        let txOutputs = TransactionUnspentOutputs.new()
        for (const utxo of this.state.Utxos) {
            txOutputs.add(utxo.TransactionUnspentOutput)
        }
        return txOutputs
    }

    createStringDatum_utf_to_hex(str, desc)  {
        console.log("createStringDatum_utf_to_hex " + desc)
        //let str=this.state.datumStr
        let strUtf=Buffer.from(str, "utf-8")
        //let strHex=Buffer.from(str, "hex")
        let strUtfToHex=strUtf.toString("hex").toLowerCase()
        console.log("Buffer0: " + str)
        //console.log("Buffer1: " + strUtf)
        //console.log("Buffer2: " + strHex)
        //console.log("Buffer3: " + strUtfToHex)
        let dataStr="{\"bytes\":\""+strUtfToHex+"\"}"
        console.log("createStringDatum_utf_to_hex final: " + dataStr)
        let dataFromJson=encode_json_str_to_plutus_datum(dataStr, PlutusDatumSchema.DetailedSchema)
        //console.log("Buffer5: " + dataFromJson)
        return dataFromJson;
    }

    createStringDatum_hex_to_hex(str, desc)  {
        console.log("createStringDatum_hex_to_hex " + desc)
        //let str=this.state.datumStr
        //let strUtf=Buffer.from(str, "utf-8")
        let strHex=Buffer.from(str, "hex")
        //let strUtfToHex=strUtf.toString("hex").toUpperCase()
        let strHexToHex=strHex.toString("hex").toLowerCase()
        //console.log("Buffer0: " + str)
        //console.log("Buffer1: " + strUtf)
        //console.log("Buffer2: " + strHex)
        //console.log("Buffer3: " + strUtfToHex)
        //console.log("Buffer4: " + strHexToHex)
        let dataStr="{\"bytes\":\""+strHexToHex+"\"}"
        console.log("createStringDatum_hex_to_hex final: " + dataStr)
        let dataFromJson=encode_json_str_to_plutus_datum(dataStr, PlutusDatumSchema.DetailedSchema)
        //console.log("Buffer6: " + dataFromJson)
        return dataFromJson;
    }


    buildSendAdaToPlutusScript = async () => {
        await this.refreshBeforeSubmit();
        const name = "buildSendAdaToPlutusScript: "

        const txBuilder = await this.initTransactionBuilderExUnits();
        const ScriptAddress = Address.from_bech32(this.state.addressScriptBech32);
        const shelleyChangeAddress = Address.from_bech32(this.state.changeAddress)
        console.log(name + "this.state.changeAddress: " + this.state.changeAddress);


        let txOutputBuilder = TransactionOutputBuilder.new();
        txOutputBuilder = txOutputBuilder.with_address(ScriptAddress);
        //data=PlutusData.new_integer(BigInt.from_str(this.state.datumStr))
        console.log(name + "this.state.datumStr: " + this.state.datumStr);
        let datumFromJson=this.createStringDatum_hex_to_hex(this.state.datumStr, "buildSendAdaToPlutusScript")
        const dataHash = hash_plutus_data(datumFromJson)
        txOutputBuilder = txOutputBuilder.with_data_hash(dataHash)

        txOutputBuilder = txOutputBuilder.next();

        console.log(name + "this.state.lovelaceToSend: " + this.state.lovelaceToSend);
        //txOutputBuilder = txOutputBuilder.with_value(Value.new(BigNum.from_str(this.state.lovelaceToSend.toString())))
        txOutputBuilder = txOutputBuilder.with_value(Value.new(BigNum.from_str((this.state.lovelaceToSend*1000000).toString())))
        const txOutput = txOutputBuilder.build();

        txBuilder.add_output(txOutput)

        // Find the available UTXOs in the wallet and
        // us them as Inputs
        const txUnspentOutputs = await this.getTxUnspentOutputs();
        txBuilder.add_inputs_from(txUnspentOutputs, 2)


        // calculate the min fee required and send any change to an address
        txBuilder.add_change_if_needed(shelleyChangeAddress)

        // once the transaction is ready, we build it to get the tx body without witnesses
        const txBody = txBuilder.build();

        // Tx witness
        const transactionWitnessSet = TransactionWitnessSet.new();

        const tx = Transaction.new(
            txBody,
            TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes())
        )
        console.log(name + "transactionWitnessSet: " + transactionWitnessSet.to_json());

        await this.API.signTx(Buffer.from(tx.to_bytes(), "utf8").toString("hex"), true)
        .then((txVkeyWitnessesRes) => {
            const txVkeyWitnesses = TransactionWitnessSet.from_bytes(Buffer.from(txVkeyWitnessesRes, "hex"));

            transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

            const signedTx = Transaction.new(
                tx.body(),
                transactionWitnessSet
            );
    
            this.API.submitTx(Buffer.from(signedTx.to_bytes(), "utf8").toString("hex"))
            .then((submittedTxHash) => {
                console.log(name + " submittedTxHash: " + submittedTxHash)
                this.setState({submittedTxHash: submittedTxHash, transactionIdLocked: submittedTxHash, lovelaceLocked: this.state.lovelaceToSend});
                return { submittedTxHash: submittedTxHash, dataHash: dataHash.to_hex() };
            });
        })


    }


    buildSendAdaFailed = async () => {
        await this.refreshBeforeSubmit();

        const txBuilder = await this.initTransactionBuilder();
        const shelleyChangeAddress = Address.from_bech32(this.state.changeAddress)
        const profitAddr = Address.from_bech32(properties.profitAddress);
        const roiAddr = Address.from_bech32(this.state.selectedLottery.roiAddr);

        const totalAmount = this.state.lovelaceToSend*1000000
        const profit = properties.profitAmount
        const roiAmount = totalAmount-profit;
        console.log("buildSendAdaFailed profitAmount: " + profit + ", profitAddr: " + profitAddr.to_bech32())
        console.log("buildSendAdaFailed roiAmount: " + roiAmount + ", roiAddr: " + roiAddr.to_bech32())

        /*
        const ScriptAddress = Address.from_bech32(this.state.addressScriptBech32);
        let txOutputBuilder = TransactionOutputBuilder.new();
        txOutputBuilder = txOutputBuilder.with_address(ScriptAddress);
        let datumFromJson=this.createStringDatum_hex_to_hex(this.state.datumStr, "buildSendAdaFailed")
        const dataHash = hash_plutus_data(datumFromJson)
        txOutputBuilder = txOutputBuilder.with_data_hash(dataHash)

        txOutputBuilder = txOutputBuilder.next();

        txOutputBuilder = txOutputBuilder.with_value(Value.new(BigNum.from_str(scriptAmount.toString())))
        const txOutput = txOutputBuilder.build();

        txBuilder.add_output(txOutput)
        */

        txBuilder.add_output(
            TransactionOutput.new(
                profitAddr,
                Value.new(BigNum.from_str(profit.toString()))
            ),
        );
        txBuilder.add_output(
            TransactionOutput.new(
                roiAddr,
                Value.new(BigNum.from_str(roiAmount.toString()))
            ),
        );
        // Find the available UTXOs in the wallet and
        // us them as Inputs
        const txUnspentOutputs = await this.getTxUnspentOutputs();
        txBuilder.add_inputs_from(txUnspentOutputs, 2)


        // calculate the min fee required and send any change to an address
        txBuilder.add_change_if_needed(shelleyChangeAddress)

        // once the transaction is ready, we build it to get the tx body without witnesses
        const txBody = txBuilder.build();

        // Tx witness
        const transactionWitnessSet = TransactionWitnessSet.new();

        const tx = Transaction.new(
            txBody,
            TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes())
        )

        let txVkeyWitnesses = await this.API.signTx(Buffer.from(tx.to_bytes(), "utf8").toString("hex"), true);
        txVkeyWitnesses = TransactionWitnessSet.from_bytes(Buffer.from(txVkeyWitnesses, "hex"));

        transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

        const signedTx = Transaction.new(
            tx.body(),
            transactionWitnessSet
        );

        const submittedTxHash = await this.API.submitTx(Buffer.from(signedTx.to_bytes(), "utf8").toString("hex"));
        console.log("buildSendAdaFailed submittedTxHash: " + submittedTxHash)
        this.setState({submittedTxHash: submittedTxHash, transactionIdLocked: submittedTxHash, lovelaceLocked: this.state.lovelaceToSend});

        return submittedTxHash;
    }


    initTransactionBuilderExUnits = async () => {
        const exUnitPrices = ExUnitPrices.new(
            UnitInterval.new(
                BigNum.from_str(properties.exScriptMemStart.toString()), 
                BigNum.from_str(properties.exScriptMemInc.toString())
            ),
            UnitInterval.new(
                BigNum.from_str(properties.exScriptStepStart.toString()), 
                BigNum.from_str(properties.exScriptStepInc.toString())
            ),
        )
        const txBuilder = TransactionBuilder.new(
            TransactionBuilderConfigBuilder.new()
                .fee_algo(LinearFee.new(BigNum.from_str(this.protocolParams.linearFee.minFeeA), BigNum.from_str(this.protocolParams.linearFee.minFeeB)))
                .pool_deposit(BigNum.from_str(this.protocolParams.poolDeposit))
                .key_deposit(BigNum.from_str(this.protocolParams.keyDeposit))
                .coins_per_utxo_byte(BigNum.from_str(this.protocolParams.coinsPerUtxoWord))
                //.coins_per_utxo_word(BigNum.from_str(this.protocolParams.coinsPerUtxoWord))
                .max_value_size(this.protocolParams.maxValSize)
                .max_tx_size(this.protocolParams.maxTxSize)
                .ex_unit_prices(exUnitPrices)
                .prefer_pure_change(true)
                .build()
        );

        return txBuilder
    }


    buildRedeemAdaFromPlutusScript = async () => {
        this.setState({showWorking: true})
        await this.refreshBeforeSubmit();

        //this.state.datumStr = this.state.datumStr.toUpperCase();

        const selectedLottery = this.state.selectedLottery;

        const callName = "buildRedeemAdaFromPlutusScript: ";
        console.log(callName + "this.state.addressScriptBech32: " + this.state.addressScriptBech32);
        console.log(callName + "this.state.changeAddress: " + this.state.changeAddress);
        console.log(callName + "this.state.transactionIdLocked: " + this.state.transactionIdLocked);
        console.log(callName + "this.state.transactionIndxLocked: " + this.state.transactionIndxLocked);
        console.log(callName + "this.state.datumStr: " + this.state.datumStr);
        console.log(callName + "this.state.redeemStr: " + this.state.redeemStr);
        console.log(callName + "this.state.lovelaceLocked: " + this.state.lovelaceLocked);

        const txBuilder = await this.initTransactionBuilderExUnits();

        const ScriptAddress = Address.from_bech32(this.state.addressScriptBech32);
        const shelleyChangeAddress = Address.from_bech32(this.state.changeAddress)
        //const amountToRedeem = this.state.lovelaceLocked*1000000

        const noOfUtxos = selectedLottery.utxos.length;
        console.log(callName + "noOfUtxos: " + noOfUtxos);

        const inputs = TxInputsBuilder.new();

        const datumFromJson=this.createStringDatum_hex_to_hex(this.state.datumStr, "buildRedeemAdaFromPlutusScript datum")
        const redeemerFromJson=this.createStringDatum_utf_to_hex(this.state.redeemStr, "buildRedeemAdaFromPlutusScript redeem")
        const script = PlutusScript.from_bytes(Buffer.from(this.state.plutusScriptCborHex, "hex"))

        const ex = ExUnits.new(
            BigNum.from_str(properties.scriptMem.toString()),
            BigNum.from_str(properties.scriptStep.toString())
        )

        const redeemer = Redeemer.new(
            RedeemerTag.new_spend(),
            BigNum.from_str("0"),//ind.toString()),
            redeemerFromJson,
            ex
        )
        console.log(callName + "ex: " + ex.to_json());

        console.log(callName + "redeemer: " + redeemer.to_json());

        selectedLottery.utxos.forEach(function (utxo, ind) {
            const hash = utxo.tx_hash
            const hashInd = utxo.tx_index
            const amount = utxo.amount

            txBuilder.add_plutus_script_input(
                PlutusWitness.new(script, datumFromJson, redeemer),
                TransactionInput.new(
                    TransactionHash.from_bytes(Buffer.from(hash, "hex")),
                    hashInd.toString()),
                Value.new(BigNum.from_str(amount.toString()))
            )
                /*
            inputs.add_input(
                ScriptAddress,
                TransactionInput.new(
                    TransactionHash.from_bytes(Buffer.from(hash, "hex")),
                    hashInd.toString()),
                Value.new(BigNum.from_str(amount.toString()))
            )
    
            /*if (ind==0) {


                //datums.add(datumFromJson)
                //redeemers.add(redeemer);

                txBuilder.add_plutus_script_input(
                        PlutusWitness.new(script, datumFromJson, redeemer),
                        TransactionInput.new(
                            TransactionHash.from_bytes(Buffer.from(hash, "hex")),
                            hashInd.toString()),
                        Value.new(BigNum.from_str(amount.toString()))
                )

                /*
                inputs.add_input(
                    ScriptAddress,
                    TransactionInput.new(
                        TransactionHash.from_bytes(Buffer.from(hash, "hex")),
                        hashInd.toString()),
                    Value.new(BigNum.from_str(amount.toString()))
                )

                witnesses.add(PlutusWitness.new(script, datumFromJson, redeemer));
                /*} else {
                datums.add(datumFromJson)

               
            } */
            //console.log(callName + "build tx unsafe: " + txBuilder.build_tx_unsafe().to_json());
                    
        }, this);


        //inputs.add_required_plutus_input_scripts(witnesses);

        /*txBuilder.set_inputs(inputs);
        console.log(callName + "count_missing_input_scripts: before: " + txBuilder.build_tx().to_json());

        txBuilder.add_required_plutus_input_scripts(PlutusWitness.new(script, datumFromJson, redeemer));

        console.log(callName + "count_missing_input_scripts: after: " + txBuilder.build_tx().to_json());
*/
        var step = 1;
        console.log(callName + " step " + step++);

        const collateral = this.state.CollatUtxos;
        const collateralI = TxInputsBuilder.new();
        collateral.forEach((utxo) => {
            const ti = utxo.input();
            //console.log(callName + "collateral: " + utxo.to_json() + " " + ti.transaction_id().to_hex() + " " + ti.index());
            collateralI.add_input(
                utxo.output().address(), //ScriptAddress, //
                utxo.input(),
                utxo.output().amount(),
            );
        });
        txBuilder.set_collateral(collateralI);

        console.log(callName + " step " + step++);

        //const costModel = TxBuilderConstants.plutus_vasil_cost_models().get(Language.new_plutus_v1());
        //const costModels = Costmdls.new();
        //costModels.insert(Language.new_plutus_v1(), costModel);
        txBuilder.calc_script_data_hash(TxBuilderConstants.plutus_vasil_cost_models());

        console.log(callName + " step " + step++);

        const baseAddress = BaseAddress.from_address(shelleyChangeAddress)
        txBuilder.add_required_signer(baseAddress.payment_cred().to_keyhash())
        

        console.log(callName + " step " + step++);
        //console.log(callName + "build tx 1: " + txBuilder.build_tx().to_json());
        console.log(callName + "min fee: " + txBuilder.min_fee().to_str());

        const vKeys = Vkeywitnesses.new();
        //txBuilder.add_required_signer.get(vKeys);

        /*
        vKeys.add(Vkeywitness.new(Vkey.new(PublicKey.from_bech32(this.state.changeAddress)), Ed25519Signature.from_bech32(this.state.changeAddress)));
        vKeys.add(Vkeywitness.new(Vkey.new(PublicKey.from_bech32(this.state.changeAddress)), Ed25519Signature.from_bech32(this.state.changeAddress)));
        vKeys.add(Vkeywitness.new(Vkey.new(PublicKey.from_bech32(this.state.changeAddress)), Ed25519Signature.from_bech32(this.state.changeAddress)));
*/
//console.log(callName + "build txBody 2: " + txBuilder.build_tx_unsafe().to_js_value());
//console.log(callName + "build tx 2: " + txBuilder.build_tx().to_json());

        txBuilder.add_change_if_needed(shelleyChangeAddress)

        console.log(callName + "count_missing_input_scripts: " + txBuilder.count_missing_input_scripts());
        console.log(callName + "get_fee_if_set: " + txBuilder.get_fee_if_set().to_str());


        const tx = txBuilder.build_tx();
        console.log(callName + "build tx 3: " + tx.to_json());
        
        let txVkeyWitnesses = await this.API.signTx(Buffer.from(tx.to_bytes(), "utf8").toString("hex"), true);
        txVkeyWitnesses = TransactionWitnessSet.from_bytes(Buffer.from(txVkeyWitnesses, "hex"));
        console.log(callName + "txVkeyWitnesses 1: " + txVkeyWitnesses.to_json());

        const vkeys = txVkeyWitnesses.vkeys();
        console.log(callName + "vkeys 1: " + JSON.stringify(vkeys));
        console.log(callName + "vkeys 2: " + JSON.parse(JSON.stringify(vkeys)));

        const witnessSet = tx.witness_set();
        witnessSet.set_vkeys(vkeys);
        console.log(callName + "witnessSet 1: " + witnessSet.to_json());
        console.log(callName + "witnessSet 2: " + witnessSet.to_bytes().length);

        //const newFee = tx.get_fee_if_set()+witnessSet.to_bytes().length*this.protocolParams.linearFee.minFeeA;


        const signedTx = Transaction.new(
            tx.body(),
            witnessSet
        );

        console.log(callName + "submit tx: " + signedTx.to_json());
        const submittedTxHash = await this.API.submitTx(Buffer.from(signedTx.to_bytes(), "utf8").toString("hex"));
        console.log(callName + " submittedTxHash: " + submittedTxHash)
        this.setState({submittedTxHash});

        this.setState({showWorking: false})
        return submittedTxHash;    
    }

    async componentDidMount() {
        this.pollWallets();
        await this.refreshData();
    }

    handleConnect(x) {
        console.log("handleConnect", x)
        const whichWalletSelected = x
        this.setState({whichWalletSelected},
            () => {
                this.refreshData()
            })        
        //this.setState({msg : 'Welcome to the React world!'})
    }

    clickOpenAvailableWalletsDialog = () => {
        //if (this.state.wallets.length==0) {
        //    this.pollWallets();
        //}
        this.setState({openAvailableWalletsDialog: true});
    };
    
    closeAvailableWalletsDialog = () => {
        this.setState({openAvailableWalletsDialog: false});
    };

    handleConnectClick = (value) => {
        this.setState({openAvailableWalletsDialog: false});
        this.handleConnect(value);
    };
  

    copyToClipboard = (value) => {
        (clipboard.write(value)).then((message)=>{  
            console.log("copyToClipboard success. The message is:" + message)
        }).catch((message)=>{  
            console.log("copyToClipboard failed. The message is:" + message)  
        })  

    };

    clickOpenWalletDetailsDialog = () => {
        this.setState({openWalletDetailsDialog: true});
    };
    
    closeWalletDetailsDialog = () => {
        this.setState({openWalletDetailsDialog: false});
    };

    handleDisconnectClick = () => {
        this.setState({openWalletDetailsDialog: false});
        this.setState({
            whichWalletSelected: undefined,
            walletFound: false,
            walletIsEnabled: false,
        },
        () => {
            this.refreshData()
        })  
    };

    truncate = (val) => {
        const truncate = val?.length > 20 
        ? val.substring(0, 10) + '...' + val.substring(val.length-5, val.length) 
        : val;
        return truncate;
    }

    formatAda = (val) => {
        const truncate = Math.trunc(val/1000000)
        return truncate;
    }

    handleSliderChange = (x) => {
        console.log("Min: " + x)
    };

    render() {
        return (
            <div>
                <div className='topDiv'>
                    {this.renderLotto()}
                </div>
                {(this.state.connectWallet) &&
                    <div className='newWalletConnect'>
                    {this.renderNewButtonInfo()}
                    </div>
                }
                {(this.state.showWalletInfo) &&
                    <div className='bottomDiv'>
                        {this.renderWalletInfo()}
                    </div>
                }
            </div>
        );
      }


      handleLotterySelect = (utxo) => {
        const lotteries = this.state.lotteries;
        console.log("handleLotterySelect: " + utxo);
        let selectedLottery = lotteries.find(o => o.utxo === utxo).clone();
        this.setState({selectedLottery})
      };

      handleClickNewLottery = () => {
        const selectedLottery = new Lottery("", 1, 1, 10, 3);//"Bingo"+Date.now(), 5, 1);
        //selectedLottery.choices[1]=true;
        //selectedLottery.amount=1;
        const createNewLottery = true
        this.setState({createNewLottery});
        this.setState({selectedLottery: selectedLottery});
      };

      handleCancelNewLottery = () => {
        const selectedLottery = this.state.lotteries[0];
        const createNewLottery = false
        this.setState({createNewLottery, selectedLottery});
      };

      async axoisBlockfrost() {
        const callName = "axoisBlockfrost";
        console.log(callName + " start");

        var utxos = new Map();
        var utxosByDataHash = new Map();

        var page = 0;
        var doNext = true;

        while (doNext && page < properties.blockfrostMaxPage) {
            page++;
            doNext=false;

            const url = properties.blockfrostURL+'addresses/'+properties.addressScriptBech32+'/utxos';
            var config = {
                method: 'get',
                url: url,
                headers: { 
                'Accept': 'application/json', 
                'project_id': properties.blockfrostAPIKey,
                },
                params: {
                    count: properties.blockfrostPageSize,
                    page: page,
                    order: "asc",
                },
            };

            await axios(config)
            .then(function (response) {
                doNext = response.status===200 && response.data.length===properties.blockfrostPageSize;
                console.log(callName + ": page: " + page + ", response.data.length: " + response.data.length);
                //console.log(callName + ": " + JSON.stringify(response.data));
                response.data.forEach(function (utxo, index) {
                    //console.log(callName + ": utxo: " + utxo.amount[0].quantity); 
                    //console.log(callName + ": utxo.tx_hash: " + utxo.tx_hash); 
                    //console.log(callName + ": utxo.tx_index: " + utxo.tx_index); 
                    const lovelace = utxo.amount.filter(amt => amt.unit == 'lovelace').map(amt => amt.quantity).reduce((a, b) => a+b);
                    //console.log(callName + ": utxo.amt: " + lovelace); 
                    const myUtxo = {
                        tx_hash: utxo.tx_hash,
                        tx_index: utxo.tx_index,
                        data_hash: utxo.data_hash,
                        amount: lovelace,
                    }
                    const myUtxoArr = {
                        tx_hash: utxo.tx_hash,
                        tx_index: utxo.tx_index,
                        data_hash: utxo.data_hash,
                        amount: lovelace,
                        utxos: [],
                    }
                    utxos.set(utxo.tx_hash, myUtxoArr);

                    if (utxosByDataHash.has(myUtxo.data_hash)) {
                        utxosByDataHash.get(myUtxo.data_hash).push(myUtxo);
                    } else {
                        utxosByDataHash.set(myUtxo.data_hash, [myUtxo])
                    }
                });
                //console.log(callName + ": " + JSON.stringify(Array.from(utxos.entries())));
                console.log(callName + ": utxo size: " + utxos.size);
            })
            .catch(function (error) {
                console.log(callName + " error: " + error);
            });        

            utxos.forEach(function (utxo, tx_hash) {
                utxo.utxos = utxosByDataHash.get(utxo.data_hash);
                utxo.amount = utxo.utxos.map(v => Number(v.amount)).reduce((a, b) => a+b);
                console.log(callName + ": " + utxo.amount);
            });

        }
          console.log(callName + " end");
          return utxos;
      }
      
      async axoisGetAllDB() {
        const callName = "axoisGetAllDB";
        console.log(callName + " start");

        var utxos = new Map();

        var config = {
            method: 'get',
            url: 'get/all',
            baseURL: properties.beUrl,
            headers: { 
              'Accept': 'application/json', 
            }
          };

        await axios(config)
          .then(function (response) {
            console.log(callName + ": " + JSON.stringify(response.data));
            response.data.forEach(function (rec, index) {
                //console.log(callName + ": utxo: " + rec.utxo); 
                utxos.set(rec.utxo, rec);
            });            
            //console.log(callName + ": " + JSON.stringify(Array.from(utxos.entries())));
            console.log(callName + ": size: " + utxos.size);
          })
          .catch(function (error) {
            console.log(callName + " error: " + error);
          });    
          console.log(callName + " end");
          return utxos;
      }
      
      async axoisStoreDB() {
        const callName = "axoisStoreDB";
        console.log(callName + " start");
        const selectedLottery = this.state.selectedLottery;

        selectedLottery.sha256 = selectedLottery.calcSha256();

        var config = {
            method: 'put',
            url: 'store',
            baseURL: properties.beUrl,
            headers: { 
              'Content-Type': 'application/json', 
            },
            data: {
                utxo: selectedLottery.utxo, 
                sha256: selectedLottery.sha256, 
                name: selectedLottery.name, 
                maxNo: selectedLottery.maxNo, 
                maxChoices: selectedLottery.maxChoices, 
                selected: selectedLottery.selected(), 
                amount: selectedLottery.amount,
                cost: selectedLottery.cost,
                dataHash: selectedLottery.dataHash,
                creatorAddr: selectedLottery.creatorAddr,
                roiAddr: selectedLottery.roiAddr,
            }
          };

        await axios(config)
          .then(function (response) {
            console.log(callName + ": " + response.data);
          })
          .catch(function (error) {
            console.log(callName + "error: " + error);
          });    
          console.log(callName + " end");
        }

      handleLoadLotteries = async () => {
        const callName = "handleLoadLotteries";

        const dbUtxos = await this.axoisGetAllDB();
        console.log(callName + ": handleClickCreateNewLottery axoisGetAllDB done");

        const adaUtxos = await this.axoisBlockfrost();
        console.log(callName + ": handleClickCreateNewLottery axoisBlockfrost done");

        let lotteries = [];

        adaUtxos.forEach((adaUtxo, utxo) => {
            if (dbUtxos.has(utxo)) {
                const dbUtxo = dbUtxos.get(utxo);
                let lottery = Lottery.restore(
                    utxo, dbUtxo.sha256, dbUtxo.selected, 
                    dbUtxo.name, dbUtxo.maxNo, dbUtxo.maxChoices,
                    adaUtxo.amount/1000000, dbUtxo.cost, dbUtxo.dataHash, adaUtxo.utxos, 
                    dbUtxo.creatorAddr, dbUtxo.roiAddr,
                )
                lotteries.push(lottery);
                //console.log(callName + ": lottery: " + JSON.stringify(lottery));
            }
        });

        console.log(callName + ": " + JSON.stringify(lotteries));
        this.setState({lotteries});
        if (lotteries.length>0) {
            this.setState({selectedLottery: lotteries[0].clone()});
        }
      }

      handleClickCreateNewLottery = async () => {
        const name = "handleClickCreateNewLottery: "

        this.setState({showWorking: true})
        const selectedLottery = this.state.selectedLottery;


        if (selectedLottery.name.length==0) {
            this.showNameRequireAlert();     
            this.setState({showWorking: false})
            return ;
        }
        if (!selectedLottery.isValidChoices()) {
            this.showWinningNumbersAlert();     
            this.setState({showWorking: false})
            return ;   
        }

        selectedLottery.sha256 = selectedLottery.calcSha256();
        
        this.state.datumStr = selectedLottery.sha256;
        this.state.lovelaceToSend = selectedLottery.amount;

        await this.buildSendAdaToPlutusScript()
        .then((result) => {
            selectedLottery.utxo = result.submittedTxHash;
            selectedLottery.dataHash = result.dataHash;
            selectedLottery.creatorAddr = this.state.rewardAddress;
            selectedLottery.roiAddr = this.state.changeAddress;
            this.axoisStoreDB();
    
            const createNewLottery = false;
            this.setState({createNewLottery, selectedLottery: null});
    
            //this.setState({lotteries, createNewLottery});
            //const lotteries = this.state.lotteries;
            //lotteries.push(this.state.selectedLottery);
            //const createNewLottery = !this.state.createNewLottery
            //this.setState({createNewLottery});
    
            this.showNewLotteryCreatedAlertAlert();
        })
        .catch((err) => {
            console.log(name + " error: " + err);
            this.showErrorAlert();

        })

        //this.refreshData();

        this.setState({showWorking: false})
        console.log(name + " end");
    };

      showNewLotteryCreatedAlertAlert = () => {
        this.setState({newLotteryCreatedAlert: true});
        setTimeout(() => {
            this.setState({newLotteryCreatedAlert: false});
        }, 5000);      
      };     

      showErrorAlert = () => {
        this.setState({errorAlert: true});
        setTimeout(() => {
            this.setState({errorAlert: false});
        }, 5000);      
      };  

      showNameRequireAlert = () => {
        this.setState({nameRequiredAlert: true});
        setTimeout(() => {
            this.setState({nameRequiredAlert: false});
        }, 5000);      
      };     

      showWinningNumbersAlert = () => {
        this.setState({winningNumbersAlert: true});
        setTimeout(() => {
            this.setState({winningNumbersAlert: false});
        }, 5000);      
      };      

      showYouWonAlert = () => {
        this.setState({youWonAlert: true});
        setTimeout(() => {
            this.setState({youWonAlert: false});
        }, 5000);      
      };      

      showYouLostAlert = () => {
        this.setState({youLostAlert: true});
        setTimeout(() => {
            this.setState({youLostAlert: false});
        }, 5000);      
      };      

      handleClickPlay = async () => {
        this.setState({showWorking: true})
        const callName = "handleClickPlay";

        const selectedLottery = this.state.selectedLottery;
        if (!selectedLottery.isValidChoices()) {
            this.showWinningNumbersAlert();     
            return ;   
        }

        //this.state.selectedLottery.sha256=this.state.selectedLottery.calcSha256();

        //console.log(callName + ": before this.state.datumStr: " + this.state.datumStr);
        //console.log(callName + ": before this.state.selectedLottery.sha256: " + this.state.selectedLottery.sha256);
        //console.log(callName + ": before selectedLottery.sha256: " + selectedLottery.sha256);
        
        this.state.transactionIdLocked = selectedLottery.utxo;
        this.state.transactionIndxLocked = 0;
        this.state.lovelaceLocked = selectedLottery.amount;
        this.state.datumStr = selectedLottery.sha256;
        this.state.redeemStr = selectedLottery.toString();
        this.state.lovelaceToSend = selectedLottery.cost;

        //console.log(callName + ": after this.state.datumStr: " + this.state.datumStr);
        //console.log(callName + ": after this.state.selectedLottery.sha256: " + this.state.selectedLottery.sha256);
        //console.log(callName + ": after selectedLottery.sha256: " + selectedLottery.sha256);


        try {
            if (selectedLottery.sha256==selectedLottery.calcSha256()) {
                const submittedTxHash = await this.buildRedeemAdaFromPlutusScript();
                if (submittedTxHash.length>10) {
                    this.showYouWonAlert();
                    const newLotteries = this.state.lotteries.filter(function(value, index, arr){ 
                        return value.utxo!=selectedLottery.utxo;
                    });
                    const newSelectedLottery = newLotteries[0];
                    this.setState({selectedLottery: newSelectedLottery, lotteries: newLotteries})
                }
            } else {
                const submittedTxHash = await this.buildSendAdaFailed();
                if (submittedTxHash.length>10) {
                    this.showYouLostAlert();
                }
            }
        } catch (err) {
            console.log(err.stack)
            console.log(callName + ": error: " + err)
        }
        this.setState({showWorking: false})
        //this.refreshData();        
      };

      handleLotteryNameChange = (input) => {
        const selectedLottery = this.state.selectedLottery;
        selectedLottery.name = input;
        this.setState({selectedLottery});
        console.log("handleLotteryNameChange: " + this.state.selectedLottery.name);
      }
      handleLotteryMaxNoChange = (input) => {
        //console.log("handleLotteryMaxNoChange: " + input)
        const selectedLottery = this.state.selectedLottery;
        selectedLottery.setMaxNo(input);
        this.setState({selectedLottery});
        //console.log("handleLotteryMaxNoChange: " + JSON.stringify(this.state.selectedLottery, null, 4))
      }
      handleLotteryMaxChoicesChange = (input) => {
        const selectedLottery = this.state.selectedLottery;
        selectedLottery.maxChoices = input;
        this.setState({selectedLottery});
        //console.log("handleLotteryMaxNoChange: " + JSON.stringify(this.state.selectedLottery, null, 4))
      }
      handleLotteryAmountChange = (input) => {
        const selectedLottery = this.state.selectedLottery;
        selectedLottery.amount = input;
        this.setState({selectedLottery});
      }
      handleLotteryCostChange = (input) => {
        const selectedLottery = this.state.selectedLottery;
        selectedLottery.cost = input;
        this.setState({selectedLottery});
      }

      createLotteries() {
        let lotteries = [
            new Lottery("Lol", 55, 6, 10),
            new Lottery("Nav", 30, 3, 11),
            new Lottery("Mino", 24, 4, 12),
            new Lottery("Easy", 12, 1, 13)
        ]
        return lotteries;
      }

      
      renderLotto()
      {
        const lotteries = this.state.lotteries;
        const selectedLottery = this.state.selectedLottery;
        const createNewLottery = this.state.createNewLottery;
        const winningNumbersAlert = this.state.winningNumbersAlert;
        const youWonAlert = this.state.youWonAlert;
        const youLostAlert = this.state.youLostAlert;
        const newLotteryCreatedAlert = this.state.newLotteryCreatedAlert;
        const nameRequiredAlert = this.state.nameRequiredAlert;
        const errorAlert = this.state.errorAlert;
        const maxChoices = this.state.selectedLottery?.maxChoices;
        const cost = this.state.selectedLottery?.cost;
        const working = !this.state.balance || this.state.showWorking;
        //console.log("App.js: maxNo" + lottery1.maxNo)
        //console.log("App.js: maxChoices" + lottery1.maxChoices)
        //console.log("App.js: choices" + lottery1.choices)
        //console.log("App.js: lottery1: " + JSON.stringify(lottery1, null, 4));
        return (

            <Grid container>
                <Grid item xs={12} md={12}>
                    <Typography variant="h4" gutterBottom>
                        Cardano Lottery
                    </Typography>
                </Grid>

                {(!createNewLottery)
                    &&
                <Grid item xs={12} md={6} >
                    <BasicTable selectedLottery={selectedLottery} lotteries={lotteries} lotteryClick={this.handleLotterySelect}></BasicTable>
                    <br></br>
                    <Stack direction="row" spacing={2} mt={4} sx={{justifyContent: 'center',}}>
                        <Button variant="contained" onClick={this.handleLoadLotteries} disabled={working}>Reload List</Button>
                        <Button variant="contained" onClick={this.handleClickNewLottery} disabled={working}>Create new Lottery</Button>
                    </Stack>
                    {(newLotteryCreatedAlert) && <Alert severity="info">New lottery created - please Reload to see it appear</Alert>}
                </Grid>
                }
                {(createNewLottery)
                    &&
                <Grid item xs={12} md={6}>
                    <NewLottery lotteries={lotteries} 
                    lottery={selectedLottery} 
                    handleLotteryNameChange={this.handleLotteryNameChange} 
                    handleLotteryMaxNoChange={this.handleLotteryMaxNoChange} 
                    handleLotteryMaxChoicesChange={this.handleLotteryMaxChoicesChange} 
                    handleLotteryAmountChange={this.handleLotteryAmountChange} 
                    handleLotteryCostChange={this.handleLotteryCostChange} 
                    createLotteryClick={this.handleClickCreateNewLottery}>                        
                    </NewLottery>
                </Grid>
                }


                {(selectedLottery)
                    &&
                <Grid item xs={12} md={6}>
                    <LottoView lottery={selectedLottery}></LottoView>
                    {(errorAlert) && <Alert severity="info">Oops.  An error occurred.  Please refresh page and try again.</Alert>}
                    {(youWonAlert) && <Alert severity="success">Wow!! You Won!</Alert>}
                    {(youLostAlert) && <Alert severity="info">Sorry!  Try again...</Alert>}
                    {(winningNumbersAlert) && <Alert severity="error">Please choose your {maxChoices} winning numbers</Alert>}
                    {(createNewLottery && nameRequiredAlert) && <Alert severity="error">Please enter a name for this lottery</Alert>}

                    {(working) &&  <LinearProgress  sx={{mb: 2}} />}

                    {(!createNewLottery) && <Button variant="contained" onClick={this.handleClickPlay} disabled={working}>Play</Button>}

                    {(createNewLottery)
                    &&
                    <Stack direction="row" spacing={2} mt={4} sx={{justifyContent: 'center',}}>
                        <Button variant="contained" onClick={this.handleCancelNewLottery} disabled={working}>Cancel</Button>
                        <Button variant="contained" onClick={this.handleClickCreateNewLottery} disabled={working}>Create new Lottery</Button>
                    </Stack>
                    } 
                </Grid>
                }
            </Grid>
        )
      }
            

      renderNewButtonInfo()
      {
  
          return (
              <div>
  
                  {(!this.state.walletIsEnabled)
                  &&
                  <div>
                      <Button id="walletConnectButton" variant="contained" onClick={this.clickOpenAvailableWalletsDialog} size="large">
                          Connect Wallet...
                      </Button>
                      <Dialog onClose={this.closeAvailableWalletsDialog} open={this.state.openAvailableWalletsDialog} maxWidth='lg'>
                          <DialogTitle>Your installed wallets</DialogTitle>
                          {(this.state.wallets.length==0)
                          &&
                          <DialogContent>
                          <DialogContentText>
                            No installed wallets found.
                            </DialogContentText>
                            <DialogContentText>
                            Please install / enable wallet and refresh the page.
                          </DialogContentText>
                          </DialogContent>
                          }
                          {(this.state.wallets.length>0)
                          &&
                          <List>
                          { this.state.wallets.map(key => (
                              <ListItem button onClick={() => this.handleConnectClick(key)} key={key} divider={true}>
                                  <ListItemAvatar>
                                      <img src={window.cardano[key].icon} width={24} height={24} alt={key}/>
                                  </ListItemAvatar>
                                  <ListItemText primary={window.cardano[key].name} secondary={key}/>
                              </ListItem>
                          ))}
                          </List>
                          }
                      </Dialog>       
                  </div>                
                  }
  
                  {(this.state.walletIsEnabled)
                  &&
                  <div>
                      <div id="walletConnectButton">
                      <ButtonGroup variant="contained" aria-label="outlined primary button group">
                          <Button onClick={this.clickOpenWalletDetailsDialog} size="large"
                              startIcon={<Avatar src={window.cardano[this.state.whichWalletSelected].icon} sx={{ width: 12, height: 12 }}/>}>
                              {this.state.balance && this.formatAda(this.state.balance)} ADA                        
                          </Button>
                      </ButtonGroup>     
                      <Collapse in={this.state.openNFTSuccessAlert}>
                          <Alert severity="info" onClose={() => {this.setState({openNFTSuccessAlert: false})}}>Success.  You will receive your NFT shortly.</Alert>
                      </Collapse>
                      <Collapse in={this.state.openNFTFailureAlert}>
                          <Alert severity="error" onClose={() => {this.setState({openNFTFailureAlert: false})}}>An error has occurred.  Please try again</Alert>
                      </Collapse>
                      </div>               
                      <Dialog onClose={this.closeWalletDetailsDialog} open={this.state.openWalletDetailsDialog} maxWidth='lg'>
                          <DialogTitle>Connected Wallet</DialogTitle>
                          <List>
                              <ListItem>
                                  <ListItemAvatar>
                                      <img src={window.cardano[this.state.whichWalletSelected].icon} width={24} height={24} alt={this.state.whichWalletSelected}/>
                                  </ListItemAvatar>
  
                                  <Tooltip title="Copy address">
                                  <ListItemButton onClick={() => this.copyToClipboard(this.state.changeAddress)}>
                                      <ListItemText primary={window.cardano[this.state.whichWalletSelected].name} secondary={this.truncate(this.state.changeAddress)}/>
                                      <ListItemIcon>
                                              <ContentCopyIcon/>
                                          </ListItemIcon>
                                  </ListItemButton>
                                  </Tooltip>
  
                                  <ListItemButton onClick={this.handleDisconnectClick} >
                                      <ListItemText primary="Disconnect" />
                                  </ListItemButton>
                              </ListItem>
                          </List>
                      </Dialog>    
                  </div>                
                  }
                  </div>
          )
      }
           
}