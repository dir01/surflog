import firebaseRepository from "./FirebaseRepository";

class Repository {
    constructor(implementation) {
        this.imp = implementation
    }

    async writeTodaySurfSessions(sessions) {
        return await this.imp.writeTodaySurfSessions(sessions)
    }

    async getTodaySurfSessions() {
        return await this.imp.getTodaySurfSessions()
    }

    async writeSuggestItems(suggestItems) {
        return await this.imp.writeSuggestItems(suggestItems)
    }

    async loadSuggestItems() {
        return await this.imp.loadSuggestItems()
    }
}


const repository = new Repository(firebaseRepository);
export default repository;
