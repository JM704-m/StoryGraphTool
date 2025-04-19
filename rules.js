class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        this.key = key;
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body);

        // Initialize the items array if it's not already defined
        if (!this.engine.items) this.engine.items = [];

        // Give item if available and not already obtained
        let gaveItem = false;
        if (locationData.GivesItem && !this.engine.items.includes(locationData.GivesItem)) {
            this.engine.items.push(locationData.GivesItem);
            this.engine.show(`You obtained: ${locationData.GivesItem}`);
            gaveItem = true;
        }

        const validChoices = [];
        if (locationData.Choices && locationData.Choices.length > 0) {
            for (let choice of locationData.Choices) {
                if (!choice.RequiredItem || this.engine.items.includes(choice.RequiredItem)) {
                    validChoices.push(choice);
                }
            }
        }

        // Explicitly ensure the "Back to Central Hub" option after taking Safe Key or opening the Safe
        if (["Observation Room (Key)", "Storage Room (Safe)"].includes(key)) {
            if (!validChoices.some(c => c.Target === "Central Hub")) {
                validChoices.push({ Text: "Back to Central Hub", Target: "Central Hub" });
            }
        }

        if (validChoices.length > 0) {
            for (let choice of validChoices) {
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.");
        }
    }

    handleChoice(choice) {
        if (choice && choice.Target) {
            this.engine.show(`&gt; ${choice.Text}`);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

const SceneClasses = {};
Engine.items = [];
Engine.load(Start, 'myStory.json');
