/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from "@testing-library/react";
import URLShortenerForm from "./URLShortenerForm";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";

test("Verifies for valid url on the client side", async () => {
  render(<URLShortenerForm />);

  let formSubmitButton = screen.getByText("Get Shorten URL");
  userEvent.click(formSubmitButton);

  let urlInput = screen.getByPlaceholderText("Enter URL");

  let formFeedbackText = screen.getByTestId("form_feedback");
  expect(formFeedbackText).toHaveTextContent("A valid URL must be provided");
  userEvent.type(urlInput, "1dafsd");

  expect(formFeedbackText).toHaveTextContent("A valid URL must be provided");

  userEvent.clear(urlInput);
  userEvent.type(urlInput, "http://www.google.com/");

  expect(urlInput).toHaveValue("http://www.google.com/");

  expect(formFeedbackText).toBeInTheDocument();
});

test("Displays a success message after shortened url", async () => {
  render(<URLShortenerForm />);

  global.fetch = jest.fn(() =>
    Promise.resolve({
      statusCode: 200,
      json: () =>
        Promise.resolve({
          message:
            "http://localhost:8080/1a2b3c4d now links to http://www.yahoo.com/",
        }),
    })
  );

  let formSubmitButton = screen.getByText("Get Shorten URL");
  let urlInput = screen.getByPlaceholderText("Enter URL");
  act(() => {
    userEvent.type(urlInput, "http://www.yahoo.com/");
    userEvent.click(formSubmitButton);
  });

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  expect(
    screen.getByText(
      "http://localhost:8080/1a2b3c4d now links to http://www.yahoo.com/"
    )
  ).toBeInTheDocument();
});

test("Displays a failure message for used alias", async () => {
  render(<URLShortenerForm />);

  global.fetch = jest.fn(() =>
    Promise.resolve({
      statusCode: 400,
      json: () =>
        Promise.resolve({
          message: "Alias already taken",
        }),
    })
  );

  let formSubmitButton = screen.getByText("Get Shorten URL");
  let urlInput = screen.getByPlaceholderText("Enter URL");
  let aliasInput = screen.getByPlaceholderText("Alias");
  act(() => {
    userEvent.type(urlInput, "http://www.yahoo.com/");
    userEvent.type(aliasInput, "usedAlias");
    userEvent.click(formSubmitButton);
  });

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  expect(screen.getByText("Alias already taken")).toBeInTheDocument();
});
