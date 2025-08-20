# AppVirality SDK Integration Guide

This project demonstrates the integration of AppVirality SaaS Web SDK for implementing a referral program in a web application.

## Features Implemented

1. **User Authentication System** - Login/Signup modal with form validation
2. **AppVirality SDK Integration** - Complete integration following the official guide
3. **Referral Code Display** - Shows user's referral code after signup/login
4. **Referrer Information Display** - Shows who referred the user (if applicable)
5. **Auto-fill Referral Code** - Automatically fills referral code from cookies and URL parameters during signup
6. **Referral Widget** - Launch referral popup using the "Launch Referrals" button
7. **Comprehensive Referral Dashboard** - Full dashboard with all AppVirality features
8. **Campaign Data Display** - Shows active campaign information
9. **User Balance Tracking** - Displays current rewards and earnings
10. **Friends List Management** - Shows referred friends and their status
11. **Terms & Conditions** - Displays campaign terms
12. **Code Validation** - Real-time validation of referral codes
13. **Social Action Recording** - Track social sharing activities
14. **Custom Widget** - Configurable referral widget
15. **Apply Code Functionality** - Automatically applies referral codes during signup

## Integration Steps Followed

### Step 1: SDK Installation
- Added the AppVirality SDK script to the HTML file
- Initialized with the App Key: `c0171b97c195403b8ad2b33900b84f85`

### Step 2: SDK Initialization
- Created `initializeAppVirality()` function that calls `appvirality.init()`
- Initialization happens after successful user signup/login
- Passes user email and referral code (if any) to the SDK

### Step 3: Referral Code Auto-fill
- Uses `appvirality.getReferrerCode()` to get referral code from cookies
- Auto-fills the referral code input field during signup

### Step 4: Referrer Details
- Uses `appvirality.getReferrer()` to get referrer information
- Displays referrer name, profile image, and reward details

### Step 5: User Experience
- Displays user's own referral code prominently after signup
- Shows referrer information if user was referred by someone
- Provides copy-to-clipboard functionality for referral codes

## How to Use

1. **Open the website** - Navigate to the homepage
2. **Sign up/Login** - Click "Login / Signup" button
3. **Enter referral code** - If you have a referral code, it will be auto-filled from cookies or URL parameters
4. **Complete signup** - After successful signup, you'll see:
   - Your personal referral code
   - Information about who referred you (if applicable)
   - Comprehensive referral dashboard with all features
5. **Use the dashboard** - Explore all the referral features:
   - View campaign information
   - Check your balance and earnings
   - See your referred friends
   - Read terms and conditions
   - Validate referral codes
   - Record social actions
   - Use custom widgets
6. **Share your code** - Use the "Copy Code" button to share your referral code
7. **Launch referrals** - Click "Launch Referrals" to open the AppVirality referral widget

## File Structure

```
dummy-website/
├── index.html          # Main HTML file with SDK integration
├── script.js           # JavaScript with AppVirality integration
├── style.css           # Custom styles
├── appvirality.js      # AppVirality SDK file (if needed)
└── README.md           # This file
```

## Key Functions

### `initializeAppVirality(userEmail, referralCode)`
- Initializes the AppVirality SDK with user information
- Called after successful signup/login
- Handles the callback to display referral information

### `displayReferralCode(referralCode)`
- Creates a beautiful display of the user's referral code
- Includes copy-to-clipboard functionality
- Shows at the top of the main content area

### `getAndDisplayReferrerDetails(userEmail)`
- Fetches referrer information using the SDK
- Calls `displayReferrerInfo()` to show the results

### `displayReferrerInfo(referrerData)`
- Displays referrer name, profile image, and reward details
- Shows in a styled card format

### `createReferralDashboard()`
- Creates a comprehensive dashboard with all AppVirality features
- Includes campaign data, user balance, friends list, terms, validation, and social actions
- Provides interactive buttons for all SDK methods

### Global Dashboard Functions
- `loadCampaignData()` - Fetches and displays campaign information
- `loadUserBalance()` - Shows user's current rewards balance
- `loadFriendsList()` - Displays list of referred friends
- `loadTerms()` - Shows campaign terms and conditions
- `validateReferralCode()` - Validates referral codes in real-time
- `recordSocialAction()` - Records social sharing activities
- `showCustomWidget()` - Displays configurable referral widget

## AppVirality SDK Methods Used

1. **`appvirality.init()`** - Initialize SDK with user data
2. **`appvirality.getReferrerCode()`** - Get referral code from cookies
3. **`appvirality.getReferrer()`** - Get referrer details
4. **`appvirality.getCampaignData()`** - Get active campaign information
5. **`appvirality.getUserBalance()`** - Get user's current rewards balance
6. **`appvirality.getFriendsList()`** - Get list of referred friends
7. **`appvirality.getTerms()`** - Get campaign terms and conditions
8. **`appvirality.validateCode()`** - Validate referral codes
9. **`appvirality.applyCode()`** - Apply referral code to user account
10. **`appvirality.recordSocialAction()`** - Record social sharing activities
11. **`appvirality.widget()`** - Display custom referral widget
12. **`appvirality.logout()`** - Not available in current SDK version (handled locally)

## Testing the Integration

1. **Fresh User Signup**: Sign up without a referral code to get your own referral code
2. **Referral Code Usage**: Use a referral code during signup to see referrer information
3. **Cookie Testing**: The referral code should auto-fill from cookies if available
4. **Widget Testing**: Click "Launch Referrals" to test the referral widget

## Browser Console Logs

The integration includes comprehensive console logging:
- SDK initialization status
- Referral code retrieval
- Referrer information fetching
- Error handling

## Notes

- The integration uses localStorage to persist user session
- All AppVirality calls are asynchronous and use callback functions
- The referral widget is triggered by elements with class `av_refer_btn`
- Error handling is implemented for all SDK calls

## Troubleshooting

1. **SDK not loading**: Check if the AppVirality script is loading correctly
2. **No referral code**: Ensure cookies are enabled and referral code exists
3. **No referrer info**: User might not have been referred by anyone
4. **Widget not opening**: Check if the button has the correct class name
5. **Logout error**: The `appvirality.logout()` function is not available in the current SDK version - logout is handled locally by clearing user data

## Next Steps

To complete the integration, you may want to:
1. Add conversion event tracking for subscriptions
2. Implement reward redemption
3. Add analytics tracking
4. Customize the referral widget styling
5. Add email verification
6. Implement proper backend integration
