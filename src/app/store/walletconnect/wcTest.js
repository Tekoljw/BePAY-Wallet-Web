import { Core } from "@walletconnect/core";
import { Web3Wallet } from "@walletconnect/web3wallet";
import { getSdkError } from "@walletconnect/utils";
const acceptSession = async () => {
    const core = new Core({
        projectId: "035cb2d52902323e520070380ba2aa82",
    });
    const web3wallet =
        await Web3Wallet.init({
            core, // <- pass the shared `core` instance
            metadata: {
                name: "Demo app",
                description: "Demo Client as Wallet/Peer",
                url: "www.walletconnect.com",
                icons: [],
            },
        });
    // 配对实例
    const { topic, uri } = await web3wallet.core.pairing.create();
    await web3wallet.core.pairing.pair({ uri });
    // 批准会话
    web3wallet.on("session_proposal", async (proposal) => {
        // console.log('now session_proposal')
        const session = await web3wallet.approveSession({
            id: proposal.id,
            namespaces,
        });
        // 更新会话
        // await web3wallet.updateSession({ topic, namespaces:'Demo app'});
    });


    // // 发出会话
    // await web3wallet.emitSessionEvent({
    //     topic,
    //     event: {
    //       name: "accountsChanged",
    //       data: ["0xab16a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb"],
    //     },
    //     chainId: "eip155:1",
    //   });

    //响应会话
    web3wallet.on("session_request", async (event) => {
        // console.log('now Request')
        // await web3wallet.core.pairing.ping({ topic: "1b3eda3f4..." })
        // 通过提供配对主题激情活动先创建的配对（例如，在对等方配对后）
        await web3wallet.core.pairing.activate({ topic: "1b3eda3f4..." })

        const { topic, params, id } = event;
        const { request } = params;
        const requestParamsMessage = request.params[0];
        // convert `requestParamsMessage` by using a method like hexToUtf8
        const message = hexToUtf8(requestParamsMessage);
        // sign the message
        const signedMessage = await wallet.signMessage(message);
        const response = { id, result: signedMessage, jsonrpc: "2.0" };
        await web3wallet.respondSessionRequest({ topic, response });
    });
    return {
        uri,topic
    }
}
const requestSession = async () => {
    web3wallet.on("session_request", async (event) => {
        const { topic, params, id } = event;
        const { request } = params;
        const requestParamsMessage = request.params[0];
        // convert `requestParamsMessage` by using a method like hexToUtf8
        const message = hexToUtf8(requestParamsMessage);
        // sign the message
        const signedMessage = await wallet.signMessage(message);
        const response = { id, result: signedMessage, jsonrpc: "2.0" };
        await web3wallet.respondSessionRequest({ topic, response });
    });
}
export default {
    acceptSession,
    requestSession
}