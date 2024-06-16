"use client";
import AppPagination from "@/components/app-pagination";
import Container from "@/components/container";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import httpClient from "@/lib/httpClient";
import { PagedResponse } from "@/models/http/PagedResponse";
import { UserResponse } from "@/models/user/UserResponse";

import React from "react";
import useSWR from "swr";

export default function page() {
  const [page, setPage] = React.useState(0);

  const {data} = useSWR(`/api/admin/users?page=${page}`, () => {
    return httpClient.get<PagedResponse<UserResponse>>('/api/admin/users', {params: {page}})
      .then(res => res.data)
  })

  return (
    <Container size="lg">
      <h2 className="text-2xl font-semibold">Users</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>First name</TableHead>
            <TableHead>Last name</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
          ))}
          {!data?.data ||
            (data.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  No users
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {data && (
        <AppPagination
          hasNext={data?.page + 1 < data?.totalPages}
          hasPrevious={data?.page >= 1}
          onNextPage={() => setPage(page + 1)}
          onPreviousPage={() => setPage(page - 1)}
        />
      )}
    </Container>
  );
}
