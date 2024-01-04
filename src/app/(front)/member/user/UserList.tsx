"use client";

import { User } from "@prisma/client";
import dayjs from "dayjs";

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

const UserList = ({ users }: { users: User[] }) => {
  console.log("users", users);

  return (
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
        {users.map((user) => (
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
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default UserList;
