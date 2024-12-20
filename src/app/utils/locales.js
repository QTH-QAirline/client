import seatBooking from "../components/SearchFlights/SeatBooking/SeatBooking";
import BookingConfirm from "../search-flights/booking-confirmation/page";

export const en = {
  navigation: {
    home: "Home",
    myFlights: "My Flights",
    login: "Login / Signup",
    language: "English",
  },
  header: {
    fromLabel: "From",
    fromInput: "Where from?",
    toLabel: "To",
    toInput: "Where to?",
    dateLabel: "Date",
    dateInput: "Select dates",
    travelerLabel: "Traveler",
    searchButton: "Search",
    travelerLabels: {
      onePerson: "1 Person",
      twoPersons: "2 Persons",
      threePersons: "3 Persons",
      multiPerson: "4+ Persons",
    },
    tripTypeLabels: {
      roundTrip: "Round-trip",
      oneWay: "One-way",
      multiCity: "Multi-city",
    },
    ticketClassLabels: {
      economy: "Economy",
      business: "Business class",
      first: "First Class",
    },
  },
  flightSuggestions: {
    title: "Where to next?",
    subtitle:
      "Planning your next international adventure? Type in your destination.",
    fromLabel: "From",
    fromInput: "Your destination",
    priceFrom: "From",
    moreButton: "View more destinations",
    lessButton: "Show less",
  },
  FAQs: {
    title: "Frequently Asked Questions",
    moreButton: "View more FAQs",
    lessButton: "Show less",
  },
  footer: {
    tagline: "Fly with Comfort and Confidence",
    quickLinks: "Quick Links",
    home: "Home",
    myFlights: "My Flights",
    booking: "Booking",
    checkin: "Check-in",
    customerService: "Customer Service",
    helpCenter: "Help Center",
    contactUs: "Contact Us",
    baggagePolicy: "Baggage Policy",
    faq: "FAQ",
    legal: "Legal",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    refundPolicy: "Refund Policy",
    cookiesSettings: "Cookies Settings",
    contactInformation: "Contact Information",
    customerSupport: "Customer Support",
    allRightsReserved: "All Rights Reserved",
  },
  myFlights: {
    content: "My Flights",
    tabs: {
      upcoming: "Upcoming",
      completed: "Completed",
      cancelled: "Cancelled",
    },
    loading: "Loading data...",
    noFlights: "No flights in {status} status",
    error: "An error occurred while loading data. Please try again later.",
    bookingCode: "Booking Code",
    status: "Status",
    terminal: "Terminal",
  },
  login: {
    title: "Login to QAirline",
    emailOrPhone: "Email or Phone",
    password: "Password",
    loginButton: "Login",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    signUp: "Sign up",
    errors: {
      requiredIdentifier: "Email or phone is required",
      invalidIdentifier: "Please enter a valid email or 10-digit phone number",
      requiredPassword: "Password is required",
      shortPassword: "Password must be at least 6 characters",
    },
  },
  signup: {
    title: "Create Account",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone Number",
    password: "Password",
    confirmPassword: "Confirm Password",
    submitButton: "Create Account",
    loginLink: "Already have an account?",
    errors: {
      fullNameRequired: "Full name is required",
      fullNameTooShort: "Name is too short",
      emailInvalid: "Please enter a valid email address",
      phoneRequired: "Phone number is required",
      phoneInvalid: "Please enter a valid 10-digit phone number",
      passwordTooShort: "Password must be at least 6 characters",
      passwordMismatch: "Passwords do not match",
    },
  },
  flightInfo: {
    flightClasses: {
      Economy: "Economy",
      Business: "Business",
      FirstClass: "First Class",
    },
    flightSearch: {
      title: "Flight Search Results",
      sortBy: "Sort by:",
      priceSort: "Price",
      durationSort: "Duration",
      stops: {
        zero: "stops",
        one: "stop",
      },
      pricing: {
        multipleSeats: "Multiple seats",
        seatLeft: "seat left",
        notAvailable: "Not available",
      },
      bookingButton: "Process Booking",
    },
  },
  bookingConfirm: {
    loading: "Loading booking details...",
    confirm_booking: "Confirm Your Booking",
    flight_details: "Flight Details",
    airline: "Airline",
    flight_number: "Flight Number",
    departure_city: "Departure City",
    departure_time: "Departure Time",
    arrival_city: "Arrival City",
    arrival_time: "Arrival Time",
    total_duration: "Total Duration",
    stops: "Number of Stops",
    ticket_class: "Ticket Class",
    selected_seat: "Selected Seat",
    price: "Price",
    passenger_details: "Passenger Details",
    full_name: "Full Name",
    date_of_birth: "Date of Birth",
    id_number: "ID/Passport Number",
    nationality: "Nationality",
    email: "Email",
    phone_number: "Phone Number",
    submit_booking: "Submit Booking",
    booking_success: "Booking submitted successfully!",
    success_message: "Booking submitted successfully!",
  },
  seatBooking: {
    loading: "Loading flight information...",
    flightSummary: "Flight Summary",
    departure_city: "Departure City",
    arrival_city: "Arrival City",
    class: "Class",
    flight: "Flight",
    selectSeat: "Select Your Seat",
    available: "Available",
    occupied: "Occupied",
    selected: "Selected",
    confirm: "Confirm Selection",
    seatClasses: {
      economy: "Economy Class",
      business: "Business Class",
      firstClass: "First Class",
    },
    warnings: {
      noSeatSelected: "Please select a seat to continue",
      confirmSelection: "Are you sure you want to select seat",
    },
    flightDetails: {
      from: "From",
      to: "To",
      date: "Date",
      time: "Time",
      duration: "Duration",
      departure_city: "Departure City",
    },
    pricing: {
      price: "Price",
      tax: "Tax",
      total: "Total",
    },
    seatInfo: {
      seatNumber: "Seat Number",
      rowNumber: "Row",
      position: "Position",
    },
    buttons: {
      back: "Back to Flight Selection",
      next: "Continue to Payment",
      cancel: "Cancel Selection",
    },
  },
};

