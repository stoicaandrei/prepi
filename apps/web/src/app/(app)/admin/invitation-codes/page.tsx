"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CreateInvitationCode } from "./create-code";

type SortField = "createdAt" | "code" | "maxUses" | "usesLeft" | "validUntil";
type SortOrder = "asc" | "desc";

export default function Component() {
  const [limit, setLimit] = useState(10);
  const [cursor, setCursor] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const { data, isLoading, refetch } = trpc.admin.invitationCode.list.useQuery({
    limit,
    cursor,
    sortBy,
    sortOrder,
  });

  const handleSort = (field: SortField) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handlePrevPage = () => {
    setCursor(null); // Reset to first page
  };

  const handleNextPage = () => {
    if (data?.nextCursor) {
      setCursor(data.nextCursor);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Invitation Codes</h1>
      <CreateInvitationCode />
      <div className="flex justify-between items-center mb-4">
        <Select
          value={limit.toString()}
          onValueChange={(value) => setLimit(Number(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select page size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handlePrevPage}
            disabled={!cursor}
            size="icon"
            variant="outline"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button
            onClick={handleNextPage}
            disabled={!data?.nextCursor}
            size="icon"
            variant="outline"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Button variant="ghost" onClick={() => handleSort("code")}>
                  Code {sortBy === "code" && (sortOrder === "asc" ? "↑" : "↓")}
                </Button>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => handleSort("maxUses")}>
                  Max Uses{" "}
                  {sortBy === "maxUses" && (sortOrder === "asc" ? "↑" : "↓")}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => handleSort("usesLeft")}>
                  Uses Left{" "}
                  {sortBy === "usesLeft" && (sortOrder === "asc" ? "↑" : "↓")}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("validUntil")}
                >
                  Valid Until{" "}
                  {sortBy === "validUntil" && (sortOrder === "asc" ? "↑" : "↓")}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data?.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No invitation codes found.
                </TableCell>
              </TableRow>
            ) : (
              data?.items.map((code) => (
                <TableRow key={code.id}>
                  <TableCell className="font-medium">{code.code}</TableCell>
                  <TableCell>{code.description || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    {code.maxUses || "Unlimited"}
                  </TableCell>
                  <TableCell className="text-right">
                    {code.usesLeft || "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    {code.validUntil
                      ? new Date(code.validUntil).toLocaleDateString()
                      : "No expiration"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
