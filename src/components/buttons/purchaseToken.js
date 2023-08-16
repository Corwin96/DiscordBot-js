require("dotenv").config();
const Web3 = require("web3");
const Contract = require("web3-eth-contract");
const { Transaction } = require("@ethereumjs/tx");
const { Common, CustomChain } = require("@ethereumjs/common");
const ABI = require("../../components/contract/ABI.json");
const User = require("../../schemas/user");

const { walletPk, alchemyKey, publicKey, contractAddress } = process.env;
const web3 = new Web3(alchemyKey);

module.exports = {
  data: {
    name: `purchaseToken`,
  },
  async execute(interaction, client) {
    let userProfile = await User.findOne({ userID: interaction.user.id });
    if (userProfile.xp < 50_000) {
      await interaction.reply({
        content: `You don't have enough xp for a Titan token!`,
      });
      return;
    }
    await interaction.reply({
      content: `${interaction.user}, await intructions in DM`,
      ephemeral: true,
    });

    const msg = await interaction.user.send({
      content: `Hi, please answer to this message with your public key, the token will be sent here. You have 60 seconds to respond.`,
    });

    const filter = (response) => response.content.startsWith("0x");

    const collected = await msg.channel
      .awaitMessages({ filter, max: 1, time: 60_000, errors: ["time"] })
      .catch(() => {
        interaction.user.send(
          "Timed out, please try again. Note that only Ethereum addresses will be accepted."
        );
        return;
      });

    if (web3.utils.isAddress(collected.first().content)) {
      const contract = new Contract(ABI, contractAddress);
      const toAddress = collected.first().content;
      const txData = contract.methods.transfer(toAddress, BigInt(10 ** 18)).encodeABI();
      const txCount = await web3.eth.getTransactionCount(publicKey);
      const common = Common.custom(CustomChain.Polygon);

      const txObject = {
        nonce: web3.utils.toHex(txCount),
        to: contractAddress,
        gasLimit: 210000,
        gasPrice: 1000000000,
        data: txData,
      };

      const tx = Transaction.fromTxData(txObject, { common });
      const signedTx = tx.sign(Buffer.from(walletPk, "hex"));
      const serializedTx = signedTx.serialize();

      const raw = "0x" + serializedTx.toString("hex");
      await interaction.user.send({
        content: `Transaction in progress, it might take a while to complete.`,
      });
      try {
        const finalTx = await web3.eth.sendSignedTransaction(raw);
        client.decreaseXp(userProfile, 50_000);
        await interaction.user.send({
          content: `You just purchased a Titan token on address ${
            collected.first().content
          }, you can find the transaction at the hash https://polygonscan.com/tx/${finalTx.transactionHash}!`,
        });
      } catch {
        await interaction.user.send({
          content: `Something went wrong when sending the transaction, please contact an administrator`,
        });
        return;
      }
    } else {
      await interaction.user.send({
        content: `You did not send a valid Ethereum address, please check again.`,
      });
      return;
    }
  },
};
