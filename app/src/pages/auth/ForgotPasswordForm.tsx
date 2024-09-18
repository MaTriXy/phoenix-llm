import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { css } from "@emotion/react";

import { Alert, Button, Form, TextField, View } from "@arizeai/components";

type ForgotPasswordFormParams = {
  email: string;
};

export function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onSubmit = useCallback(
    async (params: ForgotPasswordFormParams) => {
      setMessage(null);
      setError(null);
      setIsLoading(true);
      try {
        const response = await fetch("/auth/password-reset-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });
        if (!response.ok) {
          setError("Failed attempt");
          return;
        }
      } catch (error) {
        setError("Failed attempt");
        return;
      } finally {
        setIsLoading(() => false);
      }
      setMessage(
        "A link to reset your password has been sent. Check your email for details."
      );
    },
    [setMessage, setError]
  );
  const { control, handleSubmit } = useForm<ForgotPasswordFormParams>({
    defaultValues: { email: "" },
  });
  return (
    <>
      {message ? (
        <View paddingBottom="size-100">
          <Alert variant="success">{message}</Alert>
        </View>
      ) : null}
      {error ? (
        <View paddingBottom="size-100">
          <Alert variant="danger">{error}</Alert>
        </View>
      ) : null}
      <Form>
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              label="Email"
              name="email"
              isRequired
              type="email"
              onChange={onChange}
              value={value}
              placeholder="your email address"
            />
          )}
        />
        <div
          css={css`
            margin-top: var(--ac-global-dimension-size-400);
            margin-bottom: var(--ac-global-dimension-size-50);
            button {
              width: 100%;
            }
          `}
        >
          <Button
            variant="primary"
            loading={isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            Submit
          </Button>
        </div>
      </Form>
    </>
  );
}
