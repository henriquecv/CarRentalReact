class User {
    constructor(id, nickname, name, lastname, hash) {
        if (id)
            this.id = id;

        this.nickname = nickname;
        this.name = name;
        this.lastname = lastname;
        this.hash = hash;
    }
}

module.exports = User;