function generateIndividualPreferences(n, populationSize) {
    const alternatives = Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i)); // Generate alternatives A, B, C, ...
    const individualPreferences = {};
    
    for (let i = 0; i < populationSize; i++) {
        const preferences = shuffle([...alternatives]); // Randomize preferences
        individualPreferences[`Individual${i + 1}`] = preferences;
    }
    
    return individualPreferences;
}

// Shuffle function to randomize preferences
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


// Plurality voting aggregation function
function pluralityVoting(preferences) {
    const voteCounts = {};
    preferences.forEach(preference => {
        const firstChoice = preference[0];
        voteCounts[firstChoice] = (voteCounts[firstChoice] || 0) + 1;
    });
    return Object.keys(voteCounts).reduce((a, b) => voteCounts[a] > voteCounts[b] ? a : b);
}

function rankedChoiceVoting(preferences) {
    let remainingCandidates = new Set(preferences.flat());
    let round = 0;
    
    while (remainingCandidates.size > 1) {
        round++;
        let voteCounts = {};
        
        // Count first-choice votes
        preferences.forEach(preference => {
            const firstChoice = preference.find(candidate => remainingCandidates.has(candidate));
            if (firstChoice) {
                voteCounts[firstChoice] = (voteCounts[firstChoice] || 0) + 1;
            }
        });
        
        // Find candidate with majority
        const candidates = Array.from(remainingCandidates);
        const majorityCandidate = candidates.find(candidate => voteCounts[candidate] > preferences.length / 2);
        
        if (majorityCandidate) {
            return majorityCandidate;
        }
        
        // Eliminate candidate with fewest votes
        const minVotes = Math.min(...candidates.map(candidate => voteCounts[candidate] || 0));
        const candidatesWithMinVotes = candidates.filter(candidate => (voteCounts[candidate] || 0) === minVotes);
        candidatesWithMinVotes.forEach(candidate => remainingCandidates.delete(candidate));
    }
    
    return Array.from(remainingCandidates)[0];
}

function bordaCount(preferences) {
    const points = {};
    preferences.forEach(preference => {
        preference.forEach((candidate, index) => {
            points[candidate] = (points[candidate] || 0) + (preferences.length - index - 1);
        });
    });
    return Object.keys(points).reduce((a, b) => points[a] > points[b] ? a : b);
}

function approvalVoting(preferences) {
    const voteCounts = {};
    preferences.forEach(preference => {
        preference.forEach(candidate => {
            voteCounts[candidate] = (voteCounts[candidate] || 0) + 1;
        });
    });
    return Object.keys(voteCounts).reduce((a, b) => voteCounts[a] > voteCounts[b] ? a : b);
}

function rangeVoting(preferences) {
    const scores = {};
    preferences.forEach(preference => {
        preference.forEach(({ candidate, score }) => {
            scores[candidate] = (scores[candidate] || 0) + score;
        });
    });
    return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
}

function condorcetMethod(preferences) {
    const candidates = new Set(preferences.flat());
    for (const candidateA of candidates) {
        for (const candidateB of candidates) {
            if (candidateA !== candidateB) {
                const winsA = preferences.filter(preference =>
                    preference.indexOf(candidateA) < preference.indexOf(candidateB)
                ).length;
                if (winsA > preferences.length / 2) {
                    return candidateA;
                }
            }
        }
    }
    return null; // No Condorcet winner
}

// Detect cycling
function detectCycling(preferences, votingSystem) {
    const candidates = new Set(preferences.flat());
    
    for (const candidateA of candidates) {
        for (const candidateB of candidates) {
            if (candidateA !== candidateB) {
                const winsA = preferences.filter(preference =>
                    preference.indexOf(candidateA) < preference.indexOf(candidateB)
                ).length;
                const winsB = preferences.filter(preference =>
                    preference.indexOf(candidateB) < preference.indexOf(candidateA)
                ).length;
                
                if (winsA === winsB) {
                    // No clear preference between candidateA and candidateB
                    const cycle = findCycle(candidateA, candidateB, preferences, votingSystem);
                    if (cycle) {
                        return cycle;
                    }
                }
            }
        }
    }
    return null; // No cycling detected
}

function findCycle(start, current, preferences, votingSystem, visited = new Set()) {
    if (visited.has(current)) {
        return [current];
    }
    
    visited.add(current);
    
    for (const candidate of getOpponents(current, preferences)) {
        const result = votingSystem(preferences.concat([[start, candidate]]));
        if (result === current) {
            return [current, start];
        }
        const cycle = findCycle(start, result, preferences, votingSystem, visited);
        if (cycle) {
            return cycle;
        }
    }
    
    visited.delete(current);
    return null;
}

function getOpponents(candidate, preferences) {
    const opponents = new Set();
    preferences.forEach(preference => {
        const index = preference.indexOf(candidate);
        if (index > -1) {
            opponents.add(preference[index === 0 ? 1 : 0]);
        }
    });
    return Array.from(opponents);
}

// Social welfare function (simplified)
function socialWelfareFunction(preferences, choice) {
    if (choice == 1){
        return pluralityVoting(preferences);
    }
    else if (choice == 2){
        return rankedChoiceVoting(preferences);
    }
    else if (choice == 3){
        return bordaCount(preferences);
    }
    else if (choice == 4){
        return approvalVoting(preferences);
    }
    else if (choice == 5){
        return rangeVoting(preference);
    }
    else if (choice == 6){
        return condorcetMethod(prefences);
    }
}

// Check desirable criteria
function isDictatorship(preferences, votingSystem) {
    const candidates = new Set(preferences.flat());
    for (const candidate of candidates) {
        const otherCandidates = Array.from(candidates).filter(c => c !== candidate);
        const modifiedPreferences = preferences.map(preference => {
            if (preference.includes(candidate)) {
                return preference.filter(c => c === candidate); // Keep only the candidate's preference
            }
            return preference.concat(otherCandidates); // Add other candidates after candidate's preference
        });
        const collectivePreference = votingSystem(modifiedPreferences);
        if (collectivePreference !== candidate) {
            return false; // Found a candidate who is not a dictator
        }
    }
    return true; // No dictator found
}


function isParetoEfficient(preferences, votingSystem) {
    const candidates = new Set(preferences.flat());
    for (const candidateA of candidates) {
        for (const candidateB of candidates) {
            if (candidateA !== candidateB) {
                const allPreferAtoB = preferences.every(preference =>
                    preference.indexOf(candidateA) < preference.indexOf(candidateB)
                );
                if (allPreferAtoB) {
                    const collectivePreference = votingSystem(preferences);
                    if (collectivePreference !== candidateA) {
                        return false; // Pareto efficiency violated
                    }
                }
            }
        }
    }
    return true; // Pareto efficiency satisfied
}

// Other desirable criteria functions...

// Example usage
const collectivePreference = socialWelfareFunction(Object.values(individualPreferences));
console.log("Collective preference:", collectivePreference);

// Check desirable criteria
if (satisfiesNonDictatorship(Object.values(individualPreferences))) {
    console.log("The voting system satisfies non-dictatorship.");
} else {
    console.log("The voting system does not satisfy non-dictatorship.");
}
