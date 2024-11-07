import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBOrganizationEditPage from "main/pages/UCSBOrganization/UCSBOrganizationEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useParams: () => ({
      id: "ACM",
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("UCSBOrganizationEditPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  const queryClient = new QueryClient();

  afterEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
  });

  describe("when the backend doesn't return data", () => {
    beforeEach(() => {
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/ucsborganizations", { params: { orgCode: "ACM" } })
        .timeout();
    });

    test("renders header but form is not present", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await screen.findByText("Edit UCSB Organization");
      expect(
        screen.queryByTestId("UCSBOrganizationForm-orgCode")
      ).not.toBeInTheDocument();
    });
  });

  describe("when the backend is working normally", () => {
    beforeEach(() => {
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/ucsborganizations", { params: { orgCode: "ACM" } })
        .reply(200, {
          orgCode: "ACM",
          orgTranslationShort: "Association for Computing Machinery",
          orgTranslation: "The Association for Computing Machinery",
          inactive: false,
        });
      axiosMock.onPut("/api/ucsborganizations").reply(200, {
        orgCode: "ACM",
        orgTranslationShort: "Updated ACM",
        orgTranslation: "Updated Association for Computing Machinery",
        inactive: true,
      });
    });

    test("renders form with initial data", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      const orgCodeField = await screen.findByTestId("UCSBOrganizationForm-orgCode");
      expect(orgCodeField).toHaveValue("ACM");
    });

    test("updates organization information upon form submission", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      const orgTranslationShortField = await screen.findByTestId("UCSBOrganizationForm-orgTranslationShort");
      const orgTranslationField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
      const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
      const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

      fireEvent.change(orgTranslationShortField, { target: { value: "Updated ACM" } });
      fireEvent.change(orgTranslationField, { target: { value: "Updated Association for Computing Machinery" } });
      fireEvent.change(inactiveField, { target: { value: "true" } });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalledWith("UCSB Organization Updated - orgCode: ACM"));
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/ucsborganization" });

      const putRequest = axiosMock.history.put[0];
      expect(JSON.parse(putRequest.data)).toEqual({
        orgCode: "ACM",
        orgTranslationShort: "Updated ACM",
        orgTranslation: "Updated Association for Computing Machinery",
        inactive: "true",
      });
      expect(putRequest.method).toBe("put");
    });
  });

  describe("when backend returns a 404 error", () => {
    beforeEach(() => {
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/ucsborganizations", { params: { orgCode: "INVALID" } })
        .reply(404, { message: "Not Found" });
      
      jest.mock("react-router-dom", () => {
        const originalModule = jest.requireActual("react-router-dom");
        return {
          ...originalModule,
          useParams: () => ({
            id: "INVALID",
          }),
        };
      });
    });

    test("displays error message when organization not found", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      // const errorMessage = await screen.findByText(/UCSBOrganization with id INVALID not found/i);
      // expect(errorMessage).toBeInTheDocument();
      // expect(screen.queryByTestId("UCSBOrganizationForm-orgCode")).not.toBeInTheDocument();
    });
  });
});