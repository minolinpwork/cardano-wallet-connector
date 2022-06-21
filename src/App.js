import React from 'react'
import { Tab, Tabs, RadioGroup, Radio, FormGroup, InputGroup, NumericInput, Menu, MenuItem } from "@blueprintjs/core";
import "../node_modules/@blueprintjs/core/lib/css/blueprint.css";
import "../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css";

import "../node_modules/normalize.css/normalize.css";
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
    ScriptDataHash, Ed25519KeyHash, NativeScript, StakeCredential
} from "@emurgo/cardano-serialization-lib-asmjs"
import "./App.css";
import {blake2b} from "blakejs";
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
let Buffer = require('buffer/').Buffer
let blake = require('blakejs')
//import "./../node_modules/minipaint/src/css/layout.css";
var minipaint = require('./../node_modules/minipaint/dist/minipaint.js');
//var minipaint = require('./../node_modules/minipaintlink/dist/minipaint.js'); // USING SYMLINK


class WalletSelect extends React.Component {
    render() {
      return (
<Menu className='walletMenu'>
    <MenuItem text="Connect Wallet">
        <MenuItem text="Child one" />
        <MenuItem text="Child two" />
        <MenuItem text="Child three" />
    </MenuItem>
</Menu>
      );
    }
  }


class PaintCanvas extends React.Component {
  render() {
    return (
<div>
    <div className="wrapper">

        <nav aria-label="Main Menu" className="main_menu" id="main_menu"></nav>
        
        <div className="submenu">
            <a className="logo" href="#">ADA NFT Creator</a>
            <div className="block attributes" id="action_attributes"></div>
            <button className="undo_button" id="undo_button" type="button">
                <span className="sr_only">Undo</span>
            </button>
        </div>
        
        <div className="sidebar_left" id="tools_container"></div>


        <div className="middle_area" id="middle_area">

            <canvas className="ruler_left" id="ruler_left"></canvas>
            <canvas className="ruler_top" id="ruler_top"></canvas>

            <div className="main_wrapper" id="main_wrapper">
                <div className="canvas_wrapper" id="canvas_wrapper">
                    <div id="mouse"></div>
                    <div className="transparent-grid" id="canvas_minipaint_background"></div>
                    <canvas id="canvas_minipaint">
                        <div className="trn error">
                            Your browser does not support canvas or JavaScript is not enabled.
                        </div>
                    </canvas>
                </div>
            </div>
        </div>

        <div className="sidebar_right">
            <div className="preview block">
                <h2 className="trn toggle" data-target="toggle_preview">Preview</h2>
                <div id="toggle_preview"></div>
            </div>
            
            <div className="colors block">
                <h2 className="trn toggle" data-target="toggle_colors">Colors</h2>
                <div className="content" id="toggle_colors"></div>
            </div>
            
            <div className="block" id="info_base">
                <h2 className="trn toggle toggle-full" data-target="toggle_info">Information</h2>
                <div className="content" id="toggle_info"></div>
            </div>
            
            <div className="details block" id="details_base">
                <h2 className="trn toggle toggle-full" data-target="toggle_details">Layer details</h2>
                <div className="content" id="toggle_details"></div>
            </div>
            
            <div className="layers block">
                <h2 className="trn">Layers</h2>
                <div className="content" id="layers_base"></div>
            </div>
        </div>
    </div>
    <div className="mobile_menu">
        <button className="left_mobile_menu" id="left_mobile_menu_button" type="button">
            <span className="sr_only">Toggle Menu</span>
        </button>
        <button className="right_mobile_menu" id="mobile_menu_button" type="button">
            <span className="sr_only">Toggle Menu</span>
        </button>
    </div>
    <div className="hidden" id="tmp"></div>
    <div id="popups"></div>
</div>

    );
  }
}


