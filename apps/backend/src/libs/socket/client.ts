class SocketClient  {
    private constructor() {
        console.log('SocketClient created');
    }

    static getClient()  {
        return new SocketClient();
    }    
}