export const renderVoteQuery = (type: "upvote" | "downvote", state: "upvote" | "downvote" | "-"): string => {
    let voteQuery = "";
    if (type === state) {
        if (state === "upvote") {
            voteQuery = "up_vote-1"
        } else {
            voteQuery = "up_vote+1"
        }
    } else if (state === "-" && type === "upvote") {
        voteQuery = "up_vote + 1";
    } else if (state === "-" && type === "downvote") {
        voteQuery = "up_vote - 1";
    } else if (state === "downvote" && type === "upvote") {
        voteQuery = "up_vote + 2";
    } else {
        voteQuery = "up_vote - 2";
    }

    return voteQuery;
}