export default class App extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            selectedTabId: "1",
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

            addressBech32SendADA: "addr_test1qzafd4kv7lfpwvs5ln0puuwqf5u982t5he6y4wns464lp7x9w00v9ljd6duvwz3unkn84el30j30lpk35txg2h7el2zsjhcmly",
            lovelaceToSend: 3000000,
            assetNameHex: "4c494645",
            assetPolicyIdHex: "ae02017105527c6c0c9840397a39cc5ca39fabe5b9998ba70fda5f2f",
            assetAmountToSend: 5,
            addressScriptBech32: "addr_test1wpnlxv2xv9a9ucvnvzqakwepzl9ltx7jzgm53av2e9ncv4sysemm8",
            datumStr: "12345678",
            plutusScriptCborHex: "4e4d01000033222220051200120011",
            transactionIdLocked: "",
            transactionIndxLocked: 0,
            lovelaceLocked: 3000000,
            manualFee: 900000,

            open: false,

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
            minUtxo: "34482",
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
            //this.refreshData()
        });
    }

    /**
     * Handles the tab selection on the user form
     * @param tabId
     */
    handleTabId = (tabId) => this.setState({selectedTabId: tabId})

    /**
     * Handles the radio buttons on the form that
     * let the user choose which wallet to work with
     * @param obj
     */
    handleWalletSelect = (obj) => {
        const whichWalletSelected = obj.target.value
        this.setState({whichWalletSelected},
            () => {
                this.refreshData()
            })
    }

    /**
     * Generate address from the plutus contract cborhex
     */
    generateScriptAddress = () => {
        // cborhex of the alwayssucceeds.plutus
        // const cborhex = "4e4d01000033222220051200120011";
        // const cbor = Buffer.from(cborhex, "hex");
        // const blake2bhash = blake.blake2b(cbor, 0, 28);

        const script = PlutusScript.from_bytes(Buffer.from(this.state.plutusScriptCborHex, "hex"))
        // const blake2bhash = blake.blake2b(script.to_bytes(), 0, 28);
        const blake2bhash = "67f33146617a5e61936081db3b2117cbf59bd2123748f58ac9678656";
        const scripthash = ScriptHash.from_bytes(Buffer.from(blake2bhash,"hex"));

        const cred = StakeCredential.from_scripthash(scripthash);
        const networkId = NetworkInfo.testnet().network_id();
        const baseAddr = EnterpriseAddress.new(networkId, cred);
        const addr = baseAddr.to_address();
        const addrBech32 = addr.to_bech32();

        // hash of the address generated from script
        console.log(Buffer.from(addr.to_bytes(), "utf8").toString("hex"))

        // hash of the address generated using cardano-cli
        const ScriptAddress = Address.from_bech32("addr_test1wpnlxv2xv9a9ucvnvzqakwepzl9ltx7jzgm53av2e9ncv4sysemm8");
        console.log(Buffer.from(ScriptAddress.to_bytes(), "utf8").toString("hex"))


        console.log(ScriptAddress.to_bech32())
        console.log(addrBech32)

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

    /**
     * Refresh all the data from the user's wallet
     * @returns {Promise<void>}
     */
    refreshData = async () => {
        this.generateScriptAddress()

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

    /**
     * The transaction is build in 3 stages:
     * 1 - initialize the Transaction Builder
     * 2 - Add inputs and outputs
     * 3 - Calculate the fee and how much change needs to be given
     * 4 - Build the transaction body
     * 5 - Sign it (at this point the user will be prompted for
     * a password in his wallet)
     * 6 - Send the transaction
     * @returns {Promise<void>}
     */
    buildSendADATransaction = async () => {

        const txBuilder = await this.initTransactionBuilder();
        const shelleyOutputAddress = Address.from_bech32(this.state.addressBech32SendADA);
        const shelleyChangeAddress = Address.from_bech32(this.state.changeAddress);

        txBuilder.add_output(
            TransactionOutput.new(
                shelleyOutputAddress,
                Value.new(BigNum.from_str(this.state.lovelaceToSend.toString()))
            ),
        );

        // Find the available UTXOs in the wallet and
        // us them as Inputs
        const txUnspentOutputs = await this.getTxUnspentOutputs();
        txBuilder.add_inputs_from(txUnspentOutputs, 1)

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

        console.log(txVkeyWitnesses)

        txVkeyWitnesses = TransactionWitnessSet.from_bytes(Buffer.from(txVkeyWitnesses, "hex"));

        transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

        const signedTx = Transaction.new(
            tx.body(),
            transactionWitnessSet
        );


        const submittedTxHash = await this.API.submitTx(Buffer.from(signedTx.to_bytes(), "utf8").toString("hex"));
        console.log(submittedTxHash)
        this.setState({submittedTxHash});


    }


    buildSendTokenTransaction = async () => {

        const txBuilder = await this.initTransactionBuilder();
        const shelleyOutputAddress = Address.from_bech32(this.state.addressBech32SendADA);
        const shelleyChangeAddress = Address.from_bech32(this.state.changeAddress);

        let txOutputBuilder = TransactionOutputBuilder.new();
        txOutputBuilder = txOutputBuilder.with_address(shelleyOutputAddress);
        txOutputBuilder = txOutputBuilder.next();

        let multiAsset = MultiAsset.new();
        let assets = Assets.new()
        assets.insert(
            AssetName.new(Buffer.from(this.state.assetNameHex, "hex")), // Asset Name
            BigNum.from_str(this.state.assetAmountToSend.toString()) // How much to send
        );
        multiAsset.insert(
            ScriptHash.from_bytes(Buffer.from(this.state.assetPolicyIdHex, "hex")), // PolicyID
            assets
        );

        txOutputBuilder = txOutputBuilder.with_asset_and_min_required_coin(multiAsset, BigNum.from_str(this.protocolParams.coinsPerUtxoWord))
        const txOutput = txOutputBuilder.build();

        txBuilder.add_output(txOutput)

        // Find the available UTXOs in the wallet and
        // us them as Inputs
        const txUnspentOutputs = await this.getTxUnspentOutputs();
        txBuilder.add_inputs_from(txUnspentOutputs, 3)


        // set the time to live - the absolute slot value before the tx becomes invalid
        // txBuilder.set_ttl(51821456);

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
        console.log(submittedTxHash)
        this.setState({submittedTxHash});

        // const txBodyCborHex_unsigned = Buffer.from(txBody.to_bytes(), "utf8").toString("hex");
        // this.setState({txBodyCborHex_unsigned, txBody})

    }



    buildSendAdaToPlutusScript = async () => {

        const txBuilder = await this.initTransactionBuilder();
        const ScriptAddress = Address.from_bech32(this.state.addressScriptBech32);
        const shelleyChangeAddress = Address.from_bech32(this.state.changeAddress)


        let txOutputBuilder = TransactionOutputBuilder.new();
        txOutputBuilder = txOutputBuilder.with_address(ScriptAddress);
        const dataHash = hash_plutus_data(PlutusData.new_integer(BigInt.from_str(this.state.datumStr)))
        txOutputBuilder = txOutputBuilder.with_data_hash(dataHash)

        txOutputBuilder = txOutputBuilder.next();

        txOutputBuilder = txOutputBuilder.with_value(Value.new(BigNum.from_str(this.state.lovelaceToSend.toString())))
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

        let txVkeyWitnesses = await this.API.signTx(Buffer.from(tx.to_bytes(), "utf8").toString("hex"), true);
        txVkeyWitnesses = TransactionWitnessSet.from_bytes(Buffer.from(txVkeyWitnesses, "hex"));

        transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

        const signedTx = Transaction.new(
            tx.body(),
            transactionWitnessSet
        );

        const submittedTxHash = await this.API.submitTx(Buffer.from(signedTx.to_bytes(), "utf8").toString("hex"));
        console.log(submittedTxHash)
        this.setState({submittedTxHash: submittedTxHash, transactionIdLocked: submittedTxHash, lovelaceLocked: this.state.lovelaceToSend});


    }

    buildSendTokenToPlutusScript = async () => {

        const txBuilder = await this.initTransactionBuilder();
        const ScriptAddress = Address.from_bech32(this.state.addressScriptBech32);
        const shelleyChangeAddress = Address.from_bech32(this.state.changeAddress)

        let txOutputBuilder = TransactionOutputBuilder.new();
        txOutputBuilder = txOutputBuilder.with_address(ScriptAddress);
        const dataHash = hash_plutus_data(PlutusData.new_integer(BigInt.from_str(this.state.datumStr)))
        txOutputBuilder = txOutputBuilder.with_data_hash(dataHash)

        txOutputBuilder = txOutputBuilder.next();




        let multiAsset = MultiAsset.new();
        let assets = Assets.new()
        assets.insert(
            AssetName.new(Buffer.from(this.state.assetNameHex, "hex")), // Asset Name
            BigNum.from_str(this.state.assetAmountToSend.toString()) // How much to send
        );
        multiAsset.insert(
            ScriptHash.from_bytes(Buffer.from(this.state.assetPolicyIdHex, "hex")), // PolicyID
            assets
        );

        // txOutputBuilder = txOutputBuilder.with_asset_and_min_required_coin(multiAsset, BigNum.from_str(this.protocolParams.coinsPerUtxoWord))

        txOutputBuilder = txOutputBuilder.with_coin_and_asset(BigNum.from_str(this.state.lovelaceToSend.toString()),multiAsset)

        const txOutput = txOutputBuilder.build();

        txBuilder.add_output(txOutput)

        // Find the available UTXOs in the wallet and
        // us them as Inputs
        const txUnspentOutputs = await this.getTxUnspentOutputs();
        txBuilder.add_inputs_from(txUnspentOutputs, 3)





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
        console.log(submittedTxHash)
        this.setState({submittedTxHash: submittedTxHash, transactionIdLocked: submittedTxHash, lovelaceLocked: this.state.lovelaceToSend})

    }




    buildRedeemAdaFromPlutusScript = async () => {

        const txBuilder = await this.initTransactionBuilder();
        const ScriptAddress = Address.from_bech32(this.state.addressScriptBech32);
        const shelleyChangeAddress = Address.from_bech32(this.state.changeAddress)

        txBuilder.add_input(
            ScriptAddress,
            TransactionInput.new(
                TransactionHash.from_bytes(Buffer.from(this.state.transactionIdLocked, "hex")),
                this.state.transactionIndxLocked.toString()),
            Value.new(BigNum.from_str(this.state.lovelaceLocked.toString()))) // how much lovelace is at that UTXO

        txBuilder.set_fee(BigNum.from_str(Number(this.state.manualFee).toString()))

        const scripts = PlutusScripts.new();
        scripts.add(PlutusScript.from_bytes(Buffer.from(this.state.plutusScriptCborHex, "hex"))); //from cbor of plutus script

        // Add outputs
        const outputVal = this.state.lovelaceLocked.toString() - Number(this.state.manualFee)
        const outputValStr = outputVal.toString();
        txBuilder.add_output(TransactionOutput.new(shelleyChangeAddress, Value.new(BigNum.from_str(outputValStr))))


        // once the transaction is ready, we build it to get the tx body without witnesses
        const txBody = txBuilder.build();

        const collateral = this.state.CollatUtxos;
        const inputs = TransactionInputs.new();
        collateral.forEach((utxo) => {
            inputs.add(utxo.input());
        });

        let datums = PlutusList.new();
        // datums.add(PlutusData.from_bytes(Buffer.from(this.state.datumStr, "utf8")))
        datums.add(PlutusData.new_integer(BigInt.from_str(this.state.datumStr)))

        const redeemers = Redeemers.new();

        const data = PlutusData.new_constr_plutus_data(
            ConstrPlutusData.new(
                BigNum.from_str("0"),
                PlutusList.new()
            )
        );

        const redeemer = Redeemer.new(
            RedeemerTag.new_spend(),
            BigNum.from_str("0"),
            data,
            ExUnits.new(
                BigNum.from_str("7000000"),
                BigNum.from_str("3000000000")
            )
        );

        redeemers.add(redeemer)

        // Tx witness
        const transactionWitnessSet = TransactionWitnessSet.new();

        transactionWitnessSet.set_plutus_scripts(scripts)
        transactionWitnessSet.set_plutus_data(datums)
        transactionWitnessSet.set_redeemers(redeemers)

        const cost_model_vals = [197209, 0, 1, 1, 396231, 621, 0, 1, 150000, 1000, 0, 1, 150000, 32, 2477736, 29175, 4, 29773, 100, 29773, 100, 29773, 100, 29773, 100, 29773, 100, 29773, 100, 100, 100, 29773, 100, 150000, 32, 150000, 32, 150000, 32, 150000, 1000, 0, 1, 150000, 32, 150000, 1000, 0, 8, 148000, 425507, 118, 0, 1, 1, 150000, 1000, 0, 8, 150000, 112536, 247, 1, 150000, 10000, 1, 136542, 1326, 1, 1000, 150000, 1000, 1, 150000, 32, 150000, 32, 150000, 32, 1, 1, 150000, 1, 150000, 4, 103599, 248, 1, 103599, 248, 1, 145276, 1366, 1, 179690, 497, 1, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 148000, 425507, 118, 0, 1, 1, 61516, 11218, 0, 1, 150000, 32, 148000, 425507, 118, 0, 1, 1, 148000, 425507, 118, 0, 1, 1, 2477736, 29175, 4, 0, 82363, 4, 150000, 5000, 0, 1, 150000, 32, 197209, 0, 1, 1, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 3345831, 1, 1];

        const costModel = CostModel.new();
        cost_model_vals.forEach((x, i) => costModel.set(i, Int.new_i32(x)));


        const costModels = Costmdls.new();
        costModels.insert(Language.new_plutus_v1(), costModel);

        const scriptDataHash = hash_script_data(redeemers, costModels, datums);
        txBody.set_script_data_hash(scriptDataHash);

        txBody.set_collateral(inputs)


        const baseAddress = BaseAddress.from_address(shelleyChangeAddress)
        const requiredSigners = Ed25519KeyHashes.new();
        requiredSigners.add(baseAddress.payment_cred().to_keyhash())

        txBody.set_required_signers(requiredSigners);

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
        console.log(submittedTxHash)
        this.setState({submittedTxHash});

    }

    buildRedeemTokenFromPlutusScript = async () => {

        const txBuilder = await this.initTransactionBuilder();
        const ScriptAddress = Address.from_bech32(this.state.addressScriptBech32);
        const shelleyChangeAddress = Address.from_bech32(this.state.changeAddress)

        let multiAsset = MultiAsset.new();
        let assets = Assets.new()
        assets.insert(
            AssetName.new(Buffer.from(this.state.assetNameHex, "hex")), // Asset Name
            BigNum.from_str(this.state.assetAmountToSend.toString()) // How much to send
        );

        multiAsset.insert(
            ScriptHash.from_bytes(Buffer.from(this.state.assetPolicyIdHex, "hex")), // PolicyID
            assets
        );

        txBuilder.add_input(
            ScriptAddress,
            TransactionInput.new(
                TransactionHash.from_bytes(Buffer.from(this.state.transactionIdLocked, "hex")),
                this.state.transactionIndxLocked.toString()),
            Value.new_from_assets(multiAsset)
        ) // how much lovelace is at that UTXO


        txBuilder.set_fee(BigNum.from_str(Number(this.state.manualFee).toString()))

        const scripts = PlutusScripts.new();
        scripts.add(PlutusScript.from_bytes(Buffer.from(this.state.plutusScriptCborHex, "hex"))); //from cbor of plutus script


        // Add outputs
        const outputVal = this.state.lovelaceLocked.toString() - Number(this.state.manualFee)
        const outputValStr = outputVal.toString();

        let txOutputBuilder = TransactionOutputBuilder.new();
        txOutputBuilder = txOutputBuilder.with_address(shelleyChangeAddress);
        txOutputBuilder = txOutputBuilder.next();
        txOutputBuilder = txOutputBuilder.with_coin_and_asset(BigNum.from_str(outputValStr),multiAsset)

        const txOutput = txOutputBuilder.build();
        txBuilder.add_output(txOutput)


        // once the transaction is ready, we build it to get the tx body without witnesses
        const txBody = txBuilder.build();

        const collateral = this.state.CollatUtxos;
        const inputs = TransactionInputs.new();
        collateral.forEach((utxo) => {
            inputs.add(utxo.input());
        });



        let datums = PlutusList.new();
        // datums.add(PlutusData.from_bytes(Buffer.from(this.state.datumStr, "utf8")))
        datums.add(PlutusData.new_integer(BigInt.from_str(this.state.datumStr)))

        const redeemers = Redeemers.new();

        const data = PlutusData.new_constr_plutus_data(
            ConstrPlutusData.new(
                BigNum.from_str("0"),
                PlutusList.new()
            )
        );

        const redeemer = Redeemer.new(
            RedeemerTag.new_spend(),
            BigNum.from_str("0"),
            data,
            ExUnits.new(
                BigNum.from_str("7000000"),
                BigNum.from_str("3000000000")
            )
        );

        redeemers.add(redeemer)

        // Tx witness
        const transactionWitnessSet = TransactionWitnessSet.new();

        transactionWitnessSet.set_plutus_scripts(scripts)
        transactionWitnessSet.set_plutus_data(datums)
        transactionWitnessSet.set_redeemers(redeemers)

        const cost_model_vals = [197209, 0, 1, 1, 396231, 621, 0, 1, 150000, 1000, 0, 1, 150000, 32, 2477736, 29175, 4, 29773, 100, 29773, 100, 29773, 100, 29773, 100, 29773, 100, 29773, 100, 100, 100, 29773, 100, 150000, 32, 150000, 32, 150000, 32, 150000, 1000, 0, 1, 150000, 32, 150000, 1000, 0, 8, 148000, 425507, 118, 0, 1, 1, 150000, 1000, 0, 8, 150000, 112536, 247, 1, 150000, 10000, 1, 136542, 1326, 1, 1000, 150000, 1000, 1, 150000, 32, 150000, 32, 150000, 32, 1, 1, 150000, 1, 150000, 4, 103599, 248, 1, 103599, 248, 1, 145276, 1366, 1, 179690, 497, 1, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 148000, 425507, 118, 0, 1, 1, 61516, 11218, 0, 1, 150000, 32, 148000, 425507, 118, 0, 1, 1, 148000, 425507, 118, 0, 1, 1, 2477736, 29175, 4, 0, 82363, 4, 150000, 5000, 0, 1, 150000, 32, 197209, 0, 1, 1, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 3345831, 1, 1];

        const costModel = CostModel.new();
        cost_model_vals.forEach((x, i) => costModel.set(i, Int.new_i32(x)));


        const costModels = Costmdls.new();
        costModels.insert(Language.new_plutus_v1(), costModel);

        const scriptDataHash = hash_script_data(redeemers, costModels, datums);
        txBody.set_script_data_hash(scriptDataHash);

        txBody.set_collateral(inputs)


        const baseAddress = BaseAddress.from_address(shelleyChangeAddress)
        const requiredSigners = Ed25519KeyHashes.new();
        requiredSigners.add(baseAddress.payment_cred().to_keyhash())

        txBody.set_required_signers(requiredSigners);

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
        console.log(submittedTxHash)
        this.setState({submittedTxHash});

    }


    async componentDidMount() {
        this.pollWallets();
       // await this.refreshData();
    }

    handleClick(x) {
        console.log(x)
        const whichWalletSelected = x
        this.setState({whichWalletSelected},
            () => {
                this.refreshData()
            })        
        //this.setState({msg : 'Welcome to the React world!'})
    }

    handleClickOpen = () => {
      this.setState({open: true});
    };
    
    handleClose = (value) => {
        this.setState({open: false});
    };
  
    handleListItemClick = (value) => {
        this.setState({open: false});
        this.handleClick(value);
    };

    emails = ['username@gmail.com', 'user02@gmail.com'];

    renderWalletInfo()
    {

        return (
            <div style={{margin: "20px"}}>

                <Button id="walletConnectButton" variant="outlined" onClick={this.handleClickOpen}>
                    Connect Wallet...
                </Button>
                <div>
                    <Typography variant="subtitle1" component="div">
                    Selected: {this.state.whichWalletSelected}
                    </Typography>
                    <br />
                    <Dialog onClose={this.handleClose} open={this.state.open}>
                        <DialogTitle>Choose a wallet</DialogTitle>
                        <List sx={{ pt: 0 }}>
                        { this.state.wallets.map(key => (
                            <ListItem button onClick={() => this.handleListItemClick(key)} key={key}>
                                <ListItemAvatar>
                                    <img src={window.cardano[key].icon} width={24} height={24} alt={key}/>
                                </ListItemAvatar>
                                <ListItemText primary={window.cardano[key].name} secondary={key}/>
                            </ListItem>
                        ))}
                        </List>
                    </Dialog>       
                </div>                
                
                
                {/*
                <SimpleDialogDemo/>
                <Menu className='walletMenu'>
                    <MenuItem text="Connect Wallet" key="Wallet">
                    { this.state.wallets.map(key =>
                        <MenuItem 
                        text={window.cardano[key].name} label={key} key={key}
                        icon={<img src={window.cardano[key].icon} width={24} height={24} alt={key}/>} 
                        onClick={e => this.handleClick(key)}
                        />
                        )}                        
                    </MenuItem>
                </Menu>
                    */}
                <div>
                    <div>Select wallet:</div>
                    <RadioGroup
                        onChange={this.handleWalletSelect}
                        selectedValue={this.state.whichWalletSelected}
                        inline={true}
                        className="wallets-wrapper"
                    >
                        { this.state.wallets.map(key =>
                            <Radio
                                key={key}
                                className="wallet-label"
                                value={key}>
                                <img src={window.cardano[key].icon} width={24} height={24} alt={key}/>
                                {window.cardano[key].name} ({key})
                            </Radio>
                        )}
                    </RadioGroup>
                </div>



                <button style={{padding: "20px"}} onClick={this.refreshData}>Refresh</button>

                <p style={{paddingTop: "20px"}}><span style={{fontWeight: "bold"}}>Wallet Found: </span>{`${this.state.walletFound}`}</p>
                <p><span style={{fontWeight: "bold"}}>Wallet Connected: </span>{`${this.state.walletIsEnabled}`}</p>
                <p><span style={{fontWeight: "bold"}}>Wallet API version: </span>{this.state.walletAPIVersion}</p>
                <p><span style={{fontWeight: "bold"}}>Wallet name: </span>{this.state.walletName}</p>

                <p><span style={{fontWeight: "bold"}}>Network Id (0 = testnet; 1 = mainnet): </span>{this.state.networkId}</p>
                <p style={{paddingTop: "20px"}}><span style={{fontWeight: "bold"}}>UTXOs: (UTXO #txid = ADA amount + AssetAmount + policyId.AssetName + ...): </span>{this.state.Utxos?.map(x => <li style={{fontSize: "10px"}} key={`${x.str}${x.multiAssetStr}`}>{`${x.str}${x.multiAssetStr}`}</li>)}</p>
                <p style={{paddingTop: "20px"}}><span style={{fontWeight: "bold"}}>Balance: </span>{this.state.balance}</p>
                <p><span style={{fontWeight: "bold"}}>Change Address: </span>{this.state.changeAddress}</p>
                <p><span style={{fontWeight: "bold"}}>Staking Address: </span>{this.state.rewardAddress}</p>
                <p><span style={{fontWeight: "bold"}}>Used Address: </span>{this.state.usedAddress}</p>
                <hr style={{marginTop: "40px", marginBottom: "40px"}}/>

                <Tabs id="TabsExample" vertical={true} onChange={this.handleTabId} selectedTabId={this.state.selectedTabId}>
                    <Tab id="1" title="1. Send ADA to Address" panel={
                        <div style={{marginLeft: "20px"}}>

                            <FormGroup
                                helperText="insert an address where you want to send some ADA ..."
                                label="Address where to send ADA"
                            >
                                <InputGroup
                                    disabled={false}
                                    leftIcon="id-number"
                                    onChange={(event) => this.setState({addressBech32SendADA: event.target.value})}
                                    value={this.state.addressBech32SendADA}

                                />
                            </FormGroup>
                            <FormGroup
                                helperText="Adjust Order Amount ..."
                                label="Lovelaces (1 000 000 lovelaces = 1 ADA)"
                                labelFor="order-amount-input2"
                            >
                                <NumericInput
                                    id="order-amount-input2"
                                    disabled={false}
                                    leftIcon={"variable"}
                                    allowNumericCharactersOnly={true}
                                    value={this.state.lovelaceToSend}
                                    min={1000000}
                                    stepSize={1000000}
                                    majorStepSize={1000000}
                                    onValueChange={(event) => this.setState({lovelaceToSend: event})}
                                />
                            </FormGroup>

                            <button style={{padding: "10px"}} onClick={this.buildSendADATransaction}>Run</button>
                        </div>
                    } />
                    <Tab id="2" title="2. Send Token to Address" panel={
                        <div style={{marginLeft: "20px"}}>

                            <FormGroup
                                helperText="insert an address where you want to send some ADA ..."
                                label="Address where to send ADA"
                            >
                                <InputGroup
                                    disabled={false}
                                    leftIcon="id-number"
                                    onChange={(event) => this.setState({addressBech32SendADA: event.target.value})}
                                    value={this.state.addressBech32SendADA}

                                />
                            </FormGroup>
                            <FormGroup
                                helperText="Make sure you have enough of Asset in your wallet ..."
                                label="Amount of Assets to Send"
                                labelFor="asset-amount-input"
                            >
                                <NumericInput
                                    id="asset-amount-input"
                                    disabled={false}
                                    leftIcon={"variable"}
                                    allowNumericCharactersOnly={true}
                                    value={this.state.assetAmountToSend}
                                    min={1}
                                    stepSize={1}
                                    majorStepSize={1}
                                    onValueChange={(event) => this.setState({assetAmountToSend: event})}
                                />
                            </FormGroup>
                            <FormGroup
                                helperText="Hex of the Policy Id"
                                label="Asset PolicyId"
                            >
                                <InputGroup
                                    disabled={false}
                                    leftIcon="id-number"
                                    onChange={(event) => this.setState({assetPolicyIdHex: event.target.value})}
                                    value={this.state.assetPolicyIdHex}

                                />
                            </FormGroup>
                            <FormGroup
                                helperText="Hex of the Asset Name"
                                label="Asset Name"
                            >
                                <InputGroup
                                    disabled={false}
                                    leftIcon="id-number"
                                    onChange={(event) => this.setState({assetNameHex: event.target.value})}
                                    value={this.state.assetNameHex}

                                />
                            </FormGroup>

                            <button style={{padding: "10px"}} onClick={this.buildSendTokenTransaction}>Run</button>
                        </div>
                    } />
                    <Tab id="3" title="3. Send ADA to Plutus Script" panel={
                        <div style={{marginLeft: "20px"}}>
                            <FormGroup
                                helperText="insert a Script address where you want to send some ADA ..."
                                label="Script Address where to send ADA"
                            >
                                <InputGroup
                                    disabled={false}
                                    leftIcon="id-number"
                                    onChange={(event) => this.setState({addressScriptBech32: event.target.value})}
                                    value={this.state.addressScriptBech32}

                                />
                            </FormGroup>
                            <FormGroup
                                helperText="Adjust Order Amount ..."
                                label="Lovelaces (1 000 000 lovelaces = 1 ADA)"
                                labelFor="order-amount-input2"
                            >
                                <NumericInput
                                    id="order-amount-input2"
                                    disabled={false}
                                    leftIcon={"variable"}
                                    allowNumericCharactersOnly={true}
                                    value={this.state.lovelaceToSend}
                                    min={1000000}
                                    stepSize={1000000}
                                    majorStepSize={1000000}
                                    onValueChange={(event) => this.setState({lovelaceToSend: event})}
                                />
                            </FormGroup>
                            <FormGroup
                                helperText="insert a Datum ..."
                                label="Datum that locks the ADA at the script address ..."
                            >
                                <InputGroup
                                    disabled={false}
                                    leftIcon="id-number"
                                    onChange={(event) => this.setState({datumStr: event.target.value})}
                                    value={this.state.datumStr}

                                />
                            </FormGroup>
                            <button style={{padding: "10px"}} onClick={this.buildSendAdaToPlutusScript}>Run</button>
                        </div>
                    } />
                    <Tab id="4" title="4. Send Token to Plutus Script" panel={
                        <div style={{marginLeft: "20px"}}>
                            <FormGroup
                                helperText="Script address where ADA is locked ..."
                                label="Script Address"
                            >
                                <InputGroup
                                    disabled={false}
                                    leftIcon="id-number"
                                    onChange={(event) => this.setState({addressScriptBech32: event.target.value})}
                                    value={this.state.addressScriptBech32}

                                />
                            </FormGroup>
                            <FormGroup
                                helperText="Need to send ADA with Tokens ..."
                                label="Lovelaces (1 000 000 lovelaces = 1 ADA)"
                                labelFor="order-amount-input2"
                            >
                                <NumericInput
                                    id="order-amount-input2"
                                    disabled={false}
                                    leftIcon={"variable"}
                                    allowNumericCharactersOnly={true}
                                    value={this.state.lovelaceToSend}
                                    min={1000000}
                                    stepSize={1000000}
                                    majorStepSize={1000000}
                                    onValueChange={(event) => this.setState({lovelaceToSend: event})}
                                />
                            </FormGroup>
                            <FormGroup
                                helperText="Make sure you have enough of Asset in your wallet ..."
                                label="Amount of Assets to Send"
                                labelFor="asset-amount-input"
                            >
                                <NumericInput
                                    id="asset-amount-input"
                                    disabled={false}
                                    leftIcon={"variable"}
                                    allowNumericCharactersOnly={true}
                                    value={this.state.assetAmountToSend}
                                    min={1}
                                    stepSize={1}
                                    majorStepSize={1}
                                    onValueChange={(event) => this.setState({assetAmountToSend: event})}
                                />
                            </FormGroup>
                            <FormGroup
                                helperText="Hex of the Policy Id"
                                label="Asset PolicyId"
                            >
                                <InputGroup
                                    disabled={false}
                                    leftIcon="id-number"
                                    onChange={(event) => this.setState({assetPolicyIdHex: event.target.value})}
                                    value={this.state.assetPolicyIdHex}

                                />
                            </FormGroup>
                            <FormGroup
                                helperText="Hex of the Asset Name"
                                label="Asset Name"
                            >
                                <InputGroup
                                    disabled={false}
                                    leftIcon="id-number"
                                    onChange={(event) => this.setState({assetNameHex: event.target.value})}
                                    value={this.state.assetNameHex}

                                />
                            </FormGroup>
                            <FormGroup
                                helperText="insert a Datum ..."
                                label="Datum that locks the ADA at the script address ..."
                            >
                                <InputGroup
                                    disabled={false}
                                    leftIcon="id-number"
                                    onChange={(event) => this.setState({datumStr: event.target.value})}
                                    value={this.state.datumStr}

                                />
                            </FormGroup>
                            <button style={{padding: "10px"}} onClick={this.buildSendTokenToPlutusScript}>Run</button>
                        </div>
                    } />
                    <Tab id="5" title="5. Redeem ADA from Plutus Script" panel={
                        <div style={{marginLeft: "20px"}}>
                            <FormGroup
                                helperText="Script address where ADA is locked ..."
                                label="Script Address"
                            >
                                <InputGroup
                                    disabled={false}
                                    leftIcon="id-number"
                                    onChange={(event) => this.setState({addressScriptBech32: event.target.value})}
                                    value={this.state.addressScriptBech32}

                                />
                            </FormGroup>
                            <FormGroup
                                helperText="content of the plutus script encoded as CborHex ..."
                                label="Plutus Script CborHex"
                            >
                                <InputGroup
                                    disabled={false}
                                    leftIcon="id-number"
                                    onChange={(event) => this.setState({plutusScriptCborHex: event.target.value})}
                                    value={this.state.plutusScriptCborHex}

                                />
                            </FormGroup>
                            <FormGroup
                                helperText="Transaction hash ... If empty then run n. 3 first to lock some ADA"
                                label="UTXO where ADA is locked"
                            >
                                <InputGroup
                                    disabled={false}
                                    leftIcon="id-number"
                                    onChange={(event) => this.setState({transactionIdLocked: event.target.value})}
                                    value={this.state.transactionIdLocked}

                                />
                            </FormGroup>
                            <FormGroup
                                helperText="UTXO IndexId#, usually it's 0 ..."
                                label="Transaction Index #"
                                labelFor="order-amount-input2"
                            >
                                <NumericInput
                                    id="order-amount-input2"
                                    disabled={false}
                                    leftIcon={"variable"}
                                    allowNumericCharactersOnly={true}
                                    value={this.state.transactionIndxLocked}
                                    min={0}
                                    stepSize={1}
                                    majorStepSize={1}
                                    onValueChange={(event) => this.setState({transactionIndxLocked: event})}
                                />
                            </FormGroup>
                            <FormGroup
                                helperText="Adjust Order Amount ..."
                                label="Lovelaces (1 000 000 lovelaces = 1 ADA)"
                                labelFor="order-amount-input2"
                            >
                                <NumericInput
                                    id="order-amount-input2"
                                    disabled={false}
                                    leftIcon={"variable"}
                                    allowNumericCharactersOnly={true}
                                    value={this.state.lovelaceLocked}
                                    min={1000000}
                                    stepSize={1000000}
                                    majorStepSize={1000000}
                                    onValueChange={(event) => this.setState({lovelaceLocked: event})}
                                />
                            </FormGroup>
                            <FormGroup
                                helperText="insert a Datum ..."
                                label="Datum that unlocks the ADA at the script address ..."
                            >
                                <InputGroup
                                    disabled={false}
                                    leftIcon="id-number"
                                    onChange={(event) => this.setState({datumStr: event.target.value})}
                                    value={this.state.datumStr}

                                />
                            </FormGroup>
                            <FormGroup
                                helperText="Needs to be enough to execute the contract ..."
                                label="Manual Fee"
                                labelFor="order-amount-input2"
                            >
                                <NumericInput
                                    id="order-amount-input2"
                                    disabled={false}
                                    leftIcon={"variable"}
                                    allowNumericCharactersOnly={true}
                                    value={this.state.manualFee}
                                    min={160000}
                                    stepSize={100000}
                                    majorStepSize={100000}
                                    onValueChange={(event) => this.setState({manualFee: event})}
                                />
                            </FormGroup>
                            <button style={{padding: "10px"}} onClick={this.buildRedeemAdaFromPlutusScript}>Run</button>
                            {/*<button style={{padding: "10px"}} onClick={this.signTransaction}>2. Sign Transaction</button>*/}
                            {/*<button style={{padding: "10px"}} onClick={this.submitTransaction}>3. Submit Transaction</button>*/}
                        </div>
                    } />
                    <Tab id="6" title="6. Redeem Tokens from Plutus Script" panel={
                        <div style={{marginLeft: "20px"}}>
                            <FormGroup
                                helperText="Script address where ADA is locked ..."
                                label="Script Address"
                            >
                                <InputGroup
                                    disabled={false}
                                    leftIcon="id-number"
                                    onChange={(event) => this.setState({addressScriptBech32: event.target.value})}
                                    value={this.state.addressScriptBech32}

                                />
                            </FormGroup>
                            <FormGroup
                                helperText="content of the plutus script encoded as CborHex ..."
                                label="Plutus Script CborHex"
                            >
                                <InputGroup
                                    disabled={false}
                                    leftIcon="id-number"
                                    onChange={(event) => this.setState({plutusScriptCborHex: event.target.value})}
                                    value={this.state.plutusScriptCborHex}

                                />
                            </FormGroup>
                            <FormGroup
                                helperText="Transaction hash ... If empty then run n. 3 first to lock some ADA"
                                label="UTXO where ADA is locked"
                            >
                                <InputGroup
                                    disabled={false}
                                    leftIcon="id-number"
                                    onChange={(event) => this.setState({transactionIdLocked: event.target.value})}
                                    value={this.state.transactionIdLocked}

                                />
                            </FormGroup>
                            <FormGroup
                                helperText="UTXO IndexId#, usually it's 0 ..."
                                label="Transaction Index #"
                                labelFor="order-amount-input2"
                            >
                                <NumericInput
                                    id="order-amount-input2"
                                    disabled={false}
                                    leftIcon={"variable"}
                                    allowNumericCharactersOnly={true}
                                    value={this.state.transactionIndxLocked}
                                    min={0}
                                    stepSize={1}
                                    majorStepSize={1}
                                    onValueChange={(event) => this.setState({transactionIndxLocked: event})}
                                />
                            </FormGroup>
                            <FormGroup
                                helperText="Adjust Order Amount ..."
                                label="Lovelaces (1 000 000 lovelaces = 1 ADA)"
                                labelFor="order-amount-input2"
                            >
                                <NumericInput
                                    id="order-amount-input2"
                                    disabled={false}
                                    leftIcon={"variable"}
                                    allowNumericCharactersOnly={true}
                                    value={this.state.lovelaceLocked}
                                    min={1000000}
                                    stepSize={1000000}
                                    majorStepSize={1000000}
                                    onValueChange={(event) => this.setState({lovelaceLocked: event})}
                                />
                            </FormGroup>
                            <FormGroup
                                helperText="Make sure you have enough of Asset in your wallet ..."
                                label="Amount of Assets to Reedem"
                                labelFor="asset-amount-input"
                            >
                                <NumericInput
                                    id="asset-amount-input"
                                    disabled={false}
                                    leftIcon={"variable"}
                                    allowNumericCharactersOnly={true}
                                    value={this.state.assetAmountToSend}
                                    min={1}
                                    stepSize={1}
                                    majorStepSize={1}
                                    onValueChange={(event) => this.setState({assetAmountToSend: event})}
                                />
                            </FormGroup>
                            <FormGroup
                                helperText="Hex of the Policy Id"
                                label="Asset PolicyId"
                            >
                                <InputGroup
                                    disabled={false}
                                    leftIcon="id-number"
                                    onChange={(event) => this.setState({assetPolicyIdHex: event.target.value})}
                                    value={this.state.assetPolicyIdHex}

                                />
                            </FormGroup>
                            <FormGroup
                                helperText="Hex of the Asset Name"
                                label="Asset Name"
                            >
                                <InputGroup
                                    disabled={false}
                                    leftIcon="id-number"
                                    onChange={(event) => this.setState({assetNameHex: event.target.value})}
                                    value={this.state.assetNameHex}

                                />
                            </FormGroup>
                            <FormGroup
                                helperText="insert a Datum ..."
                                label="Datum that unlocks the ADA at the script address ..."
                            >
                                <InputGroup
                                    disabled={false}
                                    leftIcon="id-number"
                                    onChange={(event) => this.setState({datumStr: event.target.value})}
                                    value={this.state.datumStr}

                                />
                            </FormGroup>
                            <FormGroup
                                helperText="Needs to be enough to execute the contract ..."
                                label="Manual Fee"
                                labelFor="order-amount-input2"
                            >
                                <NumericInput
                                    id="order-amount-input2"
                                    disabled={false}
                                    leftIcon={"variable"}
                                    allowNumericCharactersOnly={true}
                                    value={this.state.manualFee}
                                    min={160000}
                                    stepSize={100000}
                                    majorStepSize={100000}
                                    onValueChange={(event) => this.setState({manualFee: event})}
                                />
                            </FormGroup>
                            <button style={{padding: "10px"}} onClick={this.buildRedeemTokenFromPlutusScript}>Run</button>
                        </div>
                    } />
                    <Tabs.Expander />
                </Tabs>

                <hr style={{marginTop: "40px", marginBottom: "40px"}}/>

                {/*<p>{`Unsigned txBodyCborHex: ${this.state.txBodyCborHex_unsigned}`}</p>*/}
                {/*<p>{`Signed txBodyCborHex: ${this.state.txBodyCborHex_signed}`}</p>*/}
                <p>{`Submitted Tx Hash: ${this.state.submittedTxHash}`}</p>
                <p>{this.state.submittedTxHash ? 'check your wallet !' : ''}</p>



            </div>
        )
    }

  render() {
    return (
        <div>
            <div className='topDiv'>
                <PaintCanvas  />
            </div>
            <div className='bottomDiv'>
                {this.renderWalletInfo()}
            </div>
        </div>
    );
  }


}