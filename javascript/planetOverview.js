// ZODIAC CARD SLIDER

let currentCardIndex = 0;

const waterSigns = ["Cancer", "Scorpio", "Pisces"];

let waterParticipants = [];

for (let participant of participants) {
    if (waterSigns.includes(participant.sign)) {
        waterParticipants.push(participant);
    }
}

const cardsContainer = document.querySelector("#zodiacCardsContainer");
const previousButton = document.querySelector("#previousCardButton");
const nextButton = document.querySelector("#nextCardButton");

function renderZodiacCard() {

    const participant = waterParticipants[currentCardIndex];

    cardsContainer.innerHTML = `
        <div class="zodiacCard">

            <img 
                class="zodiacCardImage" 
                src="${participant.profilePic}" 
                alt="${participant.sign}"
            >

            <div class="zodiacCardInfo">
                <h3>${participant.sign}</h3>
                <p>${participant.name}</p>
            </div>

        </div>
    `;

}

nextButton.addEventListener("click", function () {

    currentCardIndex++;

    if (currentCardIndex >= waterParticipants.length) {
        currentCardIndex = 0;
    }

    renderZodiacCard();

});

previousButton.addEventListener("click", function () {

    currentCardIndex--;

    if (currentCardIndex < 0) {
        currentCardIndex = waterParticipants.length - 1;
    }

    renderZodiacCard();

});

renderZodiacCard();



// FILTERS

let currentSeason = "All";
let currentGame = "All";

const seasonButtons = document.querySelectorAll("#seasonFilters .filterButton");
const gameButtons = document.querySelectorAll("#gameFilters .filterButton");

function updateActiveButton(buttons, clickedButton) {

    for (let button of buttons) {
        button.classList.remove("activeFilter");
    }

    clickedButton.classList.add("activeFilter");

}


// Season filters

for (let button of seasonButtons) {

    button.addEventListener("click", function () {

        currentSeason = button.textContent.trim();

        updateActiveButton(seasonButtons, button);

        console.log("Current season:", currentSeason);
        console.log("Current game:", currentGame);

        renderLeaderboardGraph();

    });

}


// Game filters

for (let button of gameButtons) {

    button.addEventListener("click", function () {

        currentGame = button.textContent.trim();

        updateActiveButton(gameButtons, button);

        console.log("Current season:", currentSeason);
        console.log("Current game:", currentGame);

        renderLeaderboardGraph();

    });

}



// LEADERBOARD DATA

function getDisciplineIdFromGameName(gameName) {

    if (gameName === "All") {
        return "All";
    }

    for (let discipline of disciplines) {

        if (discipline.name === gameName) {
            return discipline.id;
        }

    }

    return "All";

}


function getParticipantById(participantId) {

    for (let participant of participants) {

        if (participant.id === participantId) {
            return participant;
        }

    }

    return null;

}


function buildLeaderboardData() {

    let leaderboard = [];

    let selectedDisciplineId = getDisciplineIdFromGameName(currentGame);


    // Loop through first 3 seasons

    for (let i = 0; i < 3; i++) {

        let season = seasons[i];

        let seasonName = "Season " + (i + 1);


        // Season filter

        if (currentSeason !== "All" && currentSeason !== seasonName) {
            continue;
        }


        // Competition days

        for (let competitionDay of season.competitionDays) {


            // Events / games

            for (let event of competitionDay.events) {


                // Game filter

                if (
                    selectedDisciplineId !== "All" &&
                    event.disciplineId !== selectedDisciplineId
                ) {
                    continue;
                }


                // Scores

                for (let scoreObject of event.scores) {

                    let participant = getParticipantById(scoreObject.participantId);


                    // If participant doesn't exist

                    if (participant === null) {
                        continue;
                    }


                    // Check if participant already exists

                    let existingParticipant = null;

                    for (let item of leaderboard) {

                        if (item.id === participant.id) {
                            existingParticipant = item;
                        }

                    }


                    // Create new participant

                    if (existingParticipant === null) {

                        leaderboard.push({
                            id: participant.id,
                            name: participant.name,
                            sign: participant.sign,
                            profilePic: participant.profilePic,
                            totalScore: scoreObject.score
                        });

                    }


                    // Add score to existing participant

                    else {

                        existingParticipant.totalScore += scoreObject.score;

                    }

                }

            }

        }

    }


    // Sort highest score first

    leaderboard.sort(function (a, b) {
        return b.totalScore - a.totalScore;
    });


    // Only show top 6

    let topSix = leaderboard.slice(0, 6);


    console.log("Top 6 leaderboard:", topSix);

    return topSix;

}



// D3 LEADERBOARD GRAPH

function renderLeaderboardGraph() {

    let data = buildLeaderboardData();

    let svg = d3.select("#leaderboardGraph");

    let width = 700;
    let height = 700;

    svg
        .attr("width", width)
        .attr("height", height);

    svg.selectAll("*").remove();

    let centerX = width / 2;
    let centerY = height / 2;

    let positions = [
        { x: centerX, y: centerY - 80 },
        { x: centerX + 130, y: centerY - 40 },
        { x: centerX - 130, y: centerY - 40 },
        { x: centerX + 170, y: centerY + 120 },
        { x: centerX - 170, y: centerY + 120 },
        { x: centerX, y: centerY + 190 }
    ];

    svg.append("circle")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", 55)
        .attr("fill", "rgba(86, 213, 255, 0.35)")
        .attr("stroke", "#56d5ff")
        .attr("stroke-width", 2);

    for (let i = 0; i < data.length; i++) {

        let participant = data[i];
        let position = positions[i];

        svg.append("image")
            .attr("href", participant.profilePic)
            .attr("x", position.x - 35)
            .attr("y", position.y - 35)
            .attr("width", 70)
            .attr("height", 70);

    }

}


renderLeaderboardGraph();