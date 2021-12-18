import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import App from "./App";

test("URL Shortener Form renders without crashing", () => {
  render(<App />);
  expect(screen.getByText("URL Shortener")).toBeInTheDocument();
});
