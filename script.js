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

            // Create comprehensive referral dashboard
            createReferralDashboard();
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

    // Function to create comprehensive referral dashboard
    function createReferralDashboard() {
        let dashboard = document.getElementById('referral-dashboard');
        if (!dashboard) {
            dashboard = document.createElement('div');
            dashboard.id = 'referral-dashboard';
            dashboard.className = 'mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-lg';
            document.querySelector('main').insertBefore(dashboard, document.querySelector('main').firstChild);
        }

        dashboard.innerHTML = `
            <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">🎯 Referral Dashboard</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Campaign Data -->
                <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                    <h3 class="text-lg font-semibold text-purple-800 mb-3">📊 Campaign Info</h3>
                    <div id="campaign-data" class="text-sm text-purple-700">
                        <p>Loading campaign data...</p>
                    </div>
                    <button onclick="loadCampaignData()" class="mt-3 w-full bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700">
                        Refresh Campaign
                    </button>
                </div>

                <!-- User Balance -->
                <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                    <h3 class="text-lg font-semibold text-green-800 mb-3">💰 Your Balance</h3>
                    <div id="user-balance" class="text-sm text-green-700">
                        <p>Loading balance...</p>
                    </div>
                    <button onclick="loadUserBalance()" class="mt-3 w-full bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700">
                        Refresh Balance
                    </button>
                </div>

                <!-- Friends List -->
                <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <h3 class="text-lg font-semibold text-blue-800 mb-3">👥 Your Friends</h3>
                    <div id="friends-list" class="text-sm text-blue-700">
                        <p>Loading friends...</p>
                    </div>
                    <button onclick="loadFriendsList()" class="mt-3 w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
                        Refresh Friends
                    </button>
                </div>

                <!-- Terms & Conditions -->
                <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                    <h3 class="text-lg font-semibold text-yellow-800 mb-3">📋 Terms & Conditions</h3>
                    <div id="terms-data" class="text-sm text-yellow-700 max-h-32 overflow-y-auto">
                        <p>Loading terms...</p>
                    </div>
                    <button onclick="loadTerms()" class="mt-3 w-full bg-yellow-600 text-white px-3 py-2 rounded text-sm hover:bg-yellow-700">
                        View Terms
                    </button>
                </div>

                <!-- Code Validation -->
                <div class="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                    <h3 class="text-lg font-semibold text-red-800 mb-3">✅ Validate Code</h3>
                    <div class="mb-3">
                        <input type="text" id="validate-code-input" placeholder="Enter referral code" 
                               class="w-full px-3 py-2 border border-red-300 rounded text-sm">
                    </div>
                    <button onclick="validateReferralCode()" class="w-full bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700">
                        Validate Code
                    </button>
                    <div id="validation-result" class="mt-2 text-xs"></div>
                </div>

                <!-- Social Actions -->
                <div class="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg border border-pink-200">
                    <h3 class="text-lg font-semibold text-pink-800 mb-3">📱 Social Share</h3>
                    <div class="mb-3">
                        <input type="email" id="share-email" placeholder="Friend's email" 
                               class="w-full px-3 py-2 border border-pink-300 rounded text-sm mb-2">
                        <textarea id="share-message" placeholder="Share message" 
                                  class="w-full px-3 py-2 border border-pink-300 rounded text-sm h-16"></textarea>
                    </div>
                    <button onclick="recordSocialAction()" class="w-full bg-pink-600 text-white px-3 py-2 rounded text-sm hover:bg-pink-700">
                        Share via Email
                    </button>
                </div>
            </div>

            <!-- Custom Widget Section -->
            <div class="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 class="text-lg font-semibold text-gray-800 mb-3">🎨 Custom Widget</h3>
                <button onclick="showCustomWidget()" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                    Show Custom Widget
                </button>
            </div>
        `;

        // Load initial data
        loadCampaignData();
        loadUserBalance();
        loadFriendsList();
        loadTerms();
    }

    // Global functions for dashboard buttons
    window.loadCampaignData = function () {
        appvirality.getCampaignData(function (err, data) {
            const campaignDiv = document.getElementById('campaign-data');
            if (!err && data) {
                campaignDiv.innerHTML = `
                    <p><strong>Campaign:</strong> ${data.campaign_name || 'N/A'}</p>
                    <p><strong>Status:</strong> ${data.status || 'N/A'}</p>
                    <p><strong>Type:</strong> ${data.campaign_type || 'N/A'}</p>
                    <p><strong>Reward:</strong> ${data.reward_description || 'N/A'}</p>
                `;
            } else {
                campaignDiv.innerHTML = '<p class="text-red-600">Error loading campaign data</p>';
            }
        });
    };

    window.loadUserBalance = function () {
        appvirality.getUserBalance(function (err, data) {
            const balanceDiv = document.getElementById('user-balance');
            if (!err && data) {
                balanceDiv.innerHTML = `
                    <p><strong>Current Balance:</strong> ${data.balance || '0'}</p>
                    <p><strong>Currency:</strong> ${data.currency || 'N/A'}</p>
                    <p><strong>Total Earned:</strong> ${data.total_earned || '0'}</p>
                    <p><strong>Pending:</strong> ${data.pending || '0'}</p>
                `;
            } else {
                balanceDiv.innerHTML = '<p class="text-red-600">Error loading balance</p>';
            }
        });
    };

    window.loadFriendsList = function () {
        appvirality.getFriendsList(function (err, data) {
            const friendsDiv = document.getElementById('friends-list');
            if (!err && data && data.friends) {
                if (data.friends.length > 0) {
                    const friendsList = data.friends.map(friend =>
                        `<p>• ${friend.name || friend.email} - ${friend.status || 'Invited'}</p>`
                    ).join('');
                    friendsDiv.innerHTML = `
                        <p><strong>Total Friends:</strong> ${data.friends.length}</p>
                        <div class="mt-2">${friendsList}</div>
                    `;
                } else {
                    friendsDiv.innerHTML = '<p>No friends referred yet</p>';
                }
            } else {
                friendsDiv.innerHTML = '<p class="text-red-600">Error loading friends</p>';
            }
        });
    };

    window.loadTerms = function () {
        appvirality.getTerms(function (err, data) {
            const termsDiv = document.getElementById('terms-data');
            if (!err && data) {
                termsDiv.innerHTML = `
                    <p><strong>Terms:</strong></p>
                    <p>${data.terms || 'No terms available'}</p>
                `;
            } else {
                termsDiv.innerHTML = '<p class="text-red-600">Error loading terms</p>';
            }
        });
    };

    window.validateReferralCode = function () {
        const code = document.getElementById('validate-code-input').value;
        const resultDiv = document.getElementById('validation-result');

        if (!code) {
            resultDiv.innerHTML = '<p class="text-red-600">Please enter a code</p>';
            return;
        }

        appvirality.validateCode(code, function (err, data) {
            if (!err && data && data.valid) {
                resultDiv.innerHTML = '<p class="text-green-600">✅ Valid code!</p>';
            } else {
                resultDiv.innerHTML = '<p class="text-red-600">❌ Invalid code</p>';
            }
        });
    };

    window.recordSocialAction = function () {
        const email = document.getElementById('share-email').value;
        const message = document.getElementById('share-message').value;

        if (!email || !message) {
            alert('Please fill in both email and message');
            return;
        }

        const mailBody = message;
        const mailTo = email;
        const mailSubject = 'Check out this awesome referral program!';
        const socialActionId = 'email_share';

        appvirality.recordSocialAction(mailBody, socialActionId, mailTo, mailSubject, function (err, data) {
            if (!err && data) {
                alert('Social action recorded successfully!');
                document.getElementById('share-email').value = '';
                document.getElementById('share-message').value = '';
            } else {
                alert('Error recording social action');
            }
        });
    };

    window.showCustomWidget = function () {
        appvirality.widget({
            title: 'Share and Earn!',
            description: 'Invite your friends and earn rewards',
            iframe: true
        });
    };

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

    // Also check URL parameters for referral code
    function getReferralCodeFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const refCode = urlParams.get('ref') || urlParams.get('referral') || urlParams.get('code');
        if (refCode) {
            const refcodeInput = document.getElementById('refcode-input');
            if (refcodeInput) {
                refcodeInput.value = refCode;
                console.log("Auto-filled referral code from URL:", refCode);
            }
        }
    }

    // Call this function when page loads
    getReferralCodeFromURL();

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
                // Note: appvirality.logout() is not available in current SDK version
                // We handle logout by clearing local data and UI

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
                const dashboard = document.getElementById('referral-dashboard');
                if (referralDisplay) referralDisplay.remove();
                if (referrerDisplay) referrerDisplay.remove();
                if (dashboard) dashboard.remove();

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

            // If user used a referral code, apply it
            if (refcode && refcode.trim() !== '') {
                appvirality.applyCode(refcode, function (err, data) {
                    if (!err && data) {
                        console.log('Referral code applied successfully:', data);
                    } else {
                        console.log('Error applying referral code:', err);
                    }
                });
            }

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