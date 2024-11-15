class PlayerData {
    constructor(nickname, location) {
        this.nickname = nickname;
        this.location = location;
    }
}

export class PlayersData {
    constructor() {
        if (PlayersData.instance) {
            return PlayersData.instance;
        }

        PlayersData.instance = this;
        this.playersData = [];
    }

    registerPlayerData(player) {
        let playerData = new PlayerData(player.name, player.location);
        this.playersData.push(playerData);
    }

    getPlayerData(nickname) {
        return this.playersData.find(data => data.nickname === nickname);
    }
}