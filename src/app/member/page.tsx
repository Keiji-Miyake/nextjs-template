import { notFound } from "next/navigation";

import dayjs from "dayjs";

import MemberService from "@/domains/member/service";
import { getServerSession } from "@/libs/auth";

const memberService = new MemberService();

const page = async () => {
  const session = await getServerSession();
  if (!session?.user?.memberId) notFound();
  const memberId = session?.user?.memberId;

  try {
    const member = await memberService.getCurrent(memberId);
    if (!member) notFound();

    return (
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">会員情報</h1>
        </div>

        <div className="my-6 w-full overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                  項目名
                </th>
                <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                  値
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  ID
                </td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  {member.id}
                </td>
              </tr>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  Email
                </td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  {member.email}
                </td>
              </tr>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  Name
                </td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  {member.name}
                </td>
              </tr>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  Logo
                </td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  {member.logo}
                </td>
              </tr>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  Created At
                </td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  {dayjs(member.createdAt).format("YYYY年MM月DD日 HH:mm:ss")}
                </td>
              </tr>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  Updated At
                </td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  {dayjs(member.updatedAt).format("YYYY年MM月DD日 HH:mm:ss")}
                </td>
              </tr>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  Deleted At
                </td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  {dayjs(member.deletedAt || null).format("YYYY年MM月DD日 HH:mm:ss")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    );
  } catch (error) {
    console.error("/member", error);
    throw error;
  }
};

export default page;
