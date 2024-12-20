import axios from 'axios';

const testLogin = async () => {
  try {
    const response = await axios.post(
      'http://localhost:4000/auth/customer/login',
      {
        email: 'quanvi03@gmail.com',
        password: '12345678',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Phản hồi từ server:', response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Lỗi đăng nhập:', error.response?.data || error.message);
    } else {
      console.error('Lỗi không xác định:', error);
    }
  }
};

testLogin();
