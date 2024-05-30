import Link from "next/link";
import { notFound } from "next/navigation";

import dayjs from "dayjs";
import { Metadata } from "next";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { USERS_PER_PAGE } from "@/config/site";
import { UnauthorizedError } from "@/domains/error/class/UnauthorizedError";
import UserService from "@/domains/user/service";
import { getServerSession } from "@/libs/auth";

export const metadata: Metadata = {
  title: "ユーザー一覧ページ",
  description: "ユーザー一覧ページ",
};

const users = async ({ searchParams }: { searchParams: URLSearchParams }) => {
  const userService = new UserService();
  const session = await getServerSession();
  if (!session) {
    throw new UnauthorizedError();
  }
  const memberId = session?.user.memberId;

  try {
    const users = await userService.getList(memberId, searchParams, USERS_PER_PAGE);
    console.debug("users", users);
    if (!users || !users.length) notFound();

    const allUsers = await userService.getAllForMember(memberId);
    const totalCount = allUsers?.length ?? 0;
    const totalPages = Math.ceil(totalCount ?? 0 / USERS_PER_PAGE);
    const currentPage = searchParams instanceof URLSearchParams ? Number(searchParams.get("page")) : 1;

    return (
      <div className="container">
        <h1>ユーザー一覧</h1>
        <Button asChild>
          <Link href={`/member/users/create`}>ユーザー作成</Link>
        </Button>
        <Table>
          <TableCaption>ユーザー一覧</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">id</TableHead>
              <TableHead>name</TableHead>
              <TableHead>email</TableHead>
              <TableHead>role</TableHead>
              <TableHead>profileIcon</TableHead>
              <TableHead>createdAt</TableHead>
              <TableHead>updatedAt</TableHead>
              <TableHead>deletedAt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <Link href={`/member/users/edit/${user.id}`}>{user.id}</Link>
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.profileIcon}</TableCell>
                <TableCell suppressHydrationWarning={true}>
                  {dayjs(user.createdAt).format("YYYY年MM月DD日 HH:mm:ss")}
                </TableCell>
                <TableCell suppressHydrationWarning={true}>
                  {dayjs(user.updatedAt).format("YYYY年MM月DD日 HH:mm:ss")}
                </TableCell>
                <TableCell suppressHydrationWarning={true}>
                  {dayjs(user.deletedAt || null).format("YYYY年MM月DD日 HH:mm:ss")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">{totalCount}</TableCell>
              <TableCell colSpan={4}>
                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      {currentPage > 1 ? (
                        <PaginationItem>
                          <PaginationPrevious href={`?page=${currentPage - 1}`} />
                        </PaginationItem>
                      ) : (
                        <PaginationItem>
                          <PaginationPrevious href="" />
                        </PaginationItem>
                      )}
                      {currentPage > 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationLink href={`?page=${currentPage - 1}`}>{currentPage - 1}</PaginationLink>
                        </PaginationItem>
                      )}
                      <PaginationItem>{currentPage}</PaginationItem>
                      {currentPage < totalPages && (
                        <PaginationItem>
                          <PaginationLink href={`?page=${currentPage + 1}`}>{currentPage + 1}</PaginationLink>
                        </PaginationItem>
                      )}
                      {currentPage < totalPages - 1 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      {currentPage < totalPages ? (
                        <PaginationItem>
                          <PaginationNext href={`?page=${currentPage + 1}`} />
                        </PaginationItem>
                      ) : (
                        <PaginationItem>
                          <PaginationNext href="" />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    );
  } catch (error) {
    throw error;
  }
};

export default users;
