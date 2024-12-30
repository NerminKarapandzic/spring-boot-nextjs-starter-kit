"use client";

import Container from "@/components/Container";
import { restClient } from "@/lib/httpClient";
import { Button, TextInput, Title } from "@mantine/core";
import React, { useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { LineChart } from "@mantine/charts";
import useSWR from "swr";

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

  const {data: notificationDeliveryData} = useSWR("/api/notifications/delivery", () => restClient.getNotificationDeliveryStats())
  const {data: subscribersData} = useSWR("/api/notifications/stats/subscriptions", () => restClient.getNotificationSubscriptionStats())

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
          data={notificationDeliveryData?.data || []}
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
          data={subscribersData?.data || []}
          dataKey="date"
          series={[
            { name: "subscribers", color: "indigo.6" },
          ]}
          curveType="linear"
        />
      </div>
    </Container>
  );
}
