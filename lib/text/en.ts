import type { Difficulty, EmployeeSizeRange, SubmissionStatus } from "@/lib/types";

// English UI copy for frontend-user, mirroring vi.ts's exact key structure —
// see docs/business/vision.md#phase-amendment--2026-08-06 (US-49/50).
// AI-translated, no human review gate, per that amendment. Never imported
// directly by components — go through "./index" (`getText`/`useText`).
export const en = {
  header: {
    navAriaLabel: "Main",
    homeLink: "Home",
    questionsLink: "Questions",
    companiesLink: "Companies",
    subscribeLink: "Pricing",
    bookmarksLink: "Saved questions",
    contributeLink: "Contribute",
    mySubmissionsLink: "My submissions",
    paymentHistoryLink: "Payment history",
    notificationsLabel: "Notifications",
    accountMenuLabel: "Account menu",
    profileLink: "Profile",
    logoutLabel: "Log out",
    loginLink: "Log in",
    loginRegisterLink: "Log in / Register",
    closeMenuLabel: "Close menu",
    openMenuLabel: "Open navigation menu",
  },
  footer: {
    tagline: "An interview practice platform for the Vietnamese job market.",
  },
  themeToggle: {
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
  },
  common: {
    loading: "Loading…",
    or: "or",
    goToLoginLink: "Go to login",
    networkError: "Couldn't connect to the server. Check your network and try again.",
    passwordHint: (minLength: number) => `At least ${minLength} characters`,
    premiumBadge: "Premium",
    retryLabel: "Try again",
    genericErrorTitle: "Something went wrong",
    genericErrorBody: "Please try again. If this keeps happening, come back later.",
    notFoundTitle: "Page not found",
    notFoundBody: "The page you're looking for doesn't exist or has moved.",
    backToHomeLink: "Back to home",
    // Shared between company reviews and Q&A comments (BE-65/FU-29/FU-30) —
    // one string, not forked per domain.
    anonymousAuthorLabel: "Anonymous",
  },
  auth: {
    login: {
      pageTitle: "Log in",
      heading: "Log in",
      subtitle: "Log in to keep practicing.",
      emailLabel: "Email",
      passwordLabel: "Password",
      forgotPasswordLink: "Forgot password?",
      submitLabel: "Log in",
      submitLoading: "Logging in…",
      googleLabel: "Continue with Google",
      noAccount: "Don't have an account?",
      createAccountLink: "Create an account",
      errors: {
        emailNotVerified:
          "Email not verified yet. Check your inbox for the verification link before logging in.",
        invalidCredentials: "Incorrect email or password.",
      },
    },
    register: {
      pageTitle: "Create account",
      heading: "Create account",
      subtitle: "Create a free account to save questions and practice.",
      emailLabel: "Email",
      passwordLabel: "Password",
      submitLabel: "Create account",
      submitLoading: "Creating account…",
      googleLabel: "Sign up with Google",
      haveAccount: "Already have an account?",
      loginLink: "Log in",
      emailTakenPrefix: "This email is already registered.",
      emailTakenLoginLink: "Log in",
      emailTakenSuffix: "or use a different email.",
      errors: {
        validationError: "Please check the email and password you entered.",
      },
      success: {
        title: "Check your email to verify your account",
        bodyBeforeEmail: "We sent a verification email to ",
        bodyAfterEmail: ". You need to verify it before logging in.",
      },
    },
    forgotPassword: {
      pageTitle: "Forgot password",
      heading: "Forgot password",
      emailLabel: "Email",
      submitLabel: "Send reset link",
      submitLoading: "Sending…",
      success: {
        title: "Check your email",
        bodyBeforeEmail: "If ",
        bodyAfterEmail: " has an account, we sent a password reset link to it.",
      },
    },
    resetPassword: {
      pageTitle: "Reset password",
      heading: "Reset password",
      newPasswordLabel: "New password",
      confirmPasswordLabel: "Confirm new password",
      mismatchError: "Passwords don't match.",
      submitLabel: "Reset password",
      submitLoading: "Resetting…",
      missingToken: {
        title: "Missing reset code",
        body: "Open the link directly from the email you received.",
      },
      success: {
        title: "Password reset",
        body: "All previous sessions have been signed out. Log in again with your new password.",
      },
      errors: {
        tokenExpired: "This reset link has expired. Request a new one.",
        tokenUsed: "This link has already been used. Request a new one if you still need to reset.",
        tokenInvalid: "Invalid reset link. Double-check the link in your email.",
      },
    },
    verifyEmail: {
      pageTitle: "Verify email",
      heading: "Verify email",
      verifyingSrOnly: "Verifying…",
      verifyingBody: "Verifying your email…",
      status: {
        success: { title: "Email verified", body: "You can log in now." },
        expired: {
          title: "Verification link expired",
          body: "Register again or contact support for a new verification link.",
        },
        used: {
          title: "This link has already been used",
          body: "Your account may already be verified — try logging in.",
        },
        invalid: {
          title: "Invalid verification link",
          body: "Double-check the link in your email, or request a new one.",
        },
        missing: {
          title: "Missing verification code",
          body: "Open the link directly from the email you received, rather than typing this page's address.",
        },
      },
    },
    googleCallback: {
      pageTitle: "Logging in",
      completingSrOnly: "Completing login…",
      completingBody: "Completing login…",
      failedTitle: "Couldn't log in with Google",
      failedBody: "You may have cancelled on Google, or the sign-in session expired.",
      backToLoginLink: "Back to login",
    },
  },
  questions: {
    difficultyLabel: {
      EASY: "Easy",
      MEDIUM: "Medium",
      HARD: "Hard",
    } satisfies Record<Difficulty, string>,
    list: {
      pageHeading: "Interview questions",
      pageIntro: "Practice with a real question set, organized by topic.",
      categoryPageHeadingPrefix: "Interview questions",
      categoryPageIntroPrefix: "Practice with a real question set on",
      emptyTitle: "No matching questions found",
      emptyBody: "Try loosening the filters or changing your search terms.",
      meta: {
        titlePagePrefix: "page",
        descriptionBase: "A real interview question set",
        descriptionCategoryPrefix: "topic",
        descriptionDifficultyPrefix: "difficulty",
        descriptionTagPrefix: "tag",
        descriptionSuffix: "Practice for free, unlock detailed answers with Premium.",
        categoryDescription: (categoryName: string) =>
          `Interview question set for ${categoryName}. Practice for free, unlock detailed answers with Premium.`,
      },
    },
    detail: {
      breadcrumbAriaLabel: "Breadcrumb",
      answerHeading: "Answer",
      referenceLinksHeading: "Further reading",
      noAnswerYet: "This question doesn't have an answer yet.",
      revealAnswerCta: "Show answer",
      freeBadge: "Free",
      contributedByPrefix: "Contributed by",
      meta: {
        descriptionPrefix: "Interview question",
        descriptionCategoryInfix: "on",
        descriptionPremium: "Unlock the detailed answer with Premium.",
        descriptionFree: "See the detailed answer for free.",
      },
      premiumAnswer: {
        checkingAccessSrOnly: "Checking access…",
        checkFailedTitle: "Couldn't check access",
        checkFailedBody: "Check your network and try again.",
        gatedTitle: "Premium member content",
        gatedBodyLoggedIn: "Upgrade to Premium to see the full answer.",
        gatedBodyLoggedOut: "Log in and upgrade to Premium to see the full answer.",
        upgradeCta: "Upgrade now",
        loginCta: "Log in",
        unlockedBadge: "Unlocked",
        lockedBadge: "Locked",
      },
    },
    comments: {
      heading: "Comments & rating",
      rating: {
        heading: "Rate this answer",
        starAriaLabel: (value: number) => `${value} stars`,
        summary: (average: number, count: number) => `${average.toFixed(1)}/5 · ${count} ratings`,
        emptySummary: "No ratings yet",
      },
      list: {
        emptyBody: "No comments yet for this answer.",
        replyLabel: "Reply",
        reportLabel: "Report",
        reportedLabel: "Reported",
        editLabel: "Edit",
        deleteLabel: "Delete",
        saveEditLabel: "Save",
        savingEditLabel: "Saving…",
        cancelEditLabel: "Cancel",
      },
      form: {
        loginPromptBody: "Log in to comment on this answer.",
        loginPromptCta: "Log in",
        contentPlaceholder: "Write your comment...",
        replyPlaceholder: "Write your reply...",
        anonymousLabel: "Post anonymously",
        submitLabel: "Post comment",
        submitReplyLabel: "Post reply",
        cancelReplyLabel: "Cancel",
      },
    },
    filters: {
      formAriaLabel: "Filter questions",
      categoryLabel: "Topic",
      allCategories: "All topics",
      difficultyLabel: "Difficulty",
      allDifficulties: "All difficulties",
      planLabel: "Plan",
      allPlans: "All",
      freePlan: "Free",
      premiumPlan: "Premium",
      searchLabel: "Search",
      searchPlaceholder: "Enter a keyword...",
      searchSubmit: "Search",
      markStudyingLabel: "Mark as studying",
      unmarkStudyingLabel: "Studying this topic",
      tagLabel: "Tag",
      tagHint: "Tags filter further by specific technique within your selected Category",
      allTags: "All tags",
      tagsSelectedLabel: (n: number) => `${n} tag${n === 1 ? "" : "s"} selected`,
      clearTagsLabel: "Clear",
      activeTagsPrefix: "Tag:",
      removeTagAriaLabel: (tag: string) => `Remove tag ${tag}`,
    },
    pagination: {
      ariaLabel: "Pagination",
      prev: "Previous",
      next: "Next",
      pagePrefix: "Page",
      jumpAriaLabel: "Enter a page number to jump to",
      goButton: "Go",
    },
  },
  companies: {
    list: {
      pageHeading: "Company directory",
      pageIntro: "Look up company information to prepare better for interviews.",
      emptyTitle: "No matching companies found",
      emptyBody: "Try different search terms.",
      meta: {
        titlePagePrefix: "page",
        description: "A company directory to help you prepare for interviews.",
      },
    },
    detail: {
      breadcrumbAriaLabel: "Breadcrumb",
      meta: {
        descriptionPrefix: "Company info",
      },
      employeeSizeRangeLabel: {
        UNDER_50: "Under 50 employees",
        RANGE_50_200: "50–200 employees",
        RANGE_200_1000: "200–1,000 employees",
        RANGE_1000_5000: "1,000–5,000 employees",
        OVER_5000: "Over 5,000 employees",
      } satisfies Record<EmployeeSizeRange, string>,
      industriesAriaLabel: "Industries",
    },
    filters: {
      formAriaLabel: "Search companies",
      searchLabel: "Search",
      searchPlaceholder: "Enter a company name...",
      searchSubmit: "Search",
    },
    reviews: {
      // Same dev-console eyebrow convention as home.eyebrow — deliberately
      // ASCII/command-style in both locales, not translated.
      eyebrow: (count: number) => `$ reviews --count=${count}`,
      heading: "Company reviews",
      emptyBody: "No reviews for this company yet.",
      ratingAriaLabel: (rating: number) => `${rating} out of 5 stars`,
      status: {
        PENDING: "Pending approval",
        REJECTED: "Rejected",
      },
      adminReplyLabel: "Reply from the team",
      deleteLabel: "Delete",
      reportLabel: "Report",
      reportedLabel: "Reported",
      likeLabel: "Like",
      likeAriaLabel: (count: number) => `Like (${count} likes)`,
      unlikeAriaLabel: (count: number) => `Unlike (${count} likes)`,
      // Section heading above the write-review box — switches with login
      // state, same as the design (docs/design/figma-export's WriteReviewCard).
      shareExperienceHeading: "Share your experience",
      writeReviewHeading: "Write your review",
      form: {
        loginPromptHeading: "Log in to write a review",
        loginPromptBody: "You need to log in to share a review of this company.",
        loginPromptCta: "Log in",
        ratingLabel: "Your rating",
        ratingStarAriaLabel: (value: number) => `${value} star${value === 1 ? "" : "s"}`,
        contentLabel: "Review",
        contentPlaceholder: "Share your experience working here...",
        anonymousLabel: "Post anonymously",
        submitLabel: "Submit review",
        submittedNotice: "Thanks! Your review is pending admin approval.",
      },
    },
  },
  bookmarks: {
    toggle: {
      addLabel: "Save question",
      removeLabel: "Remove bookmark",
    },
    list: {
      pageTitle: "Saved questions",
      pageHeading: "Saved questions",
      pageIntro: "Questions you've saved to review later.",
      loadingSrOnly: "Loading saved questions…",
      emptyTitle: "You haven't saved any questions yet",
      emptyBody: "Tap the save icon on a question to add it here.",
      browseQuestionsLink: "Browse questions",
      errorTitle: "Couldn't load saved questions",
      errorBody: "Check your network and try again.",
      signedOutTitle: "Log in to see saved questions",
      signedOutBody: "You need to log in to save and review questions.",
    },
  },
  // BE-78/FU-44 (2026-08-21) — every attempt shown, not just successful
  // ones (confirmed via AskUserQuestion), so a user can self-serve "why
  // did this charge fail" instead of only ever seeing successful rows.
  paymentHistory: {
    pageTitle: "Payment history",
    pageHeading: "Payment history",
    pageIntro: "Every Premium payment attempt on your account, including ones that didn't succeed.",
    loadingSrOnly: "Loading payment history…",
    emptyTitle: "No transactions yet",
    emptyBody: "Your payment history will appear here once you upgrade to Premium.",
    browseSubscribeLink: "View pricing",
    errorTitle: "Couldn't load payment history",
    errorBody: "Check your network and try again.",
    signedOutTitle: "Log in to see your payment history",
    signedOutBody: "You need to log in to review your past transactions.",
    statusLabel: {
      SUCCESS: "Succeeded",
      FAILED: "Failed",
      PENDING: "Processing",
      REFUNDED: "Refunded",
    } as Record<string, string>,
  },
  profile: {
    pageTitle: "Your profile",
    pageHeading: "Your profile",
    emailLabel: "Email",
    displayNameLabel: "Display name",
    displayNameHint: "Shown instead of your email in public places, like company reviews. Optional.",
    displayNamePlaceholder: "No display name set",
    saveLabel: "Save changes",
    savingLabel: "Saving…",
    saveSuccess: "Display name saved.",
    saveError: "Couldn't save. Please try again.",
    signedOutTitle: "Log in to see your profile",
    signedOutBody: "You need to log in to view and edit your profile.",
  },
  contribute: {
    pageTitle: "Contribute a question",
    breadcrumbLabel: "Contribute a question",
    heading: "Contribute a question",
    intro:
      "Your question will be reviewed by an admin before it's published. Your display name will be credited publicly once it's approved.",
    loginPromptHeading: "Log in to contribute a question",
    loginPromptBody: "You need to log in to submit a question to the community.",
    loginPromptCta: "Log in",
    form: {
      titleLabel: "Question title",
      titleHint: "Keep it short and clear — this is what shows up in the question list.",
      titlePlaceholder: "Example: Explain the difference between BFS and DFS.",
      contentLabel: "Question content",
      contentHint: "Describe the question in full, with context or constraints if any.",
      contentPlaceholder: "Write the full question here...",
      answerLabel: "Suggested answer",
      answerHint: "Your reference answer. An admin may edit it before publishing.",
      answerPlaceholder: "Write out the answer, including complexity analysis if relevant...",
      categoryLabel: "Category (optional)",
      categoryHint: "Not sure which category fits? Leave it blank — an admin will pick one when reviewing.",
      categoryPlaceholder: "No category chosen",
      tagLabel: "Tags (optional)",
      consentNote: "By submitting, you agree to let the platform publish this question (once approved) and credit your display name.",
      resetLabel: "Reset",
      submitLabel: "Submit question",
      submittingLabel: "Submitting...",
    },
    displayNameRequired: {
      title: "You haven't set a display name",
      body: "Your display name will be credited publicly once this question is approved. Set one before contributing.",
      cta: "Go to profile settings",
    },
    genericError: "Couldn't submit the question. Please try again.",
    success: {
      statusLabel: "Submitted — pending review",
      heading: "Submitted — pending review",
      body: "Your question was submitted successfully and is awaiting admin review. You'll be notified once it's decided.",
      viewSubmissionsCta: "View my submissions",
      submitAnotherCta: "Submit another question",
    },
  },
  mySubmissions: {
    pageTitle: "Contributed questions",
    breadcrumbLabel: "Contributed questions",
    heading: "Contributed questions",
    loadingSrOnly: "Loading contributed questions…",
    signedOutTitle: "Log in to see your contributed questions",
    signedOutBody: "You need to log in to view the status of your submissions.",
    errorTitle: "Couldn't load the list",
    errorBody: "Check your network and try again.",
    emptyTitle: "No submissions yet",
    emptyBody: "You haven't contributed any questions yet. Start sharing your knowledge with the community.",
    emptyCta: "Contribute your first question",
    contributeMoreCta: "Contribute another",
    status: {
      PENDING: "Pending",
      APPROVED: "Approved",
      REJECTED: "Rejected",
    } as Record<SubmissionStatus, string>,
    rejectionReasonLabel: "Rejection reason",
    editLabel: "Edit",
    saveLabel: "Save",
    savingLabel: "Saving...",
    cancelLabel: "Cancel",
    withdrawLabel: "Withdraw",
    viewPublishedCta: "View published question",
    lockedLabel: "Locked",
    actionError: "Couldn't save your changes. This question may have just been reviewed — try reloading the page.",
    summary: (approved: number, pending: number, rejected: number) =>
      `${approved} approved · ${pending} pending · ${rejected} rejected`,
  },
  notifications: {
    heading: "Notifications",
    loadingSrOnly: "Loading notifications…",
    errorTitle: "Couldn't load notifications",
    errorBody: "Check your network and try again.",
    emptyTitle: "No notifications yet",
    emptyBody: "Updates about your account and subscription will show up here.",
    unreadBadgeAriaLabel: (count: number) => `${count} unread notifications`,
    message: (type: string, payload: Record<string, unknown>): string => {
      const planLabel = (planName: unknown) =>
        typeof planName === "string" ? (en.subscription.planName[planName] ?? planName) : "";
      switch (type) {
        case "UserRegistered":
          return "Welcome to DevDeck! Your account was created successfully.";
        case "SubscriptionActivated":
          return `${planLabel(payload.planName)} was activated successfully.`;
        case "PaymentFailed":
          return `Payment for ${planLabel(payload.planName)} failed. Please try again.`;
        case "SubmissionApproved": {
          const title = typeof payload.questionTitle === "string" ? payload.questionTitle : "";
          return `Your contributed question "${title}" was approved and published!`;
        }
        default:
          return "You have a new notification.";
      }
    },
    settingsLinkLabel: "Notification settings",
    preferences: {
      pageTitle: "Notification settings",
      pageHeading: "Notification settings",
      pageIntro: "Choose which notifications you want to receive by email.",
      loadingSrOnly: "Loading notification settings…",
      errorTitle: "Couldn't load notification settings",
      errorBody: "Check your network and try again.",
      signedOutTitle: "Log in to see notification settings",
      signedOutBody: "You need to log in to view and edit notification settings.",
      transactionalGroupTitle: "Transactional",
      transactionalGroupBody: "Account created, plan activated, payment failed.",
      transactionalGroupNote: "Always on — protects you from missing important account or payment information.",
      remindersGroupTitle: "Reminders",
      remindersGroupBody: "A reminder before your plan renews.",
      remindersToggleLabel: "Receive renewal reminder emails",
      savingLabel: "Saving…",
      savedLabel: "Saved",
      saveError: "Couldn't save. Please try again.",
    },
  },
  subscription: {
    planName: {
      MONTHLY: "Monthly Plan",
      LIFETIME: "Lifetime Plan",
    } as Record<string, string>,
    subscribe: {
      pageTitle: "Upgrade to Premium",
      pageHeading: "Choose a Premium plan",
      pageIntro: "Unlock full, detailed answers for every interview question.",
      // 2026-08-18 — shown instead of the plan selector while
      // PAYMENTS_ENABLED=false (lib/constants/app.ts).
      comingSoonTitle: "Premium plans are coming soon",
      comingSoonBody:
        "We're finishing up checkout. In the meantime, everything — including the suggested answer for Premium questions — is free for everyone.",
      comingSoonCta: "Browse questions",
      loadingSrOnly: "Loading plans…",
      errorTitle: "Couldn't load plans",
      errorBody: "Check your network and try again.",
      emptyTitle: "No plans available right now",
      perPeriodSuffix: "/ month",
      oneTimeSuffix: "one-time",
      recommendedBadge: "Most popular",
      freeTitle: "Free",
      freePriceLabel: "$0",
      freeDescription: "Read every question, including free ones, no account needed.",
      freeCta: "Browse free questions",
      // All real, non-Premium features: real free-question total (from the
      // API), study-mark/bookmark tracking (FU-22), company reviews
      // (BE-36/37) — not a dashboard-style "progress tracking" feature the
      // product doesn't have.
      freeBenefits: (count: number) => [
        `Access all ${count} free questions`,
        "Mark topics you're studying and bookmark favorite questions",
        "Write company reviews",
      ],
      planDescription: {
        MONTHLY: "Good for a quick refresh before a specific round of interviews.",
        LIFETIME: "Pay once, use forever — no renewal needed.",
      } as Record<string, string>,
      // What Premium actually unlocks (business-rule.md#premium-gating,
      // #Premium-content-leak) — the same for both paid plans, since both
      // grant identical entitlement and differ only in price/duration.
      benefits: [
        "Unlock detailed answers for every question, including Premium ones",
        "See comments and ratings on Premium questions",
        "Applies across every interview topic",
      ],
      paymentNote: "Secure payment via MoMo",
      selectCta: "Choose this plan",
      selectCtaLoading: "Redirecting to MoMo…",
      signedOutTitle: "Log in to upgrade",
      signedOutBody: "You need to log in before choosing a Premium plan.",
      alreadySubscribed: {
        title: "You're already a Premium member",
        bodyLifetime: "Your Lifetime plan never expires.",
        bodyWithExpiry: (date: string) => `Your current plan is valid until ${date}.`,
      },
      // Shown instead of "Choose this plan" once the user already owns
      // Lifetime — buying anything else can never add value on top of it.
      currentPlanBadge: "✓ Your current plan",
      lifetimeOwnedCta: "Already have Lifetime — no need to buy",
      checkoutError: "Couldn't start checkout. Please try again.",
      alreadyLifetimeError: "You already have the Lifetime plan — no other plan can add to it.",
    },
    callback: {
      pageTitle: "Confirming payment",
      confirmingSrOnly: "Confirming payment…",
      confirmingBody: "Confirming your payment with MoMo. Please wait a moment…",
      successTitle: "Payment successful",
      successBody: "Your account has been upgraded to Premium.",
      premiumAccessLabel: "Premium Access",
      neverExpiresLabel: "Never expires",
      validUntilLabel: (date: string) => `Valid until ${date}`,
      goToQuestionsLink: "See Premium questions",
      pendingTitle: "Payment confirmation not received yet",
      pendingBody:
        "We haven't received payment confirmation from MoMo yet. If your payment succeeded, this page will update automatically in a few minutes — otherwise, please try again.",
      retryLink: "Try again",
      backToSubscribeLink: "Back to plan selection",
      signedOutTitle: "Couldn't determine your session",
      signedOutBody: "Log in again to check your payment status.",
    },
    // BE-75/FU-40 — the fake-payment-provider confirmation page.
    fakeCheckout: {
      pageTitle: "Test payment",
      badgeLabel: "🧪 Test mode",
      heading: "Test payment",
      body: "This is a test payment environment — no real transaction has been made. Click confirm below to activate the Premium plan right away.",
      amountLabel: "Amount",
      confirmLabel: "Confirm payment",
      confirmingLabel: "Confirming…",
      errorBody: "Couldn't confirm the payment. Please try again.",
      retryLabel: "Try again",
      cancelLink: "Cancel, back to plan selection",
      missingTxnTitle: "Missing transaction info",
      missingTxnBody: "This payment link is invalid or has expired.",
    },
  },
  home: {
    siteDescription: "Practice interviews with a real question set, organized by topic.",
    heroBody: "Practice interviews with a real question set, organized by topic.",
    browseQuestionsLink: "Browse questions",
    loginLink: "Log in",
    createAccountLink: "Create account",
    eyebrow: "$ interview-training --topic=all --level=junior..senior",
    heroHeadingBeforeMark: "Practice interviews with real questions, ",
    heroHeadingMark: "with suggested answers",
    // 2026-08-18 — accurate while PREMIUM_GATING_ENABLED=false (backend
    // env.ts): everything, including Premium answers, is free right now.
    // Revert alongside that flag.
    heroSub:
      "Browse interview questions by topic and difficulty, answer them yourself first, then compare against the suggested answer — every question, including Premium ones, is free to read right now.",
    searchPlaceholder: "e.g. event loop, React hooks, database normalization...",
    searchSubmit: "Search",
    searchAriaLabel: "Search interview questions",
    flashcard: {
      tagLabel: "QUESTION #128",
      category: "JavaScript",
      questionBeforeMark: "Explain how the ",
      questionMark: "event loop",
      questionAfterMark: " works.",
      reviewedLabel: "Reviewed 3 times",
    },
    categoriesHeading: "Browse by topic",
    categoriesCaption: "Pick a topic to start practicing.",
    categoriesQuestionCount: (total: number) => `(${total} questions)`,
    categoriesViewAll: "View all →",
    // Logged-in only — homepage "Topics you're studying" section.
    studyingHeading: "Topics you're studying",
    studyingEmptyTitle: "You haven't marked any topics yet",
    studyingEmptyBody: "Click the ⭐ next to a topic in the Questions page's sidebar to mark it as studying — it'll show up here next time you're back.",
    benefits: [
      {
        title: "Focused practice",
        body: "Filter questions by topic and difficulty, and focus on your weak spots instead of reading everything.",
      },
      {
        title: "Detailed suggested answers",
        body: "Every Premium question comes with a full suggested answer, so you know exactly what you're missing.",
      },
      {
        title: "Save for later",
        body: "Bookmark questions to come back to before your interview day.",
      },
    ],
    howItWorksHeading: "How it works",
    steps: [
      { title: "Pick a topic and level", body: "Browse the question catalog or search by keyword." },
      { title: "Answer it yourself first", body: "Read the question and try answering it like a real interview." },
      {
        title: "Compare with the suggested answer",
        body: "See the suggested answer right away — Premium questions are free to unlock too, for now.",
      },
    ],
    ctaHeading: "Ready to practice more seriously?",
    ctaBody: "Unlock every suggested answer with Premium.",
    ctaLink: "See pricing",
    faqHeading: "Frequently asked questions",
    faq: [
      {
        // 2026-08-18 — accurate while PREMIUM_GATING_ENABLED=false
        // (backend/src/shared/config/env.ts): payment isn't live yet, so
        // nothing is actually paywalled. Revert alongside that flag.
        question: "Do I have to pay to see the questions?",
        answer:
          "No. Every question — including the suggested answer for Premium questions — is free to read for everyone during launch.",
      },
      {
        question: "What's different about Premium questions?",
        answer:
          "Premium questions usually come with a more detailed answer, sometimes a code demo or a \"when to use which\" note. Once paid plans launch, that answer will require an active plan — for now it's open to everyone.",
      },
      {
        question: "When will paid plans launch?",
        answer: "We're finishing up MoMo checkout. In the meantime, everything is free to read.",
      },
    ],
  },
} as const;
