"use client";
import Container from "@/components/Container";
import httpClient from "@/lib/httpClient";
import { PagedResponse } from "@/models/http/PagedResponse";
import { UserResponse } from "@/models/user/UserResponse";
import { Button, Pagination, Table } from "@mantine/core";

import React from "react";
import useSWR from "swr";

export default function page() {
  const [page, setPage] = React.useState(1);

  const { data } = useSWR(`/api/admin/users?page=${page}`, () => {
    return httpClient
      .get<PagedResponse<UserResponse>>("/api/admin/users", {
        params: { page: page - 1 },
      })
      .then((res) => res.data);
  });

  return (
    <Container size="xl">
      <h2 className="text-2xl font-semibold">Users</h2>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>#</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>First name</Table.Th>
            <Table.Th>Last name</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Impersonate</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data?.data.map((user) => (
            <Table.Tr key={user.id}>
              <Table.Td>{user.id}</Table.Td>
              <Table.Td>{user.email}</Table.Td>
              <Table.Td>{user.firstName}</Table.Td>
              <Table.Td>{user.lastName}</Table.Td>
              <Table.Td>{user.role}</Table.Td>
              <Table.Td>
                <a href={`/api/auth/impersonate?username=${user.email}`}>
                  <Button>Impersonate</Button>
                </a>
              </Table.Td>
            </Table.Tr>
          ))}
          {!data?.data ||
            (data.data.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={9} className="text-center">
                  No users
                </Table.Td>
              </Table.Tr>
            ))}
        </Table.Tbody>
      </Table>

      {data && (
        <Pagination total={data.totalPages} onChange={setPage} className="mt-4"/>
      )}
    </Container>
  );
}
