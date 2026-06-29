import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";

import { createAppStore } from "@/app/store";

import { WeatherDashboard } from "./WeatherDashboard";

describe("WeatherDashboard", () => {
  it("renders weather data from the API", async () => {
    const store = createAppStore();

    render(
      <Provider store={store}>
        <WeatherDashboard />
      </Provider>,
    );

    expect(screen.getByText(/The Weather Channel/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Temperature/i)).toBeInTheDocument();
    });
  });
});
