/**
 * Gestion MetaMask et réseau Chiliz - VERSION AUTOMATIQUE POUR TEST
 * Gère la connexion au wallet MetaMask et la configuration du réseau Chiliz Chain
 */

class Web3Manager {
    constructor() {
        this.userAddress = null;
        this.isConnected = false;
        this.chilizChainId = '0x15b32'; // chiliz chain id 88882 (testnet)
    }

    isMetaMaskInstalled() {
        if (!window.ethereum) {
            throw new Error("MetaMask not installed");
        }
        return window.ethereum.isMetaMask;
    }

    async connectMetaMask() {
        try {
            if (!this.isMetaMaskInstalled()) {
                throw new Error("MetaMask not installed. Please install it from https://metamask.io/");
            }

            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (accounts.length === 0) {
                throw new Error("No MetaMask account found");
            }

            this.userAddress = accounts[0];
            this.isConnected = true;

            // listen to account changes (disconnected, network changed, etc.)
            this.setupEventListeners();

            console.log("✅ MetaMask connected:", this.userAddress);
            return this.userAddress;

        } catch (error) {
            console.error("❌ Error connecting MetaMask:", error.message);
            
            if (error.code === 4001) {
                throw new Error("User rejected connection");
            }
            
            throw error;
        }
    }

    async isOnChilizNetwork() {
        try {
            const currentChainId = await window.ethereum.request({
                method: 'eth_chainId'
            });
            
            return currentChainId.toLowerCase() === this.chilizChainId.toLowerCase();
        } catch (error) {
            console.error("❌ Error checking network:", error.message);
            return false;
        }
    }

    async switchToChilizNetwork() {
        try {
            console.log("🔄 Tentative de basculement vers Chiliz...");

            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: this.chilizChainId }]
            });

            console.log("✅ Network switched to Chiliz Chain");
            return true;

        } catch (switchError) {
            console.log("⚠️ Error switching network, code:", switchError.code);
            
            if (switchError.code === 4902) {
                console.log("🆕 Network not found, adding network...");
                return await this.addChilizNetwork();
            }
            
            console.error("❌ Error switching network:", switchError.message);
            throw new Error("Impossible to switch to Chiliz Chain");
        }
    }

    async addChilizNetwork() {
        try {
            console.log("➕ Adding Chiliz Testnet network...");
            
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: this.chilizChainId,
                    chainName: 'Chiliz Spicy Testnet',
                    rpcUrls: ['https://rpc.ankr.com/chiliz_testnet'],
                    nativeCurrency: {
                        name: 'CHZ',
                        symbol: 'CHZ',
                        decimals: 18
                    },
                    blockExplorerUrls: ['https://testnet.chiliscan.com']
                }]
            });

            console.log("✅ Chiliz Testnet network added successfully");
            return true;

        } catch (error) {
            console.error("❌ Error adding Chiliz network:", error.message);
            throw new Error("Impossible to add Chiliz network");
        }
    }

    async checkChilizNetwork() {
        try {
            const isOnChiliz = await this.isOnChilizNetwork();
            
            if (!isOnChiliz) {
                console.log("⚠️ Not on Chiliz Chain, automatic switch in progress...");
                await this.switchToChilizNetwork();
                console.log("🎉 Automatic switch completed!");
            } else {
                console.log("✅ You are already on Chiliz Chain");
            }
            
            return true;

        } catch (error) {
            console.error("❌ Error checking Chiliz network:", error.message);
            throw error;
        }
    }

    setupEventListeners() {
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                this.disconnectMetaMask();
            } else {
                this.userAddress = accounts[0];
                console.log("🔄 Account changed:", this.userAddress);
            }
        });

        window.ethereum.on('chainChanged', (chainId) => {
            console.log("🔄 Network changed:", chainId);
            window.location.reload();
        });

        window.ethereum.on('disconnect', () => {
            console.log("🔌 MetaMask disconnected");
            this.disconnectMetaMask();
        });
    }

    disconnectMetaMask() {
        this.userAddress = null;
        this.isConnected = false;
        console.log("👋 Wallet disconnected");
    }
    async getChilizChainId() {
        return this.chilizChainId;
    }
    async getUserAddress() {
        return this.userAddress;
    }

    async initialize() {
        try {
            const address = await this.connectMetaMask();
           
            await this.checkChilizNetwork();
            
            console.log("🎉 Web3 initialization completed successfully");
            return address;

        } catch (error) {
            console.error("💥 Web3 initialization error:", error.message);
            throw error;
        }
    }
}

export default Web3Manager;