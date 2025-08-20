document.addEventListener('DOMContentLoaded', () => {

    // --- Login/Signup Modal & User State Logic ---
    const authModal = document.getElementById('auth-modal');
    const closeAuthModalBtn = document.getElementById('close-auth-modal');
    const authButtonsContainer = document.getElementById('auth-buttons');
    const loginFormContainer = document.getElementById('login-form-container');
    const signupFormContainer = document.getElementById('signup-form-container');
    const showLoginBtn = document.getElementById('show-login');
    const showSignupBtn = document.getElementById('show-signup');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // Simulate user state with localStorage
    const user = JSON.parse(localStorage.getItem('currentUser')) || { isLoggedIn: false, email: null, code: null };
    const appkey = 'c0171b97c195403b8ad2b33900b84f85';

    // Function to initialize AppVirality SDK
    function initializeAppVirality(userEmail, referralCode = null) {
        console.log("Initializing AppVirality with:", { email: userEmail, code: referralCode });

        appvirality.init(appkey, {
            email: userEmail,
            code: referralCode,
            name: userEmail.split('@')[0], // Use email prefix as name
        }, function (err, data) {
            if (err) {
                console.error("AppVirality Init error:", err);
                return;
            }

            console.log("AppVirality Init success:", data);

            // Display user's referral code on screen
            if (data.referralcode) {
                displayReferralCode(data.referralcode);
            }

            // Get and display referrer details
            if (data.hasreferrer === 'true') {
                getAndDisplayReferrerDetails(userEmail);
            }

            // Store user data
            user.userkey = data.userkey;
            user.referralcode = data.referralcode;
            user.shareurl = data.shareurl;
            localStorage.setItem('currentUser', JSON.stringify(user));
        });
    }

    // Function to display referral code on screen
    function displayReferralCode(referralCode) {
        // Create or update referral code display section
        let referralDisplay = document.getElementById('referral-code-display');
        if (!referralDisplay) {
            referralDisplay = document.createElement('div');
            referralDisplay.id = 'referral-code-display';
            referralDisplay.className = 'mt-8 p-6 bg-green-50 border border-green-200 rounded-lg text-center';
            document.querySelector('main').insertBefore(referralDisplay, document.querySelector('main').firstChild);
        }

        referralDisplay.innerHTML = `
            <h3 class="text-xl font-bold text-green-800 mb-2">🎉 Welcome! Your Referral Code</h3>
            <div class="bg-white p-4 rounded-lg border-2 border-green-300 mb-4">
                <span class="text-2xl font-mono font-bold text-green-600">${referralCode}</span>
            </div>
            <p class="text-green-700 mb-4">Share this code with friends and earn rewards!</p>
            <button onclick="navigator.clipboard.writeText('${referralCode}')" 
                    class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300">
                📋 Copy Code
            </button>
        `;
    }

    // Function to get and display referrer details
    function getAndDisplayReferrerDetails(userEmail) {
        appvirality.getReferrer(appkey, null, userEmail, null, function (err, data) {
            if (!err && data && data.referrername) {
                displayReferrerInfo(data);
            } else {
                console.log("No referrer data found or error occurred:", err);
            }
        });
    }

    // Function to display referrer information
    function displayReferrerInfo(referrerData) {
        let referrerDisplay = document.getElementById('referrer-info-display');
        if (!referrerDisplay) {
            referrerDisplay = document.createElement('div');
            referrerDisplay.id = 'referrer-info-display';
            referrerDisplay.className = 'mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg text-center';
            document.querySelector('main').insertBefore(referrerDisplay, document.querySelector('main').firstChild);
        }

        referrerDisplay.innerHTML = `
            <h3 class="text-xl font-bold text-blue-800 mb-2">👋 You were referred by</h3>
            <div class="flex items-center justify-center space-x-4 mb-4">
                ${referrerData.profileimage ?
                `<img src="${referrerData.profileimage}" alt="Referrer" class="w-12 h-12 rounded-full">` :
                '<div class="w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center text-blue-600 font-bold">' +
                referrerData.referrername.charAt(0).toUpperCase() + '</div>'
            }
                <div>
                    <p class="text-lg font-semibold text-blue-700">${referrerData.referrername}</p>
                    <p class="text-sm text-blue-600">Referral Code: ${referrerData.referrercode}</p>
                </div>
            </div>
            ${referrerData.friendreward ?
                `<p class="text-blue-700">🎁 Your reward: ${referrerData.friendreward}${referrerData.friendrewardunit} for ${referrerData.friendrewardfrequency}</p>` :
                ''
            }
        `;
    }

    // Initialize AppVirality for existing logged-in user
    if (user.isLoggedIn && user.email) {
        initializeAppVirality(user.email, user.code);
    }

    // Call the AppVirality SDK to get the referrer code from the cookie (for new users)
    appvirality.getReferrerCode(appkey, function (err, data) {
        console.log("Fetching referrer code from cookie...");
        console.log("Referrer code data:", data);

        if (!err && data && data['referralcode']) {
            const refcodeInput = document.getElementById('refcode-input');
            if (refcodeInput) {
                refcodeInput.value = data['referralcode'];
                console.log("Auto-filled referral code:", data['referralcode']);
            }
        } else {
            console.log("No referral code found in cookie or error:", err);
        }
    });

    // Function to update the navbar based on login status
    function updateAuthButtons() {
        authButtonsContainer.innerHTML = '';
        if (user.isLoggedIn) {
            const userGreeting = document.createElement('span');
            userGreeting.className = 'text-gray-600 font-medium hidden md:inline-block p-2';
            userGreeting.textContent = `Hello, ${user.email.split('@')[0]}!`;

            const logoutBtn = document.createElement('button');
            logoutBtn.id = 'logout-btn';
            logoutBtn.className = 'bg-red-500 text-white px-5 py-2 rounded-full font-medium hover:bg-red-600 transition duration-300 shadow-md';
            logoutBtn.textContent = 'Logout';

            authButtonsContainer.appendChild(userGreeting);
            authButtonsContainer.appendChild(logoutBtn);

            logoutBtn.addEventListener('click', () => {
                // Call AppVirality logout
                appvirality.logout();

                user.isLoggedIn = false;
                user.email = null;
                user.code = null;
                user.userkey = null;
                user.referralcode = null;
                user.shareurl = null;
                localStorage.removeItem('currentUser');

                // Remove referral displays
                const referralDisplay = document.getElementById('referral-code-display');
                const referrerDisplay = document.getElementById('referrer-info-display');
                if (referralDisplay) referralDisplay.remove();
                if (referrerDisplay) referrerDisplay.remove();

                updateAuthButtons();
            });
        } else {
            const loginBtn = document.createElement('button');
            loginBtn.id = 'open-auth-modal';
            loginBtn.className = 'bg-indigo-600 text-white px-5 py-2 rounded-full font-medium hover:bg-indigo-700 transition duration-300 shadow-md';
            loginBtn.textContent = 'Login / Signup';

            authButtonsContainer.appendChild(loginBtn);

            loginBtn.addEventListener('click', () => {
                authModal.classList.remove('hidden');
                authModal.querySelector('div').classList.add('modal-fade-in');
            });
        }
    }

    // Initial call to set up the buttons
    updateAuthButtons();

    // Close modal button listener
    closeAuthModalBtn.addEventListener('click', () => {
        authModal.querySelector('div').classList.remove('modal-fade-in');
        authModal.querySelector('div').classList.add('modal-fade-out');
        setTimeout(() => {
            authModal.classList.add('hidden');
            authModal.querySelector('div').classList.remove('modal-fade-out');
        }, 300);
    });

    // Toggle between login and signup forms
    showSignupBtn.addEventListener('click', () => {
        loginFormContainer.classList.add('hidden');
        signupFormContainer.classList.remove('hidden');
    });

    showLoginBtn.addEventListener('click', () => {
        signupFormContainer.classList.add('hidden');
        loginFormContainer.classList.remove('hidden');
    });

    // Handle Signup Form Submission
    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = event.target.elements['signup-email'].value;
        const password = event.target.elements['signup-password'].value;
        const refcode = event.target.elements['refcode-input'].value;

        // Simple check for demonstration
        if (email && password) {
            // Simulate successful signup and immediate login
            user.isLoggedIn = true;
            user.email = email;
            user.code = refcode;
            localStorage.setItem('currentUser', JSON.stringify(user));

            // Close the modal and update UI
            closeAuthModalBtn.click();
            updateAuthButtons();

            // Reset the form
            signupForm.reset();

            console.log(`User signed up and logged in: ${email}`);
            console.log(`Referral code used: ${refcode}`);

            // Initialize AppVirality after successful signup
            initializeAppVirality(email, refcode);

        } else {
            console.error('Signup failed: Please fill in all fields.');
        }
    });

    // Handle Login Form Submission
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = event.target.elements['login-email'].value;
        const password = event.target.elements['login-password'].value;

        // Simple check for demonstration
        if (email && password) {
            // Simulate successful login
            user.isLoggedIn = true;
            user.email = email;
            localStorage.setItem('currentUser', JSON.stringify(user));

            // Close the modal and update UI
            closeAuthModalBtn.click();
            updateAuthButtons();

            // Reset the form
            loginForm.reset();

            console.log(`User logged in: ${email}`);

            // Initialize AppVirality after successful login
            initializeAppVirality(email, user.code);

        } else {
            console.error('Login failed: Invalid credentials.');
        }
    });

    // Close modal when clicking outside
    authModal.addEventListener('click', (event) => {
        if (event.target === authModal) {
            closeAuthModalBtn.click();
        }
    });
});