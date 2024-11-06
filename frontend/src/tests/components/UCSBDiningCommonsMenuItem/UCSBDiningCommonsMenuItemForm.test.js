import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UCSBDiningCommonsMenuItemForm tests suites", () => {
  const queryClient = new QueryClient();

  const testId = "UCSBDiningCommonsMenuItemForm";

  test("test1", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBDiningCommonsMenuItemForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
  });

  test("test2", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBDiningCommonsMenuItemForm
            initialContents={ucsbDiningCommonsMenuItemFixtures.oneItem}
          />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByText("Id")).toBeInTheDocument();
  });

  test("test3", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBDiningCommonsMenuItemForm />
        </Router>
      </QueryClientProvider>,
    );

    const cancelButton = await screen.findByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("test4", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBDiningCommonsMenuItemForm />
        </Router>
      </QueryClientProvider>,
    );
    const submitButton = await screen.findByText(/Create/);
    fireEvent.click(submitButton);
    expect(
      await screen.findByText("diningCommonsCode is required."),
    ).toBeInTheDocument();
    expect(await screen.findByText("Name is required.")).toBeInTheDocument();
    expect(await screen.findByText("Station is required.")).toBeInTheDocument();

    const nameInput = screen.getByTestId(`${testId}-name`);
    fireEvent.change(nameInput, { target: { value: "a".repeat(31) } });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText("Max length 30 characters"),
    ).toBeInTheDocument();
  });

  test("test5", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBDiningCommonsMenuItemForm submitAction={mockSubmitAction} />
        </Router>
      </QueryClientProvider>,
    );

    const diningCommonsCodeField = await screen.findByTestId(
      `${testId}-diningCommonsCode`,
    );
    const nameField = screen.getByTestId(`${testId}-name`);
    const stationField = screen.getByTestId(`${testId}-station`);
    const submitButton = screen.getByTestId(`${testId}-submit`);

    fireEvent.change(diningCommonsCodeField, { target: { value: "DLG" } });
    fireEvent.change(nameField, { target: { value: "De La Guerra" } });
    fireEvent.change(stationField, { target: { value: "Grill" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
    expect(
      screen.queryByText("Dining Commons Code is required."),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Name is required.")).not.toBeInTheDocument();
    expect(screen.queryByText("Station is required.")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Max length 30 characters"),
    ).not.toBeInTheDocument();
  });
  test("7 test", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBDiningCommonsMenuItemForm />
        </Router>
      </QueryClientProvider>,
    );
    const submitButton = await screen.findByText(/Create/);
    fireEvent.click(submitButton);
    expect(
      await screen.findByText("diningCommonsCode is required."),
    ).toBeInTheDocument();
    expect(await screen.findByText("Name is required.")).toBeInTheDocument();
    expect(await screen.findByText("Station is required.")).toBeInTheDocument();

    const diningCommonsCodeInput = screen.getByTestId(
      `${testId}-diningCommonsCode`,
    );
    fireEvent.change(diningCommonsCodeInput, {
      target: { value: "a".repeat(31) },
    });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText("Max length 30 characters"),
    ).toBeInTheDocument();
  });
  test("8 test", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBDiningCommonsMenuItemForm />
        </Router>
      </QueryClientProvider>,
    );
    const submitButton = await screen.findByText(/Create/);
    fireEvent.click(submitButton);
    expect(
      await screen.findByText("diningCommonsCode is required."),
    ).toBeInTheDocument();
    expect(await screen.findByText("Name is required.")).toBeInTheDocument();
    expect(await screen.findByText("Station is required.")).toBeInTheDocument();

    const stationCodeInput = screen.getByTestId(`${testId}-station`);
    fireEvent.change(stationCodeInput, { target: { value: "a".repeat(31) } });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText("Max length 30 characters"),
    ).toBeInTheDocument();
  });
});
