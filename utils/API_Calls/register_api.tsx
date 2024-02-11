const SERVER_IP = process.env.SERVER_IP;

export const handleRegister = async (id: string, recaptchaToken: string) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("g-recaptcha-response", recaptchaToken);

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: "",
      redirect: 'follow'
    };

    const response = await fetch(SERVER_IP + "/captcha/user/mail/" + id, requestOptions);
    // console.log(await response.text());
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
