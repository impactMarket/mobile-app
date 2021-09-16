export default {
    errors: {
        network: {
            connectionLost: 'The network connection was lost.',
            rpc: 'RPC service unavailable. Please try again later.',
        },
        sync: {
            issues: 'Seems like there were syncing issues. Please, try again.',
            possiblyValora:
                "It seems like your valora isn't synced with the network. Please, open Valora and make sure you don't see any message similar to 'Connecting...'",
            clock:
                'It seems like your date or time is incorrect. Please, fix it before trying again.',
        },
        modals: {
            valora: {
                title: 'Request timeout',
                description:
                    'Your request was lost. Please try again or visit our FAQ.',
            },
            clock: {
                title: 'Incorrect Time',
                description:
                    'We have detected that your device may have the time incorrectly set. Please open the clock settings to match {{serverTime}}. Your time is currently {{userTime}}. After doing so, please, restart the app.',
            },
            title: 'Ooops!',
            description: 'Something went wrong. Please try again later.',
        },
        unknown: 'Unknown.',
        notEnoughForTransaction:
            "You don't have enough balance to submit the request. Celo's transactions are nearly free but not completely free. Always keep a few cents in your account.",
        scanningAddress: 'You are trying to scan an invalid address!',
        gettingGPS: 'An error happened while getting the GPS location.',
        uploadingAvatar:
            'An error happened while uploading your image, try again later!',
        generic: 'An error happened, please, try again.', // this will be deprecated
        loadingApp:
            'Unfortunately an unexpected error occurred while loading the app. Please restart the app and try again.',
    },
    permissions: {
        title: 'Questing Permission',
        cameraMessage: 'impactMarket requires permission to use your camera.',
        allowCamera: 'Allow camera', // TODO: this should be replaced
    },
    generic: {
        testnetWarning:
            "A friendly reminder you're using the Alfajores network build - the balances are not real.",
        share: 'Share',
        beneficiaries: 'Beneficiaries',
        backers: 'Backer',
        backers_plural: 'Backers',
        or: 'or',
        ok: 'Ok',
        cancel: 'Cancel',
        confirm: 'Confirm',
        raisedFrom: 'Raised from {{backers}}',
        goal: 'Goal',
        ubi: 'UBI',
        manage: 'Manage',
        communities: 'Communities',
        name: 'Name',
        currency: 'Currency',
        cityCountry: 'City, Country',
        moreAboutYourCommunity: 'About my community',
        added: 'Added',
        removed: 'Removed',
        remove: 'Remove',
        create: 'Create',
        submit: 'Submit',
        submitting: 'Submitting',
        yes: 'Yes',
        no: 'No',
        failure: 'Failure',
        success: 'Success',
        email: 'Email',
        upload: 'Upload',
        continue: 'Continue',
        yourQRCode: 'Your QR Code',
        close: 'Close',
        faq: 'FAQ',
        oneTimeWelcomeMessage1:
            'impactMarket enables any community to setup its own Unconditional Basic Income for their beneficiaries. Anyone can back those communities by donating directly to their UBI contracts.',
        exploreCommunities: 'Explore Communities',
        day: 'day',
        days: 'day',
        days_plural: 'days',
        week: 'week',
        select: 'Select',
        tryAgain: 'Try Again',
        openHelpCenter: 'Open Help Center',
        knowMoreHelpCenter: 'Know more about on our Help Center',
        turnOn: 'Turn On',
        turnOnLocationHint: 'Turn on your location for a better experience.',
        youAreNotConnected:
            'You are not connected to your Valora. Connect to send directly.',
        language: 'Language',
        update: 'Update',
        skip: 'Skip',
        newVersionAvailable: 'New version available',
        newVersionAvailableMessage:
            'To get the latest improvements and features we need you to update to the latest version.',
        offline: 'The Internet connection appears to be offline',
        openClockSettings: 'Open Clock Settings',
        dismiss: 'Dismiss',
        backWithSymbol: '< Back',
        order: 'Order',
        nearest: 'Nearest',
        bigger: 'Bigger (Beneficiaries)',
        pleaseWait: 'Please wait...',
        thankYou: 'Thank you!',
        search: 'Search',
        noResults: 'No results found!',
        story: 'Story',
        viewAll: 'View All',
        notInComunity: 'Not in a community!',
        delete: 'Delete',
        descriptionCopiedClipboard: 'Description copied to clipboard!',
        welcome: 'Welcome!',
        translatedFrom: 'Translated from {{from}}',
    },
    createCommunity: {
        recoverForm: {
            title: 'Continue submission',
            message:
                'We have saved your previous application. Do you want to continue editing it?',
        },
        leave: {
            title: 'Leave form',
            message:
                'All the information you provided in this form will still be available next time you continue this application.',
        },
        alert: 'After submitting, we’ll will contact you in a few weeks.',
        pendingApprovalMessage:
            'We are reviewing your submission and will contact you in a few weeks. If you have any additional questions visit our Help Center to read our F.A.Q.s or submit a ticket.',
        applyCommunity: 'Apply Community',
        editCommunity: 'Edit',
        communityDetails: 'Community Details',
        communityDescriptionLabel:
            'Tell more about your community and why access to a basic income could be important for its members.',
        contractIncrementTitle: 'Total time increment after each claim',
        contractDescriptionLabel:
            "These values should be a minimum basic income that is sufficient to meet your beneficiaries' basic needs. They will be able to claim while there are funds available in the contract. You will have the responsibility to promote your community and to raise funds for it.\n\nIf there is another person or organization among your community you believe is more suitable to drive this initiative, let them know about this possibility and encourage them to create a community.",
        imageDimensionsNotFit: 'Select an image with the correct dimensions',
        changeCoverImage: 'Cover Image',
        changeProfileImage: 'Your Profile Image',
        minProfilePictureSize: 'Min. 300px by 300px',
        communityName: 'Community Name',
        shortDescription: 'Description (Min 240 Chars)',
        contractDetails: 'Contract Details',
        claimAmount: 'Amount per Claim',
        aroundValue: 'Around {{amount}}',
        totalClaimPerBeneficiary: 'Amount',
        frequency: 'Claim Frequency',
        incrementalFrequency: 'Incremental Frequency',
        daily: 'Daily',
        weekly: 'Weekly',
        minutes: 'Minutes',
        hours: 'Hours',
        days: 'Days',
        time: 'Time',
        minCoverSize: 'Min. 784px by 784px',
        expectedUBIDuration:
            'This UBI will take at least {{years}} years {{months}} months {{days}} days {{hours}} hours {{minutes}} minutes per beneficiary.',
        timeIncrementAfterClaim: 'Time increment after each claim',
        timeInMinutes: 'Time in minutes',
        visibility: 'Visibility',
        public: 'Public',
        private: 'Private',
        communityPicsImportance:
            'P.S: Communities with all the details completed, including the managers photos, are more likely to get funded.',
        communityRequestSending:
            'Please wait while the community information is being uploaded...',
        communityRequestCancel: 'Are you sure you want to cancel the request?',
        missingFieldError:
            'All the fields marked as required need to be informed. Please check what is missing and try again.',
        communityRequestError:
            'There was an error submitting the community information.',
        communityRequestSuccess:
            'Your community information was succefully submitted.',
        claimBiggerThanMax:
            'Claim Amount should not be bigger than Total claim amount per beneficiary!',
        claimNotZero: 'Claim Amount should not be zero!',
        maxNotZero: 'Total claim amount should not be zero!',
        claimAmountHelp:
            'This is the UBI amount, in $cUSD, that each beneficiary will be able to claim each time from this community contract. For example, each beneficiary can claim $2 from the contract on a regular basis, while there are funds available.',
        totalClaimPerBeneficiaryHelp:
            'This value is the limit each beneficiary can get in total after several claims. For example, each beneficiary can claim $2/day until it reaches a total of $1,000, meaning that each beneficiary will have access to a UBI ($2/day) for at least 16 months. This time can increase if minutes are added to the Time increment.',
        frequencyHelp:
            'Each beneficiary will be able to access a basic income on a regular basis, that can be daily or weekly. For example, if daily, each beneficiary will have to wait at least 1 day (24h) before being able to claim again (more $2).',
        timeIncrementAfterClaimHelp:
            'It is possible to add a time increment each time a beneficiary claims. For example, in a community where each beneficiary can claim $2/day, 20 minutes can be added to the time that that beneficiary will have to wait before being able to claim again (in this case, 24h20m after claiming for the 2nd time, 24h40m after the 3rd time, and so on). This benefits those who claimed less and incentivizes self-sustainability progress.',
        visibilityHelp:
            'A community can be public (need our approval to be listed on the app), or private where anyone can create its own UBI and will not show up on the communities list.',
        coverImageRequired: 'Cover image is required!',
        profileImageRequired: 'Profile image is required!',
        communityNameRequired: 'Comunity name is required!',
        communityDescriptionRequired: 'Comunity description is required!',
        communityDescriptionTooShort: 'This description is too small!',
        cityCountryRequired: 'Location is required!',
        emailRequired: 'Email address is required!',
        emailInvalidFormat: 'Email address is invalid!',
        claimAmountRequired: 'Claim amount is required!',
        maxClaimAmountRequired: 'Max claim amount is required!',
        incrementalIntervalRequired: 'Incremental interval is required!',
        incrementalIntervalUnitRequired:
            'Incremental interval unit is required!',
        baseIntervalRequired: 'Base interval is required!',
    },
    manager: {
        rules: {
            title: 'Important Rules',
            btnText: 'I read and understand',
            first:
                'As a manager, you will have the responsibility of selecting which beneficiaries have access to a basic income. As more people have access in your community, more difficult will be to have funds available for everyone all the time, so be careful choosing who can/should benefit and really needs it.',
            second:
                'This app uses blockchain technology to identify potential fraud and suspicious funds usage, so everything that happens, including all transactions, are public and transparent.',
            third:
                'Your profile can be blocked and funds can be prevented from being distributed to the beneficiaries if suspicious activity is found or reported. This can result in having your community and organization removed from the system.',
            fourth: 'Do not add beneficiaries that were already removed.',
            fifth: 'Do not ask beneficiaries for money.',
            sixth: 'Do not add more than one account per person and device.',
            seventh:
                'Your profile information should be completed and accurate.',
            warning:
                'If you find suspicious activity among beneficiaries, let us know, as it will be regarded as a good-faith action that can prevent all the community to be affected because of a few bad actors.',
        },
        noFunds: 'No Funds',
        notFundsToAddBeneficiary:
            'Your community does not has enough funds! You need at least $0.05 cUSD in the contract to add a beneficiary.',
        addingInvalidAddress: 'You are trying to add an invalid address!',
        addingYourOwnAddress:
            'You are trying to add your own address. Are you sure?',
        alreadyInCommunity:
            'You are trying to add an address that already is in this community!',
        errorRemovingBeneficiary:
            'An error happened while removing the beneficiary.\n\nError: {{error}}',
        userWasRemoved: '{{user}} was successfully removed!',
        errorAddingBeneficiary:
            'An error happened while adding the beneficiary.\n\nError: {{error}}',
        addedNewBeneficiary: "You've successfully added a new beneficiary!",
        errorAddingManager:
            'An error happened while adding the manager.\n\nError: {{error}}',
        addedNewManager: "You've successfully added a new manager!",
        errorRemovingManager:
            'An error happened while removing the manager.\n\nError: {{error}}',
        claimedSince: '{{amount}} claimed since {{date}}',
        editCommunityDetails: 'Edit community details',
        viewAsPublic: 'View as public',
        addBeneficiary: 'Add Beneficiary',
        beneficiaryAddress: 'Beneficiary Account No (address)',
        managerAddress: 'Manager Account No (address)',
        addManager: 'Add Manager',
        managers: 'Managers',
        notAnUser: 'The address you are adding, is not an user.',
        managerSince: 'Manager since {{date}}',
        ubiParamsUpdated: 'Community UBI parameters were updated!',
        ubiParams: 'UBI Params',
        ubiParamsChanged:
            'Your community UBI contract parameters have changed. The new parameters will be the following:',
        acceptNewUbiParams: 'Accept New Paramenters',
        welcomeManagerTitle: 'You are now a manager of {{ communityName }}',
        userNotRegistered: "The user isn't registered!",
    },
    stories: {
        stories: 'Stories',
        emptyStoriesTitle: "Didn't create any story yet?",
        emptyStoriesDescription:
            "Don't miss the opportunity and create one, now!",
        storyRules: 'Important Rules',
        storyRulesFirstParagraph:
            '<bold>Sharing your stories will help your community to raise more funds.</bold> Do not share any content (text or image) that infringe our rules as it will be deleted and you may be removed from your community.',
        storySubTitle: 'Stories must not contain any of the following:',
        storyRulesSecondParagraph:
            'Violence, Terrorism/violent extremism, Child sexual exploitation, Abuse/harassment, Hateful conduct, Suicide or self-harm, Sensitive media, Illegal or certain regulated goods or services, Nudity, Non-consensual nudity, Civic Integrity, Impersonation, Synthetic and manipulated media, and Copyrights and trademarks.',
        reportAsInapropriated: 'Report as inapropriate',
        reportedAsInapropriated: 'Reported as inapropriate',
        reportInapropriateSuccess: 'Your report was successfully submitted.',
        deleteSuccess: 'Your story was successfully deleted.',
        reportInapropriateWarning:
            'Are you sure you want to report this story as inapropriate?',
        deleteWarning: 'Are you sure you want to delete this story?',
        storyCongrat: 'Congratulations, your story was submitted!',
        storyFailure: 'Error uploading story!',
        emptyStoryFailure: 'Please meka sure your story has a text or image.',
        createStory: 'Create Story',
        myStories: 'My Stories',
        newStory: 'New Story',
    },
    beneficiary: {
        rules: {
            title: 'Important Rules',
            btnText: 'I read and understand',
            first:
                'This money is only yours and unconditional to use in whatever you need.',
            second:
                'Only use 1 account per person. Using more accounts per person/device will make you blocked and your community will be identified as a risk for donors to send funds.',
            third:
                'We recommend you have your profile completed with true information.',
            fourth: 'Do not share your Valora Account Key with anyone.',
            fifth:
                'All activity and transactions are public and transparent, so it’s easier for anyone to identify and verify potential fraud. Once the system detects potential fraudulent activity, funds can be cut for all the community.',
            sixth:
                'Funds are allocated and prioritized to communities based on their risk and suspicious activity levels.',
            seventh:
                'If your managers ask you for money to be in the program, please let us know. Once again, this is unconditional money for you to use in what you need.',
            warning:
                'If you find some suspicious activity, let us know, as it will be regarded as a good faith action that can prevent all the community to be affected because of a few bad actors.',
        },
        claim: 'Claim',
        claimExplained1:
            '<bold>Each community has a group of beneficiaries</bold>, added by the coommunity managers, that can access a basic income under a set of rules. For example, each beneficiary can claim $1/day up to $500.',
        claimExplained2:
            '<bold>There is a minimum time you have to wait before being able to claim again</bold>, but there is no maximum. You should only claim when you need those funds. The more you claim, the more time you have to wait to claim again.',
        claimExplained3:
            '<bold>If your community have run out of funds</bold> you will not be able to claim. The only way to start claiming again is when the community gets additional funds through donations.',
        claimLockedUntil:
            "You aren't yet allowed to claim. Will be available in {{date}}. If it fails peridically, make sure to have the best internet connection possible and Valora is synced.",
        youCanClaimXin: 'You can claim {{amount}} in',
        claimX: 'Claim ', // {{amount}}
        youHaveClaimedXoutOfY: 'You have claimed ${{claimed}} out of ${{max}}',
        nextTimeWillWaitClaim:
            'Next time you will have to wait at least {{nextWait}}. <a>How claims work.</a>',
        howClaimWorks: 'How claims work.',
        errorClaiming: 'An error happened while claiming.\n\nError: {{error}}',
        beneficiaryCommunityNoFunds:
            'Unfortunately, your community do not have funds at the moment! Please, try again later.',
        blockedAccountTitle: 'Blocked Account',
        blockedAccountDescription:
            'Your account has been blocked. Please contact your manager if you think it was a mistake.',
        welcomeBeneficiayTitle:
            'You are now a beneficiary of {{ communityName }}',
        welcomeBeneficiaryDecription:
            'Every day, you can claim ~{{claimXCCurrency}}. After claiming, you need to wait for {{interval}} + {{minIncrement}} minutes.',
    },
    profile: {
        deleteAccountWarn: {
            msg1:
                'All private and public personal data will be permanently erased (except all public data saved on the celo blockchain) and this account will be closed.',
            msg2:
                'This process will take 15 days and it can be terminated by connecting again to the same wallet address during this period.',
        },
        profile: 'Profile',
        balance: 'Valora Wallet Balance',
        uploadProfilePicture: 'Upload profile picture',
        phoneNumber: 'Phone Number',
        logout: 'Logout',
        stolenOrChangedPhone:
            'Please read the following instruction in case your phone is <blue>stolen/lost</blue> or you need to <blue>change your phone number.</blue>',
        age: 'Age',
        gender: 'Gender',
        male: 'Male',
        female: 'Female',
        others: 'Others',
        howManyChildren: 'How many children do you have?',
        deleteAccount: 'Delete Account',
    },
    community: {
        ssi: 'Self-Sustainability Index',
        ssiDescription:
            'SSI measures how financially sustainable a community is, and its progress.',
        seeMore: 'See More',
        seeOriginal: 'See Original',
        seeLess: 'See Less',
        eachBeneficiaryCanClaimXUpToY:
            'Each beneficiary can claim ~{{claimXCCurrency}} ($<bold>{{claimX}}</bold> cUSD) per <bold>{{interval}}</bold>, up till $<bold>{{upToY}}</bold> cUSD. Each claim adds <bold>{{minIncrement}}</bold> min to its waiting interval.',
        copyContractAddress: 'Copy Contract Address',
        suspiciousActivityDetected: 'Suspicious activities detected',
        suspiciousDescription:
            'The community funds may be put on hold if the beneficiaries or managers involved are not removed from this community.',
        noSuspiciousActivityDetected:
            'No suspicious activities detected in this community.',
        lowSuspiciousActivityDetected:
            'A very small  number of accounts may be involved in suspicious activities.',
        significantSuspiciousActivityDetected:
            'A significant number of accounts may be involved in suspicious activities.',
        largeSuspiciousActivityDetected:
            'A very large number of accounts  may be involved in suspicious activities.',
        fundsRunOut: 'Community funds will run out in {{days}}',
        shareTitle: 'impactMarket | Decentralized Poverty Alleviation Protocol',
    },
    report: {
        report: 'Report',
        title: 'Report illegal activity',
        category: 'Category',
        general: 'General',
        selectCategory: 'Select category',
        potencialFraud: 'Potencial Fraud',
        message:
            'If you think there is something suspicious with your community, money distribution, or behavior, like potential fraud or corruption, let us know in an anonymous way.',
        label: 'Describe the potential  ilegal activity...',
        alertCongrat: 'Thank you for reporting potential illegal activity.',
        alertCongratLink: 'Know more about anonymous reporting.',
        alertFailure: 'Error uploading report!',
    },
    communityFundsRunOut: {
        title: 'Community funds run out',
        description:
            'We understand the inconvenience and we know how much you need this allowance.  <bold>You will be notified when funds are available again.</bold>',
        callToAction: 'Why funds run out?',
    },
    communityWentOutOfFunds:
        'It seems like your community run out of funds. Please try again later',
    donate: {
        errorDonating: 'An error happened while donating!',
        addressCopiedClipboard:
            'Community address copied to clipboard! Send only $cUSD (Celo Dollar) to this contract',
        donate: 'Contribute',
        attach: 'Attach',
        donateWithValora: 'Contribute with Valora',
        donateSymbol: 'Contribute ({{symbol}})',
        donateConfirmMessage:
            "By pressing 'Contribute', you will contribute <bold>{{symbol}}{{amount}} (${{amountInDollars}} cUSD)</bold> to {{to}}.",
        yourDonationWillBackFor:
            'It will back {{backNBeneficiaries}} beneficiaries for {{backForDays}}+ days.',
        donationBiggerThanBalance:
            'You are trying to contribute with an amount bigger than your balance. Add funds on your Valora app.',
        amountShouldBe: 'Amount should be ${{claimAmount}}+ to calculate..',
        donationBeingProcessed: 'Your donation is being processed...',
        donateWithCelo: 'Celo Dollar ($cUSD)',
        donateWithESolidar: 'Credit Card / Paypal / BTC / ETH',
        poweredByESolidar: 'Powered by',
        contributeWith: 'Contribute with',
    },
    sagas: {
        messages: {
            submitAddStoriesToStateSuccess: 'Hurray! See the latest stories.',
            yourNetworkisOffline: 'Ouch! Seems like you are offline.',
            yourNetworkisWeak:
                'Hmmm! Seems like you are facing network issues.',
            yourNetworkisOnline: 'Hurray! Your network is back online!',
            submitAddStoriesToStateFailure:
                'Oops! We could not update all stories at this time. Please try again later',
        },
    },
    auth: {
        impactMarketDescription:
            'ImpactMarket operates on top of Celo network, an open and global financial platform.',
        loginDescription:
            'With Valora you can easily send and receive money with just a mobile phone.',
        step1: 'Step 1 of 2',
        step2: 'Step 2 of 2',
        whatIsValora: 'What is Valora?',
        installAndCreateValoraAccount: 'Install and create Valora Account',
        connectWithValora: 'Connect with Valora',
        duplicatedTitle: 'Duplicated Account',
        duplicatedMsg1:
            'Your phone number {{phoneNumber}} is associated with other impactMarket account.',
        duplicatedMsg2: 'Do you want login and disable all other accounts?',
        duplicatedMsg3:
            'P.S: Funds will continue to exist on all other Valora accounts.',
        welcomeBack: 'Welcome back!',
        recover: 'Recover',
        recoverMsg1:
            'Because you have initiated this account deletion process less than 15 days ago, you can recover your private and public data.',
    },
    promoter: {
        createdIn: 'Created community on {{date}}',
        promoter: 'Promoter',
        promotedBy: 'Promoted by',
    },
};
