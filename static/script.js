// document.addEventListener('DOMContentLoaded', function() {
//     const form = document.querySelector('form');

//     form.addEventListener('submit', function(event) {
//         const name = document.getElementById('name').value.trim();
//         const email = document.getElementById('email').value.trim();
//         let allTeamsEntered = true;
//         const teams = [];
//         for (let i = 1; i <= 20; i++) {
//             const teamInput = document.getElementById(`team${i}`);
//             if (!teamInput.value.trim()) {
//                 allTeamsEntered = false;
//                 break;
//             }
//             teams.push(teamInput.value.trim());
//         }

//         if (!name || !email) {
//             alert('Please enter your name and email address.');
//             event.preventDefault(); // Stop form submission
//             return;
//         }

//         if (!allTeamsEntered) {
//             alert('Please enter all 20 football teams.');
//             event.preventDefault(); // Stop form submission
//             return;
//         }

//         // Basic email format validation
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             alert('Please enter a valid email address.');
//             event.preventDefault();
//             return;
//         }

//         // Optional: Check for duplicate team entries (client-side)
//         const uniqueTeams = new Set(teams);
//         if (uniqueTeams.size !== 20) {
//             alert('Please ensure all 20 team entries are unique.');
//             event.preventDefault();
//             return;
//         }

//         // If all checks pass, the form will submit
//     });
// });

//2

// document.addEventListener('DOMContentLoaded', function() {
//     const form = document.getElementById('predictionForm');
//     const teamListElement = document.getElementById('teamList');

//     // --- Predefined Football Teams ---
//     // In a real app, you might fetch these from your Flask backend.
//     let currentTeamsOrder = [
//         "Manchester City", "Arsenal", "Liverpool", "Aston Villa",
//         "Tottenham Hotspur", "Chelsea", "Newcastle United", "Manchester United",
//         "West Ham United", "Brighton & Hove Albion", "Wolverhampton Wanderers",
//         "AFC Bournemouth", "Fulham", "Crystal Palace", "Brentford",
//         "Everton", "Nottingham Forest", "Luton Town", "Burnley", "Sheffield United"
//     ].sort(); // Sort alphabetically initially for a consistent starting point

//     // --- Helper Functions ---

//     function renderTeamList() {
//         teamListElement.innerHTML = ''; // Clear current list
//         currentTeamsOrder.forEach((teamName, index) => {
//             const listItem = document.createElement('li');
//             listItem.dataset.id = teamName; // Store original team name as a unique ID for Sortable.js
//             listItem.innerHTML = `
//                 <span class="rank">${index + 1}.</span>
//                 <span class="team-name">${teamName}</span>
//             `;
//             teamListElement.appendChild(listItem);
//         });
//         updateHiddenInputs(); // Update hidden fields every time the list is rendered/reordered
//     }

//     function updateHiddenInputs() {
//         // Get the current order of teams from Sortable.js's underlying data
//         // Sortable.js stores the 'data-id' attribute in the `toArray()` method
//         const orderedTeamNames = Sortable.get(teamListElement).toArray();

//         // Populate the hidden input fields for Flask
//         for (let i = 0; i < 20; i++) {
//             const hiddenInput = document.getElementById(`hiddenTeam${i + 1}`);
//             if (hiddenInput) {
//                 hiddenInput.value = orderedTeamNames[i] || ''; // Assign value or empty string
//             }
//         }
//     }

//     // --- Initialize Sortable.js ---
//     const sortable = Sortable.create(teamListElement, {
//         animation: 150, // ms, animation speed moving items when sorting, `0` — no animation.
//         ghostClass: 'sortable-ghost', // Class name for the drop placeholder
//         chosenClass: 'sortable-chosen', // Class name for the chosen item
//         dragClass: 'sortable-drag',   // Class name for the dragging item

//         // Event called when the sorting is completed
//         onEnd: function (evt) {
//             // Update our JavaScript array based on the new DOM order
//             currentTeamsOrder = sortable.toArray();
//             renderTeamList(); // Re-render to update the visible rank numbers
//         },
//     });

//     // --- Initial Render ---
//     renderTeamList();

//     // --- Form Submission Handler ---
//     form.addEventListener('submit', function(event) {
//         const name = document.getElementById('name').value.trim();
//         const email = document.getElementById('email').value.trim();

//         // Client-side validation
//         if (!name || !email) {
//             alert('Please enter your name and email address.');
//             event.preventDefault();
//             return;
//         }

//         // Basic email format validation
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             alert('Please enter a valid email address.');
//             event.preventDefault();
//             return;
//         }

