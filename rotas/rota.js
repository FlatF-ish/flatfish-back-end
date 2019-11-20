//TO-DO
// Create a way for rotas to be written to the database
    // Create an endpoint to access speecific information    
    // Keep track of who's turn it is to buy toilet paper next
    // Keep track of who's turn it is to buy kitchen paper next
    // Keep track of the current week
    // Allow 1 user to send a message to trigger notification for another user

// More to add - but I'm a sleeepy boi


// Create an endpoint to update a rota
function updateRota() {

}


// Make a way to update who's turn it is to do something
function updateTurn() {

}

// Make a way to say that you have completed your job
function taskComplete() {

}

// Allow users to say that they have done it or ask to be reminded later
function weeklyOverviewOfTasks() {

}

// Create a way to send a notification to someone who's turn it will be the next day
function notifyForTomorrow() {

}

// Remind someone on the day that it is their go to do something
function notifyForToday() {

}

// 24 hourly poll of DB
// Work out who needs notified
// Notify the appropriate people at given time
function notifyOfTask() {

    notifyForTomorrow();
    notifyForToday();

    // if day is sunday do this
    weeklyOverviewOfTasks();
    
}