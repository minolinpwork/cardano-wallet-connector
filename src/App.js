import React from 'react'
import { Tab, Tabs, RadioGroup, Radio, FormGroup, InputGroup, NumericInput } from "@blueprintjs/core";
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
    ScriptDataHash, Ed25519KeyHash, NativeScript, StakeCredential,
    TxBuilderConstants,
    encode_json_str_to_plutus_datum,
    PlutusDatumSchema
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
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import { ListItemButton } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Tooltip from '@mui/material/Tooltip';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';

import Alert from '@mui/material/Alert';
import clipboard from 'clipboardy';

import { properties } from './properties/properties.js'
import MinimumDistanceSlider from './component/Slider'
import CircleButton from './component/CircleButton'
import LottoView, {Lottery} from './component/Lottery'
import BasicTable from './component/BasicTable'
import NewLottery from './component/NewLottery'

let Buffer = require('buffer/').Buffer
let blake = require('blakejs')

export default class App extends React.Component
{
    constructor(props)
    {
        super(props);

        const lotteriesX = this.createLotteries();

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
            plutusScriptCborHex: "59072d59072a01000033232323232323232323232323232332232323232222232325335333006375c00a6eb8010cccd5cd19b8735573aa004900011991091980080180119191919191919191919191999ab9a3370e6aae754029200023333333333222222222212333333333300100b00a009008007006005004003002335014232323333573466e1cd55cea80124000466442466002006004603e6ae854008c064d5d09aba2500223263202833573805205004c26aae7940044dd50009aba1500a33501401535742a012666aa02eeb94058d5d0a804199aa80bbae501635742a00e66a02803e6ae854018cd4050cd54088081d69aba150053232323333573466e1cd55cea801240004664424660020060046464646666ae68cdc39aab9d5002480008cc8848cc00400c008cd4095d69aba150023026357426ae8940088c98c80b0cd5ce01681601509aab9e5001137540026ae854008c8c8c8cccd5cd19b8735573aa004900011991091980080180119a812bad35742a004604c6ae84d5d1280111931901619ab9c02d02c02a135573ca00226ea8004d5d09aba2500223263202833573805205004c26aae7940044dd50009aba1500433501475c6ae85400ccd4050cd54089d710009aba15002301c357426ae8940088c98c8090cd5ce01281201109aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aab9e5001137540026ae854008c8c8c8cccd5cd19b875001480188c848888c010014c05cd5d09aab9e500323333573466e1d400920042321222230020053019357426aae7940108cccd5cd19b875003480088c848888c004014c054d5d09aab9e500523333573466e1d40112000232122223003005375c6ae84d55cf280311931900f99ab9c02001f01d01c01b01a135573aa00226ea8004d5d09aba2500223263201833573803203002c202e264c6402e66ae7124010350543500017135573ca00226ea800448c88c008dd6000990009aa80a111999aab9f00125009233500830043574200460066ae8800804c8c8c8c8cccd5cd19b8735573aa00690001199911091998008020018011919191999ab9a3370e6aae7540092000233221233001003002301535742a00466a01c0286ae84d5d1280111931900c19ab9c019018016135573ca00226ea8004d5d0a801999aa803bae500635742a00466a014eb8d5d09aba2500223263201433573802a02802426ae8940044d55cf280089baa0011335500175ceb44488c88c008dd5800990009aa80911191999aab9f0022500823350073355015300635573aa004600a6aae794008c010d5d100180909aba100111220021221223300100400312232323333573466e1d4005200023212230020033005357426aae79400c8cccd5cd19b8750024800884880048c98c8040cd5ce00880800700689aab9d500113754002464646666ae68cdc39aab9d5002480008cc8848cc00400c008c014d5d0a8011bad357426ae8940088c98c8034cd5ce00700680589aab9e5001137540024646666ae68cdc39aab9d5001480008dd71aba135573ca004464c6401666ae7003002c0244dd500089119191999ab9a3370ea00290021091100091999ab9a3370ea00490011190911180180218031aba135573ca00846666ae68cdc3a801a400042444004464c6401c66ae7003c03803002c0284d55cea80089baa0012323333573466e1d40052002212200223333573466e1d40092000212200123263200a33573801601401000e26aae74dd5000919191919191999ab9a3370ea002900610911111100191999ab9a3370ea004900510911111100211999ab9a3370ea00690041199109111111198008048041bae35742a00a6eb4d5d09aba2500523333573466e1d40112006233221222222233002009008375c6ae85401cdd71aba135744a00e46666ae68cdc3a802a400846644244444446600c01201060186ae854024dd71aba135744a01246666ae68cdc3a8032400446424444444600e010601a6ae84d55cf280591999ab9a3370ea00e900011909111111180280418071aba135573ca018464c6402466ae7004c04804003c03803403002c0284d55cea80209aab9e5003135573ca00426aae7940044dd50009191919191999ab9a3370ea002900111999110911998008028020019bad35742a0086eb4d5d0a8019bad357426ae89400c8cccd5cd19b875002480008c8488c00800cc020d5d09aab9e500623263200b33573801801601201026aae75400c4d5d1280089aab9e500113754002464646666ae68cdc3a800a400446424460020066eb8d5d09aab9e500323333573466e1d400920002321223002003375c6ae84d55cf280211931900419ab9c009008006005135573aa00226ea800444888c8c8cccd5cd19b8735573aa0049000119aa80518031aba150023005357426ae8940088c98c8020cd5ce00480400309aab9e5001137540029309000a490350543100112212330010030021123230010012233003300200200122232333573466e3c010004488008488004dc90011",
            addressScriptBech32: "addr_test1wq5uxrjetegdstljjc924gfmph5tknxu4u5dlusngef00cqwrn27u",
            datumStr: "872e4e50ce9990d8b041330c47c9ddd11bec6b503ae9386a99da8584e9bb12c4".toUpperCase(),
            redeemStr: "HelloWorld",
            transactionIdLocked: "85d607cba9edd396eb4a87591cb4df84f0c8a265f8fc64bb5a1a0309ee3da8bb",
            lovelaceToSend: 4400000,
            lovelaceLocked: 4400000,

            openAvailableWalletsDialog: false,
            openWalletDetailsDialog: false,
            openNFTDetailsDialog: false,
            openNFTSuccessAlert: false,
            openNFTFailureAlert: false,
            showWalletInfo: false,
            connectWallet: false,

            nft_policyName: 'ADANFTCreator',
            nft_name: '',
            nft_description: '',
            nft_imageType: 'PNG',
            statusUpdate: "",

            lotteries: lotteriesX,
            selectedLottery: lotteriesX[0],

            //selectedLottery : new Lottery("", 1, 1),
            createNewLottery: false,

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
            minUtxo: "34482",
            poolDeposit: "500000000",
            keyDeposit: "2000000",
            maxValSize: 5000,
            maxTxSize: 16384,
            priceMem: 0.0577,
            priceStep: 0.0000721,
            coinsPerUtxoWord: "34482",
        }

