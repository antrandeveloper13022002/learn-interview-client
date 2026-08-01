import type { Difficulty } from "@/lib/types";

// All Vietnamese UI copy for frontend-user, namespaced by feature. Never
// imported directly by components — go through "./index" (`text`), the one
// place a future locale would be swapped in without touching call sites.
export const vi = {
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
  },
  auth: {
    login: {
      pageTitle: "Đăng nhập",
      heading: "Đăng nhập",
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
        descriptionSuffix: "Luyện tập miễn phí, mở khoá đáp án chi tiết với gói Premium.",
        categoryDescription: (categoryName: string) =>
          `Bộ câu hỏi phỏng vấn chủ đề ${categoryName}. Luyện tập miễn phí, mở khoá đáp án chi tiết với gói Premium.`,
      },
    },
    detail: {
      breadcrumbAriaLabel: "Breadcrumb",
      answerHeading: "Đáp án",
      noAnswerYet: "Câu hỏi này chưa có đáp án.",
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
    },
    pagination: {
      ariaLabel: "Phân trang",
      prev: "Trước",
      next: "Sau",
      pageOf: (page: number, totalPages: number) => `Trang ${page} / ${totalPages}`,
    },
  },
  home: {
    siteDescription: "Luyện tập phỏng vấn với bộ câu hỏi thực tế theo từng chủ đề.",
    heroBody: "Luyện tập phỏng vấn với bộ câu hỏi thực tế theo từng chủ đề. Trang danh sách câu hỏi đang được xây dựng.",
    loginLink: "Đăng nhập",
    createAccountLink: "Tạo tài khoản",
  },
} as const;
