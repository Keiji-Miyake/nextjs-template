const page = ({ params }: { params: { id: number } }) => {
  const userId = params.id;
  console.debug(typeof userId);
  return (
    <div className="container">
      <h1>ユーザー編集</h1>
    </div>
  );
};

export default page;