export const vi = {
  navigation: {
    home: "Trang chủ",
    myFlights: "Chuyến bay của tôi",
    login: "Đăng nhập / Đăng ký",
    language: "Tiếng Việt",
  },
  header: {
    fromLabel: "Điểm đi",
    fromInput: "Khởi hành từ?",
    toLabel: "Điểm đến",
    toInput: "Điểm đến ở?",
    dateLabel: "Ngày",
    dateInput: "Thời gian",
    travelerLabel: "Số người",
    searchButton: "Tìm kiếm",
    travelerLabels: {
      onePerson: "1 Người",
      twoPersons: "2 Người",
      threePersons: "3 Người",
      multiPerson: "4+ Người",
    },
    tripTypeLabels: {
      roundTrip: "Khứ hồi",
      oneWay: "Một chiều",
      multiCity: "Nhiều điểm",
    },
    ticketClassLabels: {
      economy: "Phổ thông",
      business: "Thương gia",
      first: "Hạng nhất",
    },
  },
  flightSuggestions: {
    title: "Tiếp theo đi đâu?",
    subtitle:
      "Bạn đang lập kế hoạch cho chuyến phiêu lưu tiếp theo? Nhập điểm đến của bạn",
    fromLabel: "Từ",
    fromInput: "Điểm đến của bạn",
    priceFrom: "Giá từ",
    moreButton: "Xem thêm",
    lessButton: "Ẩn bớt",
  },
  FAQs: {
    title: "Câu hỏi thường gặp",
    moreButton: "Xem thêm",
    lessButton: "Ẩn bớt",
  },
  footer: {
    tagline: "Bay cùng sự thoải mái và an tâm",
    quickLinks: "Liên kết hữu ích",
    home: "Trang chủ",
    myFlights: "Chuyến bay của tôi",
    booking: "Đặt vé",
    checkin: "Làm thủ tục",
    customerService: "Dịch vụ khách hàng",
    helpCenter: "Trung tâm hỗ trợ",
    contactUs: "Liên hệ chúng tôi",
    baggagePolicy: "Chính sách hành lý",
    faq: "Câu hỏi thường gặp",
    legal: "Pháp lý",
    privacyPolicy: "Chính sách bảo mật",
    termsOfService: "Điều khoản dịch vụ",
    refundPolicy: "Chính sách hoàn tiền",
    cookiesSettings: "Cài đặt cookie",
    contactInformation: "Thông tin liên hệ",
    customerSupport: "Hỗ trợ khách hàng",
    allRightsReserved: "Bản quyền thuộc về chúng tôi",
  },
  myFlights: {
    content: "Chuyến Bay Của Tôi",
    tabs: {
      upcoming: "Sắp Tới",
      completed: "Đã Hoàn Thành",
      cancelled: "Đã Hủy",
    },
    loading: "Đang tải dữ liệu...",
    noFlights: "Không có chuyến bay nào trong trạng thái {status}",
    error: "Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.",
    bookingCode: "Mã đặt chỗ",
    status: "Trạng thái",
    terminal: "Nhà ga",
  },
  login: {
    title: "Đăng nhập",
    emailOrPhone: "Email hoặc Số điện thoại",
    password: "Mật khẩu",
    loginButton: "Đăng nhập",
    forgotPassword: "Quên mật khẩu?",
    noAccount: "Chưa có tài khoản?",
    signUp: "Đăng ký",
    errors: {
      requiredIdentifier: "Yêu cầu nhập email hoặc số điện thoại",
      invalidIdentifier:
        "Vui lòng nhập email hợp lệ hoặc số điện thoại 10 chữ số",
      requiredPassword: "Yêu cầu nhập mật khẩu",
      shortPassword: "Mật khẩu phải có ít nhất 6 ký tự",
    },
  },
  signup: {
    title: "Tạo Tài Khoản",
    fullName: "Họ và Tên",
    email: "Địa Chỉ Email",
    phone: "Số Điện Thoại",
    password: "Mật Khẩu",
    confirmPassword: "Xác Nhận Mật Khẩu",
    submitButton: "Tạo Tài Khoản",
    loginLink: "Đã có tài khoản?",
    errors: {
      fullNameRequired: "Họ và tên là bắt buộc",
      fullNameTooShort: "Tên quá ngắn",
      emailInvalid: "Vui lòng nhập địa chỉ email hợp lệ",
      phoneRequired: "Số điện thoại là bắt buộc",
      phoneInvalid: "Vui lòng nhập số điện thoại 10 chữ số",
      passwordTooShort: "Mật khẩu phải có ít nhất 6 ký tự",
      passwordMismatch: "Mật khẩu không khớp",
    },
  },
  flightInfo: {
    flightClasses: {
      Economy: "Hạng Phổ thông",
      Business: "Hạng Thương gia",
      FirstClass: "Hạng Nhất",
    },
    flightSearch: {
      title: "Kết quả tìm kiếm chuyến bay",
      sortBy: "Sắp xếp theo:",
      priceSort: "Giá",
      durationSort: "Thời gian",
      stops: {
        zero: "điểm dừng",
        one: "điểm dừng",
      },
      pricing: {
        multipleSeats: "Nhiều ghế",
        seatLeft: "ghế còn lại",
        notAvailable: "Không có sẵn",
      },
      bookingButton: "Xác nhận đặt chỗ",
    },
  },
  bookingConfirm: {
    loading: "Đang tải thông tin đặt vé...",
    confirm_booking: "Xác Nhận Đặt Vé",
    flight_details: "Thông Tin Chuyến Bay",
    airline: "Hãng Hàng Không",
    flight_number: "Số Hiệu Chuyến Bay",
    departure_city: "Thành Phố Khởi Hành",
    departure_time: "Thời Gian Khởi Hành",
    arrival_city: "Thành Phố Đến",
    arrival_time: "Thời Gian Đến",
    total_duration: "Tổng Thời Gian Bay",
    stops: "Số Điểm Dừng",
    ticket_class: "Hạng Vé",
    selected_seat: "Ghế Đã Chọn",
    price: "Giá Vé",
    passenger_details: "Thông Tin Hành Khách",
    full_name: "Họ và Tên",
    date_of_birth: "Ngày Sinh",
    id_number: "Số CMND/Hộ Chiếu",
    nationality: "Quốc Tịch",
    email: "Email",
    phone_number: "Số Điện Thoại",
    submit_booking: "Xác Nhận Đặt Vé",
    booking_success: "Đặt vé thành công!",
    success_message: "Xác nhận đặt vé thành công!",
  },
  seatBooking: {
    loading: "Đang tải thông tin chuyến bay...",
    flightSummary: "Thông tin chuyến bay",
    departure_city: "Thành Phố Khởi Hành",
    arrival_city: "Thành Phố Đến",
    class: "Hạng ghế",
    flight: "Chuyến bay",
    selectSeat: "Chọn ghế ngồi",
    available: "Còn trống",
    occupied: "Đã đặt",
    selected: "Đã chọn",
    confirm: "Xác nhận chọn ghế",
    seatClasses: {
      economy: "Hạng phổ thông",
      business: "Hạng thương gia",
      firstClass: "Hạng nhất",
    },
    warnings: {
      noSeatSelected: "Vui lòng chọn ghế để tiếp tục",
      confirmSelection: "Bạn có chắc chắn muốn chọn ghế",
    },
    flightDetails: {
      from: "Khởi hành từ",
      to: "Đến",
      date: "Ngày",
      time: "Giờ",
      duration: "Thời gian bay",
      departure_city: "Thành Phố Khởi Hành",
    },
    pricing: {
      price: "Giá vé",
      tax: "Thuế",
      total: "Tổng cộng",
    },
    seatInfo: {
      seatNumber: "Số ghế",
      rowNumber: "Hàng",
      position: "Vị trí",
    },
    buttons: {
      back: "Quay lại chọn chuyến bay",
      next: "Tiếp tục thanh toán",
      cancel: "Hủy chọn ghế",
    },
  },
};
