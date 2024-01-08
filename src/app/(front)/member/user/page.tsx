import Link from "next/link";

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
import { AppError } from "@/domains/error/class/AppError";
import UserService from "@/domains/user/service";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "ユーザー一覧ページ",
  description: "ユーザー一覧ページ",
};

const users = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) => {
  const userService = new UserService();
  const session = await auth();
  if (!session) {
    throw new AppError("UNAUTHORIZED", "ログインが必要です。", "/login");
  }
  const memberId = session?.user.memberId;
  const currentPage = Number(searchParams?.page) || 1;
  const { users, totalCount } = await userService.fetchUsersPage(memberId, currentPage, USERS_PER_PAGE);
  const totalPages = Math.ceil(totalCount / USERS_PER_PAGE);

  return (
    <div className="container">
      <h1>ユーザー一覧</h1>
      <Button asChild>
        <Link href={`/member/user/create`}>ユーザー作成</Link>
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
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.profileIcon}</TableCell>
              <TableCell suppressHydrationWarning={true}>
                {dayjs(user.createdAt.toString()).format("YYYY年MM月DD日 HH:mm:ss")}
              </TableCell>
              <TableCell suppressHydrationWarning={true}>
                {dayjs(user.updatedAt.toString()).format("YYYY年MM月DD日 HH:mm:ss")}
              </TableCell>
              <TableCell suppressHydrationWarning={true}>
                {dayjs(user.deletedAt?.toString()).format("YYYY年MM月DD日 HH:mm:ss")}
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
};

export default users;
