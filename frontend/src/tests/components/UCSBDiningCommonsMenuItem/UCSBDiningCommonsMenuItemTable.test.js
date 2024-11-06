import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import UCSBDiningCommonsMenuItemTable from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UCSBDiningCommonsMenuItemTable tests suites", () => {
  const queryClient = new QueryClient();
  //const expectedHeaders = ["id", "DiningCommonsCode", "Name", "Station"];
  //const expectedFields = ["id", "diningCommonsCode", "name", "station"];
  const testId = "UCSBDiningCommonsMenuItemTable";

  // ... other tests ...

  test("Test1", async () => {
    const currentUser = currentUserFixtures.adminUser;

    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onDelete("/api/UCSBDiningCommonsMenuItem", { params: { id: 1 } })
      .reply(200, { message: "UCSBDiningCommonsMenuItem deleted" });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemTable
            UCSBDiningCommonsMenuItem={
              ucsbDiningCommonsMenuItemFixtures.threeItems
            }
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByTestId(`${testId}-cell-row-0-col-id`),
    ).toHaveTextContent("1");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-diningCommonsCode`),
    ).toHaveTextContent("DLG");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));
    expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });
  });

  test("Test2", async () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemTable
            UCSBDiningCommonsMenuItem={
              ucsbDiningCommonsMenuItemFixtures.threeItems
            }
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith(
        "/ucsbdiningcommonsmenuitem/edit/1",
      );
    });
  });
  test("Test3", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemTable
            UCSBDiningCommonsMenuItem={
              ucsbDiningCommonsMenuItemFixtures.threeItems
            }
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    const editButton = screen.queryByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).not.toBeInTheDocument();

    const deleteButton = screen.queryByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).not.toBeInTheDocument();
  });
});