//         // Since the list starts with 20 teams and we're just reordering,
//         // we can assume `currentTeamsOrder` always has 20 unique teams from the start.
//         // If you allowed adding/removing, you'd re-validate length and uniqueness here.
//         if (currentTeamsOrder.length !== 20) {
//              alert('Internal error: Expected 20 teams, but found ' + currentTeamsOrder.length + '.');
//              event.preventDefault();
//              return;
//         }

//         // Ensure hidden inputs are updated with the final order before submission
//         updateHiddenInputs();

//         // Flask will perform its own crucial server-side validation upon receiving the data.
//     });
// });

//3

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('predictionForm');
    const teamListElement = document.getElementById('teamList');
    const submitBtn = document.getElementById('submitBtn');

    // --- Predefined Football Teams ---
    let currentTeamsOrder = [
        "Manchester City", "Arsenal", "Liverpool", "Aston Villa",
        "Tottenham Hotspur", "Chelsea", "Newcastle United", "Manchester United",
        "West Ham United", "Brighton & Hove Albion", "Wolverhampton Wanderers",
        "AFC Bournemouth", "Fulham", "Crystal Palace", "Brentford",
        "Everton", "Nottingham Forest", "Luton Town", "Burnley", "Sheffield United"
    ].sort(); // Sort alphabetically initially for a consistent starting point

    // --- Helper Functions ---

    function renderTeamList() {
        teamListElement.innerHTML = ''; // Clear current list
        currentTeamsOrder.forEach((teamName, index) => {
            const listItem = document.createElement('li');
            listItem.dataset.id = teamName; // Store original team name as a unique ID for Sortable.js
            listItem.innerHTML = `
                <span class="rank">${index + 1}.</span>
                <span class="team-name">${teamName}</span>
            `;
            teamListElement.appendChild(listItem);
        });
        updateHiddenInputs(); // Update hidden fields every time the list is rendered/reordered
    }

    function updateHiddenInputs() {
        // Get the current order of teams from Sortable.js's underlying data
        const orderedTeamNames = Sortable.get(teamListElement).toArray();

        // Populate the hidden input fields for Flask
        for (let i = 0; i < 20; i++) {
            const hiddenInput = document.getElementById(`hiddenTeam${i + 1}`);
            if (hiddenInput) {
                hiddenInput.value = orderedTeamNames[i] || ''; // Assign value or empty string
            }
        }
    }

    function resetForm() {
        form.reset(); // Reset name and email fields
        // Re-initialize team order to default and re-render
        currentTeamsOrder = [
            "Manchester City", "Arsenal", "Liverpool", "Aston Villa",
            "Tottenham Hotspur", "Chelsea", "Newcastle United", "Manchester United",
            "West Ham United", "Brighton & Hove Albion", "Wolverhampton Wanderers",
            "AFC Bournemouth", "Fulham", "Crystal Palace", "Brentford",
            "Everton", "Nottingham Forest", "Luton Town", "Burnley", "Sheffield United"
        ].sort();
        renderTeamList();
    }


    // --- Initialize Sortable.js ---
    const sortable = Sortable.create(teamListElement, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',

        onEnd: function (evt) {
            currentTeamsOrder = sortable.toArray();
            renderTeamList();
        },
    });

    // --- Initial Render ---
    renderTeamList();

    // --- Form Submission Handler (AJAX with Fetch API) ---
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission (page reload)

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        // Perform client-side validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();

        if (!name || !email) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please enter your name and email address.'
            });
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Prediction';
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please enter a valid email address.'
            });
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Prediction';
            return;
        }

        // Teams are already handled by Sortable.js and `currentTeamsOrder`
        // We ensure 20 teams are selected (implicitly by initial setup)
        if (currentTeamsOrder.length !== 20) {
            Swal.fire({
                icon: 'error',
                title: 'Internal Error',
                text: 'Expected 20 teams, but found ' + currentTeamsOrder.length + '. Please refresh and try again.'
            });
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Prediction';
            return;
        }

        // Ensure hidden inputs are updated with the final order before submission
        updateHiddenInputs();

        // Prepare form data using FormData API
        const formData = new FormData(form);

        try {
            const response = await fetch('/submit_prediction', {
                method: 'POST',
                body: formData // FormData automatically sets content-type header
            });

            const data = await response.json(); // Parse JSON response from Flask

            if (response.ok) { // HTTP status 200-299 is considered 'ok'
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: data.message // Message from Flask backend
                });
                resetForm(); // Reset the form after successful submission
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: data.message || 'An unexpected error occurred.' // Error message from Flask backend
                });
            }
        } catch (error) {
            console.error('Network or parsing error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'Could not connect to the server. Please check your internet connection and try again.'
            });
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Prediction';
        }
    });
});