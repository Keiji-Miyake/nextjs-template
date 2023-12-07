export async function sendOTP(email: string) {
  const otp = Math.floor(Math.random() * 1000000);
  console.debug(email);
  // const text = `Your OTP is ${otp}`;
  // const html = `<p>Your OTP is <b>${otp}</b></p>`;

  // await sendEmail({
  //   to: email,
  //   subject: "OTP for login",
  //   html,
  //   text,
  // });

  return otp;
}
