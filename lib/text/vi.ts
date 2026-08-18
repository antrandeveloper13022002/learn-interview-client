import type { Difficulty, EmployeeSizeRange, SubmissionStatus } from "@/lib/types";

// All Vietnamese UI copy for frontend-user, namespaced by feature. Never
// imported directly by components — go through "./index" (`text`), the one
// place a future locale would be swapped in without touching call sites.
export const vi = {
  header: {
    navAriaLabel: "Chính",
    homeLink: "Trang chủ",
    questionsLink: "Câu hỏi",
    companiesLink: "Công ty",
    subscribeLink: "Bảng giá",
    bookmarksLink: "Câu hỏi đã lưu",
    contributeLink: "Đóng góp",
    mySubmissionsLink: "Bài đã đóng góp",
    notificationsLabel: "Thông báo",
    profileLink: "Hồ sơ",
    logoutLabel: "Đăng xuất",
    loginLink: "Đăng nhập",
    loginRegisterLink: "Đăng nhập / Đăng ký",
    closeMenuLabel: "Đóng menu",
    openMenuLabel: "Mở menu điều hướng",
  },
  footer: {
    tagline: "Nền tảng luyện phỏng vấn dành cho thị trường Việt Nam.",
  },
  themeToggle: {
    switchToLight: "Chuyển sang chế độ sáng",
    switchToDark: "Chuyển sang chế độ tối",
  },
  common: {
    loading: "Đang tải…",
    or: "hoặc",
    goToLoginLink: "Đến trang đăng nhập",
    networkError: "Không thể kết nối máy chủ. Kiểm tra mạng và thử lại.",
    passwordHint: (minLength: number) => `Tối thiểu ${minLength} ký tự`,
    premiumBadge: "Premium",
    retryLabel: "Thử lại",
    genericErrorTitle: "Đã có lỗi xảy ra",
    genericErrorBody: "Vui lòng thử lại. Nếu lỗi vẫn tiếp diễn, hãy quay lại sau.",
    notFoundTitle: "Không tìm thấy trang",
    notFoundBody: "Trang bạn tìm không tồn tại hoặc đã được di chuyển.",
    backToHomeLink: "Về trang chủ",
  },
  auth: {
    login: {
      pageTitle: "Đăng nhập",
      heading: "Đăng nhập",
      subtitle: "Đăng nhập để tiếp tục luyện tập.",
      emailLabel: "Email",
      passwordLabel: "Mật khẩu",
      forgotPasswordLink: "Quên mật khẩu?",
      submitLabel: "Đăng nhập",
      submitLoading: "Đang đăng nhập…",
      googleLabel: "Tiếp tục với Google",
      noAccount: "Chưa có tài khoản?",
      createAccountLink: "Tạo tài khoản",
      errors: {
        emailNotVerified:
          "Email chưa được xác minh. Kiểm tra hộp thư để lấy link xác minh trước khi đăng nhập.",
        invalidCredentials: "Email hoặc mật khẩu chưa đúng.",
      },
    },
    register: {
      pageTitle: "Tạo tài khoản",
      heading: "Tạo tài khoản",
      subtitle: "Tạo tài khoản miễn phí để lưu câu hỏi và luyện tập.",
      emailLabel: "Email",
      passwordLabel: "Mật khẩu",
      submitLabel: "Tạo tài khoản",
      submitLoading: "Đang tạo tài khoản…",
      googleLabel: "Đăng ký với Google",
      haveAccount: "Đã có tài khoản?",
      loginLink: "Đăng nhập",
      emailTakenPrefix: "Email này đã được đăng ký.",
      emailTakenLoginLink: "Đăng nhập",
      emailTakenSuffix: "hoặc dùng email khác.",
      errors: {
        validationError: "Vui lòng kiểm tra lại email và mật khẩu đã nhập.",
      },
      success: {
        title: "Kiểm tra email để xác minh tài khoản",
        bodyBeforeEmail: "Chúng tôi đã gửi một email xác minh đến ",
        bodyAfterEmail: ". Bạn cần xác minh email trước khi đăng nhập.",
      },
    },
    forgotPassword: {
      pageTitle: "Quên mật khẩu",
      heading: "Quên mật khẩu",
      emailLabel: "Email",
      submitLabel: "Gửi link đặt lại mật khẩu",
      submitLoading: "Đang gửi…",
      success: {
        title: "Kiểm tra email của bạn",
        bodyBeforeEmail: "Nếu ",
        bodyAfterEmail: " có tài khoản, chúng tôi đã gửi link đặt lại mật khẩu đến đó.",
      },
    },
    resetPassword: {
      pageTitle: "Đặt lại mật khẩu",
      heading: "Đặt lại mật khẩu",
      newPasswordLabel: "Mật khẩu mới",
      confirmPasswordLabel: "Nhập lại mật khẩu mới",
      mismatchError: "Mật khẩu nhập lại không khớp.",
      submitLabel: "Đặt lại mật khẩu",
      submitLoading: "Đang đặt lại…",
      missingToken: {
        title: "Thiếu mã đặt lại mật khẩu",
        body: "Mở link trực tiếp từ email đã nhận.",
      },
      success: {
        title: "Đã đặt lại mật khẩu",
        body: "Tất cả phiên đăng nhập trước đó đã bị đăng xuất. Đăng nhập lại với mật khẩu mới.",
      },
      errors: {
        tokenExpired: "Link đặt lại mật khẩu đã hết hạn. Yêu cầu link mới.",
        tokenUsed: "Link này đã được dùng trước đó. Yêu cầu link mới nếu vẫn cần đặt lại.",
        tokenInvalid: "Link đặt lại mật khẩu không hợp lệ. Kiểm tra lại đường link trong email.",
      },
    },
    verifyEmail: {
      pageTitle: "Xác minh email",
      heading: "Xác minh email",
      verifyingSrOnly: "Đang xác minh…",
      verifyingBody: "Đang xác minh email…",
      status: {
        success: { title: "Email đã được xác minh", body: "Bạn có thể đăng nhập ngay bây giờ." },
        expired: {
          title: "Link xác minh đã hết hạn",
          body: "Đăng ký lại hoặc liên hệ hỗ trợ để nhận link xác minh mới.",
        },
        used: {
          title: "Link này đã được sử dụng",
          body: "Tài khoản có thể đã được xác minh trước đó — thử đăng nhập.",
        },
        invalid: {
          title: "Link xác minh không hợp lệ",
          body: "Kiểm tra lại đường link trong email, hoặc yêu cầu gửi lại.",
        },
        missing: {
          title: "Thiếu mã xác minh",
          body: "Mở link trực tiếp từ email đã nhận, đừng gõ tay địa chỉ trang này.",
        },
      },
    },
    googleCallback: {
      pageTitle: "Đang đăng nhập",
      completingSrOnly: "Đang hoàn tất đăng nhập…",
      completingBody: "Đang hoàn tất đăng nhập…",
      failedTitle: "Không thể đăng nhập bằng Google",
      failedBody: "Bạn có thể đã huỷ xác nhận trên Google, hoặc phiên đăng nhập đã hết hạn.",
      backToLoginLink: "Quay lại trang đăng nhập",
    },
  },
  questions: {
    difficultyLabel: {
      EASY: "Dễ",
      MEDIUM: "Trung bình",
      HARD: "Khó",
    } satisfies Record<Difficulty, string>,
    list: {
      pageHeading: "Câu hỏi phỏng vấn",
      pageIntro: "Luyện tập với bộ câu hỏi thực tế theo từng chủ đề.",
      categoryPageHeadingPrefix: "Câu hỏi phỏng vấn",
      categoryPageIntroPrefix: "Luyện tập với bộ câu hỏi thực tế chủ đề",
      emptyTitle: "Không tìm thấy câu hỏi phù hợp",
      emptyBody: "Thử bỏ bớt bộ lọc hoặc đổi từ khoá tìm kiếm.",
      meta: {
        titlePagePrefix: "trang",
        descriptionBase: "Bộ câu hỏi phỏng vấn thực tế",
        descriptionCategoryPrefix: "chủ đề",
        descriptionDifficultyPrefix: "độ khó",
        descriptionTagPrefix: "tag",
        descriptionSuffix: "Luyện tập miễn phí, mở khoá đáp án chi tiết với gói Premium.",
        categoryDescription: (categoryName: string) =>
          `Bộ câu hỏi phỏng vấn chủ đề ${categoryName}. Luyện tập miễn phí, mở khoá đáp án chi tiết với gói Premium.`,
      },
    },
    detail: {
      breadcrumbAriaLabel: "Breadcrumb",
      answerHeading: "Đáp án",
      referenceLinksHeading: "Tài liệu tham khảo",
      noAnswerYet: "Câu hỏi này chưa có đáp án.",
      revealAnswerCta: "Hiện đáp án",
      freeBadge: "Miễn phí",
      contributedByPrefix: "Đóng góp bởi",
      meta: {
        descriptionPrefix: "Câu hỏi phỏng vấn",
        descriptionCategoryInfix: "chủ đề",
        descriptionPremium: "Mở khoá đáp án chi tiết với gói Premium.",
        descriptionFree: "Xem đáp án chi tiết miễn phí.",
      },
      premiumAnswer: {
        checkingAccessSrOnly: "Đang kiểm tra quyền truy cập…",
        checkFailedTitle: "Không thể kiểm tra quyền truy cập",
        checkFailedBody: "Kiểm tra mạng và thử lại.",
        gatedTitle: "Nội dung dành cho thành viên Premium",
        gatedBodyLoggedIn: "Nâng cấp gói Premium để xem đáp án đầy đủ.",
        gatedBodyLoggedOut: "Đăng nhập và nâng cấp gói Premium để xem đáp án đầy đủ.",
        upgradeCta: "Nâng cấp ngay",
        loginCta: "Đăng nhập",
        unlockedBadge: "Đã mở khoá",
        lockedBadge: "Khoá",
      },
    },
    filters: {
      formAriaLabel: "Lọc câu hỏi",
      categoryLabel: "Chủ đề",
      allCategories: "Tất cả chủ đề",
      difficultyLabel: "Độ khó",
      allDifficulties: "Tất cả độ khó",
      planLabel: "Gói",
      allPlans: "Tất cả",
      freePlan: "Miễn phí",
      premiumPlan: "Premium",
      searchLabel: "Tìm kiếm",
      searchPlaceholder: "Nhập từ khoá...",
      searchSubmit: "Tìm",
      markStudyingLabel: "Đánh dấu đang ôn",
      unmarkStudyingLabel: "Đang ôn chủ đề này",
      tagLabel: "Tag",
      allTags: "Tất cả tag",
      tagsSelectedLabel: (n: number) => `${n} tag đã chọn`,
      clearTagsLabel: "Xoá lọc",
      activeTagsPrefix: "Tag:",
      removeTagAriaLabel: (tag: string) => `Xoá tag ${tag}`,
    },
    pagination: {
      ariaLabel: "Phân trang",
      prev: "Trước",
      next: "Sau",
      pageOf: (page: number, totalPages: number) => `Trang ${page} / ${totalPages}`,
    },
  },
  companies: {
    list: {
      pageHeading: "Danh bạ công ty",
      pageIntro: "Tra cứu thông tin các công ty để chuẩn bị phỏng vấn tốt hơn.",
      emptyTitle: "Không tìm thấy công ty phù hợp",
      emptyBody: "Thử đổi từ khoá tìm kiếm.",
      meta: {
        titlePagePrefix: "trang",
        description: "Danh bạ công ty phục vụ chuẩn bị phỏng vấn.",
      },
    },
    detail: {
      breadcrumbAriaLabel: "Breadcrumb",
      meta: {
        descriptionPrefix: "Thông tin công ty",
      },
      // Confirmed 2026-08-06 (BE-51/52) — all optional, no field renders
      // when unset (FU-17 DoD).
      employeeSizeRangeLabel: {
        UNDER_50: "Dưới 50 nhân viên",
        RANGE_50_200: "50–200 nhân viên",
        RANGE_200_1000: "200–1.000 nhân viên",
        RANGE_1000_5000: "1.000–5.000 nhân viên",
        OVER_5000: "Trên 5.000 nhân viên",
      } satisfies Record<EmployeeSizeRange, string>,
      industriesAriaLabel: "Ngành nghề",
    },
    filters: {
      formAriaLabel: "Tìm công ty",
      searchLabel: "Tìm kiếm",
      searchPlaceholder: "Nhập tên công ty...",
      searchSubmit: "Tìm",
    },
    // FU-12 (BE-37/38/39) — unlimited reviews per user per company,
    // pre-publish moderation (business-rule.md#company-reviews--moderation--
    // confirmed-2026-08-04).
    reviews: {
      // Same dev-console eyebrow convention as home.eyebrow — deliberately
      // ASCII/command-style in both locales, not translated.
      eyebrow: (count: number) => `$ reviews --count=${count}`,
      heading: "Đánh giá công ty",
      emptyBody: "Chưa có đánh giá nào cho công ty này.",
      ratingAriaLabel: (rating: number) => `${rating} trên 5 sao`,
      status: {
        PENDING: "Đang chờ duyệt",
        REJECTED: "Bị từ chối",
      },
      adminReplyLabel: "Phản hồi từ quản trị viên",
      deleteLabel: "Xoá",
      reportLabel: "Báo cáo",
      reportedLabel: "Đã báo cáo",
      // Section heading above the write-review box — switches with login
      // state, same as the design (docs/design/figma-export's WriteReviewCard).
      shareExperienceHeading: "Chia sẻ trải nghiệm",
      writeReviewHeading: "Viết đánh giá của bạn",
      form: {
        loginPromptHeading: "Đăng nhập để viết đánh giá",
        loginPromptBody: "Bạn cần đăng nhập để chia sẻ đánh giá về công ty này.",
        loginPromptCta: "Đăng nhập",
        ratingLabel: "Đánh giá của bạn",
        ratingStarAriaLabel: (value: number) => `${value} sao`,
        contentLabel: "Nội dung",
        contentPlaceholder: "Chia sẻ trải nghiệm làm việc của bạn...",
        anonymousLabel: "Đăng ẩn danh",
        submitLabel: "Gửi đánh giá",
        submittedNotice: "Cảm ơn bạn! Đánh giá của bạn đang chờ quản trị viên duyệt.",
      },
    },
  },
  bookmarks: {
    toggle: {
      addLabel: "Lưu câu hỏi",
      removeLabel: "Bỏ lưu câu hỏi",
    },
    list: {
      pageTitle: "Câu hỏi đã lưu",
      pageHeading: "Câu hỏi đã lưu",
      pageIntro: "Danh sách câu hỏi bạn đã lưu để xem lại.",
      loadingSrOnly: "Đang tải danh sách đã lưu…",
      emptyTitle: "Bạn chưa lưu câu hỏi nào",
      emptyBody: "Nhấn biểu tượng lưu trên một câu hỏi để thêm vào đây.",
      browseQuestionsLink: "Xem danh sách câu hỏi",
      errorTitle: "Không thể tải danh sách đã lưu",
      errorBody: "Kiểm tra mạng và thử lại.",
      signedOutTitle: "Đăng nhập để xem câu hỏi đã lưu",
      signedOutBody: "Bạn cần đăng nhập để lưu và xem lại câu hỏi.",
    },
  },
  // FU-17 (2026-08-06) — self-service displayName edit, confirmed optional
  // and not part of registration.
  profile: {
    pageTitle: "Hồ sơ của bạn",
    pageHeading: "Hồ sơ của bạn",
    emailLabel: "Email",
    displayNameLabel: "Tên hiển thị",
    displayNameHint: "Hiển thị thay cho email ở những nơi công khai, ví dụ trên đánh giá công ty. Không bắt buộc.",
    displayNamePlaceholder: "Chưa đặt tên hiển thị",
    saveLabel: "Lưu thay đổi",
    savingLabel: "Đang lưu…",
    saveSuccess: "Đã lưu tên hiển thị.",
    saveError: "Không thể lưu. Vui lòng thử lại.",
    signedOutTitle: "Đăng nhập để xem hồ sơ",
    signedOutBody: "Bạn cần đăng nhập để xem và chỉnh sửa hồ sơ.",
  },
  // FU-23 (2026-08-13) — business-rule.md#user-contributed-questions--
  // confirmed-2026-08-11, backed by BE-58/59/60.
  contribute: {
    pageTitle: "Đóng góp câu hỏi",
    breadcrumbLabel: "Đóng góp câu hỏi",
    heading: "Đóng góp câu hỏi",
    intro:
      "Câu hỏi của bạn sẽ được đội ngũ quản trị viên xem xét trước khi xuất bản. Tên hiển thị của bạn sẽ được ghi nhận công khai khi câu hỏi được duyệt.",
    loginPromptHeading: "Đăng nhập để đóng góp câu hỏi",
    loginPromptBody: "Bạn cần đăng nhập để gửi câu hỏi cho cộng đồng.",
    loginPromptCta: "Đăng nhập",
    form: {
      titleLabel: "Tiêu đề câu hỏi",
      titleHint: "Viết ngắn gọn, rõ ràng — sẽ hiển thị trong danh sách câu hỏi.",
      titlePlaceholder: "Ví dụ: Giải thích sự khác biệt giữa BFS và DFS.",
      contentLabel: "Nội dung câu hỏi",
      contentHint: "Mô tả chi tiết câu hỏi, bối cảnh, ràng buộc nếu có.",
      contentPlaceholder: "Viết nội dung câu hỏi đầy đủ ở đây...",
      answerLabel: "Gợi ý đáp án",
      answerHint: "Đáp án tham khảo của bạn. Quản trị viên có thể chỉnh sửa trước khi duyệt.",
      answerPlaceholder: "Trình bày đáp án, bao gồm phân tích độ phức tạp nếu áp dụng...",
      consentNote: "Bằng cách gửi, bạn đồng ý cho phép nền tảng xuất bản câu hỏi này (sau khi duyệt) và ghi nhận tên hiển thị của bạn.",
      resetLabel: "Đặt lại",
      submitLabel: "Gửi câu hỏi",
      submittingLabel: "Đang gửi...",
    },
    displayNameRequired: {
      title: "Bạn chưa đặt tên hiển thị",
      body: "Tên hiển thị sẽ được ghi nhận công khai khi câu hỏi được duyệt. Hãy đặt tên trước khi đóng góp.",
      cta: "Cài đặt hồ sơ",
    },
    genericError: "Không thể gửi câu hỏi. Vui lòng thử lại.",
    success: {
      statusLabel: "Đã gửi — chờ duyệt",
      heading: "Đã gửi — chờ duyệt",
      body: "Câu hỏi của bạn đã được gửi thành công và đang chờ đội ngũ quản trị viên xét duyệt. Bạn sẽ nhận thông báo khi có kết quả.",
      viewSubmissionsCta: "Xem câu hỏi đã gửi",
      submitAnotherCta: "Gửi câu hỏi khác",
    },
  },
  mySubmissions: {
    pageTitle: "Câu hỏi đã đóng góp",
    breadcrumbLabel: "Câu hỏi đã đóng góp",
    heading: "Câu hỏi đã đóng góp",
    loadingSrOnly: "Đang tải câu hỏi đã đóng góp…",
    signedOutTitle: "Đăng nhập để xem câu hỏi đã đóng góp",
    signedOutBody: "Bạn cần đăng nhập để xem trạng thái câu hỏi đã gửi.",
    errorTitle: "Không thể tải danh sách",
    errorBody: "Kiểm tra mạng và thử lại.",
    emptyTitle: "Chưa có câu hỏi nào",
    emptyBody: "Bạn chưa đóng góp câu hỏi nào. Hãy bắt đầu chia sẻ kiến thức của mình với cộng đồng.",
    emptyCta: "Đóng góp câu hỏi đầu tiên",
    contributeMoreCta: "Đóng góp thêm",
    status: {
      PENDING: "Chờ duyệt",
      APPROVED: "Đã duyệt",
      REJECTED: "Từ chối",
    } as Record<SubmissionStatus, string>,
    rejectionReasonLabel: "Lý do từ chối",
    editLabel: "Chỉnh sửa",
    saveLabel: "Lưu",
    savingLabel: "Đang lưu...",
    cancelLabel: "Huỷ",
    withdrawLabel: "Rút lại",
    viewPublishedCta: "Xem câu hỏi đã đăng",
    lockedLabel: "Đã khoá",
    // Most likely real cause: an admin approved/rejected this exact
    // submission while the edit form was open (SUBMISSION_NOT_PENDING) —
    // worded to cover that race without being wrong for a plain network
    // failure either.
    actionError: "Không thể lưu thay đổi. Câu hỏi có thể vừa được xét duyệt — hãy tải lại trang.",
    summary: (approved: number, pending: number, rejected: number) =>
      `${approved} đã duyệt · ${pending} đang chờ · ${rejected} từ chối`,
  },
  // FU-13 (2026-08-13) — backed by BE-41. `type` is free-text server-side,
  // message() falls back to a generic line for any type this dictionary
  // doesn't recognize yet, rather than rendering nothing.
  notifications: {
    heading: "Thông báo",
    loadingSrOnly: "Đang tải thông báo…",
    errorTitle: "Không thể tải thông báo",
    errorBody: "Kiểm tra mạng và thử lại.",
    emptyTitle: "Chưa có thông báo nào",
    emptyBody: "Thông báo về tài khoản và gói đăng ký của bạn sẽ hiển thị ở đây.",
    unreadBadgeAriaLabel: (count: number) => `${count} thông báo chưa đọc`,
    message: (type: string, payload: Record<string, unknown>): string => {
      const planLabel = (planName: unknown) =>
        typeof planName === "string" ? (vi.subscription.planName[planName] ?? planName) : "";
      switch (type) {
        case "UserRegistered":
          return "Chào mừng bạn đến với DevDeck! Tài khoản của bạn đã được tạo thành công.";
        case "SubscriptionActivated":
          return `${planLabel(payload.planName)} đã được kích hoạt thành công.`;
        case "PaymentFailed":
          return `Thanh toán cho ${planLabel(payload.planName)} không thành công. Vui lòng thử lại.`;
        default:
          return "Bạn có một thông báo mới.";
      }
    },
    settingsLinkLabel: "Cài đặt thông báo",
    // FU-14 (2026-08-13) — the "Preference categories" split confirmed in
    // business-rule.md: Giao dịch (never muteable) vs. Nhắc nhở (toggleable).
    preferences: {
      pageTitle: "Cài đặt thông báo",
      pageHeading: "Cài đặt thông báo",
      pageIntro: "Chọn loại thông báo bạn muốn nhận qua email.",
      loadingSrOnly: "Đang tải cài đặt thông báo…",
      errorTitle: "Không thể tải cài đặt thông báo",
      errorBody: "Kiểm tra mạng và thử lại.",
      signedOutTitle: "Đăng nhập để xem cài đặt thông báo",
      signedOutBody: "Bạn cần đăng nhập để xem và chỉnh sửa cài đặt thông báo.",
      transactionalGroupTitle: "Giao dịch",
      transactionalGroupBody: "Tạo tài khoản, kích hoạt gói, thanh toán thất bại.",
      transactionalGroupNote: "Luôn bật — bảo vệ bạn khỏi bỏ lỡ thông tin quan trọng về tài khoản hoặc thanh toán.",
      remindersGroupTitle: "Nhắc nhở",
      remindersGroupBody: "Nhắc gia hạn gói trước khi hết hạn.",
      remindersToggleLabel: "Nhận email nhắc gia hạn",
      savingLabel: "Đang lưu…",
      savedLabel: "Đã lưu",
      saveError: "Không thể lưu. Vui lòng thử lại.",
    },
  },
  subscription: {
    planName: {
      MONTHLY: "Gói Tháng",
      LIFETIME: "Gói Trọn đời",
    } as Record<string, string>,
    subscribe: {
      pageTitle: "Nâng cấp Premium",
      pageHeading: "Chọn gói Premium",
      pageIntro: "Mở khoá toàn bộ đáp án chi tiết cho mọi câu hỏi phỏng vấn.",
      // 2026-08-18 — shown instead of the plan selector while
      // PAYMENTS_ENABLED=false (lib/constants/app.ts).
      comingSoonTitle: "Gói Premium sắp ra mắt",
      comingSoonBody:
        "Chúng tôi đang hoàn thiện tính năng thanh toán. Trong lúc chờ, toàn bộ nội dung — kể cả đáp án của câu hỏi Premium — đang mở miễn phí cho mọi người.",
      comingSoonCta: "Xem câu hỏi",
      loadingSrOnly: "Đang tải danh sách gói…",
      errorTitle: "Không thể tải danh sách gói",
      errorBody: "Kiểm tra mạng và thử lại.",
      emptyTitle: "Hiện chưa có gói nào khả dụng",
      perPeriodSuffix: "/ tháng",
      oneTimeSuffix: "1 lần duy nhất",
      recommendedBadge: "Phổ biến nhất",
      freeTitle: "Miễn phí",
      freePriceLabel: "0 đ",
      freeDescription: "Đọc toàn bộ câu hỏi và câu hỏi miễn phí, không cần tài khoản.",
      freeCta: "Xem câu hỏi miễn phí",
      // Đều là tính năng có thật, không cần Premium: tổng số câu hỏi miễn
      // phí (thực tế, lấy từ API), đánh dấu đang ôn/bookmark (FU-22), viết
      // đánh giá công ty (BE-36/37) — không phải "progress tracking" kiểu
      // dashboard chưa có trong sản phẩm.
      freeBenefits: (count: number) => [
        `Truy cập toàn bộ ${count} câu hỏi miễn phí`,
        "Đánh dấu chủ đề đang ôn và lưu câu hỏi yêu thích",
        "Viết đánh giá công ty",
      ],
      planDescription: {
        MONTHLY: "Phù hợp để ôn nhanh trước một đợt phỏng vấn cụ thể.",
        LIFETIME: "Trả một lần, dùng mãi mãi — không cần gia hạn.",
      } as Record<string, string>,
      // Quyền lợi thực tế mà Premium mở khoá (business-rule.md#premium-gating,
      // #Premium-content-leak) — giống nhau cho cả hai gói trả phí, vì cả hai
      // đều cấp cùng một quyền, chỉ khác giá/thời hạn.
      benefits: [
        "Mở khoá đáp án chi tiết cho mọi câu hỏi, kể cả câu hỏi Premium",
        "Xem bình luận và đánh giá trên các câu hỏi Premium",
        "Áp dụng cho toàn bộ chủ đề phỏng vấn",
      ],
      paymentNote: "Thanh toán an toàn qua MoMo",
      selectCta: "Chọn gói này",
      selectCtaLoading: "Đang chuyển đến MoMo…",
      signedOutTitle: "Đăng nhập để nâng cấp",
      signedOutBody: "Bạn cần đăng nhập trước khi chọn gói Premium.",
      alreadySubscribed: {
        title: "Bạn đã là thành viên Premium",
        bodyLifetime: "Gói Trọn đời của bạn không bao giờ hết hạn.",
        bodyWithExpiry: (date: string) => `Gói hiện tại của bạn còn hiệu lực đến ${date}.`,
      },
      checkoutError: "Không thể bắt đầu thanh toán. Vui lòng thử lại.",
    },
    callback: {
      pageTitle: "Đang xác nhận thanh toán",
      confirmingSrOnly: "Đang xác nhận thanh toán…",
      confirmingBody: "Đang xác nhận thanh toán với MoMo. Vui lòng đợi trong giây lát…",
      successTitle: "Thanh toán thành công",
      successBody: "Tài khoản của bạn đã được nâng cấp Premium.",
      goToQuestionsLink: "Xem câu hỏi Premium",
      pendingTitle: "Chưa nhận được xác nhận thanh toán",
      pendingBody:
        "Hệ thống chưa xác nhận được kết quả thanh toán từ MoMo. Nếu bạn đã thanh toán thành công, trang này sẽ tự cập nhật trong ít phút — nếu không, vui lòng thử lại.",
      retryLink: "Thử lại",
      backToSubscribeLink: "Quay lại chọn gói",
      signedOutTitle: "Không xác định được phiên đăng nhập",
      signedOutBody: "Đăng nhập lại để kiểm tra trạng thái thanh toán của bạn.",
    },
  },
  home: {
    siteDescription: "Luyện tập phỏng vấn với bộ câu hỏi thực tế theo từng chủ đề.",
    heroBody: "Luyện tập phỏng vấn với bộ câu hỏi thực tế theo từng chủ đề.",
    browseQuestionsLink: "Xem câu hỏi",
    loginLink: "Đăng nhập",
    createAccountLink: "Tạo tài khoản",
    eyebrow: "$ luyen-phong-van --topic=all --level=junior..senior",
    heroHeadingBeforeMark: "Luyện phỏng vấn với câu hỏi thực tế, ",
    heroHeadingMark: "có đáp án gợi ý",
    // 2026-08-18 — accurate while PREMIUM_GATING_ENABLED=false (backend
    // env.ts): everything, including Premium answers, is free right now.
    // Revert alongside that flag.
    heroSub:
      "Duyệt câu hỏi phỏng vấn theo chủ đề và mức độ khó, tự trả lời trước, rồi đối chiếu với đáp án gợi ý — toàn bộ nội dung, kể cả câu hỏi Premium, đang mở miễn phí.",
    searchPlaceholder: "VD: event loop, React hooks, chuẩn hoá cơ sở dữ liệu...",
    searchSubmit: "Tìm kiếm",
    searchAriaLabel: "Tìm câu hỏi phỏng vấn",
    flashcard: {
      tagLabel: "CÂU HỎI #128",
      category: "JavaScript",
      questionBeforeMark: "Giải thích ",
      questionMark: "Event Loop",
      questionAfterMark: " hoạt động như thế nào?",
      reviewedLabel: "Đã ôn tập 3 lần",
    },
    categoriesHeading: "Duyệt theo chủ đề",
    categoriesCaption: "Chọn một chủ đề để bắt đầu luyện tập.",
    categoriesQuestionCount: (total: number) => `(${total} câu hỏi)`,
    categoriesViewAll: "Xem tất cả →",
    // Chỉ hiện với người đã đăng nhập — mục "Chủ đề đang ôn" trên trang chủ.
    studyingHeading: "Chủ đề đang ôn",
    studyingEmptyTitle: "Bạn chưa đánh dấu chủ đề nào",
    studyingEmptyBody: "Bấm vào biểu tượng ⭐ cạnh một chủ đề trong danh sách bên trái trang Câu hỏi để đánh dấu đang ôn — lần sau quay lại sẽ thấy ngay ở đây.",
    benefits: [
      {
        title: "Luyện tập có định hướng",
        body: "Lọc câu hỏi theo chủ đề và độ khó, tập trung đúng phần bạn còn yếu thay vì đọc tràn lan.",
      },
      {
        title: "Đáp án gợi ý chi tiết",
        body: "Mỗi câu hỏi Premium có đáp án gợi ý đầy đủ, giúp bạn biết mình đang thiếu điều gì.",
      },
      {
        title: "Lưu lại để ôn tập",
        body: "Đánh dấu câu hỏi bằng Bookmark để quay lại ôn tập trước ngày phỏng vấn.",
      },
    ],
    howItWorksHeading: "Cách hoạt động",
    steps: [
      { title: "Chọn chủ đề và mức độ", body: "Duyệt danh mục câu hỏi hoặc tìm theo từ khoá." },
      { title: "Tự trả lời trước", body: "Đọc câu hỏi và thử trả lời như trong buổi phỏng vấn thật." },
      {
        title: "Đối chiếu đáp án gợi ý",
        body: "Xem đáp án gợi ý ngay — kể cả câu hỏi Premium, hiện đang mở miễn phí cho mọi người.",
      },
    ],
    ctaHeading: "Sẵn sàng luyện tập nghiêm túc hơn?",
    ctaBody: "Mở khoá toàn bộ đáp án gợi ý với gói Premium.",
    ctaLink: "Xem bảng giá",
    faqHeading: "Câu hỏi thường gặp",
    faq: [
      {
        // 2026-08-18 — accurate while PREMIUM_GATING_ENABLED=false
        // (backend/src/shared/config/env.ts): payment isn't live yet, so
        // nothing is actually paywalled. Revert alongside that flag.
        question: "Tôi có cần trả phí để xem câu hỏi không?",
        answer:
          "Không. Toàn bộ nội dung câu hỏi, kể cả đáp án gợi ý của câu hỏi Premium, hiện đang mở miễn phí cho mọi người trong giai đoạn ra mắt.",
      },
      {
        question: "Câu hỏi Premium khác gì câu hỏi thường?",
        answer:
          'Câu hỏi Premium thường đi kèm đáp án chi tiết hơn, có thể có code demo hoặc ghi chú "khi nào dùng cái nào". Sau này khi ra mắt gói trả phí, phần đáp án này sẽ yêu cầu tài khoản có gói còn hiệu lực — hiện tại vẫn đang mở miễn phí.',
      },
      {
        question: "Gói trả phí (Premium) khi nào ra mắt?",
        answer: "Chúng tôi đang hoàn thiện tính năng thanh toán qua MoMo. Trong lúc chờ, bạn có thể xem toàn bộ nội dung miễn phí.",
      },
    ],
  },
} as const;
