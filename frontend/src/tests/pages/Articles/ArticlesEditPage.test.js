import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useParams: () => ({
      id: 1,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("ArticlesEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/articles", { params: { id: 1 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Article");
      expect(
        screen.queryByTestId("ArticlesForm-title"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/articles", { params: { id: 1 } }).reply(200, {
        id: 1,
        title: "Sample Article Title",
        url: "https://samplewebsite.com/article1",
        explanation: "This is a sample explanation for the first article.",
        email: "sampleauthor1@example.com",
        dateAdded: "2022-06-15T10:00",
      });
      axiosMock.onPut("/api/articles").reply(200, {
        id: 1,
        title: "Another Sample Article",
        url: "https://samplewebsite.com/article2",
        explanation:
          "This is another sample explanation for the second article.",
        email: "sampleauthor2@example.com",
        dateAdded: "2023-01-20T14:30",
      });
    });

    const queryClient = new QueryClient();
    test("renders without crashing", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ArticlesForm-title");
    });

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ArticlesForm-title");

      const idField = screen.getByTestId("ArticlesForm-id");
      const titleField = screen.getByTestId("ArticlesForm-title");
      const urlField = screen.getByTestId("ArticlesForm-url");
      const explanationField = screen.getByTestId("ArticlesForm-explanation");
      const emailField = screen.getByTestId("ArticlesForm-email");
      const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
      const submitButton = screen.getByTestId("ArticlesForm-submit");

      expect(idField).toHaveValue("1");
      expect(titleField).toHaveValue("Sample Article Title");
      expect(urlField).toHaveValue("https://samplewebsite.com/article1");
      expect(explanationField).toHaveValue(
        "This is a sample explanation for the first article.",
      );
      expect(emailField).toHaveValue("sampleauthor1@example.com");
      expect(dateAddedField).toHaveValue("2022-06-15T10:00");
      expect(submitButton).toBeInTheDocument();
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ArticlesForm-title");

      const idField = screen.getByTestId("ArticlesForm-id");
      const titleField = screen.getByTestId("ArticlesForm-title");
      const urlField = screen.getByTestId("ArticlesForm-url");
      const explanationField = screen.getByTestId("ArticlesForm-explanation");
      const emailField = screen.getByTestId("ArticlesForm-email");
      const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
      const submitButton = screen.getByTestId("ArticlesForm-submit");

      expect(idField).toHaveValue("1");
      expect(titleField).toHaveValue("Sample Article Title");
      expect(urlField).toHaveValue("https://samplewebsite.com/article1");
      expect(explanationField).toHaveValue(
        "This is a sample explanation for the first article.",
      );
      expect(emailField).toHaveValue("sampleauthor1@example.com");
      expect(dateAddedField).toHaveValue("2022-06-15T10:00");
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(titleField, {
        target: { value: "Another Sample Article" },
      });
      fireEvent.change(urlField, {
        target: { value: "https://samplewebsite.com/article2" },
      });
      fireEvent.change(explanationField, {
        target: {
          value: "This is another sample explanation for the second article.",
        },
      });
      fireEvent.change(emailField, {
        target: { value: "sampleauthor2@example.com" },
      });
      fireEvent.change(dateAddedField, {
        target: { value: "2023-01-20T14:30" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Article Updated - id: 1 title: Another Sample Article",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/articles" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 1 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          title: "Another Sample Article",
          url: "https://samplewebsite.com/article2",
          explanation:
            "This is another sample explanation for the second article.",
          email: "sampleauthor2@example.com",
          dateAdded: "2023-01-20T14:30",
        }),
      ); // posted object
    });
  });
});
