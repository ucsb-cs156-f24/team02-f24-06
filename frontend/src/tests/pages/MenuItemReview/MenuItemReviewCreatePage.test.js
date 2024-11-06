import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("MenuItemReviewCreatePage tests", () => {
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
  });

  test("renders without crashing", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("MenuItemReviewForm-reviewerEmail"),
      ).toBeInTheDocument();
    });
  });

  test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
    const queryClient = new QueryClient();
    const menuItem = {
      id: 17,
      itemId: 18,
      reviewerEmail: 'email',
      stars: 3,
      dateReviewed: "2022-02-02T00:00",
      comments: "comment"
    };

    axiosMock.onPost("/api/menuitemreview/post").reply(202, menuItem);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("MenuItemReviewForm-reviewerEmail"),
      ).toBeInTheDocument();
    });

    const itemIDfield = screen.getByTestId("MenuItemReview-itemID");
    const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
    const starsField = screen.getByTestId("MenuItemReview-stars");
    const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
    const commentsField = screen.getByTestId("MenuItemReview-comments");

    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

    fireEvent.change(itemIDfield, { target: { value: '18' } });
    fireEvent.change(reviewerEmailField, { target: { value: 'email' } });
    fireEvent.change(starsField, { target: { value: '3' } });
    fireEvent.change(dateReviewedField, { target: { value: '2022-02-02T00:00' } });
    fireEvent.change(commentsField, { target: { value: "comment2" } });

    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      itemId: '18',
      reviewerEmail: "email",
      stars: '3',
      dateReviewed: '2022-02-02T00:00',
      comments: "comment2",
    });

    expect(mockToast).toBeCalledWith(
      'New MenuItemReview Created - id: 17 reviewerEmail: email'
    );
    expect(mockNavigate).toBeCalledWith({ to: "/menuitemreview" });
  });
});