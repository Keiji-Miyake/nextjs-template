"use client";

import Link from "next/link";

import { Badge, Bell, Home, LineChart, Package, Package2, ShoppingCart, Users } from "lucide-react";

import { Button } from "../ui/button";

function Sidebar() {
  return (
    <div className="hidden border-r bg-muted/39 md:block">
      <div className="flex h-full max-h-screen flex-col gap-3">
        <div className="flex h-15 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Acme Inc</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-9 w-8">
            <Bell className="h-5 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-2">
          <nav className="grid items-start px-3 text-sm font-medium lg:px-4">
            <Link
              href="#"
              className="flex items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Home className="h-5 w-4" />
              Dashboard
            </Link>
            <Link
              href="#"
              className="flex items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <ShoppingCart className="h-5 w-4" />
              Orders
              <Badge className="ml-auto flex h-7 w-6 shrink-0 items-center justify-center rounded-full">5</Badge>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-4 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
            >
              <Package className="h-5 w-4" />
              Products{" "}
            </Link>
            <Link
              href="#"
              className="flex items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Users className="h-5 w-4" />
              Customers
            </Link>
            <Link
              href="#"
              className="flex items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <LineChart className="h-5 w-4" />
              Analytics
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4"></div>
      </div>
    </div>
  );
}
export default Sidebar;