        //this.pollWallets = this.pollWallets.bind(this);
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
            this.refreshData()
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

        this.createStringDatum_hex_to_hex(this.state.datumStr, "generateScriptAddress")
        this.createStringDatum_utf_to_hex(this.state.redeemStr, "generateScriptAddress ")
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

    createStringDatum_utf_to_hex(str, desc)  {
        console.log("Buffer" + desc)
        //let str=this.state.datumStr
        let strUtf=Buffer.from(str, "utf-8")
        let strHex=Buffer.from(str, "hex")
        let strUtfToHex=strUtf.toString("hex").toUpperCase()
        console.log("Buffer0: " + str)
        console.log("Buffer1: " + strUtf)
        console.log("Buffer2: " + strHex)
        console.log("Buffer3: " + strUtfToHex)
        let dataStr="{\"bytes\":\""+strUtfToHex+"\"}"
        console.log("Buffer4: " + dataStr)
        let dataFromJson=encode_json_str_to_plutus_datum(dataStr, PlutusDatumSchema.DetailedSchema)
        //console.log("Buffer5: " + dataFromJson)
        return dataFromJson;
    }

    createStringDatum_hex_to_hex(str, desc)  {
        console.log("Buffer" + desc)
        //let str=this.state.datumStr
        let strUtf=Buffer.from(str, "utf-8")
        let strHex=Buffer.from(str, "hex")
        let strUtfToHex=strUtf.toString("hex").toUpperCase()
        let strHexToHex=strHex.toString("hex").toUpperCase()
        console.log("Buffer0: " + str)
        console.log("Buffer1: " + strUtf)
        console.log("Buffer2: " + strHex)
        console.log("Buffer3: " + strUtfToHex)
        console.log("Buffer4: " + strHexToHex)
        let dataStr="{\"bytes\":\""+strHexToHex+"\"}"
        console.log("Buffer5: " + dataStr)
        let dataFromJson=encode_json_str_to_plutus_datum(dataStr, PlutusDatumSchema.DetailedSchema)
        //console.log("Buffer6: " + dataFromJson)
        return dataFromJson;
    }


