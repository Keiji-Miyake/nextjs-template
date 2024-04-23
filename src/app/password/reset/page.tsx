// パスワードリセットフォーム
const PasswordResetForm = () => {
  return (
    <div>
      <h1>パスワードリセット</h1>
      <form>
        <div>
          <label htmlFor="password">パスワード</label>
          <input type="password" id="password" />
        </div>
        <div>
          <label htmlFor="passwordConfirmation">パスワード（確認）</label>
          <input type="password" id="passwordConfirmation" />
        </div>
        <div>
          <button type="submit">送信</button>
        </div>
      </form>
    </div>
  );
};

export default PasswordResetForm;
