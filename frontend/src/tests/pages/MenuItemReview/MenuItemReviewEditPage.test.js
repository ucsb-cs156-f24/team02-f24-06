import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

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
      id: 17,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("MenuItemReviewEditPage tests", () => {
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
      axiosMock.onGet("/api/menuitemreview", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit MenuItemReview");
      expect(
        screen.queryByTestId("MenuItemReviewForm-reviewerEmail"),
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
      axiosMock
        .onGet("/api/menuitemreview", { params: { id: 17 } })
        .reply(200, {
          id: "17",
          itemId: 18,
          reviewerEmail: "email",
          stars: 3,
          dateReviewed: "2022-02-02T00:00",
          comments: "comment",
        });
      axiosMock.onPut("/api/menuitemreview").reply(200, {
        id: 17,
        itemId: 19,
        reviewerEmail: "email2",
        stars: 2,
        dateReviewed: "2021-02-02T00:00",
        comments: "comment2",
      });
    });

    const queryClient = new QueryClient();
    test("renders without crashing", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewForm-reviewerEmail");
    });

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewForm-reviewerEmail");

      // const itemIDfield = screen.getByTestId("MenuItemReview-itemID");
      const reviewerEmailField = screen.getByTestId(
        "MenuItemReviewForm-reviewerEmail",
      );
      // const starsField = screen.getByTestId("MenuItemReview-stars");
      const dateReviewedField = screen.getByTestId(
        "MenuItemReviewForm-dateReviewed",
      );
      const commentsField = screen.getByTestId("MenuItemReview-comments");

      const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

      // expect(itemIDfield).toHaveValue('19');
      expect(reviewerEmailField).toHaveValue("email");
      // expect(starsField).toHaveValue(2);
      expect(dateReviewedField).toHaveValue("2022-02-02T00:00");
      expect(commentsField).toHaveValue("comment");

      expect(submitButton).toBeInTheDocument();
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewForm-reviewerEmail");

      const itemIDfield = screen.getByTestId("MenuItemReview-itemID");
      const reviewerEmailField = screen.getByTestId(
        "MenuItemReviewForm-reviewerEmail",
      );
      const starsField = screen.getByTestId("MenuItemReview-stars");
      const dateReviewedField = screen.getByTestId(
        "MenuItemReviewForm-dateReviewed",
      );
      const commentsField = screen.getByTestId("MenuItemReview-comments");

      const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

      // expect(itemIDfield).toHaveValue('19');
      expect(reviewerEmailField).toHaveValue("email");
      // expect(starsField).toHaveValue(2);
      expect(dateReviewedField).toHaveValue("2022-02-02T00:00");
      expect(commentsField).toHaveValue("comment");

      expect(submitButton).toBeInTheDocument();

      fireEvent.change(itemIDfield, { target: { value: "18" } });
      fireEvent.change(reviewerEmailField, { target: { value: "email" } });
      fireEvent.change(starsField, { target: { value: "3" } });
      fireEvent.change(dateReviewedField, {
        target: { value: "2022-02-02T00:00" },
      });
      fireEvent.change(commentsField, { target: { value: "comment2" } });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "MenuItemReview Updated - id: 17 reviewerEmail: email2",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/menuitemreview" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: "17" });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          itemId: "18",
          reviewerEmail: "email",
          stars: 3,
          comments: "comment2",
          dateReviewed: "2022-02-02T00:00",
        }),
      ); // posted object
    });
  });
});
