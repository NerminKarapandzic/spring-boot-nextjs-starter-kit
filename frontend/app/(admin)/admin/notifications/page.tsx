"use client";

import Container from "@/components/Container";
import { restClient } from "@/lib/httpClient";
import { Button, TextInput, Title } from "@mantine/core";
import React from "react";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { LineChart } from "@mantine/charts";

export default function page() {
  const form = useForm({
    initialValues: {
      message: "",
      title: "",
      url: "",
    },
  });

  const sendNotification = () => {
    restClient
      .pushNotificationNotify(form.values)
      .then(() => {
        notifications.show({
          title: "Notification sent",
          message: "Notification sent successfully",
        });
      })
      .catch(() => {
        notifications.show({
          title: "Notification failed",
          message: "Failed to send notification",
          color: "red",
        });
      });
  };

  return (
    <Container size="xl">
      <Title order={1}>Notifications</Title>

      <div className="flex flex-col gap-2">
        <TextInput
          label="Title"
          {...form.getInputProps("title")}
          placeholder="Notification title"
        />
        <TextInput
          label="Message"
          {...form.getInputProps("message")}
          placeholder="Notification message"
        />
        <TextInput
          label="URL"
          {...form.getInputProps("url")}
          placeholder="Notification url"
        />

        <Button onClick={sendNotification} className="mt-4">
          Send notification
        </Button>
      </div>

      <div className="mt-12">
        <Title order={2}>Notifications sent</Title>

        <LineChart
          className="mt-4"
          h={300}
          data={[
            { date: "2021-01-01", sent: 20, delivered: 15 },
            { date: "2021-01-02", sent: 20, delivered: 10 },
            { date: "2021-01-03", sent: 30, delivered: 20 },
            { date: "2021-01-04", sent: 40, delivered: 40 },
            { date: "2021-01-05", sent: 50, delivered: 50 },
            { date: "2021-01-06", sent: 40, delivered: 20 },
            { date: "2021-01-07", sent: 70, delivered: 30 },
          ]}
          dataKey="date"
          series={[
            { name: "sent", color: "indigo.6" },
            { name: "delivered", color: "blue.6" },
          ]}
          curveType="linear"
        />
      </div>

      <div className="mt-12">
        <Title order={2}>Subscriptions</Title>

        <LineChart
          className="mt-4"
          h={300}
          data={[
            { date: "2021-01-01", subscriptions: 10, attempts: 20 },
            { date: "2021-01-02", subscriptions: 20, attempts: 30 },
            { date: "2021-01-03", subscriptions: 30, attempts: 40 },
            { date: "2021-01-04", subscriptions: 40, attempts: 50 },
            { date: "2021-01-05", subscriptions: 50, attempts: 60 },
            { date: "2021-01-06", subscriptions: 60, attempts: 70 },
            { date: "2021-01-07", subscriptions: 70, attempts: 80 },
          ]}
          dataKey="date"
          series={[
            { name: "subscriptions", color: "indigo.6" },
            { name: "attempts", color: "blue.6" },
          ]}
          curveType="linear"
        />
      </div>
    </Container>
  );
}
