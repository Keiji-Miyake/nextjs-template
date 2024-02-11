import { cookies } from "next/headers";

import ClientCookie from "./ClientCookie";

const page = () => {
  const sample = cookies().get("middleware");

  return (
    <>
      <h1>Cookie</h1>
      <p>Cookie has been set</p>
      <h2>Server Components Cookie</h2>
      <div>
        {sample?.name}: {sample?.value}
      </div>
      <ClientCookie />
    </>
  );
};

export default page;