    buildSendAdaToPlutusScript = async () => {

        const txBuilder = await this.initTransactionBuilder();
        const ScriptAddress = Address.from_bech32(this.state.addressScriptBech32);
        const shelleyChangeAddress = Address.from_bech32(this.state.changeAddress)


        let txOutputBuilder = TransactionOutputBuilder.new();
        txOutputBuilder = txOutputBuilder.with_address(ScriptAddress);
        //data=PlutusData.new_integer(BigInt.from_str(this.state.datumStr))
        let datumFromJson=this.createStringDatum_hex_to_hex(this.state.datumStr, "buildSendAdaToPlutusScript")
        const dataHash = hash_plutus_data(datumFromJson)
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
        //datums.add(PlutusData.new_integer(BigInt.from_str(this.state.datumStr)))
        let datumFromJson=this.createStringDatum_hex_to_hex(this.state.datumStr, "buildRedeemAdaFromPlutusScript datum")
        datums.add(datumFromJson)

        const redeemers = Redeemers.new();

        //let dataStr="{\"fields\":[],\"constructor\":0}"
        let redeemerFromJson=this.createStringDatum_utf_to_hex(this.state.redeemStr, "buildRedeemAdaFromPlutusScript redeem")
/**
        const data = PlutusData.new_constr_plutus_data(
            ConstrPlutusData.new(
                BigNum.from_str("0"),
                PlutusList.new()
            )
        );
*/

        const redeemer = Redeemer.new(
            RedeemerTag.new_spend(),
            BigNum.from_str("0"),
            redeemerFromJson,
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

        // Pre Vasil hard fork cost model
        // const cost_model_vals = [
        //     197209, 0, 1, 1, 396231, 621, 0, 1, 150000, 1000,
        //     0, 1, 150000, 32, 2477736, 29175, 4, 29773, 100, 29773, 100, 29773, 100,
        //     29773, 100, 29773, 100, 29773, 100, 100, 100, 29773, 100, 150000, 32, 150000,
        //     32, 150000, 32, 150000, 1000, 0, 1, 150000, 32, 150000, 1000, 0, 8, 148000,
        //     425507, 118, 0, 1, 1, 150000, 1000, 0, 8, 150000, 112536, 247, 1, 150000,
        //     10000, 1, 136542, 1326, 1, 1000, 150000, 1000, 1, 150000, 32, 150000, 32,
        //     150000, 32, 1, 1, 150000, 1, 150000, 4, 103599, 248, 1, 103599, 248, 1,
        //     145276, 1366, 1, 179690, 497, 1, 150000, 32, 150000, 32, 150000, 32, 150000,
        //     32, 150000, 32, 150000, 32, 148000, 425507, 118, 0, 1, 1, 61516, 11218, 0,
        //     1, 150000, 32, 148000, 425507, 118, 0, 1, 1, 148000, 425507, 118, 0, 1, 1,
        //     2477736, 29175, 4, 0, 82363, 4, 150000, 5000, 0, 1, 150000, 32, 197209, 0,
        //     1, 1, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32,
        //     150000, 32, 3345831, 1, 1
        // ];

        /*
        Post Vasil hard fork cost model
        If you need to make this code work on the Mainnet, before Vasil hard-fork
        Then you need to comment this section below and uncomment the cost model above
        Otherwise it will give errors when redeeming from Scripts
        Sending assets and ada to Script addresses is unaffected by this cost model
         */
        const cost_model_vals = [
            205665, 812, 1, 1, 1000, 571, 0, 1, 1000, 24177, 4, 1, 1000, 32, 117366,
            10475, 4, 23000, 100, 23000, 100, 23000, 100, 23000, 100, 23000, 100, 23000,
            100, 100, 100, 23000, 100, 19537, 32, 175354, 32, 46417, 4, 221973, 511, 0, 1,
            89141, 32, 497525, 14068, 4, 2, 196500, 453240, 220, 0, 1, 1, 1000, 28662, 4,
            2, 245000, 216773, 62, 1, 1060367, 12586, 1, 208512, 421, 1, 187000, 1000,
            52998, 1, 80436, 32, 43249, 32, 1000, 32, 80556, 1, 57667, 4, 1000, 10,
            197145, 156, 1, 197145, 156, 1, 204924, 473, 1, 208896, 511, 1, 52467, 32,
            64832, 32, 65493, 32, 22558, 32, 16563, 32, 76511, 32, 196500, 453240, 220, 0,
            1, 1, 69522, 11687, 0, 1, 60091, 32, 196500, 453240, 220, 0, 1, 1, 196500,
            453240, 220, 0, 1, 1, 806990, 30482, 4, 1927926, 82523, 4, 265318, 0, 4, 0,
            85931, 32, 205665, 812, 1, 1, 41182, 32, 212342, 32, 31220, 32, 32696, 32,
            43357, 32, 32247, 32, 38314, 32, 9462713, 1021, 10,
        ];

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

        // Pre Vasil hard fork cost model
        // const cost_model_vals = [197209, 0, 1, 1, 396231, 621, 0, 1, 150000, 1000, 0, 1, 150000, 32, 2477736, 29175, 4, 29773, 100, 29773, 100, 29773, 100, 29773, 100, 29773, 100, 29773, 100, 100, 100, 29773, 100, 150000, 32, 150000, 32, 150000, 32, 150000, 1000, 0, 1, 150000, 32, 150000, 1000, 0, 8, 148000, 425507, 118, 0, 1, 1, 150000, 1000, 0, 8, 150000, 112536, 247, 1, 150000, 10000, 1, 136542, 1326, 1, 1000, 150000, 1000, 1, 150000, 32, 150000, 32, 150000, 32, 1, 1, 150000, 1, 150000, 4, 103599, 248, 1, 103599, 248, 1, 145276, 1366, 1, 179690, 497, 1, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 148000, 425507, 118, 0, 1, 1, 61516, 11218, 0, 1, 150000, 32, 148000, 425507, 118, 0, 1, 1, 148000, 425507, 118, 0, 1, 1, 2477736, 29175, 4, 0, 82363, 4, 150000, 5000, 0, 1, 150000, 32, 197209, 0, 1, 1, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 3345831, 1, 1];

        /*
        Post Vasil hard fork cost model
        If you need to make this code work on the Mainnnet, before Vasil hard-fork
        Then you need to comment this section below and uncomment the cost model above
        Otherwise it will give errors when redeeming from Scripts
        Sending assets and ada to Script addresses is unaffected by this cost model
         */
        const cost_model_vals = [
            205665, 812, 1, 1, 1000, 571, 0, 1, 1000, 24177, 4, 1, 1000, 32, 117366,
            10475, 4, 23000, 100, 23000, 100, 23000, 100, 23000, 100, 23000, 100, 23000,
            100, 100, 100, 23000, 100, 19537, 32, 175354, 32, 46417, 4, 221973, 511, 0, 1,
            89141, 32, 497525, 14068, 4, 2, 196500, 453240, 220, 0, 1, 1, 1000, 28662, 4,
            2, 245000, 216773, 62, 1, 1060367, 12586, 1, 208512, 421, 1, 187000, 1000,
            52998, 1, 80436, 32, 43249, 32, 1000, 32, 80556, 1, 57667, 4, 1000, 10,
            197145, 156, 1, 197145, 156, 1, 204924, 473, 1, 208896, 511, 1, 52467, 32,
            64832, 32, 65493, 32, 22558, 32, 16563, 32, 76511, 32, 196500, 453240, 220, 0,
            1, 1, 69522, 11687, 0, 1, 60091, 32, 196500, 453240, 220, 0, 1, 1, 196500,
            453240, 220, 0, 1, 1, 806990, 30482, 4, 1927926, 82523, 4, 265318, 0, 4, 0,
            85931, 32, 205665, 812, 1, 1, 41182, 32, 212342, 32, 31220, 32, 32696, 32,
            43357, 32, 32247, 32, 38314, 32, 9462713, 1021, 10,
        ];

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

    clickOpenNFTDetailsDialog = () => {
        this.setState({openNFTDetailsDialog: true});
    };

    closeNFTDetailsDialog = () => {
        this.setState({openNFTDetailsDialog: false});
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


      handleLotterySelect = (name) => {
        const lotteries = this.state.lotteries;
        console.log("handleLotterySelect: " + name);
        let selectedLottery = lotteries.find(o => o.name === name);
        this.setState({selectedLottery})
      };

      handleClickNewLottery = () => {
        const selectedLottery = new Lottery("", 1, 1);
        const createNewLottery = true
        this.setState({createNewLottery});
        this.setState({selectedLottery: selectedLottery});
      };

      handleCancelNewLottery = () => {
        const selectedLottery = this.state.lotteries[0];
        const createNewLottery = false
        this.setState({createNewLottery, selectedLottery});
      };

      handleClickCreateNewLottery = () => {
        //console.log(this.state.selectedLottery);
        const lotteries = this.state.lotteries;
        lotteries.push(this.state.selectedLottery);
        const createNewLottery = false
        this.setState({lotteries, createNewLottery});
        //const createNewLottery = !this.state.createNewLottery
        //this.setState({createNewLottery});
      };

      handleLotteryNameChange = (input) => {
        const selectedLottery = this.state.selectedLottery;
        selectedLottery.name = input;
        this.setState({selectedLottery});
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

      createLotteries() {
        let lotteries = [
            new Lottery("Lol", 55, 6),
            new Lottery("Nav", 30, 3),
            new Lottery("Mino", 24, 4),
            new Lottery("Easy", 12, 1)
        ]
        return lotteries;
      }

      
      renderLotto()
      {
        const lotteries = this.state.lotteries;
        const selectedLottery = this.state.selectedLottery;
        const createNewLottery = this.state.createNewLottery
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
                    <BasicTable lotteries={lotteries} lotteryClick={this.handleLotterySelect}></BasicTable>
                    <br></br>
                    <Button variant="contained" onClick={this.handleClickNewLottery}  sx={{justifyContent: 'center',}}>Create new Lottery</Button>
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
                    createLotteryClick={this.handleClickCreateNewLottery}>                        
                    </NewLottery>
                    <Stack direction="row" spacing={2} mt={4} sx={{justifyContent: 'center',}}>
                        <Button variant="contained" onClick={this.handleCancelNewLottery}>Cancel</Button>
                        <Button variant="contained" onClick={this.handleClickCreateNewLottery}>Create new Lottery</Button>
                    </Stack>
                </Grid>
                }


                <Grid item xs={12} md={6}>
                    <LottoView lottery={selectedLottery}></LottoView>
                    <br></br><br></br>
                    {(!createNewLottery)
                    &&
                    <Button variant="contained">Play</Button>
                    }
                </Grid>
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
          <Dialog open={this.state.openNFTDetailsDialog} onClose={this.closeNFTDetailsDialog}>
            <DialogTitle>Create NFT</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter NFT details
              </DialogContentText>
              <TextField type="text" autoFocus id="nftName" label="NFT Name" required maxLength="32" inputProps={{ maxLength: 32, required: true }} onChange={(event) => this.setState({nft_name: event.target.value})} fullWidth margin='dense' variant='outlined' defaultValue={this.state.nft_name}/>
              <TextField type="text" id="nftDescription" label="NFT Description" required maxLength="64" inputProps={{ maxLength: 64, required: true  }} onChange={(event) => this.setState({nft_description: event.target.value})} fullWidth margin='dense' defaultValue={this.state.nft_description}/>
              <TextField type="text" id="nftPolicyName" label="Policy Name" required maxLength="32" inputProps={{ maxLength: 32, required: true  }} fullWidth margin='dense' defaultValue={this.state.nft_policyName}/>
              <Select variant="outlined"
                  labelId="selectImageTypeLabel"
                  id="selectImageType"
                  value={this.state.nft_imageType}
                  label="Image Type"
                  onChange={(event) => this.setState({nft_imageType: event.target.value})}
              >
                  <MenuItem value='PNG'>Image</MenuItem>
                  <MenuItem value='GIF'>Animation</MenuItem>
              </Select>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" size="large" onClick={this.closeNFTDetailsDialog}>Cancel</Button>
              <Button variant="contained" size="large" onClick={this.process}>Pay</Button>
            </DialogActions>
          </Dialog>
                  </div>                
                  }
                  </div>
          )
      }
                     
    renderWalletInfo()
    {

        return (
            <div style={{margin: "20px"}}>



                <h1>Boilerplate DApp connector to Wallet</h1>
                <div style={{paddingTop: "10px"}}>
                    <div style={{marginBottom: 15}}>Select wallet:</div>
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
}